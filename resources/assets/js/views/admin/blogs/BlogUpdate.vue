<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Bài viết</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Bài viết</a>
        </li>
      </ol>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body" v-if="checkLoadedImage()">
            <div class="row">
              <div class="col-xl-12 mb-3">
                <h5 class="section-semi-title">Sửa bài viết</h5>
                <tabs class="tabs-default">
                  <tab name="Tiếng Việt">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label :style="errors.has('title') ? 'color:red;' : ''">
                          {{errors.has('title')
                          ? errors.first('title') : 'Tiêu đề *'}}
                        </label>
                        <input
                          v-model="blog.title"
                          name="title"
                          data-vv-as="Tiêu đề"
                          v-validate="'required|max:150|min:10'"
                          type="text"
                          class="form-control"
                        >
                      </div>

                      <div class="form-group">
                        <label :style="errors.has('description') ? 'color:red;' : ''">
                          {{errors.has('description')
                          ? errors.first('description') : 'Mô tả *'}}
                        </label>
                        <textarea
                          rows="4"
                          v-model="blog.description"
                          name="description"
                          data-vv-as="Mô tả"
                          v-validate="'required|min:10'"
                          type="text"
                          class="form-control"
                        ></textarea>
                      </div>

                      <div class="form-group">
                        <label :style="errors.has('category') ? 'color:red;' : ''">
                          {{errors.has('category')
                          ? errors.first('category') : 'Danh mục *'}}
                        </label>
                        <multiselect
                          style="z-index:4"
                          name="category"
                          label="name"
                          v-model="category"
                          v-validate="'required'"
                          data-vv-as="Danh mục"
                          :allow-empty="false"
                          :options="listCategory"
                          :searchable="true"
                          :show-labels="false"
                          track-by="name"
                        />
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('content') ? 'color:red;' : ''">
                          {{errors.has('content')
                          ? errors.first('content') : 'Nội dung *'}}
                        </label>
                        <quill-editor
                          data-vv-as="Nội dung"
                          name="content"
                          v-model="blog.content"
                          v-validate="'required'"
                          style="height:300px"
                        ></quill-editor>
                      </div>
                    </div>
                    <br>
                  </tab>
                </tabs>
                <div class="col-xl-12 mb-3">
                  <label v-if="tags.length">Tags bài viết</label>
                  <label v-else style="color: red;">Tags bài viết là bắt buộc</label>
                  <vue-tags-input
                    v-model="tag"
                    :tags="tags"
                    @tags-changed="newTags => tags = newTags"
                  />
                </div>
                <div class="col-xl-12 mb-3">
                  <label v-if="images.length">Ảnh đại diện</label>
                  <label v-else style="color: red;">Upload ảnh là bắt buộc</label>
                  <vue-dropzone
                    id="dropzone"
                    ref="myVueDropzone"
                    :options="imageBlog"
                    @vdropzone-canceled
                    @vdropzone-mounted="vmountedBlog"
                    @vdropzone-removed-file="removedImageInDropzone"
                    @vdropzone-complete="afterCompleteImageBlog"
                  />
                </div>
              </div>
            </div>
            <button @click="updateBlog" class="btn btn-primary">Lưu bài viết</button>
          </div>
          <div class="card-body" v-else>
            <lottie :options="defaultOptions" :height="150" :width="150"></lottie>
          </div>
          <div class="card-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
