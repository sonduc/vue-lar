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
          <div class="card-body" v-if="blog != null">
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
                          :allow-empty="false"
                          name="category"
                          label="name"
                          v-model="category"
                          v-validate="'required'"
                          data-vv-as="Danh mục"
                          :options="listCategory"
                          :searchable="true"
                          :show-labels="false"
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
                  <label>Tags bài viết</label>
                  <input-tag
                    :addTagOnBlur="true"
                    :addTagOnKeys="[13]"
                    :tags.sync="tagsArray"
                    class="form-control"
                  ></input-tag>
                </div>
                <div class="col-xl-12 mb-3">
                  <label>Ảnh đại diện</label>
                  <vue-dropzone
                    @vdropzone-file-added="showFile"
                    id="dropzone"
                    @vdropzone-mounted="initImages"
                    ref="myVueDropzone"
                    :options="dropzoneOptions"
                    @vdropzone-success="onSuccess"
                    @vdropzone-removed-file="remove"
                  />
                </div>
              </div>
            </div>
            <button @click="createBlog" class="btn btn-primary">Lưu bài viết</button>
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
      dropzoneOptions: {
        url: "http://ws-api.lc/api/upload-blog-image",
        maxFilesize: 5,
        maxFiles: 10,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        acceptedFiles: "image/*",
        uploadMultiple: true,
        autoProcessQueue: true,
        dictCancelUpload: "Remove File"
      },
      tagsArray: [],
      blog: null,
      listCategory: [],
      categories: [],
      category: {},
      permissions: "blog.create"
    };
  },
  watch: {
    tagsArray: {
      handler(val) {
        this.blog.tags.data[0].name = val.toString();
      },
      deep: true
    },
    categories: {
      handler(val) {
        val.forEach(element => {
          this.listCategory.push({
            id: element.id,
            name: element.details.data[0].name
          });
        });
      }
    },
    category: {
      handler(val) {
        this.blog.category_id = val.id;
      }
    }
  },
  methods: {
    initImages() {
      let files = [];
      files.forEach(element => {
        this.$refs.myVueDropzone.manuallyAddFile(element.file, element.url);
      });
      // console.log(this.$refs.myVueDropzone);
    },
    showFile(file) {
      //   console.log(file);
    },
    async createBlog() {
      console.log(this.blog);
      // try {
      //   const response = await axios
      //     .post("blogs", this.blog)
      //     .then(response => {
      //       this.$swal("Thành công", "Đã tạo bài viết", "success");
      //     })
      //     .catch(error => {
      //       let err = error.response.data.data.errors;
      //       window.toastr["error"]("There was an error", "Error");
      //     });
      // } catch (error) {
      //   if (error) {
      //     window.toastr["error"]("", "Error");
      //   }
      // }
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
        this.blog = response.data.data;
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
    },
    onSuccess(file, response) {
      console.log(file);
      //   console.log(response);

      this.blog.source = file.dataURL;
    },
    // afterComplete(file) {
    //   //   console.log(file.name);
    //   this.blog.source = file.dataURL;
    // },
    remove(file) {
      this.blog.source = null;
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
.vue-input-tag-wrapper .new-tag {
  font-size: 16px;
}
.vue-input-tag-wrapper .input-tag {
  background-color: #d6d5d5;
  border: 1px solid #d6d5d5;
  border-radius: 12px;
  color: #000000;
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 0px;
  margin-right: 5px;
  padding: 4px;
}
.vue-input-tag-wrapper .input-tag .remove {
  color: #000000;
  cursor: pointer;
  font-weight: 700;
}
</style>
