<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Collections</h3>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'collections.list'}">
              <a>Collections</a>
            </router-link>
          </li>
          <li class="breadcrumb-item active"><a href="#">Tạo mới collection</a></li>
        </ol>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h6>Tạo mới bộ sưu tập</h6>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitForm">
                <div class="form-row">
                  <div class="col-md-12 row">
                    <div class="form-group col-md-3">
                      <label for="nameCollection">Tên bộ sưu tập</label>
                      <input
                        v-model="collection.vi.name"
                        id="nameCollection"
                        type="text"
                        class="form-control"
                        placeholder="Nhập...">
                    </div>
                    <div class="form-group col-md-3">
                      <label>Nổi bật</label>
                      <div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.hot"
                            class="form-check-input"
                            type="radio"
                            value="0">
                          <label class="form-check-label">Có</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.hot"
                            class="form-check-input"
                            type="radio"
                            value="1">
                          <label class="form-check-label">Không</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group col-md-6">
                      <label>Ảnh</label>
                      <input
                        v-model="collection.image"
                        type="text"
                        class="form-control"
                        placeholder="Nhập">
                    </div>
                    <div class="form-group custom-margin col-md-3">
                      <label>Trạng thái</label>
                      <div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.status"
                            class="form-check-input"
                            type="radio"
                            value="0"/>
                          <label class="form-check-label">Đã duyệt</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.status"
                            class="form-check-input"
                            type="radio"
                            value="1" />
                          <label class="form-check-label">Đang chờ duyệt</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group custom-margin col-md-3">
                      <label>Loại bộ sưu tập</label>
                      <div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.new"
                            class="form-check-input"
                            type="radio"
                            value="0">
                          <label class="form-check-label">Mới</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.new"
                            class="form-check-input"
                            type="radio"
                            value="1">
                          <label class="form-check-label">Cũ</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group col-md-12">
                      <label>Mô tả (tiếng việt)</label>
                      <input
                        v-model="collection.vi.description"
                        type="text"
                        class="form-control"
                        placeholder="Nhập">
                    </div>
                    <!-- <tabs class="tabs-default" style="padding-left:1em;padding-top:1em;">
                      <tab id="basic-home" name="Tiếng việt">
                        <div class="form-group custom-margin col-md-12">
                          <label>Mô tả (tiếng việt)</label>
                          <quill-editor
                            style="height:250px"
                            v-model="collection.vi.description">
                          </quill-editor>
                        </div>
                      </tab>
                      <tab id="basic-profile" name="Tiếng anh">
                        <div class="form-group col-md-3">
                          <label for="nameCollection">Tên bộ sưu tập (tiếng anh)</label>
                          <input
                            v-model="collection.en.name"
                            id="nameCollection"
                            type="text"
                            class="form-control"
                            placeholder="Nhập...">
                        </div>
                        <div class="form-group custom-margin col-md-12">
                          <label>Mô tả (tiếng anh)</label>
                          <quill-editor
                            style="height:250px"
                            v-model="collection.en.description">
                          </quill-editor>
                        </div>
                      </tab>
                    </tabs> -->
                  </div>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary"
                  style="margin-top: 2.2em;">
                  Thêm mới
                </button>
              </form>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
import Auth from "../../../services/auth";
import { chain } from 'lodash'
import Multiselect from "vue-multiselect";
import { Tabs, Tab } from 'vue-tabs-component'
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    Multiselect,
    quillEditor,
    'tabs': Tabs,
    'tab': Tab,
  },
  data(){
    return{
      language :0,
      collection:{
        image:'',
        hot:0,
        status:0,
        new:0,
        vi:{
          name:'',
          description:'',
          lang: 'vi',
        },
        en:{
          name:'',
          description:'',
          lang: 'en',
        },
      },
      permission:'collection.create',
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permission).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            // this.getRooms();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods:{
    async getRooms() {
      try {
        const response = await axios.get(`rooms`, {
          params: {
            include: "details,user,prices",
            limit: -1,
          }
        });
        console.log(response.data.data)
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async submitForm(){
      if(this.collection.en.name == ''){
        this.collection.en.name = this.collection.vi.name
      };
      if(this.collection.en.description == ''){
        this.collection.en.description = this.collection.vi.description
      };
      let data = [];
      let details = {data};
      data[0] = this.collection.vi;
      data[1] = this.collection.en;
      console.log(details);
      try {
        const response = await axios.post(`collections`,{
          image : this.collection.image,
          hot : this.collection.hot,
          new : this.collection.new,
          status : this.collection.status,
          rooms : [1],
          details : details,
        })
        .then(response => {
          this.$swal("Thành công", "Thêm thành công", "success");
          this.$router.push({name: 'collections.list'})
        });
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
          console.log(error)
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
  },
}
</script>
<style scoped>
.custom-margin{
  margin-top: 1em;
}
</style>
