<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Danh sách phòng</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item active">Danh sách phòng</li>
      </ol>
      <div class="page-actions">
        <router-link :to="{ name: 'room.create'}">
          <a style="color:white" class="btn btn-primary">
            <i class="icon-fa icon-fa-plus"/> Thêm mới
          </a>
        </router-link>
      </div>
    </div>
    <div class="mailbox">
      <div class="card">
        <div class="card-header">
          <h6>Bộ lọc</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-sm-12 col-xs-12 col-lg-6 col-xl-6 col-md-12">
              <div class="form-group row">
                <label
                  for="firstName"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Tên phòng</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <input
                    v-model="q"
                    id="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Nhập vào tên phòng"
                  >
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="email"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Thành phố</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <multiselect
                    v-model="city"
                    label="name"
                    :options="cities"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="email"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Quận</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <multiselect
                    :disabled="city == null"
                    v-model="district"
                    label="name"
                    :options="filteredDistrict"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group row">
                <label
                  for="firstName"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Khoảng giá</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <vue-slider v-model="price_range" formatter="{value} Đ" :min="0" :max="10000000"></vue-slider>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="lastName"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Phòng</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
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
                <label
                  for="lastName"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Host</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <multiselect
                    id="inputUserName"
                    v-model="merchant_id"
                    label="name"
                    :options="merchants"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="email"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Thuê theo</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
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
                <label
                  for="email"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Hiển thị</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <div class="form-check form-check-inline">
                    <input
                      id="inlineCheckbox1"
                      class="form-check-input"
                      type="checkbox"
                      v-model.number="hot_room"
                      true-value="1"
                      false-value="0"
                    >
                    <label class="form-check-label" for="inlineCheckbox1">Hot</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      id="inlineCheckbox2"
                      class="form-check-input"
                      type="checkbox"
                      v-model.number="new_room"
                      true-value="1"
                      false-value="0"
                    >
                    <label class="form-check-label" for="inlineCheckbox2">New</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      id="inlineCheckbox3"
                      class="form-check-input"
                      type="checkbox"
                      v-model.number="latest_deal"
                      true-value="1"
                      false-value="0"
                    >
                    <label class="form-check-label" for="inlineCheckbox3">Deal</label>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="email"
                  class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label"
                >Trạng thái</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <multiselect
                    :disabled="city == null"
                    v-model="status"
                    label="value"
                    :options="room_status_list"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <!-- <div class="form-group row" v-if="rent_type.id == 2 || rent_type.id == 3"> -->
              <div class="form-group row">
                <label for="lastName" class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label">Từ ngày</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <datepicker v-model="date_start" :format="format" input-class="form-control" style="margin-bottom: 10px;"/>
                </div>
              </div>
              <div class="form-group row">
                <label for="lastName" class="col-lg-3 col-xs-3 col-md-12 col-xl-3 col-sm-3 col-form-label">Đến ngày</label>
                <div class="col-lg-9 col-xs-9 col-md-12 col-xl-9 col-sm-9">
                  <datepicker
                    :disabled-dates="disabledCheckout"
                    v-model="date_end"
                    :format="format"
                    input-class="form-control"
                  />
                </div>
              </div>
              <!-- <div class="form-group row" v-else>
                <label for="lastName" class="col-sm-1 col-form-label">Từ</label>
                <div class="col-sm-3">
                  <multiselect
                    :allow-empty="true"
                    name="checkin_by_hour"
                    v-model="checkin_by_hour"
                    data-vv-as="Giờ checkin"
                    :options="hoursData"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
                <label for="lastName" class="col-sm-1 col-form-label">Đến</label>
                <div class="col-sm-3">
                  <multiselect
                    :allow-empty="true"
                    name="checkout_by_hour"
                    v-model="checkout_by_hour"
                    data-vv-as="Giờ checkout"
                    :options="hoursData"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
                <label for="lastName" class="col-sm-1 col-form-label">Ngày</label>
                <div class="col-sm-3">
                  <datepicker v-model="date_start" :format="format" input-class="form-control"/>
                </div>
              </div>-->
            </div>
          </div>
          <button @click="applyFilter(1)" class="btn btn-success btn-xs">Áp dụng</button>
          <button @click="resetFilter(1)" class="btn btn-info btn-xs">Làm mới</button>
          <button @click="openRoomGoogleMap" class="btn btn-primary btn-xs">
            <i class="icon-fa icon-fa-map-marker"/>Tìm trên bản đồ
          </button>
        </div>
      </div>

      <div class="mailbox-content">
        <lottie v-if="loading" :options="defaultOptions" :height="150" :width="150"></lottie>
        <table role="table" v-else id="room_table">
          <thead role="rowgroup">
            <tr role="row">
              <th role="columnheader" width="8%">&ensp;</th>
              <th role="columnheader">Phòng</th>
              <th role="columnheader">Giá</th>
              <th role="columnheader">Trạng thái</th>
              <th role="columnheader" style="text-align: center">Hành động</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            <tr
             role="row" v-for="(room,index) in filteredRooms" :key="index">
              <td role="cell" style="text-align: center;">{{index+1}}&ensp;</td>
              <td role="cell">
                <div class="content">
                  <div class="content-name mb-3">
                    <router-link
                      style="font-size: 1.125rem; color: #3BB3D8"
                      :to="{ name: 'room.detail', params: { roomId: room.id }}"
                    >{{ room.details.data[0].name }}</router-link>
                  </div>
                  <div class="content-subject mb-3">
                    <i class="icon-fa icon-fa-home mb-3"/>
                    &ensp;Loại phòng: {{room.room_type_txt}}
                    <br>
                    <i class="icon-fa icon-fa-clock-o"/>&ensp;Cho thuê:
                    <button
                      type="button"
                      class="btn btn-xs btn-primary"
                    >{{room.rent_type_txt}}</button>
                  </div>
                  <div class="content-subject mb-3">
                    <i class="icon-fa icon-fa-location-arrow"/>
                    &ensp;{{ room.details.data[0].address }}
                  </div>
                  <div class="content-subject mb-3">
                    <i class="icon-fa icon-fa-user"/>
                    &ensp; Chủ nhà: {{ room.user.data.name }}
                  </div>
                  <div class="content-subject mb-3">
                    <i class="icon-fa icon-fa-trash"/>
                    &ensp; Dọn dẹp: {{ room.cleaning_fee | formatNumber }}
                  </div>
                </div>
              </td>
              <td role="cell">
                <div class="content-subject mb-3">Giá theo ngày: {{ room.price_day | formatNumber }}</div>
                <div class="content-subject mb-3">Giá theo giờ: {{ room.price_hour | formatNumber }}</div>
                <div
                  class="content-subject mb-3"
                >Phụ thu giờ: {{ room.price_after_hour | formatNumber }}</div>
                <div class="content-subject mb-3">
                  Phụ thu khách: {{ room.price_charge_guest | formatNumber }} ( từ sau
                  khách thứ {{ room.max_guest }})
                </div>
                <!-- <div class="content-subject mb-3">
                  <button
                    @click="openModalOptionalPrices(room)"
                    class="btn btn-xs btn-secondary btn-pressable"
                  >Chi tiết giá</button>
                  <button @click="openBookingCalendar(room.id)" class="btn btn-danger btn-xs">
                    <i class="icon-fa icon-fa-calendar"></i>Lịch trống
                  </button>
                </div> -->
              </td>
              <td role="cell">
                <!-- <div class="content-subject mb-3">
                  Mới &ensp;
                  <button
                    @click="updateRoomMinor('new',room)"
                    type="button"
                    :class="room.new == 1 ? 'btn btn-xs btn-icon btn-success mailbox-action' :'btn btn-xs btn-icon btn-light mailbox-action'"
                  >
                    <i :class="room.new == 1 ? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i>
                  </button>
                </div> -->
                <div class="content-subject mb-3">
                  Hot &ensp;
                  <button
                    @click="updateRoomMinor('hot',room)"
                    type="button"
                    :class="room.hot == 1 ? 'btn btn-xs btn-icon btn-success mailbox-action' :'btn btn-xs btn-icon btn-light mailbox-action'"
                  >
                    <i :class="room.hot == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i>
                  </button>
                </div>
                <!-- <div class="content-subject mb-3">
                  Phòng nổi bật &ensp;
                  <button
                    @click="updateRoomMinor('latest_deal',room)"
                    type="button"
                    :class="room.latest_deal == 1 ? 'btn btn-xs btn-icon btn-success mailbox-action' :'btn btn-xs btn-icon btn-light mailbox-action'"
                  >
                    <i
                      :class="room.latest_deal == 1 ? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"
                    ></i>
                  </button>
                </div>-->
                <div class="content-subject mb-3">
                  Tự quản lý &ensp;
                  <button
                    @click="updateRoomMinor('is_manager',room)"
                    type="button"
                    :class="room.is_manager == 1 ?'btn btn-xs btn-icon btn-success mailbox-action'  :'btn btn-xs btn-icon btn-light mailbox-action'"
                  >
                    <i
                      :class="room.is_manager == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"
                    ></i>
                  </button>
                </div>
                <div class="content-subject mb-3">
                  Khóa &ensp;
                  <button
                    @click="updateRoomMinor('status',room)"
                    v-if="room.status == 0"
                    type="button"
                    class="btn btn-xs btn-icon btn-danger mailbox-action"
                  >Đang khóa</button>
                  <button
                    @click="updateRoomMinor('status',room)"
                    v-if="room.status == 1"
                    type="button"
                    class="btn btn-xs btn-icon btn-success mailbox-action"
                  >Đang mở</button>
                </div>
                <div class="content-subject mb-3">Chủ nhà khóa &ensp;
                  <div class="content-subject mb-3">
                    <button
                      v-if="room.merchant_status !== 1"
                      type="button"
                      disabled
                      class="btn btn-xs btn-icon btn-danger mailbox-action"
                    >Đang khóa</button>
                    <button
                      v-else
                      type="button"
                      disabled
                      class="btn btn-xs btn-icon btn-success mailbox-action"
                    >Đang mở</button>
                  </div>
                </div>
              </td>
              <td role="cell" style="text-align:center">
                <div class="btn-group mb-3" role="group" aria-label="First group">
                  <!-- <button
                    v-tooltip.top-center="'Chi tiết phòng'"
                    @click.prevent="openRoomDetail(room.id)"
                    type="button"
                    class="btn btn-xs btn-icon btn-outline-info"
                  >
                    <i class="icon-fa icon-fa-search"/>
                  </button> -->
                  <button
                    @click="openUpdateHostModal(room)"
                    v-tooltip.top-center="'Cập nhật chủ nhà'"
                    type="button"
                    class="btn btn-xs btn-icon btn-outline-info btn-xs"
                  >
                    <i class="icon-fa icon-fa-user"/>
                  </button>
                  <button
                    @click="openRoomUpdate(room.id)"
                    v-tooltip.top-center="'Cập nhật phòng'"
                    type="button"
                    class="btn btn-xs btn-icon btn-outline-info btn-xs"
                  >
                    <i class="icon-fa icon-fa-pencil"/>
                  </button>
                  <div class="btn-group" role="group">
                    <v-dropdown :show-arrow="false" theme-light>
                      <button
                        id="btnGroupDrop1"
                        slot="activator"
                        type="button"
                        class="btn btn-outline-info btn-xs dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >Thêm</button>
                      <v-dropdown-item>
                        <a
                          style="cursor: pointer;"
                          @click="openAirbnbCalendar(room.id)"
                          class="dropdown-item"
                        >Đồng bộ lịch</a>
                      </v-dropdown-item>
                      <v-dropdown-item>
                        <a
                          style="cursor: pointer;"
                          @click="openGuideBook(room.id)"
                          class="dropdown-item"
                        >Địa điểm lân cận</a>
                      </v-dropdown-item>
                      <v-dropdown-item>
                        <a
                          style="cursor: pointer;"
                          @click="openBookingCalendar(room.id)"
                          class="dropdown-item"
                        >Lịch trống phòng</a>
                      </v-dropdown-item>
                      <v-dropdown-item>
                        <a
                          style="cursor: pointer;"
                          @click="openModalOptionalPrices(room)"
                          class="dropdown-item"
                        >Giá ngày lễ</a>
                      </v-dropdown-item>
                      <v-dropdown-item>
                        <a
                          style="cursor: pointer;"
                          @click="openCancelBooking(room)"
                          class="dropdown-item"
                        >Chính sách hủy</a>
                      </v-dropdown-item>
                    </v-dropdown>
                  </div>
                </div>
                <br>

                <!-- <button class="btn btn-light btn-xs mb-3">Điểm quy chuẩn</button> -->
                <button @click="createBooking(room.id)" class="btn btn-theme btn-xs">Đặt phòng</button>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage"/>
      </div>

      <sweet-modal overlay-theme="dark" ref="updateHost">
        <div v-if="update_room != null" class="card">
          <div class="card-header">
            <h6>{{update_room.details.data[0].name}}</h6>
          </div>
          <div class="card-body">
            <multiselect
              id="inputUserName"
              v-model="merchant"
              label="name"
              :options="merchants"
              :searchable="true"
              :show-labels="false"
            />
          </div>
        </div>

        <button
          slot="button"
          type="button"
          class="btn btn-default"
          data-dismiss="modal"
          @click="closeUpdateHostModal"
        >Close</button>
        
        <button
          slot="button"
          type="button"
          class="btn btn-primary"
          @click="updateHostConfirm"
        >Confirm</button>
      </sweet-modal>
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
import RoomGoogleMap from "./RoomGoogleMap";
import { SweetModal } from "sweet-modal-vue";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import Auth from "../../../services/auth";
import VueSlider from "vue-slider-component";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
import Pagination from "../../../components/paginate/ServerPagination";
import { format, constant, location, hoursList } from "../../../helpers/mixins";
export default {
  mixins: [format, constant, location, hoursList],
  components: {
    Pagination,
    Multiselect,
    Datepicker,
    SweetModal,
    VueSlider,
    Lottie,
    RoomGoogleMap
  },
  install(Vue, options) {
    Vue.component("SweetModal", SweetModal);
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData
      },
      format: "yyyy-MM-dd",
      rooms: [],
      room_type: {
        id: ""
      },
      rent_type: {
        id: ""
      },
      status: {
        id: ""
      },
      price_range: [0, 10000000],
      room: {},
      room_prices: [],
      update_room: null,
      update_payment_status: null,
      update_room_status: null,
      q: "",
      date_start: null,
      date_end: null,
      merchant_id: null,
      merchant: {
        id: ""
      },
      city: {
        id: "",
        name: ""
      },
      district: {
        id: "",
        name: ""
      },
      hot_room: null,
      new_room: null,
      latest_deal: null,
      merchants: [],
      option: null,
      isModalVisible: false,
      isLeftSidebarVisible: true,
      selectedRooms: [],
      permissions: "room.view",
      totalPages: null,
      currentPage: null,
      count: null,
      disabledCheckout: {
        to: ""
      },
      loading: true
    };
  },

  computed: {
    filteredRooms() {
      return this.rooms.filter(room => {
        let nameValid = true;

        if (this.searchText) {
          let searchText = this.searchText.toLowerCase();
          nameValid =
            room.title.toLowerCase().includes(searchText) ||
            room.from.name.toLowerCase().includes(searchText);
        }

        return nameValid;
      });
    },
    filteredDistrict() {
      let self = this;
      return this.districts.filter(function(item) {
        return item.city_id == self.city.id;
      });
    }
  },
  watch: {
    selectedStatus() {
      this.isModalVisible = false;
    },
    date_start: {
      handler(val) {
        this.disabledCheckout.to = val;
      },
      deep: true
    },
    city: {
      handler(val) {
        this.district = {
          id: "",
          name: ""
        };
      }
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getRooms({});
            this.getMerchants();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    ...mapActions([
      "searchRoomGoogleMap",
      "changeCountRoomGMap",
      "changeSearchMapStatus",
      "changeInfoSearchRoom",
      "changeRoomCalendarId",
      "changeStatusRoomCalendar"
    ]),

    async getMerchants() {
      try {
        const response = await axios.get(`users`, {
          params: {
            limit: -1,
            is_owner: 1
          }
        });
        this.merchants = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getRooms({ page, filter, sort }) {
      let date_start =
        this.date_start !== null
          ? this.date_start.toISOString().substr(0, 10)
          : "";
      let date_end =
        this.date_end !== null ? this.date_end.toISOString().substr(0, 10) : "";
      try {
        const response = await axios.get(`rooms`, {
          params: {
            include: "details,user,prices,media",
            page: page,
            limit: 5,
            name: this.q,
            type_room: this.room_type.id,
            rent_type: this.rent_type.id,
            city_id: this.city.id,
            status: this.status.id,
            checkin: date_start,
            checkout: date_end,
            price_day_from: this.price_range[0],
            price_day_to: this.price_range[1],
            district_id: this.district.id,
            hot: this.hot_room,
            new: this.new_room,
            latest_deal: this.latest_deal,
            merchant: this.merchant_id,
            manager: this.is_manager
          }
        });

        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.rooms = response.data.data;
        this.loading = false;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getRoomSearch() {
      let date_start =
        this.date_start !== null
          ? this.date_start.toISOString().substr(0, 10)
          : "";
      let date_end =
        this.date_end !== null ? this.date_end.toISOString().substr(0, 10) : "";
      try {
        const response = await axios.get(`rooms`, {
          params: {
            include: "details",
            limit: 70,
            name: this.q,
            type_room: this.room_type.id,
            rent_type: this.rent_type.id,
            city_id: this.city.id,
            status: this.status.id,
            price_day_from: this.price_range[0],
            price_day_to: this.price_range[1],
            district_id: this.district.id,
            hot: this.hot_room,
            new: this.new_room,
            latest_deal: this.latest_deal,
            merchant: this.merchant_id,
            manager: this.is_manager
          }
        });
        let paginate = response.data.meta.pagination;
        this.changeCountRoomGMap(paginate.count);
        this.searchRoomGoogleMap(response.data.data);
        this.changeInfoSearchRoom({
          name: this.q,
          price_range: [this.price_range[0], this.price_range[1]],
          city_id: this.city.id,
          city_name: this.city.name,
          district_id: this.district.id,
          district_name: this.district.name
        });
        this.loading = false;
        this.changeSearchMapStatus(1);
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Tìm kiếm phòng gặp lỗi, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    reloadData(page) {
      this.getRooms({
        page
      });
    },
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    },
    openRoomGoogleMap() {
      this.getRoomSearch();
      this.$router.push({
        name: "room.googlemap"
      });
    },
    openBookingCalendar(roomId) {
      this.changeRoomCalendarId(roomId);
      this.changeStatusRoomCalendar(1);
      this.$router.push({
        name: "room.calendar",
        params: {
          roomId: roomId
        }
      });
    },
    createBooking(roomId) {
      this.$router.push({
        name: "booking.create",
        params: {
          roomId: roomId
        }
      });
    },
    openUpdateHostModal(room) {
      this.update_room = room;
      this.option = "merchant_id";
      this.$refs.updateHost.open();
    },
    closeUpdateHostModal(room) {
      this.update_room = {};
      this.$refs.updateHost.close();
    },
    openModalOptionalPrices(room) {
      this.room_prices = room.prices.data;
      this.$refs.optional_prices.open();
    },
    closeOptionalPricesModal() {
      this.room_prices = [];
      this.$refs.optional_prices.close();
    },
    openGuideBook(room_id) {
      this.$router.push({
        name: "room.guidebook",
        params: {
          roomId: room_id
        }
      });
    },
    openRoomUpdate(room_id) {
      this.$router.push({
        name: "room.update",
        params: {
          roomId: room_id
        }
      });
    },
    openRoomDetail(room_id) {
      this.$router.push({
        name: "room.detail",
        params: {
          roomId: room_id
        }
      });
    },
    async updateHostConfirm() {
      let response = await axios
        .put(`rooms/prop-update/${this.update_room.id}?option=${this.option}`, {
          merchant_id: this.merchant.id
        })
        .then(result => {
          if (result) {
            this.reloadData(this.currentPage);
            this.$refs.updateHost.close();
            window.toastr["success"]("Updated host!", "Success");
          } else {
            window.toastr["error"]("Something wrong!", "Error");
          }
        });
    },
    async updateRoomMinor(option, room) {
      if (option === "hot") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            hot: room.hot == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);

              window.toastr["success"]("Updated Hot Room!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "new") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            new: room.new == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);

              window.toastr["success"]("Updated New Room!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "latest_deal") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            latest_deal: room.latest_deal == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              window.toastr["success"]("Updated Latest Deal!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "is_manager") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            is_manager: room.is_manager == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              window.toastr["success"]("Updated Self Manage!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "status") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            status: room.status == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              window.toastr["success"]("Updated Status!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      }
    },
    applyFilter(page) {
      this.getRooms({
        page
      });
    },
    resetFilter(page) {
      this.q = "";
      this.room_type = {
        id: ""
      };
      this.merchant = {
        id: ""
      };
      this.city = {
        id: ""
      };
      this.district = {
        id: ""
      };
      this.rent_type = {
        id: ""
      };
      this.status = {
        id: ""
      };
      this.price_range = [0, 10000000];
      this.merchant_id = null;
      this.hot_room = null;
      this.new_room = null;
      this.latest_deal = null;
      this.getRooms({
        page
      });
    }
  }
};
</script>
<style>
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  /* Force table to not be like tables anymore */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin: 0 0 1rem 0;
  }

  tr:nth-child(odd) {
    background: #fff;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 0;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }

  /*
		Label the data
    You could also use a data-* attribute and content for this. That way "bloats" the HTML, this way means you need to keep HTML and CSS in sync. Lea Verou has a clever way to handle with text-shadow.
		*/
  td:nth-of-type(1):before {
    content: "";
  }
  td:nth-of-type(2):before {
    content: "Phòng";
  }
  td:nth-of-type(3):before {
    content: "Giá";
  }
  td:nth-of-type(4):before {
    content: "Trạng thái";
  }
  td:nth-of-type(5):before {
    content: "Hành động";
  }
}

#room_table {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#room_table th {
  border: 1px solid #ddd;
  padding: 8px;
}

#room_table tr:hover {
  background-color: rgb(233, 233, 233);
}

#room_table tr:hover {
  background-color: #ddd;
}

/* #room_table tr:nth-child(even) {
  background-color: #e7e7e7;
} */
</style>