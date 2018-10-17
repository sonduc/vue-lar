<template>

  <div class="main-content">
    <div class="page-header">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Components</a></li>
        <li class="breadcrumb-item active">Vue Carousel</li>
      </ol>
    </div>
    <div class="row mb-3">
      <div class="col-sm-12">
        <carousel :scroll-per-page="true" :per-page-custom="[[320, 2],[768, 3],[992, 4]]">
          <slide>
            <img src="/assets/img/demo/gallery/11.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/12.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/9.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/4.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/3.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/6.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/2.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/8.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/1.jpg" class="img-fluid">
          </slide>
          <slide>
            <img src="/assets/img/demo/gallery/10.jpg" class="img-fluid">
          </slide>
        </carousel>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-7">
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
            <div class="col-sm-12">
              <div class="card">
                <div class="card-header">Mô tả</div>
                <div class="card-body">
                  <p v-html="room_details.description"></p>
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="card">
                <div class="card-header">
                  Không gian
                </div>
                <div class="card-body">
                  <p v-html="room_details.space"></p>
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="card">
                <div class="card-header">Ghi chú</div>
                <div class="card-body">
                  <p v-html="room_details.note"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-5">

        </div>
      </div>
      <!-- <div class="row">
        <div class="card">
          <div class="card-body">
            <GmapMap :center="{lat:parseInt(room.latitude), lng:parseInt(room.longitude)}" :zoom="14" style="width:800px; height:400px">
              <gmap-marker :position="{lat:parseInt(room.latitude), lng:parseInt(room.longitude)}"></gmap-marker>
            </GmapMap>
          </div>
        </div>

      </div> -->
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import Auth from "../../../services/auth";
import { format, constant, location } from "../../../helpers/mixins";
export default {
  mixins: [format, constant, location],
  data() {
    return {
      room: {},
      room_details: {},
      room_city: {},
      isLeftSidebarVisible: true
    };
  },
  components: {
    Carousel,
    Slide
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
        this.room_details = response.data.data.details.data[1];
        this.room_city = response.data.data.city.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
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
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
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
