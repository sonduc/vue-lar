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
          <div class="card">
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
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="card mr-5 ml-5">
        <div class="card-body">
          <GmapMap 
            :center="{lat:parseInt(room.latitude), lng:parseInt(room.longitude)}" 
            :zoom="12"
            style="width:1500px; height:500px"
          >
            <gmap-marker 
              :position="{lat:parseInt(room.latitude), lng:parseInt(room.longitude)}"
            />
          </GmapMap>
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
      permissions: "room.view"
    };
  },
  components: {
    Carousel,
    Slide,
    SweetModal,
    Lottie,
    gallery: VueGallery
  },
  methods: {
    async getRoom() {
      try {
        const response = await axios.get(`rooms/${this.$route.params.roomId}`, {
          params: {
            include: "details,media,comforts.details,city,district,prices,user"
          }
        });
        this.room = response.data.data;
        this.room_details = response.data.data.details.data[0];
        this.room_city = response.data.data.city.data;
        this.room_prices = response.data.data.prices.data;
        this.room_comforts = response.data.data.comforts.data;
        this.loading = false;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
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