import Auth from "../../../services/auth";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import vueDropzone from "vue2-dropzone";
import InputTag from "vue-input-tag";
import Multiselect from "vue-multiselect";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
export default {
  components: {
    Tabs,
    Tab,
    quillEditor,
    vueDropzone,
    InputTag,
    Multiselect,
    Lottie
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData
      },
      images: [],
      imageBlog: {
        url: "https://httpbin.org/post",
        maxFilesize: 3,
        maxFiles: 1,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        acceptedFiles: "image/*",
        dictCancelUpload: "Cancel File",
        uploadMultiple: false,
        dictDefaultMessage:
          "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your File's Here",
        headers: { "My-Awesome-Header": "header value" }
      },
      tag: "",
      tags: [],
      blog: {
        source: null,
        status: 0,
        hot: 0,
        new: 0,
        category_id: null,
        content: null,
        title: null,
        description: null,
        type: 1,
        tags: {
          data: [
            {
              name: ""
            }
          ]
        }
      },
      loadedImages: false,
      listCategory: [],
      categoryId: null,
      categories: [],
      categoryChoose: {
        name: null
      },
      permissions: "blog.create"
    };
  },
  computed: {
    category: {
      get() {
        if (this.categoryChoose.name) {
          return {
            name: this.categoryChoose.name
          };
        }
      },
      set(val) {
        this.blog.category_id = val.id;
        this.categoryChoose = val;
      }
    }
  },
  watch: {
    categories: {
      handler(val) {
        val.forEach(element => {
          this.listCategory.push({
            id: element.id,
            name:
              element.details.data[0].lang === "en"
                ? element.details.data[1].name
                : ""
          });
        });
      }
    },
    categoryId: {
      handler(val) {
        if (val) {
          this.listCategory.forEach(item => {
            if (item.id == val) {
              this.categoryChoose.name = item.name;
            }
          });
        }
      }
    }
  },
  blog: {
    source: null,
    status: 0,
    hot: 0,
    new: 0,
    category_id: null,
    content: null,
    title: null,
    description: null,
    type: 1,
    tags: {
      data: [
        {
          name: ""
        }
      ]
    }
  },
  methods: {
    setInitData(dataBlog) {
      this.blog.source = dataBlog.image;
      this.blog.status = dataBlog.status;
      this.blog.hot = dataBlog.hot;
      this.blog.new = dataBlog.new;
      this.blog.category_id = dataBlog.category_id;
      this.blog.content = dataBlog.content;
      this.blog.title = dataBlog.title;
      this.blog.description = dataBlog.description;
      this.blog.type = dataBlog.type;
      this.blog.description = dataBlog.description;
      if (dataBlog.image != null) {
        this.getBase64ImageFromUrl(
          "https://s3-ap-southeast-1.amazonaws.com/d-beauty/" + dataBlog.image
        )
          .then(result => {
            this.images.push(result);
            this.loadedImages = true;
          })
          .catch(err => console.error(err));
      }
      if (dataBlog.tags.data.length) {
        dataBlog.tags.data.forEach(tag => {
          this.tags.push({ text: tag.name, tiClasses: ["ti-valid"] });
        });
      }
    },
    async getBase64ImageFromUrl(imageUrl) {
      let res = await fetch(imageUrl);
      let blob = await res.blob();
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          function() {
            resolve(reader.result);
          },
          false
        );
        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob);
      });
    },
    vmountedBlog() {
      this.images.forEach(item => {
        let file = { name: "Ảnh blog", size: 12345, type: "image" };
        let url = item;
        this.$refs.myVueDropzone.manuallyAddFile(file, url);
      });
    },
    afterCompleteImageBlog(file) {
      if (file.dataURL) {
        this.images = [];
        this.images.push(file.dataURL);
      }
    },
    removedImageInDropzone(file, error, xhr) {
      let index = this.images.findIndex(item => item === file.dataURL);
      if (index > -1) {
        this.images.splice(index, 1);
      }
    },
    checkLoadedImage() {
      if (this.loadedImages) {
        return true;
      } else {
        return false;
      }
    },
    async updateBlog() {
      const result = await this.$validator.validateAll();
      if (!result) {
        return window.scroll({
          top: 0,
          behavior: "smooth"
        });
      } else {
        let lenghtTags = this.tags.length - 1;
        this.tags.forEach((tag, index) => {
          if (index != lenghtTags) {
            this.blog.tags.data[0].name += tag.text;
            this.blog.tags.data[0].name += ",";
          } else {
            this.blog.tags.data[0].name += tag.text;
          }
        });
        this.blog.image = this.images[0];
        try {
          const response = await axios
            .put(`blogs/${this.$route.params.blogId}`, this.blog)
            .then(response => {
              this.$swal(
                "Thành công",
                "Cập nhật bài viết thành công",
                "success"
              );
            })
            .catch(error => {
              let err = error.response.data.data.errors;
              window.toastr["error"]("There was an error", "Error");
            });
        } catch (error) {
          if (error) {
            window.toastr["error"]("There was an error", "Error");
          }
        }
      }
    },
    async getCategories() {
      try {
        const response = await axios.get(`categories`, {
          params: {
            include: "details",
            limit: -1,
            type: 2
          }
        });
        this.categories = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getBlog() {
      try {
        const response = await axios.get(`blogs/${this.$route.params.blogId}`, {
          params: {
            include: "tags,categories"
          }
        });
        this.categoryId = response.data.data.categories.data[0].id;
        this.setInitData(response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"](error, "Error");
        }
      }
    },
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getCategories();
            this.getBlog();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  }
};
</script>

<style>
.vue-tags-input .ti-input {
  width: 1496px;
  height: 40px;
}
</style>
