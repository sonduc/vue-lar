<template>
  <div class="main-content">
    <div class="card">
      <div class="card-header">
        <h6>Bộ lọc</h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group row">
              <label for="firstName" class="col-sm-2 col-form-label">Tên phòng</label>
              <div class="col-sm-4">
                <input
                  v-model="q"
                  id="firstName"
                  type="text"
                  class="form-control"
                  placeholder="Nhập vào tên phòng"
                >
              </div>
              <label for="email" class="col-sm-2 col-form-label">Thuê theo</label>
              <div class="col-sm-4">
                <multiselect
                  v-model="rent_type"
                  label="value"
                  :options="rent_type_list"
                  :searchable="true"
                  :show-labels="false"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group row">
              <label for="firstName" class="col-sm-2 col-form-label">Khoảng giá</label>
              <div class="col-sm-4 mt-2">
                <vue-slider v-model="price_range" formatter="{value} Đ" :min="0" :max="10000000"></vue-slider>
              </div>

              <label for="lastName" class="col-sm-2 col-form-label">Phòng</label>
              <div class="col-sm-4">
                <multiselect
                  id="inputUserName"
                  v-model="room_type"
                  label="name"
                  :options="room_type_list"
                  :searchable="true"
                  :show-labels="false"
                />
              </div>
            </div>
            <div class="form-group row">
              <!-- <div class="col-md-12">
              <div class="form-group row">-->
              <label for="lastName" class="col-sm-2 col-form-label">Từ</label>
              <div class="col-sm-4">
                <datepicker v-model="date_start" :format="format" input-class="form-control"/>
              </div>
              <label for="lastName" class="col-sm-2 col-form-label">Đến</label>
              <div class="col-sm-4">
                <datepicker
                  :disabled-dates="disabledCheckout"
                  v-model="date_end"
                  :format="format"
                  input-class="form-control"
                />
              </div>
              <!-- </div> -->
              <!-- </div> -->
            </div>
          </div>
        </div>
        <button @click="applyFilter" class="btn btn-success btn-sm">Áp dụng</button>
        <button @click="resetFilter" class="btn btn-info btn-sm">Làm mới</button>
      </div>
      <div class="resultSearch">
        Kết quả tìm kiếm có
        <span style="color:red;">{{count}} phòng</span>.
        Để xem thêm kết quả, phóng to hoặc di chuyển sau đó nhấp vào nút trên bản đồ.
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div>
          <button v-if="isLoaded" class="btn-search" @click="filterMarkers">
            <i class="icon-fa icon-fa-refresh"/> Tìm ở khu này
          </button>
          <gmap-map
            ref="map"
            :center="center"
            :zoom="6"
            :options="{ minZoom:6, maxZoom:18 }"
            style="width:100%; height: 830px;"
            @idle="onIdle"
          >
            <gmap-marker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.latLng"
              :clickable="true"
              :draggable="false"
              :icon="getIcon(m)"
              @mouseover="toggleInfoWindow(m,index)"
            ></gmap-marker>
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
  </div>
</template>

<script>
import { format, location, constant } from "../../../helpers/mixins";
import Multiselect from "vue-multiselect";
import VueSlider from "vue-slider-component";
import { mapGetters, mapActions } from "vuex";
import Auth from "../../../services/auth";
import { loaded } from "vue2-google-maps";
import GmapCluster from "vue2-google-maps/dist/components/cluster";
import Datepicker from "vuejs-datepicker";

