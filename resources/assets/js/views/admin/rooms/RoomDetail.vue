<template>

  <div class="main-content" v-if="!loading">
    <div class="page-header">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
        <li class="breadcrumb-item"><a href="#">Phòng</a></li>
      </ol>
    </div>
    <div class="row mb-3">
      <div class="col-sm-12">
        <gallery
          :images="images"
          :index="imgIndex"
          :options="{closeOnEscape: true,
                     closeOnSlideClick: true,
                     closeOnSwipeUpOrDown: true,
                     startSlideshow: true,
                     fullScreen: false
          }"
          @close="imgIndex = null"
        />
        <carousel :scroll-per-page="true" :per-page-custom="[[320, 2],[768, 3],[992, 4]]">
          <slide v-for="(image, bindex) in images" :key="bindex">
            <figure>
              <img :src="image" class="img-fluid" @click="imgIndex = bindex">
            </figure>
          </slide>
        </carousel>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-7" v-if="room_details != null">
          <p>{{room_city.name}}</p>
          <h3>{{room_details.name}}</h3>
          <p>{{room_details.address}}</p>
          <div class="row">
            <div class="col-sm-12 mb-3">
              <div class="form-check form-check-inline">
                <i class="form-check-input icon-fa icon-fa-users"></i>
                <label class="form-check-label" for="inlineCheckbox3"> {{room.max_guest}} Khách</label>
              </div>
              <div class="form-check form-check-inline">
                <i class="form-check-input icon-fa icon-fa-bed"></i>
                <label class="form-check-label" for="inlineCheckbox1"> {{room.number_bed}} Giường</label>
              </div>
              <div class="form-check form-check-inline">
                <i class="form-check-input icon-fa icon-fa-home"></i>
                <label class="form-check-label" for="inlineCheckbox2"> {{room.number_room}} Phòng</label>
              </div>

            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 mt-2">
              <div class="panel-group">
                <v-collapse>
                  <div class="panel panel-default">
                    <v-collapse-item>
                      <a
                        slot="item-title"
                        class="panel-title"
                        href="#description"
                      >
                        Mô tả
                      </a>

                      <div v-html="room_details.description" id="description" class="panel-collapse panel-content" >

                      </div>
                    </v-collapse-item>
                  </div>
                  <div class="panel panel-default">
                    <v-collapse-item>
                      <a
                        slot="item-title"
                        class="panel-title"
                        href="#space"
                      >
                        Không gian
                      </a>

                      <div v-html="room_details.space" id="space" class="panel-collapse" >

                      </div>
                    </v-collapse-item>
                  </div>
                  <div class="panel panel-default">
                    <v-collapse-item>
                      <a
                        slot="item-title"
                        class="panel-title"
                        href="#note"
                      >
                        Ghi chú
                      </a>

                      <div v-html="room_details.note" id="note" class="panel-collapse panel-content" >

                      </div>
                    </v-collapse-item>
                  </div>
                </v-collapse>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-7" v-else>
          <lottie :options="defaultOptions" :height="150" :width="150" v-on:animCreated="handleAnimation"/>
        </div>
        <div class="col-md-5">
          <div class="card">
            <div class="card-header bg-dark">
              <h6>Giá phòng</h6>
            </div>
            <div class="card-body">
              <table class="table">
              <tbody>
                <tr>
                  <td>Giá theo ngày</td>
                  <td>{{room.price_day | formatNumber}}</td>
                </tr>
                <tr>
                  <td>Giá theo giờ</td>
                  <td>{{room.price_hour | formatNumber}}</td>
                </tr>
                <tr>
                  <td>Phí dọn dẹp</td>
                  <td>{{room.cleaning_fee | formatNumber}}</td>
                </tr>
                <tr>
                  <td>Phụ thu khách</td>
                  <td>{{room.price_charge_guest | formatNumber}} ( từ sau
                  khách thứ {{ room.max_guest }})</td>
                </tr>
                <tr>
                  <td>Giá chi tiết</td>
                  <td>
                    <button @click="openModalOptionalPrices" class="btn btn-sm btn-secondary btn-pressable">
                      <i class="icon-fa icon-fa-calendar"></i> Chi tiết giá
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <!-- <div class="card">
            <div class="card-header bg-dark">
              <h6>Tiện nghi</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div v-for="comfort in room_comforts" :key="comfort.id" class="col-md-6 mb-2">
                  <i :class="'icon-fa ' + comfort.icon "></i>{{comfort.details.data[0].name}}
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div>
      <h3 style="margin-top: 40px; padding-left: 33px;">
        <i class="icon-fa icon-fa-map-marker"></i>
        Những địa điểm nổi bật được gợi ý xung quanh phòng
      </h3>
    </div>
    <div class="row" style="margin-top: 30px;">
      <div class="card mr-5 ml-5">
        <div class="card-body">
          <gmap-map
            ref="map"
            :center="center"
            :zoom="16"
            :options="{ minZoom:10, maxZoom:18 }"
            style="width:1458px; height:700px"
            @idle="onIdle"
          >
            <gmap-marker
              v-if="isLoaded"
              :key="index"
              v-for="(m, index) in markers"
              :icon="getIcon(m)"
              :position="m.latLng"
              :clickable="true"
            >
              <gmap-info-window
                :options="infoOptions"
                :position="infoWindowPos[index]"
                :opened="true"
                @closeclick="infoWinOpen=false"
              >
                <div style="width:190px">
                  <p style="color: #cc3300;font-size: 18px; text-align:center;">
                    {{m.description}}
                  </p>
                  <p>Địa chỉ: {{m.name}}</p>
                  <p>Khoảng cách tới phòng: {{distanceToRoom[index]}} km</p>
                </div>
              </gmap-info-window>
            </gmap-marker>
            <gmap-marker
              label="★"
              :position="{
                lat:parseFloat(room.latitude),
                lng:parseFloat(room.longitude)
              }"
            />
          </gmap-map>
        </div>
      </div>

    </div>
    <sweet-modal ref="optional_prices" overlay-theme="dark">
      <table class="table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Giá theo ngày</th>
            <th>Giá theo giờ</th>
            <th>Giờ tiếp theo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(price, index) in room_prices" :key="index">
            <td>{{price.weekday == null ? price.day : price.weekday | filterWeekDay}}</td>
            <td>{{price.price_day | formatNumber}}</td>
            <td>{{price.price_hour | formatNumber}}</td>
            <td>{{price.price_after_hour | formatNumber}}</td>
          </tr>
        </tbody>
      </table>
    </sweet-modal>
  </div>
  <div class="main-content" v-else>
    <lottie :options="defaultOptions" :height="150" :width="150" v-on:animCreated="handleAnimation"/>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import Auth from "../../../services/auth";
