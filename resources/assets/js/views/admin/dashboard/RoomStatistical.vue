<template>
  <div id="dashboardPage" class="main-content">
    <div class="row">
      <div class="col-lg-12 col-xl-12 mt-2">
        <div class="card">
          <div class="card-header">
            <h6>
              <i class="icon-fa icon-fa-line-chart text-warning"/>Biểu đồ số phòng trên hệ thống
            </h6>
          </div>
          <div class="card-body">
            <chart-room-by-room-type :date_end="date_end" :date_start="date_start" :view="view"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import Auth from "../../../services/auth";

import ChartRoomByRoomType from "./ChartRoomByRoomType.vue";

export default {
  components: {
    ChartRoomByRoomType
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