export default {
  name: "RoomGoogleMap",
  mixins: [format, location, constant],
  components: {
    Multiselect,
    VueSlider,
    GmapCluster,
    Datepicker
  },
  data() {
    return {
      q: "",
      city: {
        id: ""
      },
      district: {
        id: ""
      },
      date_start: null,
      date_end: null,
      format: "yyyy-MM-dd",
      isLoaded: false,
      count: null,
      checkTypeSearch: 0,
      price_range: [0, 10000000],
      center: {
        lat: 14.542312,
        lng: 107.923343
      },
      room_type: {
        id: ""
      },
      rent_type: {
        id: ""
      },
      status: {
        id: ""
      },
      markers: [],
      currentPlace: null,
      rooms: null,
      infoContent: "",
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      areaBounds: {
        lat_min: 6.96020496098099,
        lat_max: 24.438120801731465,
        long_min: 89.74531390000004,
        long_max: 124.19843890000004
      },
      infoWinOpen: false,
      currentMidx: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -15
        },
        disableAutoPan: true
      },
      disabledCheckout: {
        to: ""
      }
    };
  },
  watch: {
    markers(markers) {
      if (this.isLoaded && markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        for (let m of markers) {
          bounds.extend(m.latLng);
        }
        if (this.checkTypeSearch == 1) {
          this.$refs.map.fitBounds(bounds);
        }
      }
    },
    date_start: {
      handler(val) {
        this.disabledCheckout.to = val;
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      "getRoomGoogleMap",
      "getCountRoomGMap",
      "getSearchMapStatus",
      "getInfoSearchRoom"
    ])
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getAllRoom();
          }
        });
      }
    });
    this.geolocate();
  },
  methods: {
    ...mapActions(["changeSearchMapStatus"]),

    // receives a place object via the autocomplete component
    onIdle() {
      this.isLoaded = true;
    },
    setPlace(place) {
      this.currentPlace = place;
    },
    getIcon(marker) {
      let price_day = this.formatNumber(marker.price_day);
      let price_hour = this.formatNumber(marker.price_hour);
      let rent_type = marker.rent_type;
      let svg;
      if (rent_type == 1) {
        svg = [
          '<?xml version="1.0"?>',
          '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
          '<rect x="0" y="0" class="bar" width="100" height="30" ry="15" style="stroke: red; fill: #EA6732;"/>',
          '<text x="13" y="20" style="fill:white;">' + price_hour + " đ</text>",
          "</svg>"
        ].join("\n");
      } else {
        svg = [
          '<?xml version="1.0"?>',
          '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
          '<rect x="0" y="0" class="bar" width="100" height="30" ry="15" style="stroke: red; fill: #EA6732;"/>',
          '<text x="8" y="20" style="fill:white;">' + price_day + " đ</text>",
          "</svg>"
        ].join("\n");
      }
      let myIcon = {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(80, 80),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(30, 20)
      };
      return myIcon;
    },
    formatNumber(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    filterMarkers() {
      let bd = this.$refs.map.$mapObject.getBounds();
      if (bd.getNorthEast().lat() > bd.getSouthWest().lat()) {
        this.areaBounds.lat_min = bd.getSouthWest().lat();
        this.areaBounds.lat_max = bd.getNorthEast().lat();
      } else {
        this.areaBounds.lat_min = bd.getNorthEast().lat();
        this.areaBounds.lat_max = bd.getSouthWest().lat();
      }
      if (bd.getSouthWest().lng() > bd.getNorthEast().lng()) {
        this.areaBounds.long_min = bd.getNorthEast().lng();
        this.areaBounds.long_max = bd.getSouthWest().lng();
      } else {
        this.areaBounds.long_min = bd.getSouthWest().lng();
        this.areaBounds.long_max = bd.getNorthEast().lng();
      }
      this.getAllRoom();
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.latLng;
      this.infoContent = this.getInfoWindowContent(marker);

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    getInfoWindowContent: function(marker) {
      let price_day = this.formatNumber(marker.price_day);
      let price_hour = this.formatNumber(marker.price_hour);
      if (marker.rent_type == 1) {
        return `<div class="row" style="margin:0px;">
            <a href="/admin/rooms/detail/${marker.id}"
              target="_blank">
              <div class="card" style="width:300px;cursor:pointer">
                <img class="card-img-top" src="https://c1.momondo.net/assets/photos/cards/card_hotels_001.jpg?q=60&h=400" alt="Card image cap">
                <ul class="list-group" style="font-weight:500;">
                  <li class="list-group-item">Căn hộ: ${marker.name}</li>
                  <li class="list-group-item">Giá theo ngày: ${price_hour}
                    đ/1 giờ</li>
                </ul>
              </div>
            </a>
          </div>`;
      } else if (marker.rent_type == 2) {
        return `<div class="row" style="margin:0px;">
            <a href="/admin/rooms/detail/${marker.id}"
              target="_blank">
              <div class="card" style="width:300px;cursor:pointer">
                <img class="card-img-top" src="https://c1.momondo.net/assets/photos/cards/card_hotels_001.jpg?q=60&h=400" alt="Card image cap">
                <ul class="list-group" style="font-weight:500;">
                  <li class="list-group-item">Căn hộ: ${marker.name}</li>
                  <li class="list-group-item">Giá theo ngày: ${price_day} đ/1ngày</li>
                </ul>
              </div>
            </a>
          </div>`;
      } else {
        return `<div class="row" style="margin:0px;">
            <a href="/admin/rooms/detail/${marker.id}"
              target="_blank">
              <div class="card" style="width:300px;cursor:pointer">
                <img class="card-img-top" src="https://c1.momondo.net/assets/photos/cards/card_hotels_001.jpg?q=60&h=400" alt="Card image cap">
                <ul class="list-group" style="font-weight:500;">
                  <li class="list-group-item">Căn hộ: ${marker.name}</li>
                  <li class="list-group-item">Giá theo ngày: ${price_day}đ/1ngày</li>
                  <li class="list-group-item">Giá theo giờ: ${price_hour} đ/1giờ</li>
                </ul>
              </div>
            </a>
          </div>`;
      }
    },
    applyFilter() {
      this.checkTypeSearch = 1;
      this.getRoomSearch();
    },
    resetFilter() {
      this.q = "";
      this.city = {
        id: ""
      };
      this.district = {
        id: ""
      };
      this.rent_type = {
        id: ""
      };
      this.date_start = null;
      this.date_end = null;
      this.room_type = {
        id: ""
      };
      this.price_range = [0, 10000000];
      // this.getRoomSearch();
    },
    async getRoomSearch() {
      let date_start =
        this.date_start !== null
          ? this.date_start.toISOString().substr(0, 10)
          : "";
      let date_end =
        this.date_end !== null ? this.date_end.toISOString().substr(0, 10) : "";
      try {
        const response = await axios.get(`rooms/room-lat-long`, {
          params: {
            include: "details",
            limit: 70,
            name: this.q.trim(),
            price_day_from: this.price_range[0],
            price_day_to: this.price_range[1],
            checkin: date_start,
            checkout: date_end,
            type_room: this.room_type.id,
            rent_type: this.rent_type.id,
            lat_min: this.areaBounds.lat_min,
            lat_max: this.areaBounds.lat_max,
            long_min: this.areaBounds.long_min,
            long_max: this.areaBounds.long_max
          }
        });
        this.rooms = response.data.data;
        let paginate = response.data.meta.pagination;
        this.count = paginate.count;
        this.markers = [];
        response.data.data.forEach(room => {
          if (room.latitude != 0 && room.longtitue != 0) {
            this.markers.push({
              id: room.id,
              name: room.details.data.length ? room.details.data[0].name : "",
              rent_type: room.rent_type,
              price_day: room.price_day,
              price_hour: room.price_hour,
              latLng: {
                lat: parseFloat(room.latitude),
                lng: parseFloat(room.longitude)
              }
            });
          }
        });
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Tìm kiếm phòng gặp lỗi, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getAllRoom() {
      let date_start =
        this.date_start !== null
          ? this.date_start.toISOString().substr(0, 10)
          : "";
      let date_end =
        this.date_end !== null ? this.date_end.toISOString().substr(0, 10) : "";
      try {
        const response = await axios.get(`rooms/room-lat-long`, {
          params: {
            include: "details",
            limit: 70,
            name: this.q.trim(),
            price_day_from: this.price_range[0],
            price_day_to: this.price_range[1],
            checkin: date_start,
            checkout: date_end,
            type_room: this.room_type.id,
            rent_type: this.rent_type.id,
            lat_min: this.areaBounds.lat_min,
            lat_max: this.areaBounds.lat_max,
            long_min: this.areaBounds.long_min,
            long_max: this.areaBounds.long_max
          }
        });
        let roomSearch;
        if (this.getSearchMapStatus) {
          this.q = this.getInfoSearchRoom.name;
          this.city.id = this.getInfoSearchRoom.city_id;
          this.district.id = this.getInfoSearchRoom.district_id;
          this.price_range = this.getInfoSearchRoom.price_range;
          this.checkTypeSearch = 1;
          this.rooms = this.getRoomGoogleMap;
          roomSearch = this.getRoomGoogleMap;
          this.count = this.getCountRoomGMap;
        } else {
          this.checkTypeSearch = 0;
          this.rooms = response.data.data;
          roomSearch = response.data.data;
          let paginate = response.data.meta.pagination;
          this.count = paginate.count;
        }
        // console.log('asdf' + roomSearch);
        this.markers = [];
        this.changeSearchMapStatus(0);
        roomSearch.forEach(room => {
          if (room.latitude != 0 && room.longtitue != 0) {
            this.markers.push({
              id: room.id,
              name: room.details.data.length ? room.details.data[0].name : "",
              rent_type: room.rent_type,
              price_day: room.price_day,
              price_hour: room.price_hour,
              latLng: {
                lat: parseFloat(room.latitude),
                lng: parseFloat(room.longitude)
              }
            });
          }
        });
      } catch (error) {
        if (error) {
          // console.log(error);
          window.toastr["error"](
            "Dữ liệu phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    }
  }
};
</script>
<style>
.btn-search {
  position: absolute;
  z-index: 999;
  margin-left: 227px;
  margin-top: 10px;
  display: inline-block;
  padding: 8px 10px;
  background-color: #5392f9;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  max-width: 75%;
  cursor: pointer;
  text-align: center;
  color: white;
  border: none;
}

.btn-search:hover {
  background-color: #1392f9;
}

.resultSearch {
  font-size: 20px;
  text-align: center;
  border: 1px solid green;
  padding: 10px;
  border-radius: 5px;
  margin: 0 200px;
}

.bar:hover {
  fill: transparent;
  stroke: blue;
  stroke-width: 1px;
}
</style>
