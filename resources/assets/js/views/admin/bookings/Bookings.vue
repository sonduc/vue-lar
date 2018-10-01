<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Booking List</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item active">Booking List</li>
      </ol>
    </div>
    <div class="mailbox">
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
              <v-dropdown-item>
                <a href="#" @click.prevent>Success</a>
              </v-dropdown-item>
            </v-dropdown>

            <button type="button" class="btn btn-icon btn-light mailbox-action">
              <i class="icon-fa icon-fa-tag" />
            </button>
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
              <td>Dịch vụ</td>
              <td>Thanh toán</td>
              <td>Khách hàng</td>
              <td>Trạng thái</td>
              <td>Hành động</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(booking,index) in filteredBookings" :key="index" :class="{'read' : booking.status }" @click="openMailModal(booking)">
              <td class="cell-checkbox" @click.stop>
                <div class="custom-control custom-checkbox">
                  <input :id="index" v-model="selectedBookings" :value="booking.id" type="checkbox" class="custom-control-input">
                  <label :for="index" class="custom-control-label" />
                </div>
              </td>
              <td class="cell-content">
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
              <td class="cell-time">
                Dịch vụ
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
                  <button v-if="booking.payment_status == 2" class="btn btn-outline-warning btn-sm btn-pressable">
                    {{booking.payment_status_txt}}
                  </button>
                  <button v-if="booking.payment_status == 3" class="btn btn-outline-success btn-sm btn-pressable">
                    {{booking.payment_status_txt}}
                  </button>
                  <button v-if="booking.payment_status == 1" class="btn btn-outline-danger btn-sm btn-pressable">
                    {{booking.payment_status_txt}}
                  </button>
                </div>
                <hr/>
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
                <hr/>
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

    </div>
  </div>
</template>

<script>
import BookingDetail from "./BookingDetail";
import Auth from "../../../services/auth";
import Pagination from "../../../components/paginate/ServerPagination";
import numeral from "numeral";
export default {
  components: {
    BookingDetail,
    Pagination
  },
  data() {
    return {
      bookings: [],
      booking: {},
      isModalVisible: false,
      isLeftSidebarVisible: true,
      selectedBookings: [],
      searchText: "",
      permissions: "role.view",
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
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async getBookings({ page, filter, sort }) {
      try {
        const response = await axios.get(
          `http://ws-api.lc/api/bookings?include=room.details&page=${page}`
        );
        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.bookings = response.data.data;
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
    openMailModal(booking) {
      this.booking = booking;
      this.isModalVisible = true;
    },
    closeMailModal() {
      this.isModalVisible = false;
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
  filters: {
    formatNumber(value) {
      return numeral(value).format("0,0") + " Đ";
    }
  }
};
</script>
