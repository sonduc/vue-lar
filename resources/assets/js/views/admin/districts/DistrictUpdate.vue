<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Cập nhật quận/huyện</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'district.list'}">
            <a>Districts</a>
          </router-link>
        </li>
        <li class="breadcrumb-item active"><a href="#">Cập nhật quận/huyện </a>
        </li>
      </ol>
    </div>
    <div class="row" v-if="checkLoadedImage()">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <h6>Cập nhật quận/huyện</h6>
          </div>
          <div class="card-body">
            <form>
              <div class="form-row">

                <div class="col-md-12 row">
                  <div class="form-group col-md-4">
                    <label :style="errors.has('name') ? 'color:red;' : ''">
                      {{errors.has('name')? errors.first('name') : 'Tên quận/huyện *'}}
                    </label>
                    <input
                      name="name"
                      data-vv-as="Tên quận/huyện"
                      v-validate="'required'"
                      v-model="district.name"
                      type="text"
                      class="form-control">
                  </div>
                  <div class="form-group col-md-4">
                    <label :style="errors.has('short_name') ? 'color:red;' : ''">
                      {{errors.has('short_name')? errors.first('short_name') : 'Tên viết tắt *'}}
                    </label>
                    <input
                      name="short_name"
                      data-vv-as="Tên viết tắt"
                      v-validate="'required'"
                      v-model="district.short_name"
                      type="text"
                      class="form-control">
                  </div>
                  <div class="form-group col-md-4">
                    <label :style="errors.has('code') ? 'color:red;' : ''">
                      {{errors.has('code')? errors.first('code') : 'Mã vùng *'}}
                    </label>
                    <input
                      name="code"
                      data-vv-as="Mã vùng"
                      v-validate="'required|min:6'"
                      v-model="district.code"
                      type="text"
                      class="form-control">
                  </div>
                </div>

                <div class="col-md-12 row">
                  <div class="form-group custom-margin col-md-3">
                    <label>Trạng thái</label>
                    <div>
                      <div class="form-check form-check-inline custom-checkbox">
                        <input
                          v-model="district.status"
                          class="form-check-input"
                          type="radio"
                          :value="0" />
                        <label class="form-check-label">Không khả dụng</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="district.status"
                          class="form-check-input"
                          type="radio"
                          :value="1"/>
                        <label class="form-check-label">Khả dụng</label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group custom-margin col-md-3">
                    <label>Nổi bật</label>
                    <div>
                      <div class="form-check form-check-inline custom-checkbox">
                        <input
                          v-model="district.hot"
                          class="form-check-input"
                          type="radio"
                          :value="0">
                        <label class="form-check-label">Không</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="district.hot"
                          class="form-check-input"
                          type="radio"
                          :value="1">
                        <label class="form-check-label">Có</label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group custom-margin col-md-6">
                    <label>Mức độ ưu tiên</label>
                    <div>
                      <div class="form-check form-check-inline custom-checkbox">
                        <input
                          v-model="district.priority"
                          class="form-check-input"
                          type="radio"
                          :value="0">
                        <label class="form-check-label">Không ưu tiên</label>
                      </div>
                      <div class="form-check form-check-inline custom-checkbox">
                        <input
                          v-model="district.priority"
                          class="form-check-input"
                          type="radio"
                          :value="3">
                        <label class="form-check-label">Ưu tiên trung bình</label>
                      </div>
                       <div class="form-check form-check-inline custom-checkbox">
                        <input
                          v-model="district.priority"
                          class="form-check-input"
                          type="radio"
                          :value="2">
                        <label class="form-check-label">Ưu tiên khá</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="district.priority"
                          class="form-check-input"
                          type="radio"
                          :value="1">
                        <label class="form-check-label">Ưu tiên cao nhất</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-12 row custom-margin">
                  <div class="form-group col-md-12">
                    <label v-if="images.length">Ảnh đại diện *</label>
                    <label v-else style="color: red;">Upload ảnh là bắt buộc *</label>
                    <p>( Note: Ảnh chỉ được lưu dưới dạng .jpg, .jpeg, .png,
                        kích thước < 5MB )</p>
                    <vue-dropzone
                      id="dropzone"
                      class="custom-vue-dropzone"
                      ref="myVueDropzone"
                      :options="imageAvatar"
                      @vdropzone-canceled
                      @vdropzone-removed-file="removedImageInDropzone"
                      @vdropzone-mounted="vmountedDistrict"
                      @vdropzone-complete="afterComplete"
                    />
                  </div>
                </div>
                <div class="col-md-12 row" style="margin-left: 645px;">
                  <button
                    style="margin-right: 10px;"
                    :disabled="images.length < 1"
                    @click.prevent="updateDistrict"
                    class="btn btn-success"
                  >Cập nhật</button>
                  <button
                    @click.prevent="returnDistrictList"
                    class="btn btn-danger"
                  >Quay lại</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from "../../../services/auth";
