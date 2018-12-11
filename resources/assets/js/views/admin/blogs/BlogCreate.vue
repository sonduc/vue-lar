<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Bài viết</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
        <li class="breadcrumb-item"><a href="#">Bài viết</a></li>
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
                  <tab :id="`basic-home-${index}`" :name="lang.lang === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'" v-for="(lang,index) in blog.details.data"
                    :key="index">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label :style="errors.has('title') ? 'color:red;' : ''">{{errors.has('title')
                          ? errors.first('title') : 'Tiêu đề *'}}</label>
                        <input v-model="blog.details.data[index].title" name="title" data-vv-as="Tiêu đề" v-validate="'required|max:150|min:10'"
                          type="text" class="form-control">
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('category') ? 'color:red;' : ''">{{errors.has('category')
                          ? errors.first('category') : 'Danh mục *'}}</label>
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
                        <label :style="errors.has('content') ? 'color:red;' : ''">{{errors.has('content')
                          ? errors.first('content') : 'Nội dung *'}}</label>
                        <quill-editor data-vv-as="Nội dung" name="content" v-model="blog.details.data[index].content" v-validate="'required'" style="height:300px"></quill-editor>
                      </div>
                    </div>
                    <br />
                  </tab>
                </tabs>
                <div class="col-xl-12 mb-3">
                    <label>Tags bài viết</label>
                    <input-tag :addTagOnBlur="true" :addTagOnKeys="[13]" :tags.sync="tagsArray" class="form-control"></input-tag>
                </div>
                <div class="col-xl-12 mb-3">
                    <label>Ảnh đại diện</label>
                    <vue-dropzone @vdropzone-file-added="showFile" id="dropzone" @vdropzone-mounted="initImages" ref="myVueDropzone" :options="dropzoneOptions"
                    @vdropzone-complete="afterComplete" @vdropzone-removed-file="remove" />
                </div>
              </div>
              
            </div>
            <button @click="createBlog" class="btn btn-primary">Lưu bài viết</button>
          </div>
          <div class="card-footer">

          </div>
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
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        maxFilesize: 2,
        maxFiles: 5,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: "Remove File"
      },
      tagsArray: [],
      blog: {
        source: null,
        status: 0,
        hot: 0,
        new: 0,
        category_id: null,
        details: {
          data: [
            {
              title: null,
              lang: "vi",
              content: null
            }
          ]
        },
        tags: {
          data: [
            {
              name: null
            }
          ]
        }
      },
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
      let files = [
        {
          file: {
            size: 49314,
            name: "img1",
            type: "image"
          },
          url:
            "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
        },
        {
          file: {
            size: 49314,
            name: "img2",
            type: "image"
          },
          url:
            "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
        },
        {
          file: {
            size: 49314,
            name: "img3",
            type: "image"
          },
          url:
            "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
        },
        {
          file: {
            size: 49314,
            name: "img4",
            type: "image"
          },
          url:
            "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
        }
      ];
      files.forEach(element => {
        this.$refs.myVueDropzone.manuallyAddFile(element.file, element.url);
      });
      // console.log(this.$refs.myVueDropzone);
    },
    showFile(file) {
      console.log(file);
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
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    },
    afterComplete(file) {
      this.blog.source = file.dataURL;
    },
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
