<template>
  <div class="main-content">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <div class="form-group row">
              <div class="col-sm-12">
                <input
                  v-model="q"
                  id="firstName"
                  type="text"
                  class="form-control"
                  placeholder="Nhập vào tên phòng"
                >
              </div>
            </div>
          </div>
          <div class="col-md-9">
            <div class="form-group row">
              <label for="firstName" class="col-sm-2 col-form-label">Khoảng giá</label>
              <div class="col-sm-3 mt-2" style="margin-left: -58px; margin-right: 58px;">
                <vue-slider v-model="price_range" formatter="{value} Đ" :min="0" :max="10000000"></vue-slider>
              </div>

              <label
                for="city"
                class="col-sm-1 col-form-label"
                style="padding-left: inherit;"
              >Thành phố</label>
              <div class="col-sm-2">
                <multiselect
                  v-model="cityRoom"
                  label="name"
                  :options="cities"
                  :searchable="true"
                  :show-labels="false"
                />
              </div>
              <label for="district" style="padding-left: 33px;" class="col-sm-1 col-form-label">Quận</label>
              <div class="col-sm-3">
                <multiselect
                  :disabled="city == null"
                  v-model="districtRoom"
                  label="name"
                  :options="filteredDistrict"
                  :searchable="true"
                  :show-labels="false"
                />
              </div>
            </div>
          </div>
        </div>
        <button @click="applyFilter" class="btn btn-success btn-sm">Tìm phòng</button>
        <button @click="resetFilter" class="btn btn-info btn-sm">Làm mới</button>
        <div class="resultSearch">
          Kết quả tìm kiếm có
          <span style="color:red;">{{count}} phòng</span>.
          Để xem thêm kết quả, phóng to hoặc di chuyển sau đó nhấp vào nút trên bản đồ.
        </div>
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
import { format, location } from "../../../helpers/mixins";
import Multiselect from "vue-multiselect";
import VueSlider from "vue-slider-component";
import { mapGetters, mapActions } from "vuex";
import Auth from "../../../services/auth";
import { loaded } from "vue2-google-maps";
import GmapCluster from "vue2-google-maps/dist/components/cluster";
export default {
  name: "RoomGoogleMap",
  mixins: [format, location],
  components: {
    Multiselect,
    VueSlider,
    GmapCluster
  },
  data() {
    return {
      q: "",
      city: {
        id: "",
        name: ""
      },
      district: {
        id: "",
        name: ""
      },
      checkChangeCity: 0,
      isLoaded: false,
      count: null,
      checkTypeSearch: 0,
      price_range: [0, 10000000],
      center: {
        lat: 14.542312,
        lng: 107.923343
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
        }
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
    }
  },
  computed: {
    ...mapGetters([
      "getRoomGoogleMap",
      "getCountRoomGMap",
      "getSearchMapStatus",
      "getInfoSearchRoom"
    ]),

    filteredDistrict() {
      let self = this;
      return this.districts.filter(function(item) {
        return item.city_id == self.city.id;
      });
    },
    cityRoom: {
      get: function() {
        if (this.getInfoSearchRoom.city_id == null) {
          return null;
        } else if (this.checkChangeCity == 1) {
          return {
            id: this.getInfoSearchRoom.city_id,
            name: this.getInfoSearchRoom.city_name
          };
        } else {
          return {
            id: this.city.id,
            name: this.city.name
          };
        }
      },
      set: function(val) {
        this.checkChangeCity = 0;
        this.city.id = val.id;
        this.city.name = val.name;
      }
    },
    districtRoom: {
      get: function() {
        if (this.getInfoSearchRoom.district_id == null) {
          return null;
        } else if (this.checkChangeCity == 1) {
          return {
            id: this.getInfoSearchRoom.district_id,
            name: this.getInfoSearchRoom.district_name
          };
        } else {
          return {
            id: this.district.id,
            name: this.district.name
          };
        }
      },
      set: function(val) {
        this.checkChangeCity = 0;
        this.district.id = val.id;
        this.district.name = val.name;
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
            <a href="http://laraspace-admin.nhat/admin/rooms/detail/${
              marker.id
            }"
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
            <a href="http://laraspace-admin.nhat/admin/rooms/detail/${
              marker.id
            }"
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
            <a href="http://laraspace-admin.nhat/admin/rooms/detail/${
              marker.id
            }"
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
      this.price_range = [0, 10000000];
      this.getRoomSearch();
    },
    async getRoomSearch() {
      try {
        const response = await axios.get(`rooms`, {
          params: {
            include: "details",
            limit: 70,
            name: this.q.trim(),
            city_id: this.city.id,
            price_range_start: this.price_range[0],
            price_range_end: this.price_range[1],
            district_id: this.district.id
          }
        });
        this.rooms = response.data.data;
        let paginate = response.data.meta.pagination;
        this.count = paginate.total;
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
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getAllRoom() {
      try {
        const response = await axios.post(
          `rooms/room-lat-long?include=details`,
          {
            lat_min: this.areaBounds.lat_min,
            lat_max: this.areaBounds.lat_max,
            long_min: this.areaBounds.long_min,
            long_max: this.areaBounds.long_max
          }
        );
        console.log(this.areaBounds);
        let roomSearch;
        if (this.getSearchMapStatus) {
          this.q = this.getInfoSearchRoom.name;
          this.city.id = this.getInfoSearchRoom.city_id;
          this.district.id = this.getInfoSearchRoom.district_id;
          this.price_range = this.getInfoSearchRoom.price_range;
          this.checkTypeSearch = 1;
          this.checkChangeCity = 1;
          this.rooms = this.getRoomGoogleMap;
          roomSearch = this.getRoomGoogleMap;
          this.count = this.getCountRoomGMap;
        } else {
          this.checkTypeSearch = 0;
          this.rooms = response.data.data;
          roomSearch = response.data.data;
          let paginate = response.data.meta.pagination;
          this.count = paginate.total;
        }
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
          window.toastr["error"]("There was an error", "Error");
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
