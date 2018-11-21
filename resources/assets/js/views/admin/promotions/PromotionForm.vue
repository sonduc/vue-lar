<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Chương trình khuyến mãi</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Chương trình khuyến mãi</a></li>
        <li class="breadcrumb-item active" v-if="type === 'Create'">Tạo mới</li>
        <li class="breadcrumb-item active" v-else>Cập nhật</li>
      </ol>
    </div>
    <form>
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">
              <div class="container">
                <div class="form-group">
                  <label :style="errors.has('promotions.name') ? 'color:red;' : ''">
                    {{errors.has('promotions.name')
                      ? errors.first('promotions.name') :
                      'Tên chương trình khuyến mãi *'}}
                  </label>
                  <input
                    type="text"
                    name="promotions.name"
                    v-validate="{ required:true, min:10, max:255,
                      regex:/^[\d\-a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ, ]*$/u }"
                    data-vv-as="Tên chương trình"
                    v-model="promotions.name"
                    class="form-control">
                </div>
                <div class="row" style="margin-top: 20px;">
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label :style="errors.has('startDay') ? 'color:red;' : ''">
                        {{errors.has('startDay') ?
                          errors.first('startDay') : 'Bắt đầu khuyến mãi *'}}
                      </label>
                      <datepicker
                        name="startDay"
                        :format="format"
                        v-validate="'required'"
                        v-model="promotions.date_start"
                        input-class="form-control"
                        data-vv-as="Ngày bắt đầu"
                        :disabled-dates="disabledStartDay"/>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label :style="errors.has('endDay') ? 'color:red;' : ''">
                        {{errors.has('endDay') ?
                          errors.first('endDay') : 'Kết thúc khuyến mãi *'}}
                      </label>
                      <datepicker
                        name="endDay"
                        :format="format"
                        v-validate="'required'"
                        v-model="promotions.date_end"
                        input-class="form-control"
                        data-vv-as="Ngày kết thúc"
                        :disabled-dates="disabledEndDay"/>
                    </div>
                  </div>
                </div>
                <div class="form-group row" style="margin-top: 20px;">
                  <label class="col-sm-2">
                    Trạng thái *
                  </label>
                  <div class="col-sm-10">
                    <button v-if="type === 'Update' ? checkDueDate(promotions.date_end) : false"
                      type="button" disabled="true"
                      v-tooltip.top-center="'Click để thay đổi trạng thái'"
                      class="btn btn-sm btn-icon btn-secondary">Hết hạn
                    </button>
                    <button v-else-if="promotions.status == 1"
                      @click="updateStatus(1)" type="button"
                      class="btn btn-sm btn-icon btn-success pl-3 pr-4" >Đang chạy
                    </button>
                    <button v-else type="button" @click="updateStatus(0)"
                      v-tooltip.top-center="'Click để thay đổi trạng thái'"
                      class="btn btn-sm btn-icon btn-danger" >Tạm dừng
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label :style="errors.has('promotions.description')
                    ? 'color:red;' : ''">
                      {{errors.has('promotions.description')
                        ? errors.first('promotions.description') : 'Mô tả chi tiết*'}}
                  </label>
                  <quill-editor
                    style="height:auto"
                    name="promotions.description"
                    data-vv-as="Mô tả chương trình khuyến mãi"
                    v-validate="'required'"
                    v-model="promotions.description">
                  </quill-editor>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail">Upload ảnh banner</label>
                  <vue-dropzone
                    id="dropzone"
                    ref="myVueDropzone"
                    :options="imagePost"
                    @vdropzone-canceled
                    @vdropzone-removed-file="removedImageInDropzone"
                    @vdropzone-mounted="vmountedPost"
                    @vdropzone-complete="afterCompleteImagePost"/>
                </div>
                <div class="btn-center">
                  <button v-if="type === 'Update' ? checkAllowUpdate(promotions.date_start) : false"
                    @click.prevent="onSubmit" style="margin-right: 10px;" class="btn btn-success">
                    Lưu khuyến mãi
                  </button>
                  <button class="btn btn-danger"
                    @click="returnProList">
                    Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Auth from "../../../services/auth";