import Lottie from "vue-lottie";
import VueGallery from "vue-gallery";
import * as animationData from "../../loading/material_wave_loading.json";
import { SweetModal } from "sweet-modal-vue";
import { format, constant, location } from "../../../helpers/mixins";
import { mapActions } from "vuex";
export default {
  mixins: [format, constant, location],
  data() {
    return {
      defaultOptions: { animationData: animationData },
      animationSpeed: 2,
      room: {},
      room_details: null,
      room_city: {},
      room_prices: [],
      room_comforts: [],
      isLeftSidebarVisible: true,
      loading: true,
      imgIndex: null,
      images: [
        "/assets/img/demo/gallery/1.jpg",
        "/assets/img/demo/gallery/2.jpg",
        "/assets/img/demo/gallery/3.jpg",
        "/assets/img/demo/gallery/4.jpg",
        "/assets/img/demo/gallery/5.jpg",
        "/assets/img/demo/gallery/6.jpg",
        "/assets/img/demo/gallery/7.jpg",
        "/assets/img/demo/gallery/8.jpg",
        "/assets/img/demo/gallery/9.jpg",
        "/assets/img/demo/gallery/10.jpg",
        "/assets/img/demo/gallery/11.jpg",
        "/assets/img/demo/gallery/12.jpg"
      ],
      infoOptions: {
        pixelOffset: {
          width: -10,
          height: 7
        }
      },
      center: {
        lat: 21.0083069,
        lng: 105.8182929
      },
      infoWindowPos: [],
      distanceToRoom: [],
      infoWinOpen: false,
      currentMidx: null,
      markers: [],
      isLoaded: false,
      permissions: "room.view"
    };
  },
  components: {
    Carousel,
    Slide,
    SweetModal,
    Lottie,
    gallery: VueGallery,
  },
  watch: {
    isLoaded: {
      handler(val) {
        if(val == true && this.markers.length) {
          this.showInfoWindow(this.markers)
          const bounds = new google.maps.LatLngBounds();
          for (let m of this.markers) {
            bounds.extend(m.latLng);
          }
          this.$refs.map.fitBounds(bounds);
        }
      }
    }
  },
  methods: {
    onIdle() {
      this.isLoaded = true;
    },
    showInfoWindow: function(markers) {
      let lat_room = parseFloat(this.room.latitude);
      let lng_room = parseFloat(this.room.longitude);
      if(markers.length) {
        markers.forEach(marker => {
          this.infoWindowPos.push(marker.latLng);
          let distance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(lat_room, lng_room),
              new google.maps.LatLng(marker.latLng.lat,marker.latLng.lng));
          let convertToKm = (distance/1000).toFixed(1);
          this.distanceToRoom.push(convertToKm);
        })

      }
    },
    async getRoom() {
      try {
        const response = await axios.get(`rooms/${this.$route.params.roomId}`, {
          params: {
            include: "details,media,comforts.details,city,district,prices,user,places"
          }
        });
        this.room = response.data.data;
        this.center.lat = parseFloat(response.data.data.latitude);
        this.center.lng = parseFloat(response.data.data.longitude);
        this.room_details = response.data.data.details.data[0];
        this.room_city = response.data.data.city.data;
        this.room_prices = response.data.data.prices.data;
        this.room_comforts = response.data.data.comforts.data;
        this.loading = false;
        if(response.data.data.places.data.length) {
          response.data.data.places.data.forEach(place => {
            this.markers.push({
              id: place.id,
              name: place.name,
              description: place.description,
              latLng: {
                lat: parseFloat(place.latitude),
                lng: parseFloat(place.longitude)
              },
              guidebook_category_id: place.guidebook_category_id,
            });
          });
        }
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
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
    openModalOptionalPrices() {
      this.$refs.optional_prices.open();
    },
    closeOptionalPricesModal() {
      this.$refs.optional_prices.close();
    },
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    },
    handleAnimation: function(anim) {
      this.anim = anim;
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getRoom();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  }
};
</script>

<style>

</style>
