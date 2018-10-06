<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Mailbox</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Apps</a></li>
        <li class="breadcrumb-item active">Mailbox</li>
      </ol>
    </div>
    <div :class="{'is-open': isLeftSidebarVisible}" class="mailbox">
      <button class="btn btn-theme btn-sm btn-block" @click="openBookingFilter">Filter</button>
      <booking-sidebar :selected-category="selectedStatus" :categories="categories" :is-left-sidebar-visible="isLeftSidebarVisible"
        @selected="selectStatus" @toggle="isLeftSidebarVisible = !isLeftSidebarVisible" />

      <div class="mailbox-content">
        <div class="mailbox-content-header">
          <div class="mailbox-actions">
            <div class="custom-control custom-checkbox mailbox-action" style="display:inline-block">
              <input id="customCheckAll" v-model="selectAll" type="checkbox" class="custom-control-input">
              <label class="custom-control-label" for="customCheckAll" />
            </div>

            <v-dropdown active-url="/admin/dashboard" theme-light class="mailbox-action">
              <a slot="activator" href="#" @click.prevent>
                <button class="btn btn-light dropdown-toggle" type="button">
                  Actions
                </button>
              </a>

              <v-dropdown-item>
                <a href="#" @click.prevent>Tạo hóa đơn</a>
              </v-dropdown-item>
              <v-dropdown-item>
                <a href="#" @click.prevent>Yêu cầu đối soát</a>
              </v-dropdown-item>
            </v-dropdown>

          </div>

          <div class="mailbox-filters">
            <div class="mail-search">
              <input id="inputEmailTo" v-model="searchText" type="email" placeholder="Search" class="form-control">
            </div>
          </div>
        </div>
        <table class="table table-hover">
          <thead>
            <tr>
              <td></td>
              <td>Booking</td>
              <td>Phòng</td>
              <td>Thanh toán</td>
              <td>Khách hàng</td>
              <td>Trạng thái</td>
              <td>Hành động</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(booking,index) in filteredBookings" :key="index" :class="{'read' : booking.status }">
              <td class="cell-checkbox" @click.stop>
                <div class="custom-control custom-checkbox">
                  <input :id="index" v-model="selectedBookings" :value="booking.id" type="checkbox" class="custom-control-input">
                  <label :for="index" class="custom-control-label" />
                </div>
              </td>
              <td class="cell-content" @click="openBookingModal(booking)">
                <div class="content">
                  <div class="content-name">
                    #{{ booking.code }}
                  </div>
                  <div class="content-subject">
                    Thời gian book: <br /><i class="icon-fa icon-fa-clock-o attachment-icon" /> {{ booking.created_at
                    }}
                  </div>
                  <div class="content-subject">
                    Checkin: <br /><i class="icon-fa icon-fa-clock-o attachment-icon" /> {{ booking.checkin }} <br />
                    Checkout: <br /><i class="icon-fa icon-fa-clock-o attachment-icon" /> {{ booking.checkout }} <br />
                  </div>
                </div>
              </td>
              <td class="cell-content">
                <div class="content">
                  <div class="content-subject">
                    <p>{{booking.room.data.details.data[0].name}}</p>
                  </div>
                </div>
              </td>
              <td class="cell-content">
                <div class="content-subject">Hình thức: <label class="label label-primary">{{booking.payment_method_txt}}</label></div>
                <div class="content-subject">Tiền phòng: {{booking.price_original | formatNumber}}</div>
                <div v-if="booking.price_discount < 0" class="content-subject">Phụ thu: {{(booking.price_discount *
                  (-1)) | formatNumber}}</div>
                <div v-if="booking.price_discount >= 0" class="content-subject">Giảm giá: {{booking.price_discount |
                  formatNumber}}</div>
                <div class="content-subject">Tổng thu: {{(booking.total_fee - booking.price_discount) | formatNumber}}</div>

              </td>
              <td class="cell-content">
                <div class="content-subject">Tên: {{booking.name}}</div>
                <div class="content-subject">Email: {{booking.email}}</div>
                <div class="content-subject">Điện thoại: {{booking.phone}}</div>
                <div class="content-subject">Số khách: {{booking.number_of_guests}}</div>
              </td>
              <td class="cell-content" style="text-align: center">
                <div class="content-subject">
                  <button v-if="booking.payment_status == 0" class="btn btn-outline-info btn-sm btn-pressable">
                    {{booking.payment_status_txt}}
                  </button>
                  <button v-if="booking.payment_status == 1" class="btn btn-outline-danger btn-sm btn-pressable">
                    {{booking.payment_status_txt}}
                  </button>
                  <button v-if="booking.payment_status == 2" class="btn btn-outline-warning btn-sm btn-pressable">
                    {{booking.payment_status_txt}}
                  </button>
                  <button v-if="booking.payment_status == 3" class="btn btn-outline-success btn-sm btn-pressable">
                    {{booking.payment_status_txt}}
                  </button>
                </div>
                <hr />
                <div class="content-subject">
                  <button v-if="booking.status == 1" class="btn btn-info btn-sm btn-pressable">
                    {{booking.status_txt}}
                  </button>
                  <button v-if="booking.status == 2" class="btn btn-warning btn-sm btn-pressable">
                    {{booking.status_txt}}
                  </button>
                  <button v-if="booking.status == 3" class="btn btn-primary btn-sm btn-pressable">
                    {{booking.status_txt}}
                  </button>
                  <button v-if="booking.status == 4" class="btn btn-success btn-sm btn-pressable">
                    {{booking.status_txt}}
                  </button>
                  <button v-if="booking.status == 5" class="btn btn-danger btn-sm btn-pressable">
                    {{booking.status_txt}}
                  </button>
                </div>
              </td>
              <td class="cell-content" style="text-align:center">
                <div class="content-subject">
                  <button class="btn btn-primary btn-sm btn-pressable">Giảm giá</button>
                  <button class="btn btn-warning btn-sm btn-pressable">Phụ thu</button>
                </div>
                <hr />
                <div class="content-subject">
                  Mã giảm giá
                </div>
                <div class="content-subject">
                  <button class="btn btn-outline-primary btn-sm btn-pressable">{{booking.coupon_txt}}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage" />
      </div>

      <transition name="fade">
        <booking-detail :booking="booking" v-show="isModalVisible" :is-visible="isModalVisible" @close="closeMailModal" />
      </transition>

      <sweet-modal overlay-theme="dark" ref="filter">
        <div class="card">
          <div class="card-header">
            <h6>Bộ lọc booking</h6>
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <label for="inputFirstName">Tìm kiếm</label>
                <input v-model="q" id="inputFirstName" type="text" class="form-control" placeholder="Nhập từ khóa tìm kiếm">
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="exampleInputEmail">Từ ngày</label>
                  <datepicker v-model="date_start" :format="format" input-class="form-control" />
                </div>
                <div class="form-group col-md-6">
                  <label for="exampleInputEmail">Đến ngày</label>
                  <datepicker v-model="date_end" :format="format" input-class="form-control" />
                </div>
              </div>
              <div class="form-group">
                <label for="inputUserName">Chủ nhà</label>
                <multiselect id="inputUserName" v-model="merchant" label="name" :options="merchants" :searchable="true"
                  :show-labels="false" />
              </div>

              <div class="form-group">
                <label for="exampleInputPassword">Thành phố</label>
                <multiselect id="inputUserName" v-model="city" label="name" :options="cities" :searchable="true"
                  :show-labels="false" />
              </div>
              <div class="form-group" v-if="city !== null">
                <label for="exampleInputPassword">Quận / Huyện</label>
                <multiselect :disabled="city == null" id="inputUserName" v-model="district" label="name" :options="filteredDistrict"
                  :searchable="true" :show-labels="false" />
              </div>
            </form>
          </div>
        </div>

        <button slot="button" type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal">
          Reset
        </button>

        <button slot="button" type="button" class="btn btn-primary" @click="applyFilter(1)">
          Apply Filter
        </button>
      </sweet-modal>
    </div>
  </div>
