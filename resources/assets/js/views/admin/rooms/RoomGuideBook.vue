<template>
  <div class="main-content">
    <div class="row">
      <button class="btn-back" @click="returnRoomList()">
        <i style="padding-right: 5px;"
          class="icon-fa icon-fa-undo"/>
          Quay lại danh sách phòng
      </button>
    </div>
    <div class="row">
      <div class="col-sm-7" v-if="roomDetail"
        style="padding-right: 243px; text-align: center;">
        <h2>{{roomDetail.details.data[0].name}}</h2>
        <p> Tạo một danh sách hướng dẫn các địa điểm yêu thích để đi ăn hoặc giải trí xung quanh căn hộ.</p>
        <p>Khách du lịch của bạn có thể tham khảo những tư vấn này bất cứ lúc nào.</p>
      </div>
      <div class="col-sm-7"
        v-for="(category, index) in guideBookList" :key="index">
        <div v-if="category.lang=='vi'"
          class="form-group" style="padding-bottom: 20px;">
          <div class="row">
            <div class="col-sm-1">
              <div class="bg-icon">
                <i :class="category.icon + ' custom-icon'"></i>
              </div>
            </div>
            <div class="col-sm-11" style="padding-left: 11px; margin-top: 8px;">
              <h3>{{category.name}}</h3>
            </div>
          </div>
          <div class="col-sm-7" style="margin-left: 60px;">
            <label
              :style="errors.has('address' + index) ? 'color:red;' : ''">
                {{errors.has('address' + index)
                ? errors.first('address' + index) : ''}}
            </label>
            <div class="search">
              <span class="icon-fa icon-fa-search"></span>
               <!-- v-validate="{ max:255,
                  regex:/^[\d\-a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ, ]*$/u }" -->
              <input
                v-if="guideBookList.length"
                type="text"
                :name="'address' + index"
                :id="'addressMap' + index"
                v-model="addressMap[index]"
                class="input-search"
                placeholder="Nhập địa điểm..."
                v-validate="'max:255'"
                data-vv-as="Địa chỉ"
                @click="doAutocomplete(index)" />
            </div>
            <textarea
              v-if="addressMap[index]"
              rows="5" cols="51"
              v-model="description[index]"
              class="guide-descript" placeholder="Mô tả">
            </textarea>
            <button v-if="addressMap[index] && isUpdate == 0"
              @click="createPlace(category.id, index)"
              class="btn btn-info">Thêm</button>
            <button v-if="addressMap[index] && isUpdate == 1"
              @click="updatePlace(currentPlace.id, index)"
              class="btn btn-info">Sửa</button>
            <button v-if="addressMap[index]" @click="clearForm(index)"
              class="btn btn-danger">Làm mới</button>
          </div>
          <div class="form-group row wrapper-room panel-collapse custom-panel">
            <div class="col-sm-8"
              style="padding-left: 90px;padding-top: 10px;padding-right: 30px;">
              <draggable
                :options="{group:'people'}"
                class="container-form">
                <div class="list-form">
                  <p v-if="place.guidebook_category_id == (index+1)"
                    v-for="(place,idx) in placeList" :key="idx"
                    @click="showInfoPlace(place)"
                    class="btn btn-outline-secondary name-room"
                    style="padding: 1px 3px; border: 1px solid #aaa; margin-right: 5px;">
                    {{place.tag}}
                    <i @click="deletePlace(index, idx)"
                      class="icon-fa icon-fa-times icon-room"
                      style="padding-left: 4px;"></i>
                  </p>
                </div>
              </draggable>
            </div>
          </div>
          <hr class="custom-hr" />
        </div>
      </div>
      <div class="col-sm-5 border-gm">
        <gmap-map
          ref="map"
          :center="center"
          :zoom="16"
          :options="{ minZoom:9, maxZoom:18 }"
          map-type-id="roadmap"
          style="width: 100%; height: 100%"
          @idle="onIdle"
        >
          <!-- <gmap-marker v-for="(marker, index) in markers"
            :key="index"
            :position="marker.position"
            :clickable="true"
            :icon="getIcon(marker)"
          /> -->
          <gmap-marker
            v-if="isLoaded"
            v-for="(place, index) in placeList"
            :key="index"
            :position="{
              lat: parseFloat(place.latitude),
              lng: parseFloat(place.longitude)
            }"
            :clickable="true"
            :icon="getIcon(place)">
            <gmap-info-window
              :options="infoOptions"
              :position="{
                lat: parseFloat(place.latitude),
                lng: parseFloat(place.longitude)
              }"
              :opened="true"
              @closeclick="infoWinOpen=false">
              <div style="width:190px">
                <p>Địa chỉ: {{place.name}}</p>
              </div>
            </gmap-info-window>
          </gmap-marker>
          <gmap-marker
            v-if="roomDetail"
            label="★"
            :position="{
              lat: parseFloat(roomDetail.latitude),
              lng: parseFloat(roomDetail.longitude)
            }"
          />
          <gmap-marker
            v-if="isUpdate == 0"
            v-for="(marker, idx) in markers"
            :key="'m'+ idx"
            :position="marker.position"
            :clickable="true"
            :icon="getIcon(marker)"
          >
            <gmap-info-window
              :options="infoOptions"
              :position="infoWindowPos"
              :opened="infoWinOpen"
              @closeclick="infoWinOpen=false"
            >
              <div style="width:190px;" v-html="infoContent"></div>
            </gmap-info-window>
          </gmap-marker>
        </gmap-map>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "../../../services/auth";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Draggable from 'vuedraggable';
