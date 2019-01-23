<template>
  <div id="dashboardPage" class="main-content">
    <div class="mailbox">
      <div class="card">
        <div class="card-header">
          <h6>Bộ lọc</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-form-label">Xem theo</label>
                <div class="col-sm-4">
                  <multiselect
                    v-model="current_view"
                    label="value"
                    :options="view_list"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
                <label for="email" class="col-sm-2 col-form-label">Trạng thái</label>
                <div class="col-sm-4">
                  <multiselect
                    v-model="current_status"
                    label="value"
                    :options="status_list"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group row">
                <label for="lastName" class="col-sm-3 col-md-3 col-form-label">Từ</label>
                <div class="col-sm-3 col-md-3">
                  <datepicker v-model="start" :format="format" input-class="form-control"/>
                </div>
                <label for="lastName" class="col-sm-3 col-md-3 col-form-label">Đến</label>
                <div class="col-sm-3 col-md-3">
                  <datepicker
                    :disabled-dates="disabledDateEnd"
                    v-model="end"
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
                  <i class="icon-fa icon-fa-line-chart text-warning"/>Tổng số phòng trên hệ thống
                </h6>
              </div>
              <div class="card-body">
                <chart-room-by-room-type
                  :date_end="date_end.toISOString().substr(0, 10)"
                  :date_start="date_start.toISOString().substr(0, 10)"
                  :view="view"
                  :status="status"
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
                  <i class="icon-fa icon-fa-line-chart text-warning"/>Số phòng theo tỉnh thành
                </h6>
              </div>
              <div class="card-body">
                <chart-room-by-city
                  :date_end="date_end.toISOString().substr(0, 10)"
                  :date_start="date_start.toISOString().substr(0, 10)"
                  :view="view"
                  :status="status"
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
                  <i class="icon-fa icon-fa-line-chart text-warning"/>
                  Top phòng có nhiều booking nhất từ
                  <b>{{date_start !== null ? date_start.toISOString().substr(0, 10) : ''}}</b> đến
                  <b>{{date_end !== null ? date_end.toISOString().substr(0, 10) : ''}}</b>
                </h6>
              </div>
              <div class="card-body">
                <chart-top-room
                  :date_end="date_end.toISOString().substr(0, 10)"
                  :date_start="date_start.toISOString().substr(0, 10)"
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
                  <i class="icon-fa icon-fa-line-chart text-warning"/>
                  Top phòng có nhiều booking nhất từ
                  <b>{{date_start !== null ? date_start.toISOString().substr(0, 10) : ''}}</b> đến
                  <b>{{date_end !== null ? date_end.toISOString().substr(0, 10) : ''}}</b>
                </h6>
              </div>
              <div class="card-body">
                <room-compare
                  :date_end="date_end.toISOString().substr(0, 10)"
                  :date_start="date_start.toISOString().substr(0, 10)"
                  :view="view"
                  :status="status"
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
import ChartRoomByRoomType from "./ChartRoomByRoomType.vue";
import ChartRoomByCity from "./ChartRoomByCity.vue";
import ChartTopRoom from "./ChartTopRoom.vue";
import RoomCompare from "./RoomCompare.vue";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Datepicker,
    ChartRoomByRoomType,
    ChartRoomByCity,
    ChartTopRoom,
    RoomCompare,
    Multiselect
  },
  data() {
    return {
      header: "header",
      start: null,
      end: null,
      current_view: {
        id: "day",
        value: "Ngày"
      },
      view_list: [
        {
          id: "day",
          value: "Ngày"
        },
        {
          id: "week",
          value: "Tuần"
        },
        {
          id: "month",
          value: "Tháng"
        },
        {
          id: "year",
          value: "Năm"
        }
      ],
      current_status: {
        id: "",
        value: "Tất cả"
      },
      status_list: [
        {
          id: 0,
          value: "Đang khóa"
        },
        {
          id: 1,
          value: "Đang hoạt động"
        },
        {
          id: "",
          value: "Tất cả"
        }
      ],
      permissions: "statistics.view",
      status: 4,
      format: "yyyy-MM-dd",
      disabledDateEnd: {
        to: ""
      }
    };
  },
  methods: {
    resetFilter() {
      this.start = null;
      this.end = null;
      this.current_view = {
        id: "day",
        value: "Ngày"
      };
      this.current_status = {
        id: "",
        value: "Tất cả"
      };
    }
  },
  computed: {
    date_start() {
      var today = new Date();
      var lastWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
      );
      return this.start !== null ? this.start : lastWeek;
    },
    date_end() {
      return this.end !== null ? this.end : new Date();
    },
    view() {
      return this.current_view.id;
    },
    status() {
      return this.current_status.id;
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

<style scoped>
/* The container */
.container {
  display: inline;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}
</style>