</template>

<script>
import { SweetModal } from "sweet-modal-vue";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import BookingSidebar from "./BookingSidebar";
import BookingDetail from "./BookingDetail";
import Auth from "../../../services/auth";
import Pagination from "../../../components/paginate/ServerPagination";
import { format, env } from "../../../helpers/mixins";
export default {
  mixins: [format, env],
  components: {
    BookingSidebar,
    BookingDetail,
    Pagination,
    SweetModal,
    Multiselect,
    Datepicker
  },
  data() {
    return {
      format: "yyyy-MM-dd",
      bookings: [],
      booking: {},
      q: "",
      date_start: null,
      date_end: null,
      merchant: {
        id: ""
      },
      city: {
        id: ""
      },
      district: {
        id: ""
      },
      merchants: [],
      cities: [],
      districts: [],
      categories: [
        {
          id: 1,
          query: "",
          name: "Tất cả",
          slug: "inbox",
          icon: "icon-fa icon-fa-inbox"
        },
        {
          id: 2,
          query: "2",
          name: "Xác nhận",
          slug: "sent",
          icon: "icon-fa icon-fa-send"
        },
        {
          id: 3,
          query: "4",
          name: "Checkout",
          slug: "draft",
          icon: "icon-fa icon-fa-check"
        },
        {
          id: 4,
          query: "1",
          name: "Đơn mới",
          slug: "important",
          icon: "icon-fa icon-fa-star"
        },
        {
          id: 5,
          query: "5",
          name: "Đã hủy",
          slug: "trash",
          icon: "icon-fa icon-fa-trash"
        }
      ],
      isModalVisible: false,
      isLeftSidebarVisible: true,
      selectedBookings: [],
      selectedStatus: "",
      permissions: "role.view",
      searchText: "",
      totalPages: null,
      currentPage: null,
      count: null
    };
  },
  computed: {
    selectAll: {
      get: function() {
        return this.bookings
          ? this.selectedBookings.length === this.bookings.length
          : false;
      },
      set: function(value) {
        let selectedBookings = [];

        if (value) {
          this.bookings.forEach(function(booking) {
            selectedBookings.push(booking.id);
          });
        }

        this.selectedBookings = selectedBookings;
      }
    },
    filteredBookings() {
      return this.bookings.filter(booking => {
        let nameValid = true;

        if (this.searchText) {
          let searchText = this.searchText.toLowerCase();
          nameValid =
            booking.title.toLowerCase().includes(searchText) ||
            booking.from.name.toLowerCase().includes(searchText);
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
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getBookings({});
            this.getMerchants();
            this.getCities();
            this.getDistricts();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async getMerchants() {
      try {
        const response = await axios.get(
          this.baseApiUrl + `users?&is_owner=1&limit=9999999`
        );
        this.merchants = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getCities() {
      try {
        const response = await axios.get(
          this.baseApiUrl + `cities?limit=9999999`
        );
        this.cities = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getDistricts() {
      try {
        const response = await axios.get(
          this.baseApiUrl + `districts?limit=9999999`
        );
        this.districts = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getBookings({ page, filter, sort }) {
      let date_start =
        this.date_start !== null
          ? this.date_start.toISOString().substr(0, 10)
          : "";
      let date_end =
        this.date_end !== null ? this.date_end.toISOString().substr(0, 10) : "";
      try {
        const response = await axios.get(
          this.baseApiUrl +
            `bookings?include=room.details&q=${this.q}&merchants=${
              this.merchant.id
            }&customers=${this.q}&city=${this.city.id}&district=${
              this.district.id
            }&date_start=${date_start}&status=${
              this.selectedStatus
            }&date_end=${date_end}&page=${page}&limit=5`
        );
        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.bookings = response.data.data;
        console.log(response.data.data);
        return {
          data: response.data.data,
          pagination: {
            totalPages: paginate.total_pages,
            currentPage: page,
            count: paginate.count
          }
        };
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    reloadData(page) {
      this.getBookings({
        page
      });
    },
    openBookingModal(booking) {
      this.booking = booking;
      this.isModalVisible = true;
    },
    closeMailModal() {
      this.isModalVisible = false;
    },
    openBookingFilter() {
      this.$refs.filter.open();
    },
    closeModal() {
      this.$refs.filter.close();
    },
    applyFilter(page) {
      this.getBookings({
        page
      });
    },
    selectStatus(status, page) {
      this.selectedStatus = status;
      console.log(status);
      this.getBookings({
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
    }
  }
};
</script>
