<template>
  <div id="dashboardPage" class="main-content">
    <div class="mailbox">
      <div class="card">
        <div class="card-header">
          <h6>Bộ lọc</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-5">
              <label class="container">
                Ngày
                <input type="radio" name="inlineRadioOptions" value="day" v-model="view">
                <span class="checkmark"></span>
              </label>
              <label class="container">
                Tuần
                <input type="radio" name="inlineRadioOptions" value="week" v-model="view">
                <span class="checkmark"></span>
              </label>
              <label class="container">
                Tháng
                <input type="radio" name="inlineRadioOptions" value="month" v-model="view">
                <span class="checkmark"></span>
              </label>
              <label class="container">
                Năm
                <input type="radio" name="inlineRadioOptions" value="year" v-model="view">
                <span class="checkmark"></span>
              </label>
            </div>
            <div class="col-md-7">
              <div class="form-group row">
                <label for="lastName" class="col-sm-1 col-form-label">Từ</label>
                <div class="col-sm-5">
                  <datepicker v-model="date_start" :format="format" input-class="form-control"/>
                </div>
                <label for="lastName" class="col-sm-1 col-form-label">Đến</label>
                <div class="col-sm-5">
                  <datepicker
                    :disabled-dates="disabledDateEnd"
                    v-model="date_end"
                    :format="format"
                    input-class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- <button @click="applyFilter()" class="btn btn-success btn-sm">Áp dụng</button> -->
          <button @click="resetFilter()" class="btn btn-info btn-sm">Làm mới</button>
        </div>
      </div>
      <div class="mailbox-content">
        <div class="row">
          <div class="col-lg-12 col-xl-12 mt-2">
            <div class="card">
              <div class="card-header">
                <h6>
                  <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ doanh thu theo loại đặt phòng
                </h6>
              </div>
              <div class="card-body">
                <chart-booking-by-type-revenue
                  :date_end="date_end"
                  :date_start="date_start"
                  :view="view"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12 col-xl-12 mt-2">
            <div class="card">
              <div class="card-header">
                <h6>
                  <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ doanh thu tổng
                </h6>
              </div>
              <div class="card-body">
                <chart-booking-revenue :date_end="date_end" :date_start="date_start" :view="view"/>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12 col-xl-12 mt-2">
            <div class="card">
              <div class="card-header">
                <h6>
                  <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ doanh thu phòng tự quản lý
                </h6>
              </div>
              <div class="card-body">
                <chart-booking-by-manager-revenue
                  :date_end="date_end"
                  :date_start="date_start"
                  :view="view"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12 col-xl-12 mt-2">
            <div class="card">
              <div class="card-header">
                <h6>
                  <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ doanh thu theo loại phòng
                </h6>
              </div>
              <div class="card-body">
                <chart-booking-by-room-type-revenue
                  :date_end="date_end"
                  :date_start="date_start"
                  :view="view"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import Auth from "../../../services/auth";
import Datepicker from "vuejs-datepicker";
import { format, constant, location } from "../../../helpers/mixins";
import ChartBookingByTypeRevenue from "./ChartBookingByTypeRevenue.vue";
import ChartBookingRevenue from "./ChartBookingRevenue.vue";
import ChartBookingByManagerRevenue from "./ChartBookingByManagerRevenue.vue";
import ChartBookingByRoomTypeRevenue from "./ChartBookingByRoomTypeRevenue.vue";

export default {
  components: {
    Datepicker,
    ChartBookingByTypeRevenue,
    ChartBookingRevenue,
    ChartBookingByManagerRevenue,
    ChartBookingByRoomTypeRevenue
  },
  data() {
    return {
      header: "header",
      date_start: null,
      date_end: null,
      view: "day",
      permissions: "statistics.view",
      status: 4,
      format: "yyyy-MM-dd",
      disabledDateEnd: {
        to: ""
      }
    };
  },
  methods: {
    methods: {
      resetFilter() {
        this.date_start = null;
        this.date_end = null;
        this.view = "week";
      }
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          }
        });
      }
    });
  }
};
</script>