export default {
  name: "RoomGuideBook",
  components: {
    quillEditor,
    Draggable,
  },
  data() {
    return {
      description: [],
      place: null,
      address:"",
      addressMap:[],
      markers: [],
      currentMarker: null,
      center: {
        lat: 21.0083069,
        lng: 105.8182929
      },
      guideBookList: [],
      infoOptions: {
        pixelOffset: {
          width: -10,
          height: 7
        },
        disableAutoPan: true
      },
      placeRecommendation: {
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        status: 1,
        guidebook_category_id: null
      },
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      isLoaded: false,
      room_index: 0,
      roomDetail: null,
      infoContent: "",
      infoWinOpen: false,
      currentMidx: null,
      autocomplete: null,
      placeList: null,
      isUpdate: 0,
      currentPlace: null,
      currentAddress: null
    }
  },
  watch: {
    markers: {
      handler(val) {
        if(val && this.isLoaded) {
          const bounds = new google.maps.LatLngBounds();
          for (let m of val) {
            bounds.extend(m.position);
          }
          this.$refs.map.fitBounds(bounds);
        }
      }
    },
    currentPlace: {
      handler(val) {
        if(val) {
          this.showInfoWindow(val)
        }
        else {
          this.infoWinOpen = false;
        }
      }
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getGuidebookCategories();
            this.getRoomById();
          }
        });
      }
    });
    this.geolocate();
  },
  methods: {
    onIdle() {
      this.isLoaded = true;
    },
    updateCoordinates(location) {
      this.marker = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      };
    },
    setPlace(place) {
      this.place = place
      this.usePlace(place);
    },
    usePlace(palce) {
      if (this.currentPlace) {
        this.markers = [],
        this.markers.push({
          position: {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng(),
          }
        })
        this.currentMarker = this.markers[0];
        this.infoWinOpen = true;
        this.placeRecommendation.latitude = this.currentPlace.geometry.location.lat();
        this.placeRecommendation.longitude = this.currentPlace.geometry.location.lng();
        this.placeRecommendation.name = this.currentAddress;
      }
    },
    getIcon(marker) {
      let svg = [
          '<?xml version="1.0"?>',
          '<svg width="40px" height="40px" version="1.1" xmlns="http://www.w3.org/2000/svg">',
          '<circle cx="10" cy="10" r="8" stroke="green" stroke-width="1" fill="red" />',
          "</svg>"
        ].join("\n");
      let myIcon = {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 10)
      };
      return myIcon;
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    showInfoWindow(place) {
      if(this.isUpdate == 1) {
        this.infoWindowPos.lat = parseFloat(place.latitude);
        this.infoWindowPos.lng = parseFloat(place.longitude);
        this.infoContent = this.placeRecommendation.name;
      }
      else {
        this.infoWindowPos.lat = parseFloat(this.currentPlace.geometry.location.lat());
        this.infoWindowPos.lng = parseFloat(this.currentPlace.geometry.location.lng());
        this.infoContent = this.placeRecommendation.name;
      }
    },
    showInfoPlace(place) {
      this.isUpdate = 1;
      this.currentPlace = place;
      this.markers = [];
      this.markers.push({
        position: {
          lat: parseFloat(place.latitude),
          lng: parseFloat(place.longitude)
        }
      })
      this.addressMap[place.guidebook_category_id - 1]
        = this.currentPlace.name;
      this.addressMap.forEach((address, idx) => {
        if(idx != (place.guidebook_category_id - 1)) {
          this.addressMap.splice(idx,0,"");
          this.description.splice(idx,0,"");

          this.addressMap.splice(idx + 1, 1);
          this.description.splice(idx + 1, 1);
        }
      })
      this.description[place.guidebook_category_id - 1]
        = place.description;
      this.infoWindowPos = {
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude)
      },
      this.infoContent = null;
      this.infoWinOpen = false;
      this.placeRecommendation.name = this.currentPlace.name;
      this.placeRecommendation.description = place.description;
      this.placeRecommendation.latitude = place.latitude;
      this.placeRecommendation.longitude = place.longitude;
      this.placeRecommendation.guidebook_category_id = place.guidebook_category_id;
    },
    clearForm(index) {
      this.addressMap.splice(index,0,"");
      this.description.splice(index,0,"");

      this.addressMap.splice(index + 1, 1);
      this.description.splice(index + 1, 1);

      this.isUpdate = 0;
    },
    doAutocomplete(index) {
      if(this.currentAddress == null) {
        this.isUpdate = 0;
        this.addressMap[index] = "";
        this.description[index] = "";
      }
      let element = document.getElementById('addressMap'+ index)
      this.autocomplete = new google.maps.places.Autocomplete(element)
      this.autocomplete.setComponentRestrictions(
            {'country': ['vn']});
      this.autocomplete.addListener('place_changed', () => {
        let place = this.autocomplete.getPlace();
        let address = "";
        let place_name = place.name.split("-")[0].trim();
        let place_formated = place.formatted_address.split(",")[0].trim();
        if(place_name !== place_formated) {
          address += (place_name + ', ' + place.formatted_address);
        }
        else {
          address = place.formatted_address;
        }
        this.currentAddress = address;
        this.addressMap[index] = address;
        this.place = place;
        this.currentPlace = place;
        this.usePlace(place);
      });
      this.addressMap.forEach((address, idx) => {
        if(idx != index) {
          this.addressMap.splice(idx,0,"");
          this.description.splice(idx,0,"");

          this.addressMap.splice(idx + 1, 1);
          this.description.splice(idx + 1, 1);
        }
      })
    },
    returnRoomList() {
      this.$router.push({
        name: "room.list"
      });
    },
    async createPlace(category_id, index) {
      try {
        const result = await this.$validator.validateAll();
        if(result) {
          let response = await axios
            .post(`places`, {
              name: this.placeRecommendation.name,
              description: this.description[index],
              longitude: this.placeRecommendation.longitude,
              latitude: this.placeRecommendation.latitude,
              guidebook_category_id: category_id,
              room_id: this.$route.params.roomId,
              status: this.placeRecommendation.status
            })
            .then(response => {
              this.addressMap.splice(index,0,"");
              this.description.splice(index,0,"");

              this.addressMap.splice(index + 1, 1);
              this.description.splice(index + 1, 1);

              this.place = null;
              this.currentAddress = null;
              this.infoContent = null;
              this.infoWinOpen = false;
              this.getRoomById();
              this.$swal(
                "Thành công",
                "Địa điểm được thêm thành công",
                "success"
              );
            });
        }
      } catch (error) {
        if (error) {
          this.$swal(
            "Xin lỗi",
            "Địa điểm chưa được thêm, làm ơn kiểm tra lại thông tin",
            "error"
          );
        }
      }
    },
    async updatePlace(place_id, index) {
      try {
        const result = await this.$validator.validateAll();
        if(result) {
          let response = await axios
            .put('places/'+ place_id, {
              name: this.placeRecommendation.name,
              description: this.description[index],
              longitude: this.placeRecommendation.longitude,
              latitude: this.placeRecommendation.latitude,
              guidebook_category_id: index + 1,
              room_id: this.$route.params.roomId,
              status: this.placeRecommendation.status
            })
            .then(response => {
              this.addressMap.splice(index,0,"");
              this.description.splice(index,0,"");

              this.addressMap.splice(index + 1, 1);
              this.description.splice(index + 1, 1);

              this.isUpdate = 0;
              this.getRoomById();
              this.$swal(
                "Thành công",
                "Địa điểm được cập nhật thành công",
                "success"
              );
            });
        }
      } catch (error) {
        if (error) {
          this.$swal(
            "Xin lỗi",
            "Địa điểm chưa được cập nhật, làm ơn kiểm tra lại thông tin",
            "error"
          );
        }
      }
    },
    async deletePlace(index, idx) {
      try {
        this.$swal({
          title: "Bạn có muốn xóa địa điểm này không",
          text: "",
          type: "warning",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          showCloseButton: false,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            this.placeList.splice(idx, 1);
            let response = await axios
            .post('places/update-room-place', {
              room_id: this.roomDetail.id,
              places: this.placeList
            })
            .then(response => {
              this.addressMap.splice(index,0,"");
              this.description.splice(index,0,"");

              this.addressMap.splice(index + 1, 1);
              this.description.splice(index + 1, 1);

              this.isUpdate = 0;
              this.place = null;
              this.getRoomById();
              this.$swal(
                "Thành công",
                "Địa điểm được xóa thành công",
                "success",
                );
              })
            }
          })
        }
        catch (error) {
          this.$swal(
            "Xin lỗi",
            "Địa điểm chưa đưọc xóa, vui lòng thử lại",
            "error"
        );
      }
    },
    async getGuidebookCategories() {
      try {
        const response = await axios.get("guidebookcategories");
        this.guideBookList = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu danh sách địa điểm hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getRoomById() {
      try {
        const response = await axios.get(
          `rooms/${ this.$route.params.roomId }`,
          {
            params: {
              include: "details,places"
            }
          }
        );
        this.roomDetail = response.data.data;
        this.placeList = [];
        response.data.data.places.data.forEach(place => {
          let tag_place = place.name.split(",");
          let p = {
            id: place.id,
            name: place.name,
            tag: tag_place[0],
            description: place.description,
            latitude: place.latitude,
            longitude: place.longitude,
            guidebook_category_id: place.guidebook_category_id
          }
          this.placeList.push(p);
        })

        this.center.lat = parseFloat(response.data.data.latitude);
        this.center.lng = parseFloat(response.data.data.longitude);
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    }
  },
};
</script>
<style>
.border-gm {
  border: solid 2px lightgray;
  padding: 0 0;
  position: fixed;
  top: 60px;
  bottom: 0px;
  right: 0px;
}
.guide-descript {
  margin-top:10px;
  border-radius: 2px;
  border:solid 1px #aaa;
  padding: 6px 10px;
  color: #484848;
}
.custom-hr {
  height: 2px;
  margin-top: 30px;
  margin-left: 12px;
  margin-right: 330px;
}
.gb-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border:solid 1px #ced4da;
}
.bg-icon {
  border-radius: 50%;
  background-color: #00798a;
  text-align: center;
  padding-top: 10px;
  width: 45px;
  height: 45px;
}
.custom-icon {
  font-size: 1.4em !important;
  color: white;
}
.btn-info {
  background-color: #00798a !important;
}
.input-search {
  border-radius: 2px;
  border:solid 1px #aaa;
  display: block;
  padding: 6px 10px 6px 33px;
  width: 100%;
  color: #484848;
}
.search {
  position: relative;
}
.search .icon-fa-search {
  position: absolute;
  top: 10px;
  left: 10px;
}
.btn-back {
  margin-left: -3px;
  margin-top: -30px;
  margin-bottom: 30px;
  display: inline-block;
  padding: 8px 10px;
  background-color: #00798a;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  max-width: 75%;
  cursor: pointer;
  text-align: center;
  color: white;
  border: none;
}
.btn-back:hover {
  background-color: #00998a;
}
</style>
