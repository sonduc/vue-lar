<template>
  <div id="dashboardPage" class="main-content">
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
</template>

<script type="text/babel">
import Auth from "../../../services/auth";

import ChartBookingByTypeRevenue from "./ChartBookingByTypeRevenue.vue";
import ChartBookingRevenue from "./ChartBookingRevenue.vue";
import ChartBookingByManagerRevenue from "./ChartBookingByManagerRevenue.vue";
import ChartBookingByRoomTypeRevenue from "./ChartBookingByRoomTypeRevenue.vue";

export default {
  components: {
    ChartBookingByTypeRevenue,
    ChartBookingRevenue,
    ChartBookingByManagerRevenue,
    ChartBookingByRoomTypeRevenue
  },
  data() {
    return {
      header: "header",
      date_start: "2018-12-01",
      date_end: "2018-12-10",
      view: "day",
      permissions: "statistics.view"
    };
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
