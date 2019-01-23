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
          <div class="card-body">
            <div class="row">
              <div class="col-xl-12 mb-3">
                <h5 class="section-semi-title">Đăng bài viết mới</h5>
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
                          v-validate="'required|max:255|min:10'"
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
                    @vdropzone-removed-file="removedImageInDropzone"
                    @vdropzone-complete="afterCompleteImageBlog"
                  />
                </div>
              </div>
            </div>
            <button
              :disabled="images.length < 1 || tags.length < 1"
              @click="createBlog"
              class="btn btn-primary"
            >Lưu bài viết</button>
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
export default {
  components: {
    Tabs,
    Tab,
    quillEditor,
    vueDropzone,
    InputTag,
    Multiselect
  },
  data() {
    return {
      tag: "",
      tags: [],
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
      blog: {
        image: null,
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
      listCategory: [],
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
    }
  },
  methods: {
    async createBlog() {
      const result = await this.$validator.validateAll();
      if (!result) {
        return window.scroll({
          top: 10,
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
            .post("blogs", this.blog)
            .then(response => {
              this.$swal("Thành công", "Đã tạo bài viết", "success");
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
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
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
