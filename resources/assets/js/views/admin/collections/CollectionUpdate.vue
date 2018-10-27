<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Cập nhật collections</h3>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'collections.list'}">
              <a>Collections</a>
            </router-link>
          </li>
          <li class="breadcrumb-item active"><a href="#">Cập nhật collection</a></li>
        </ol>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h6>Cập nhật bộ sưu tập</h6>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitForm">
                <div class="form-row">
                  <div class="col-md-6 row">
                    <div class="form-group col-md-6">
                      <label for="nameCollection">Tên bộ sưu tập</label>
                      <input
                        v-model="collection.vi.name"
                        id="nameCollection"
                        type="text"
                        class="form-control"
                        placeholder="Nhập...">
                    </div>
                    <div class="form-group col-md-6">
                      <label>Nổi bật</label>
                      <div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.hot"
                            class="form-check-input"
                            type="radio"
                            :value="0">
                          <label class="form-check-label">Không</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.hot"
                            class="form-check-input"
                            type="radio"
                            :value="1">
                          <label class="form-check-label">Có</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group custom-margin col-md-6">
                      <label>Trạng thái</label>
                      <div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.status"
                            class="form-check-input"
                            type="radio"
                            :value="0" />
                          <label class="form-check-label">Đang chờ duyệt</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.status"
                            class="form-check-input"
                            type="radio"
                            :value="1"/>
                          <label class="form-check-label">Đã duyệt</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group custom-margin col-md-6">
                      <label>Loại bộ sưu tập</label>
                      <div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.new"
                            class="form-check-input"
                            type="radio"
                            :value="0">
                          <label class="form-check-label">Cũ</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            v-model="collection.new"
                            class="form-check-input"
                            type="radio"
                            :value="1">
                          <label class="form-check-label">Mới</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6 row">
                    <div class="form-group col-md-12">
                      <label>Ảnh</label>
                      <!-- <input
                        v-model="collection.image"
                        type="text"
                        class="form-control"
                        placeholder="Nhập"> -->
                        <!-- <vue-upload-multiple-image
                          @upload-success="uploadImageSuccess"
                          @before-remove="beforeRemove"
                          @edit-image="editImage"
                          :data-images="images"
                          :multiple ='false'>
                        </vue-upload-multiple-image> -->
                    </div>
                  </div>

                  <div class="col-md-12 row">
                    <div class="form-group col-md-4 mt-2">
                      <label class="typo__label">Chọn phòng</label>
                      <multiselect
                        @select="selectRoom"
                        v-model="room"
                        :options="allRoom"
                        placeholder="Chọn phòng"
                        label="name"/>
                      </multiselect>
                    </div>

                    <div
                      class="form-group col-md-11 row container-room ml-3 mt-2"
                      v-if="rooms.length > 0">
                      <draggable
                        v-model="rooms"
                        :options="{group:'people'}"
                        @start="drag=true"
                        @end="drag=false">
                          <div
                            class="list-room"
                            v-for="element in rooms"
                            :key="element.id">
                            <p class="btn btn-outline-secondary name-room">
                              {{element.name}}
                              <i
                              class="icon-fa icon-fa-times icon-room"
                              @click="deleteRoom(element.name,element.id)"></i>
                            </p>
                          </div>
                      </draggable>
                    </div>
                  </div>

                  <div class="col-md-12 row">
                    <tabs class="tabs-default col-md-12" style="padding-left:1em;padding-top:1em;">
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
                    </tabs>
                  </div>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary"
                  style="margin-top: 2.2em;">
                  Cập nhật
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
import vue2Dropzone from 'vue2-dropzone'
import draggable from 'vuedraggable';
import VueUploadMultipleImage from 'vue-upload-multiple-image'
export default {
  components: {
    Multiselect,
    quillEditor,
    'tabs': Tabs,
    'tab': Tab,
    draggable,
    vueDropzone: vue2Dropzone,
    VueUploadMultipleImage,
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
      permission:'collection.update',
      allRoom:[
        { name: 'Thành Công Hotel - Luxury Apartment', id:'3143' },
        { name: 'Thành Công Hotel - Excutive Suite Room', id:'3142' },
        { name: 'Thành Công Hotel - Deluxe Suite Triple Room', id:'3141' },
        { name: 'Thành Công Hotel - Deluxe Suite Twin Ocean View Room', id:'3140' },
        { name: 'Thành Công Hotel - Deluxe Twin Ocean View Room', id:'3139' },
        { name: 'Thành Công Hotel - Superior Twin Room', id:'3138' },
        { name: 'Thành Công Hotel - Standard Double Room', id:'3137' },
      ],
      rooms:[],
      room:{},
      images:[{path:''}],
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permission).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getCollection();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods:{
    // async getRooms() {
    //   try {
    //     const response = await axios.get(`rooms`, {
    //       params: {
    //         include: "details,user,prices",
    //         limit: -1,
    //       }
    //     });
    //     console.log(response.data.data)
    //   } catch (error) {
    //     if (error) {
    //       window.toastr["error"]("There was an error", "Error");
    //     }
    //   }
    // },
    async uploadImageSuccess(formData, index, fileList) {
      this.collection.image = fileList[0].path;
      console.log(this.images)
    },
    beforeRemove (index, done, fileList) {
      var r = confirm("remove image")
      if (r == true) {
        done()
      } else {
      }
    },
    editImage (formData, index, fileList) {
      console.log(fileList)
      this.collection.image = fileList[0].path;
    },
    setInitData(dataCollection){
      console.log(dataCollection)
      this.collection.image = dataCollection.image;
      this.collection.hot = dataCollection.hot;
      this.collection.status = dataCollection.status;
      this.collection.new = dataCollection.new;
      this.images[0].path = 'http://sohanews.sohacdn.com/thumb_w/660/2017/photo1513071133217-1513071133217.png';
      if(dataCollection.details.data[0].lang === "vi"){
        this.collection.vi = dataCollection.details.data[0];
        this.collection.en = dataCollection.details.data[1];
      }else if(dataCollection.details.data[0].lang === "en"){
        this.collection.en = dataCollection.details.data[0];
        this.collection.vi = dataCollection.details.data[1];
      };
    },

    AddFile () {
      let file = { size: 123, name: 'Icon' }
      let url = '/assets/img/demo/gallery/' + this.count + '.jpg'
      this.$refs.myVueDropzone.manuallyAddFile(file, url)
      if (this.count !== 12) {
        this.count = this.count + 1
      } else {
        this.count = 12
      }
    },
    async getCollection() {
      try {
        const response = await axios.get(`collections/${this.$route.params.collectionId}`, {
          params: {
            include: "details",
          }
        });

        this.setInitData(response.data.data)
        // console.log(response.data.data)
      } catch (error) {
        if (error) {
          console.log(error)
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
      let valueRooms =[]
      if(this.rooms.length > 0){
        for(let i =0;this.rooms.length > i;i++){
          valueRooms.push(this.rooms[i].id)
        }
      }
      // console.log(details);
      try {
        const response = await axios.put(`collections/${this.$route.params.collectionId}`,{
          image : this.collection.image,
          hot : this.collection.hot,
          new : this.collection.new,
          status : this.collection.status,
          rooms : valueRooms,
          details : details,
        })
        .then(response => {
          this.$swal("Thành công", "Cập nhật thành công", "success");
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