import { FormWizard, TabContent } from "vue-form-wizard";
import vueDropzone from "vue2-dropzone";
import { SweetModal } from 'sweet-modal-vue';
import Multiselect from "vue-multiselect";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import Datepicker from "vuejs-datepicker";
import { quillEditor } from "vue-quill-editor";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    FormWizard,
    TabContent,
    quillEditor,
    Datepicker,
    vueDropzone,
    SweetModal,
    Multiselect,
  },
  install (Vue, options) {
    Vue.component('SweetModal', SweetModal)
  },
  props: {
    type: {
      type: String,
      default: "Create"
    },
    dataPromotion: {
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      format: "yyyy-MM-dd",
      disabledStartDay: {
         to: new Date()
      },
      disabledEndDay: {
         to:"",
      },
      promotions: {
        name : "",
        description : "",
        date_start : "",
        date_end : "",
        image:"",
        status : 1
      },
      imagePost: {
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
      },
    }
  },
  watch: {
    'promotions.date_start': {
      handler(val) {
        let addOneDay = this.addDay(val)
        this.disabledEndDay.to = new Date(addOneDay);
      },
      deep: true
    },
  },
  methods: {
    setInitData() {
      let dataPromotion = { ...this.dataPromotion };
      this.promotions = JSON.parse(JSON.stringify({ ...this.promotions, ...dataPromotion }));
    },
    selectRoom(selectedOption, id){
      let objectRoom = {
        id :selectedOption.id,
        name: selectedOption.name,
      }
      this.coupons.settings.rooms.push(objectRoom);
    },
    vmountedPost() {
      if(this.promotions.image !== "") {
        let file = { name: this.promotions.image, size: 12356, type: "image" };
        let url = this.promotions.image;
        this.$refs.myVueDropzone.manuallyAddFile(file, url);
      }
    },
    afterCompleteImagePost(file) {
      let source = null;
      if (file.dataURL) {
        source = file.dataURL;
        this.promotions.image = source;
      }
    },
    removedImageInDropzone(file, error, xhr) {
      this.promotions.image = "";
    },
    updateStatus(status) {
      if(status == 1) {
        this.promotions.status = 0;
      }
      else {
        this.promotions.status = 1;
      }
    },
    addDay(date) {
      let beforeAddDay = new Date(date);
      let timeDay = 86400000;
      let afterAddDay = new Date(beforeAddDay.getTime() + timeDay);
      let day = afterAddDay.toISOString().substring(0, 10);
      return day;
    },
    returnProList() {
      this.$router.push({ name: 'promotion.list' });
    },
    checkDueDate() {
      if(this.promotions.status == 0) {
        return true;
      }
    },
    checkDueDate(date) {
      let current = new Date();
      let currentDate = current.toISOString().substring(0, 10);
      let Time1 = this.convertDateToMiliSecond(currentDate);

      let Time2 = this.convertDateToMiliSecond(date);
      if(Time1 >= Time2) {
        return true;
      }
      else {
        return false;
      }
    },
    checkAllowUpdate(date) {
      let current = new Date();
      let currentDate = current.toISOString().substring(0, 10);
      let Time1 = this.convertDateToMiliSecond(currentDate);

      let Time2 = this.convertDateToMiliSecond(date);
      if(Time1 >= Time2) {
        return false;
      }
      else {
        return true;
      }
    },
    convertDateToMiliSecond(date) {
      let d = new Date(date);
      let time = d.getTime();
      return time;
    },
    async onSubmit() {
      const result = await this.$validator.validateAll();
      if (result) {
        try {
          let start = new Date(this.promotions.date_start);
          let startDay = start.toISOString().substring(0, 10);


          let end = new Date(this.promotions.date_end);
          let endDay = end.toISOString().substring(0, 10);

          if (this.type === "Update") {
            let start_Day = this.addDay(startDay)
            let end_Day = this.addDay(endDay)
            this.$swal({
              title: "Bạn có muốn cập nhật chương trình khuyến mãi này không",
              text: "",
              type: "warning",
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              showCloseButton: false,
              showLoaderOnConfirm: true,
              preConfirm: async () => {
                let response = await axios
                .put(`promotions/${this.$route.params.promotionId}`, {
                  name : this.promotions.name,
                  description : this.promotions.description,
                  date_start : start_Day,
                  date_end : end_Day,
                  // cập nhật khi hệ thống cho phép upload ảnh
                  //images: this.promotions.images,
                  status : this.promotions.status
                })
                .then(response => {
                  this.$swal(
                    "Thành công",
                    "Chương trình khuyến mãi được cập nhật thành công",
                    "success"
                  );
                  this.$router.push({ name: "promotion.list" });
                })
                .catch(error => {
                  let err = error.response.data.data.errors;
                  let err_array = Object.values(err)
                  let err_txt = '';
                  err_array.forEach(function(element) {
                    err_txt += element + ', ';
                  });
                  window.toastr["error"](err_txt, "Error");
                });
              }
            });
          } else {
            this.$swal({
              title: "Bạn có muốn tạo chương trình khuyến mãi này không",
              text: "",
              type: "warning",
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              showCloseButton: false,
              showLoaderOnConfirm: true,
              preConfirm: async () => {
                let response = await axios
                .post("promotions", {
                  name : this.promotions.name,
                  description : this.promotions.description,
                  date_start : startDay,
                  date_end : endDay,
                  image: this.promotions.image,
                  status : this.promotions.status
                })
                .then(response => {
                  this.$swal(
                    "Thành công",
                    "Chương trình khuyến mãi được tạo mới thành công",
                    "success"
                  );
                  this.$router.push({ name: "promotion.list" });
                })
                .catch(error => {
                  let err = error.response.data.data.errors;
                  let err_array = Object.values(err)
                  let err_txt = '';
                  err_array.forEach(function(element) {
                    err_txt += element + ', ';
                  });
                  window.toastr["error"](err_txt, "Error");
              });
              }
            })
          }
        }
        catch (error) {
          if (error) {
            this.$swal(
              "Xin lỗi",
              "Chương trình khuyến mãi chưa đưọc lưu, làm ơn kiểm tra lại thông tin",
              "error"
            );
          }
        }
      }
    },
    async getRooms() {
      try {
        const response = await axios.get('rooms/get-name');
        this.roomlist = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    }
  },
  created() {
    !(this.dataPromotion === null) && this.setInitData();
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getRooms();
          }
        });
      }
    });
  }
};
</script>

<style>
.btn-center {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