import vue2Dropzone from "vue2-dropzone";
export default {
  components: {
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      district: {
        city_id: null,
        name: null,
        short_name: null,
        code: null,
        priority: 0,
        hot: 0,
        status: 0,
        image: null,
      },
      images: [],
      loadedImages: false,
      imageAvatar: {
        url: "https://httpbin.org/post",
        maxFilesize: 5,
        maxFiles: 1,
        addRemoveLinks: true,
        acceptedFiles: ".jpeg,.jpg,.png",
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: "Cancel File",
        dictDefaultMessage:
          "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your File's Here",
        headers: { "My-Awesome-Header": "header value" }
      }
    };
  },
  methods: {
    setInitData(dataDistrict) {

      this.district = JSON.parse(JSON.stringify({ ...this.district, ...dataDistrict }));

      if(this.district.image != null) {
        this.getBase64ImageFromUrl(
          "https://s3-ap-southeast-1.amazonaws.com/d-beauty/"+ this.district.image)
        .then(result => {
          this.images.push(result);
          this.loadedImages = true;
         })
        .catch(err => console.error(err));
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
    removedImageInDropzone(file, error, xhr) {
      if(file.name === "Ảnh quận/huyện"){
        this.images.pop();
      }
      else {
        let index = this.images.findIndex(
          item => item === file.dataURL
        );
        if(index > -1) {
          this.images.splice(index, 1);
        }
      }
    },
    vmountedDistrict() {
      this.images.forEach(item => {
        let file = { name: "Ảnh quận/huyện", size: 12345, type: "image" };
        let url = item;
        this.$refs.myVueDropzone.manuallyAddFile(file, url);
      });
    },
    afterComplete(file) {
      if (file.dataURL) {
        this.images.push(file.dataURL);
      }
    },
    async getBase64ImageFromUrl(imageUrl) {
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
    },
    async getDistrictById() {
      try {
        const response = await axios
          .get(`districts/${this.$route.params.districtId}`)
          .then(response => {
            this.setInitData(response.data.data);
          });
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu district này hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async updateDistrict() {
      const result = this.$validator.validateAll();
      if (result) {
        try {
          const response = await axios
            .put(`districts/${this.$route.params.districtId}`, {
              city_id: this.district.city_id,
              name: this.district.name,
              short_name: this.district.short_name,
              code: this.district.code,
              priority: this.district.priority,
              hot: this.district.hot,
              status: this.district.status,
              image: this.images[0],
            })
            .then(response => {
              this.$swal("Thành công", "Cập nhật thành công", "success");
              this.$router.push({ name: "district.list" });
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
    returnDistrictList() {
      this.$router.push({
        name: "district.list",
      });
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
        Auth.canAccess(res, this.permission).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getDistrictById();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  }
};
</script>
<style scoped>
.custom-margin {
  margin-top: 1.2em;
}
.custom-checkbox {
  margin-right: 30px;
}
.custom-vue-dropzone {
  height: 209px;
  margin-top: 36px;
  border-radius: 3px;
  border: solid 1px lightgray;
}
</style>
