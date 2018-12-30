<template>
  <div class="main-content">
    <div class="row">
      <div class="form__group">
      </div>
      <div class="col-sm-7" v-if="roomDetail"
        style="padding-right: 243px; text-align: center;">
        <h2>{{roomDetail.details.data[0].name}}</h2>
        <p> Tạo một danh sách hướng dẫn các địa điểm yêu thích để đi ăn hoặc giải trí xung quanh căn hộ.</p>
        <p>Khách du lịch của bạn có thể tham khảo những tư vấn này bất cứ lúc nào.</p>
      </div>
      <div class="col-sm-7"
        v-for="(category, index) in guideBookList" :key="index">
        <div class="form-group" style="padding-bottom: 20px;">
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
            <label>Where do you go out at night ?</label><br/>
            <label
              :style="errors.has('address' + index) ? 'color:red;' : ''">
                {{errors.has('address' + index)
                ? errors.first('address' + index) : ''}}
            </label>
            <input
              v-if="guideBookList.length"
              type="text"
              :name="'address' + index"
              :id="'addressMap' + index"
              v-model="addressMap[index]"
              class="input-search"
              placeholder="Nhập địa điểm..."
              v-validate="{ max:255,
                regex:/^[\d\-a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ, ]*$/u }"
              data-vv-as="Địa chỉ"
              @click="doAutocomplete(index)">
            <textarea
              v-if="addressMap[index]"
              rows="5" cols="51"
              v-model="description[index]"
              class="guide-descript" placeholder="Mô tả">
            </textarea>
            <button v-if="addressMap[index] && checkIsUpdate(index) == false"
              @click="createPlace(category.id, index)"
              class="btn btn-info">Thêm</button>
            <button v-if="addressMap[index] && checkIsUpdate(index)"
              @click="updatePlace(category.id, index)"
              class="btn btn-info">Sửa</button>
            <button v-if="addressMap[index]" @click="clearForm(index)"
              class="btn btn-danger">Làm mới</button>
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
          <gmap-marker v-for="(marker, index) in markers"
            :key="index"
            :position="marker.position"
            :clickable="true"
            :icon="getIcon(marker)"
          />
          <gmap-marker
            v-if="roomDetail"
            label="★"
            :position="{
              lat: parseFloat(roomDetail.latitude),
              lng: parseFloat(roomDetail.longitude)
            }"
          />
          <gmap-info-window
            :options="infoOptions"
            :position="infoWindowPos"
            :opened="infoWinOpen"
            @closeclick="infoWinOpen=false"
          >
            <div v-html="infoContent"></div>
          </gmap-info-window>
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
import { mapGetters, mapActions } from "vuex";
export default {
  name: "RoomGuideBook",
  components: {
    quillEditor,
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
          width: 0,
          height: -30
        }
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
    }
  },
  computed: {
    ...mapGetters(['getRoomPlace']),
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
    place: {
      handler(val) {
        if(val) {
          this.showInfoWindow(this.currentMarker)
        }
        else {
          this.infoWinOpen = false;
        }
      }
    }
  },
  created() {
    if(this.getRoomPlace){
      this.markers.push({
        position: this.getRoomPlace.latLng
      })
      this.addressMap[this.getRoomPlace.guidebook_category_id - 1]
        = this.getRoomPlace.name;
      this.description[this.getRoomPlace.guidebook_category_id - 1]
        = this.getRoomPlace.description;
      this.infoWindowPos = this.getRoomPlace.latLng;
      this.infoContent = this.getRoomPlace.name;
      this.infoWinOpen = true;
      this.placeRecommendation.name = this.getRoomPlace.name;
      this.placeRecommendation.description = this.getRoomPlace.description;
      this.placeRecommendation.latitude = this.getRoomPlace.latLng.lat;
      this.placeRecommendation.longitude = this.getRoomPlace.latLng.lng;
      this.placeRecommendation.guidebook_category_id = this.getRoomPlace.guidebook_category_id;
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
    ...mapActions(["changeRoomPlace"]),

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
      if (this.place) {
        this.markers = [],
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng(),
          }
        })
        this.currentMarker = this.markers[0];
        this.infoWinOpen = true;
        this.placeRecommendation.latitude = this.place.geometry.location.lat();
        this.placeRecommendation.longitude = this.place.geometry.location.lng();
        this.placeRecommendation.name = this.place.formatted_address;
      }
    },
    getIcon(marker) {
      let svg = [
          '<?xml version="1.0"?>',
          '<svg width="40px" height="40px" version="1.1" xmlns="http://www.w3.org/2000/svg">',
          '<circle cx="20" cy="20" r="16" stroke="green" stroke-width="1" fill="red" />',
          "</svg>"
        ].join("\n");
      let myIcon = {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
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
    checkIsUpdate(index) {
      if(this.getRoomPlace) {
        if((this.getRoomPlace.guidebook_category_id - 1)  == index) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    },
    showInfoWindow: function(marker) {
      this.infoWindowPos = marker.position;
      this.infoContent = this.placeRecommendation.name;
    },
    clearForm(index) {
      this.addressMap.splice(index,0,"");
      this.description.splice(index,0,"");

      this.addressMap.splice(index + 1, 1);
      this.description.splice(index + 1, 1);

      this.place = null;
      if(this.getRoomPlace) {
        this.changeRoomPlace(null);
      }
    },
    doAutocomplete(index) {
      let element = document.getElementById('addressMap'+ index)
      this.autocomplete = new google.maps.places.Autocomplete(element)
      this.autocomplete.addListener('place_changed', () => {
        let place = this.autocomplete.getPlace();
        this.addressMap[index] = place.formatted_address;
        this.place = place;
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
              this.$swal(
                "Thành công",
                "Địa điểm được thêm thành công",
                "success"
              );
              this.addressMap.splice(index,0,"");
              this.description.splice(index,0,"");

              this.addressMap.splice(index + 1, 1);
              this.description.splice(index + 1, 1);

              this.place = null;
            });
        }
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async updatePlace(category_id, index) {
      try {
        const result = await this.$validator.validateAll();
        if(result) {
          let response = await axios
            .put(`places/${this.getRoomPlace.id}`, {
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
              this.changeRoomPlace(null);
              this.$swal(
                "Thành công",
                "Địa điểm được cập nhật thành công",
                "success"
              );
            });
        }
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getGuidebookCategories() {
      try {
        const response = await axios.get("guidebookcategories");
        this.guideBookList = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getRoomById() {
      try {
        const response = await axios.get(
          `rooms/${ this.$route.params.roomId }`,
          {
            params: {
              include: "details"
            }
          }
        );
        this.roomDetail = response.data.data;
        if(this.getRoomPlace) {
          this.center.lat = this.getRoomPlace.latLng.lat;
          this.center.lng = this.getRoomPlace.latLng.lng;
        }
        else {
          this.center.lat = parseFloat(response.data.data.latitude);
          this.center.lng = parseFloat(response.data.data.longitude);
        }
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
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
  padding: 6px 10px;
  width: 100%;
  color: #484848;
}
</style>
