<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Cập nhật tỉnh/thành phố</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'city.list'}">
            <a>Cities</a>
          </router-link>
        </li>
        <li class="breadcrumb-item active"><a href="#">Cập nhật tỉnh/thành phố </a>
        </li>
      </ol>
    </div>
    <div class="row" v-if="checkLoadedImage()">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <h6>Cập nhật tỉnh/thành phố</h6>
          </div>
          <div class="card-body">
            <form>
              <div class="form-row">

                <div class="col-md-12 row">
                  <div class="form-group col-md-3">
                    <label :style="errors.has('name') ? 'color:red;' : ''">
                      {{errors.has('name')? errors.first('name') : 'Tên tỉnh/thành phố *'}}
                    </label>
                    <input
                      name="name"
                      data-vv-as="Tên tỉnh/thành phố"
                      v-validate="'required'"
                      v-model="city.name"
                      type="text"
                      class="form-control">
                  </div>
                  <div class="form-group col-md-3">
                    <label :style="errors.has('short_name') ? 'color:red;' : ''">
                      {{errors.has('short_name')? errors.first('short_name') : 'Tên viết tắt *'}}
                    </label>
                    <input
                      name="short_name"
                      data-vv-as="Tên viết tắt"
                      v-validate="'required'"
                      v-model="city.short_name"
                      type="text"
                      class="form-control">
                  </div>
                  <div class="form-group col-md-3">
                    <label :style="errors.has('region_id') ? 'color:red;' : ''">
                      {{errors.has('region_id')? errors.first('region_id') : 'Khu vực *'}}
                    </label>
                    <multiselect
                      style="z-index:4"
                      :allow-empty="false"
                      name="region_id"
                      v-validate="'required'"
                      data-vv-as="Khu vực"
                      v-model="region"
                      label="value"
                      :options="region_list"
                      :searchable="true"
                      :show-labels="false"
                      track-by="value"
                    ></multiselect>
                  </div>
                   <div class="form-group col-md-3">
                    <label :style="errors.has('code') ? 'color:red;' : ''">
                      {{errors.has('code')? errors.first('code') : 'Mã vùng *'}}
                    </label>
                    <input
                      name="code"
                      data-vv-as="Mã vùng"
                      v-validate="'required|min:6'"
                      v-model="city.code"
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
                          v-model="city.status"
                          class="form-check-input"
                          type="radio"
                          :value="0" />
                        <label class="form-check-label">Không khả dụng</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="city.status"
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
                          v-model="city.hot"
                          class="form-check-input"
                          type="radio"
                          :value="0">
                        <label class="form-check-label">Không</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="city.hot"
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
                          v-model="city.priority"
                          class="form-check-input"
                          type="radio"
                          :value="0">
                        <label class="form-check-label">Không ưu tiên</label>
                      </div>
                      <div class="form-check form-check-inline custom-checkbox">
                        <input
                          v-model="city.priority"
                          class="form-check-input"
                          type="radio"
                          :value="3">
                        <label class="form-check-label">Ưu tiên trung bình</label>
                      </div>
                       <div class="form-check form-check-inline custom-checkbox">
                        <input
                          v-model="city.priority"
                          class="form-check-input"
                          type="radio"
                          :value="2">
                        <label class="form-check-label">Ưu tiên khá</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          v-model="city.priority"
                          class="form-check-input"
                          type="radio"
                          :value="1">
                        <label class="form-check-label">Ưu tiên cao nhất</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-12 row custom-margin">
                  <div class="form-group col-md-6">
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
                      @vdropzone-mounted="vmountedCity"
                      @vdropzone-complete="afterComplete"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label>Vị trí trên bản đồ</label>
                    <input
                      type="text"
                      id="addressMap"
                      v-model="addressMap"
                      v-validate="'required'"
                      name="address"
                      data-vv-as="Địa chỉ tỉnh/thành phố"
                      class="form-control"
                      placeholder="Nhập vị trí..."
                      @click="doAutocomplete()"
                    >
                    <div>
                      <gmap-map
                        :center="center"
                        :zoom="17"
                        map-type-id="terrain"
                        class="custom-style-google"
                      >
                        <gmap-marker label="★" :position="center"/>
                      </gmap-map>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 row" style="margin-left: 653px;">
                  <button
                    style="margin-right: 10px;"
                    :disabled="images.length < 1"
                    @click.prevent="updateCity"
                    class="btn btn-success"
                  >Cập nhật</button>
                  <button
                    @click.prevent="returnCityList"
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
import Multiselect from "vue-multiselect";
import { constant } from "../../../helpers/mixins";
import vue2Dropzone from "vue2-dropzone";
export default {
  mixins: [constant],
  components: {
    vueDropzone: vue2Dropzone,
    Multiselect,
  },
  data() {
    return {
      city: {
        region_id: null,
        name: null,
        short_name: null,
        code: null,
        longitude: null,
        latitude: null,
        priority: 0,
        hot: 0,
        status: 0,
        image: null,
      },
      place: null,
      addressMap: null,
      regionCity: {
        value: null
      },
      center: {
        lat: 21.027895,
        lng: 105.833896
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
  computed: {
    region: {
      get() {
        return {
          value: this.city.region_txt
        };
      },
      set(val) {
        this.regionCity = val;
        this.city.region_id = val.id;
        this.city.region_txt = val.value;
      }
    }
  },
  watch: {
    place: {
      handler(val) {
        if (val) {
          this.center = {
            lat: val.geometry.location.lat(),
            lng: val.geometry.location.lng()
          };
        }
      }
    }
  },
  methods: {
    setInitData(dataCity) {

      this.city = JSON.parse(JSON.stringify({ ...this.city, ...dataCity }));

      this.center.lat = parseFloat(dataCity.latitude);
      this.center.lng = parseFloat(dataCity.longitude);

      if(this.city.image != null) {
        this.getBase64ImageFromUrl(
          "https://s3-ap-southeast-1.amazonaws.com/d-beauty/"+ this.city.image)
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
      if(file.name === "Ảnh tỉnh/thành phố"){
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
    vmountedCity() {
      this.images.forEach(item => {
        let file = { name: "Ảnh tỉnh/thành phố", size: 12345, type: "image" };
        let url = item;
        this.$refs.myVueDropzone.manuallyAddFile(file, url);
      });
    },
    afterComplete(file) {
      if (file.dataURL) {
        this.images.push(file.dataURL);
      }
    },
    doAutocomplete() {
      let element = document.getElementById("addressMap");
      this.autocomplete = new google.maps.places.Autocomplete(element);
      this.autocomplete.setComponentRestrictions({ country: ["vn"] });
      this.autocomplete.addListener("place_changed", () => {
        let place = this.autocomplete.getPlace();
        let address = "";
        let place_name = place.name.split("-")[0].trim();
        let place_formated = place.formatted_address.split(",")[0].trim();
        if (place_name !== place_formated) {
          address += place_name + ", " + place.formatted_address;
        } else {
          address = place.formatted_address;
        }
        this.addressMap = address;

        this.place = place;
        this.city.latitude = place.geometry.location.lat();
        this.city.longitude = place.geometry.location.lng();
      });
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
    async getCityById() {
      try {
        const response = await axios
          .get(`cities/${this.$route.params.cityId}`)
          .then(response => {
            this.setInitData(response.data.data);
          });
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu city này hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async updateCity() {
      const result = this.$validator.validateAll();
      if (result) {
        try {
          const response = await axios
            .put(`cities/${this.$route.params.cityId}`, {
              region_id: this.city.region_id,
              name: this.city.name,
              short_name: this.city.short_name,
              code: this.city.code,
              longitude: this.city.longitude,
              latitude: this.city.latitude,
              priority: this.city.priority,
              hot: this.city.hot,
              status: this.city.status,
              image: this.images[0],
            })
            .then(response => {
              this.$swal("Thành công", "Cập nhật thành công", "success");
              this.$router.push({ name: "city.list" });
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
    returnCityList() {
      this.$router.push({
        name: "city.list",
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
            this.getCityById();
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
.custom-style-google {
  height: 210px;
  border: solid 1px lightgray;
  margin-top: 20px;
  border-radius: 3px;
}
.custom-vue-dropzone {
  height: 209px;
  margin-top: 36px;
  border-radius: 3px;
  border: solid 1px lightgray;
}
</style>
