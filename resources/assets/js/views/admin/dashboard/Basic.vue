<template>
  <div id="dashboardPage" class="main-content">
    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số lượng booking theo Giới tính
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-gender :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số lượng booking theo trạng thái
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-status :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số lượng booking Theo Ngày / Theo giờ
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-type :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số lượng booking theo tỉnh thành
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-city :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số lượng booking theo Quận Huyện
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-district :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số lượng booking theo khoảng giá
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-price-range
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
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số lượng booking theo khoảng tuổi
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-age-range :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số lượng booking theo kênh
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-source :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ doanh thu theo loại đặt phòng
            </h6>
          </div>
          <div class="card-body">
            <chart-booking-by-type-revenue :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import Auth from "../../../services/auth";
import ChartBookingByCity from "./ChartBookingByCity.vue";
import ChartBookingByDistrict from "./ChartBookingByDistrict.vue";
import ChartBookingByStatus from "./ChartBookingByStatus.vue";
import ChartBookingByType from "./ChartBookingByType.vue";
import ChartBookingByGender from "./ChartBookingByGender.vue";
import ChartBookingByPriceRange from "./ChartBookingByPriceRange.vue";
import ChartBookingByAgeRange from "./ChartBookingByAgeRange.vue";
import ChartBookingBySource from "./ChartBookingBySource.vue";
import ChartBookingByTypeRevenue from "./ChartBookingByTypeRevenue.vue";

export default {
  components: {
    ChartBookingByCity,
    ChartBookingByDistrict,
    ChartBookingByStatus,
    ChartBookingByType,
    ChartBookingByGender,
    ChartBookingByPriceRange,
    ChartBookingByAgeRange,
    ChartBookingBySource,
    ChartBookingByTypeRevenue
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
