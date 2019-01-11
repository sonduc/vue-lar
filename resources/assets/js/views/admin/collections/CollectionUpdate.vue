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
                      <label :style="errors.has('name') ? 'color:red;' : ''">
                        {{errors.has('name')? errors.first('name') : 'Tên bộ sưu tập *'}}
                      </label>
                      <input
                        name="name"
                        data-vv-as="Tên bộ sưu tập"
                        v-validate="'required'"
                        v-model="collection.vi.name"
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
                    <div
                      v-if="checkLoadedImage()"
                      class="form-group col-md-12">
                      <label v-if="collection.image.length">Upload ảnh *</label>
                      <label v-else style="color: red;">Upload ảnh là bắt buộc *</label>
                      <vue-dropzone
                        id="dropzone"
                        ref="myVueDropzone"
                        :options="imageAvatar"
                        @vdropzone-canceled
                        @vdropzone-removed-file="removedImageInDropzone"
                        @vdropzone-mounted="vmountedCollection"
                        @vdropzone-complete="afterComplete"
                      />
                    </div>
                  </div>

                  <div class="col-md-12 row">
                    <div class="form-group col-md-4 mt-2">
                      <label
                        class="typo__label"
                        :style="errors.has('roomCollection') ? 'color:red;' : ''">
                        {{errors.has('roomCollection')? errors.first('roomCollection') : 'Chọn phòng *'}}
                      </label>
                      <multiselect
                        style="z-index: 3"
                        name="roomCollection"
                        data-vv-as="Phòng"
                        v-validate="'required'"
                        v-model="rooms"
                        :options="allRoom"
                        :multiple="true"
                        :close-on-select="false"
                        :clear-on-select="true"
                        :preserve-search="true"
                        track-by="name"
                        placeholder="Chọn phòng"
                        label="name">
                        :preselect-first="true"
                        <template slot="selection" slot-scope="{ values, search, isOpen }">
                          <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">
                            {{ values.length }} phòng đã được chọn
                          </span>
                        </template>
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
                          <label :style="errors.has('descriptionCollection') ? 'color:red;' : ''">
                            {{errors.has('descriptionCollection')? errors.first('descriptionCollection') : 'Mô tả (tiếng việt) *'}}
                          </label>
                          <quill-editor
                            name="descriptionCollection"
                            data-vv-as="Mô tả (tiếng việt)"
                            v-validate="'required'"
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
                  :disabled="collection.image.length == 0"
                  type="submit"
                  class="btn btn-primary"
                  style="margin-top: 2.2em;margin-top: 2.2em;margin-right: 44px;">
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
import { chain } from "lodash";
import Multiselect from "vue-multiselect";
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import vue2Dropzone from "vue2-dropzone";
import draggable from "vuedraggable";
import VueUploadMultipleImage from "vue-upload-multiple-image";
export default {
  components: {
    Multiselect,
    quillEditor,
    tabs: Tabs,
    tab: Tab,
    draggable,
    vueDropzone: vue2Dropzone,
    VueUploadMultipleImage
  },
  data() {
    return {
      isLoaded: false,
      language: 0,
      collection: {
        image: [],
        hot: 0,
        status: 0,
        new: 0,
        vi: {
          name: "",
          description: "",
          lang: "vi"
        },
        en: {
          name: "",
          description: "",
          lang: "en"
        }
      },
      loadedImages: false,
      permission: "collection.update",
      allRoom: [],
      rooms: [],
      room: {},
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        maxFilesize: 2,
        maxFiles: 5,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: "Remove File"
      },
      imageAvatar: {
        url: "https://httpbin.org/post",
        maxFilesize: 3,
        maxFiles: 1,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: "Cancel File",
        dictDefaultMessage:
          "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your File's Here",
        headers: { "My-Awesome-Header": "header value" }
      }
    };
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permission).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getCollection();
            this.getNameRooms();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    deleteRoom(name, id) {
      let valueRooms = this.rooms;
      for (var i = 0; i < valueRooms.length; i++) {
        if (valueRooms[i].id === id) {
          valueRooms.splice(i, 1);
        }
      }
      this.rooms = valueRooms;
    },
    removedImageInDropzone(file, error, xhr) {
      if(file.name === "Ảnh bộ sưu tập"){
        this.collection.image.pop();
      }
      else {
        let index = this.collection.image.findIndex(
          item => item === file.dataURL
        );
        if(index > -1) {
          this.collection.image.splice(index, 1);
        }
      }
    },
    vmountedCollection() {
      this.collection.image.forEach(item => {
        let file = { name: "Ảnh bộ sưu tập", size: 12345, type: "image" };
        let url = item;
        this.$refs.myVueDropzone.manuallyAddFile(file, url);
      });
    },
    afterComplete(file) {
      if (file.dataURL) {
        this.collection.image.push(file.dataURL);
      }
    },
    checkLoadedImage() {
      if(this.loadedImages){
        return true;
      }
      else {
        return false;
      }
    },
    async getNameRooms() {
      try {
        const response = await axios.get(`rooms/get-name`, {
          params: {
            include: ""
          }
        });
        let allRoom = response.data.data;
        for (var i = 0; i < allRoom.length; i++) {
          let objectRoom = {
            id: allRoom[i].id,
            name: allRoom[i].name
          };
          this.allRoom.push(objectRoom);
        }
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu danh sách tên phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    setInitData(dataCollection) {
      let rooms = dataCollection.rooms.data;

      for (var i = 0; i < rooms.length; i++) {
        let detailRoom = rooms[i].details.data;
        for (var j = 0; j < detailRoom.length; j++) {
          if (detailRoom[j].lang === "vi") {
            let objectRoom = {
              id: detailRoom[j].room_id,
              name: detailRoom[j].name
            };
            this.rooms.push(objectRoom);
          }
        }
      }
      async function getBase64ImageFromUrl(imageUrl) {
        let res = await fetch(imageUrl);
        let blob = await res.blob();
        return new Promise((resolve, reject) => {
          let reader  = new FileReader();
          reader.addEventListener("load", function () {
              resolve(reader.result);
          }, false);
          reader.onerror = () => {
            return reject(this);
          };
          reader.readAsDataURL(blob);
        })
      }
      if(dataCollection.image != null) {
        getBase64ImageFromUrl(
          "https://s3-ap-southeast-1.amazonaws.com/d-beauty/"+ dataCollection.image)
        .then(result => {
          this.collection.image.push(result);
          this.loadedImages = true;
         })
        .catch(err => console.error(err));
      }
      this.collection.hot = dataCollection.hot;
      this.collection.status = dataCollection.status;
      this.collection.new = dataCollection.new;
      if (dataCollection.details.data[0].lang === "vi") {
        this.collection.vi = dataCollection.details.data[0];
        this.collection.en = dataCollection.details.data[1];
      } else if (dataCollection.details.data[0].lang === "en") {
        this.collection.en = dataCollection.details.data[0];
        this.collection.vi = dataCollection.details.data[1];
      }
      this.isLoaded = !this.isLoaded;
    },
    async getCollection() {
      try {
        const response = await axios
          .get(`collections/${this.$route.params.collectionId}`, {
            params: {
              include: "details,rooms.details"
            }
          })
          .then(res => {
            this.setInitData(res.data.data);
          });
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu collection này hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async submitForm() {
      const result = this.$validator.validateAll();
      if (result) {
        if (this.collection.en.name == "") {
          this.collection.en.name = this.collection.vi.name;
        }
        if (this.collection.en.description == "") {
          this.collection.en.description = this.collection.vi.description;
        }
        let data = [];
        let details = { data };
        data[0] = this.collection.vi;
        data[1] = this.collection.en;
        let valueRooms = [];
        if (this.rooms.length > 0) {
          for (let i = 0; this.rooms.length > i; i++) {
            valueRooms.push(this.rooms[i].id);
          }
        }
        try {
          const response = await axios
            .put(`collections/${this.$route.params.collectionId}`, {
              image: this.collection.image[0],
              hot: this.collection.hot,
              new: this.collection.new,
              status: this.collection.status,
              rooms: valueRooms,
              details: details
            })
            .then(response => {
              this.$swal("Thành công", "Cập nhật thành công", "success");
              this.$router.push({ name: "collections.list" });
            });
        } catch (error) {
          if (error) {
            window.toastr["error"]("Cập nhật thất bại", "Error");
          }
        }
      } else {
        return window.scroll({
          top: 0,
          behavior: "smooth"
        });
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
  }
};
</script>
<style scoped>
.custom-margin {
  margin-top: 1em;
}
.custom-margin {
  margin-top: 1em;
}
.container-room {
  border: 1px solid lightgray;
  padding-top: 1rem;
  border-radius: 15px;
}
.list-room {
  display: inline-block;
  margin-left: 1em;
}
.name-room:hover {
  color: yellowgreen;
}
.icon-room:hover {
  color: red;
}
</style>
