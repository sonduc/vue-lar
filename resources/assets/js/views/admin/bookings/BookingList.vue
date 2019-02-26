<template>
  <div class="main-content">
    <div class="page-header">
      <h4 class="page-title">Danh sách Booking</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Bookings</a>
        </li>
      </ol>
    </div>
    <div :class="{'is-open': isLeftSidebarVisible}" class="mailbox">
      <button class="btn btn-theme btn-xs btn-block" @click="openBookingFilter">Bộ lọc</button>
      <booking-sidebar
        :selected-category="selectedStatus"
        :categories="categories"
        :is-left-sidebar-visible="isLeftSidebarVisible"
        @selected="selectStatus"
        @toggle="isLeftSidebarVisible = !isLeftSidebarVisible"
      />

      <div class="mailbox-content">
        <div class="mailbox-content-header">
          <div class="mailbox-actions">
            <div class="custom-control custom-checkbox mailbox-action" style="display:inline-block"></div>
          </div>
        </div>

        <lottie v-if="loading" :options="defaultOptions" :height="150" :width="150"></lottie>
        <table v-else role="table" id="booking_table">
          <thead role="rowgroup">
            <tr role="row">
              <td role="columnheader">&ensp;</td>
              <td role="columnheader">Booking</td>
              <td role="columnheader">Phòng</td>
              <td role="columnheader">Thanh toán</td>
              <td role="columnheader">Khách hàng</td>
              <td role="columnheader" style="text-align:left">Trạng thái</td>
              <td role="columnheader" style="text-align:left">Hành động</td>
            </tr>
          </thead>
          <tbody role="rowgroup">
            <tr role="row" v-for="(booking,index) in filteredBookings" :key="index">
              <td role="cell">&ensp;</td>
              <td role="cell" @click="openBookingModal(booking)">
                <div class="content">
                  <div class="content-name">#{{ booking.code }} - {{booking.id}}</div>
                  <div class="content-subject">
                    Thời gian book:
                    <br>
                    <i class="icon-fa icon-fa-clock-o attachment-icon"/>
                    {{ booking.created_at
                    }}
                  </div>
                  <div class="content-subject">
                    Checkin:
                    <br>
                    <i class="icon-fa icon-fa-clock-o attachment-icon"/>
                    {{ booking.checkin }}
                    <br>Checkout:
                    <br>
                    <i class="icon-fa icon-fa-clock-o attachment-icon"/>
                    {{ booking.checkout }}
                    <br>
                  </div>
                </div>
              </td>
              <td role="cell">
                <div class="content">
                  <div class="content-subject">
                    <p>{{booking.room.data.details.data[0].name}}</p>
                  </div>
                </div>
              </td>
              <td role="cell" @click="openBookingPaymentModal(booking)">
                <div class="content-subject">
                  Hình thức:
                  <label class="label label-primary">{{booking.payment_method_txt}}</label>
                </div>
                <div class="content-subject">Tiền phòng: {{booking.price_original | formatNumber}}</div>
                <div
                  v-if="booking.additional_fee > 0"
                  class="content-subject"
                >Phụ thu: {{booking.additional_fee | formatNumber}}</div>
                <div v-if="booking.price_discount > 0" class="content-subject">
                  Giảm giá: {{booking.price_discount |
                  formatNumber}}
                </div>
                <div class="content-subject">Tổng thu: {{(booking.total_fee) | formatNumber}}</div>
                <hr v-if="booking.coupon_txt !== ''">
                <div v-if="booking.coupon_txt !== ''" class="content-subject">Mã giảm giá</div>
                <div v-if="booking.coupon_txt !== ''" class="content-subject">
                  <button
                    class="btn btn-outline-primary btn-xs btn-pressable"
                  >{{booking.coupon_txt}}</button>
                </div>
              </td>
              <td role="cell">
                <div class="content-subject">Tên: {{booking.name}}</div>
                <div class="content-subject">Email: {{booking.email}}</div>
                <div class="content-subject">Điện thoại: {{booking.phone}}</div>
                <div class="content-subject">Số khách: {{booking.number_of_guests}}</div>
              </td>
              <td role="cell" style="text-align: center">
                <div class="content-subject">
                  <button
                    @click="showModalUpdateStatus(booking)"
                    class="btn btn-outline-info btn-xs btn-pressable"
                  >{{booking.payment_status_txt}}</button>
                </div>
                <hr>
                <div class="content-subject">
                  <button
                    @click="showModalUpdatePaymentStatus(booking)"
                    class="btn btn-warning btn-xs btn-pressable"
                  >{{booking.status_txt}}</button>
                </div>
              </td>
              <td role="cell" style="text-align:center">
                <div class="content-subject">
                  <button
                    @click="showModalDiscount(booking)"
                    class="btn btn-primary btn-xs btn-pressable"
                  >Giảm giá</button>
                  <button
                    @click="showModalSurcharge(booking)"
                    class="btn btn-warning btn-xs btn-pressable"
                  >Phụ thu</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage"/>
      </div>

      <transition name="fade">
        <booking-detail
          :booking="booking"
          v-show="isModalVisible"
          :is-visible="isModalVisible"
          @close="closeMailModal"
        />
      </transition>

      <transition name="fade">
        <booking-payment
          :booking="booking"
          :bookingPayment="bookingPayment"
          v-show="modalPayment"
          :is-visible="modalPayment"
          @closePaymentModal="closePaymentModal"
        ></booking-payment>
      </transition>

      <sweet-modal overlay-theme="dark" ref="filter">
        <div class="card">
          <div class="card-header">
            <h6>Bộ lọc booking</h6>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label for="inputFirstName">Tìm kiếm</label>
              <input
                v-model="q"
                id="inputFirstName"
                type="text"
                class="form-control"
                placeholder="Nhập từ khóa tìm kiếm"
              >
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="exampleInputEmail">Từ ngày</label>
                <datepicker v-model="date_start" :format="format" input-class="form-control"/>
              </div>
              <div class="form-group col-md-6">
                <label for="exampleInputEmail">Đến ngày</label>
                <datepicker v-model="date_end" :format="format" input-class="form-control"/>
              </div>
            </div>
            <div class="form-group">
              <label for="inputUserName">Chủ nhà</label>
              <multiselect
                id="inputUserName"
                v-model="merchant"
                label="name"
                :options="merchants"
                :searchable="true"
                :show-labels="false"
              />
            </div>

            <div class="form-group">
              <label for="exampleInputPassword">Thành phố</label>
              <multiselect
                id="inputUserName"
                v-model="city"
                label="name"
                :options="cities"
                :searchable="true"
                :show-labels="false"
              />
            </div>
            <div class="form-group" v-if="city !== null">
              <label for="exampleInputPassword">Quận / Huyện</label>
              <multiselect
                :disabled="city == null"
                id="inputUserName"
                v-model="district"
                label="name"
                :options="filteredDistrict"
                :searchable="true"
                :show-labels="false"
              />
            </div>
          </div>
        </div>

        <button
          slot="button"
          type="button"
          class="btn btn-default"
          data-dismiss="modal"
          @click="resetFilter(1)"
        >Làm mới</button>
        
        <button slot="button" type="button" class="btn btn-primary" @click="applyFilter(1)">Áp dụng</button>
      </sweet-modal>
      <sweet-modal ref="update_modal" overlay-theme="dark">
        <div class="card">
          <div class="card-header">
            <h5>#{{update_booking.code}}</h5>
          </div>
          <div class="card-body">
            <multiselect
              v-if="option == 1"
              v-model="update_payment_status"
              label="title"
              :options="paymentList"
              :searchable="true"
              :show-labels="false"
            />
            <multiselect
              v-if="option == 2"
              v-model="update_booking_status"
              label="title"
              :options="statusList"
              :searchable="true"
              :show-labels="false"
            />
          </div>
        </div>
        <button
          v-if="option == 1"
          slot="button"
          type="button"
          class="btn btn-theme"
          @click="submitUpdatePaymentStatus()"
        >Cập nhập</button>
        <button
          v-if="option == 2"
          slot="button"
          type="button"
          class="btn btn-theme"
          @click="submitUpdateBookingStatus()"
        >Cập nhập</button>
        <button
          v-if="option == 3"
          slot="button"
          type="button"
          class="btn btn-theme"
          @click="closeUpdateModal()"
        >Cập nhập</button>
      </sweet-modal>

      <sweet-modal ref="money_update" overlay-theme="dark">
        <div class="card">
          <div class="card-header">
            <h5>#{{update_booking.code}}</h5>
          </div>
          <div class="card-body">
            <form>
              <div class="form-group" v-if="option == 3">
                <label for>Giá giảm</label>
                <input
                  @keydown.enter.prevent="submitUpdatePrice"
                  v-model="update_booking.price_discount"
                  type="number"
                  class="form-control"
                  placeholder="Nhập giá"
                >
              </div>

              <div class="form-group" v-if="option == 4">
                <label for>Phụ giá</label>
                <input
                  @keydown.enter.prevent="submitUpdateSurcharge"
                  v-model="update_booking.additional_fee"
                  type="number"
                  class="form-control"
                  placeholder="Nhập giá"
                >
              </div>
            </form>
          </div>
        </div>
        <button
          v-if="option == 3"
          slot="button"
          type="button"
          class="btn btn-theme"
          @click="submitUpdatePrice"
        >Cập nhật</button>
        <button
          v-if="option == 4"
          slot="button"
          type="button"
          class="btn btn-theme"
          @click="submitUpdateSurcharge"
        >Cập nhật</button>
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
import BookingPayment from "./BookingPayment";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
import Auth from "../../../services/auth";
import Pagination from "../../../components/paginate/ServerPagination";
import { format, constant } from "../../../helpers/mixins";
export default {
  mixins: [format, constant],
  components: {
    BookingSidebar,
    BookingDetail,
    BookingPayment,
    Pagination,
    SweetModal,
    Multiselect,
    Datepicker,
    Lottie
  },
  data() {
    return {
      defaultOptions: { animationData: animationData },
      format: "yyyy-MM-dd",
      bookings: [],
      bookingPayment: null,
      booking: {},
      update_booking: {},
      update_payment_status: null,
      update_booking_status: null,
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
      option: null,
      isModalVisible: false,
      modalPayment: false,
      isLeftSidebarVisible: true,
      selectedBookings: [],
      selectedStatus: "",
      permissions: "booking.view",
      searchText: "",
      totalPages: null,
      currentPage: null,
      count: null,
      loading: true
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
    },
    bookingStatus() {}
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
            this.$router.push("/permission-denied-403");
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
  created() {
    // console.log(this.statusList)
  },
  methods: {
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
          window.toastr["error"](
            "Dữ liệu danh sách chủ nhà hiện không có sẵn",
            "Error"
          );
        }
      }
    },
    async getCities() {
      try {
        const response = await axios.get(`cities`, {
          params: {
            limit: -1
          }
        });
        this.cities = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu danh sách tỉnh/thành phố hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getDistricts() {
      try {
        const response = await axios.get(`districts`, {
          params: {
            limit: -1
          }
        });
        this.districts = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu danh sách quận/huyện hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
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
        const response = await axios.get(`bookings`, {
          params: {
            include: "room.details",
            q: this.q,
            merchants: this.merchant.id,
            city: this.city.id,
            district: this.district.id,
            date_start: date_start,
            date_end: date_end,
            status: this.selectedStatus,
            page: page,
            limit: 5
          }
        });

        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.bookings = response.data.data;
        this.loading = false;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu danh sách booking hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getBookingPayment(id) {
      try {
        const response = await axios.get(
          `payments?booking=${this.booking.id}`,
          {
            params: {
              include: ""
            }
          }
        );
        this.bookingPayment = response.data.data;
        // console.log(response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu booking payment hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
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
    openBookingPaymentModal(booking) {
      this.booking = booking;
      this.getBookingPayment(booking.id);
      this.modalPayment = true;
    },
    closeMailModal() {
      this.isModalVisible = false;
    },
    closePaymentModal() {
      this.modalPayment = false;
    },
    openBookingFilter() {
      this.$refs.filter.open();
    },
    async resetFilter(page) {
      this.q = "";
      this.date_start = null;
      this.date_end = null;
      this.merchant = {
        id: ""
      };
      this.city = {
        id: ""
      };
      this.district = {
        id: ""
      };
      await this.getBookings({
        page
      }).then(this.$refs.filter.close());
    },
    async applyFilter(page) {
      await this.getBookings({
        page
      }).then(this.$refs.filter.close());
    },
    selectStatus(status, page) {
      this.selectedStatus = status;
      // console.log(status);
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
    },
    showCrossCheckingModal() {
      this.$swal(
        "Yêu cầu đối soát",
        "Yêu cầu đối soát cho các booking " + this.selectedBookings,
        "warning"
      );
    },
    makeInvoice() {
      this.$swal(
        "Yêu cầu xuất hóa đơn đỏ",
        "Yêu cầu xuất hóa đơn đỏ cho các booking được chọn",
        "warning"
      );
    },
    showModalUpdateStatus(booking) {
      this.option = 1;
      this.update_booking = booking;
      this.$refs.update_modal.open();
    },
    showModalUpdatePaymentStatus(booking) {
      this.option = 2;
      this.update_booking = booking;
      this.$refs.update_modal.open();
    },
    showModalDiscount(booking) {
      this.option = 3;
      this.update_booking = booking;
      this.$refs.money_update.open();
    },
    showModalSurcharge(booking) {
      this.option = 4;
      this.update_booking = booking;
      this.$refs.money_update.open();
    },
    async confirmUpdate() {
      // let response = await axios.put(`booking/`)
      this.$refs.update_modal.close();
    },
    closeUpdateModal() {
      this.option = null;
      this.update_booking = {};
      this.$refs.update_modal.close();
      this.$refs.money_update.close();
    },
    async submitUpdatePrice() {
      try {
        let price_discount = this.update_booking.price_discount;
        const response = await axios.put(
          `bookings/money-update/${this.update_booking.id}`,
          {
            price_discount: price_discount
          }
        );
        this.update_booking = {};
        this.$refs.money_update.close();
        this.reloadData(this.currentPage);
        window.toastr["success"]("Cập nhật thành công", "Success");
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Cập nhật thất bại, làm ơn kiểm tra lại thông tin",
            "Error"
          );
        }
      }
    },
    async submitUpdateSurcharge() {
      try {
        let additional_fee = this.update_booking.additional_fee;
        const response = await axios.put(
          `bookings/money-update/${this.update_booking.id}`,
          {
            additional_fee: additional_fee
          }
        );
        this.update_booking = {};
        this.$refs.money_update.close();
        this.reloadData(this.currentPage);
        window.toastr["success"]("Cập nhật thành công", "Success");
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Cập nhật thất bại, làm ơn kiểm tra lại thông tin",
            "Error"
          );
        }
      }
    },
    async submitUpdatePaymentStatus() {
      // console.log(this.update_payment_status.value)
      try {
        let payment_status = this.update_payment_status.value;
        const response = await axios.put(
          `bookings/status-update/${
            this.update_booking.id
          }?option=payment_status`,
          {
            payment_status: payment_status
          }
        );
        this.update_payment_status = null;
        this.$refs.update_modal.close();
        this.reloadData(this.currentPage);
        window.toastr["success"]("Cập nhật thành công", "Success");
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Cập nhật thất bại, làm ơn kiểm tra lại thông tin",
            "Error"
          );
        }
      }
    },
    async submitUpdateBookingStatus() {
      // console.log(this.update_payment_status.value)
      try {
        let status = this.update_booking_status.value;
        const response = await axios.put(
          `bookings/status-update/${this.update_booking.id}?option=status`,
          {
            status: status
          }
        );
        this.update_booking_status = null;
        this.$refs.update_modal.close();
        this.reloadData(this.currentPage);
        window.toastr["success"]("Cập nhật thành công", "Success");
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Cập nhật thất bại, làm ơn kiểm tra lại thông tin",
            "Error"
          );
        }
      }
    }
  }
};
</script>

<style>
/*
	Max width before this PARTICULAR table gets nasty. This query will take effect for any screen smaller than 760px and also iPads specifically.
	*/
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
    content: "Booking";
  }
  td:nth-of-type(3):before {
    content: "Phòng";
  }
  td:nth-of-type(4):before {
    content: "Thanh toán";
  }
  td:nth-of-type(5):before {
    content: "Khách hàng";
  }
  td:nth-of-type(6):before {
    content: "Trạng thái";
  }
  td:nth-of-type(7):before {
    content: "Hành động";
  }
}

#booking_table {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#booking_table th {
  border: 2px solid #ddd;
  padding: 8px;
}

#booking_table tr:hover {
  background-color: #ddd;
}

#booking_table tr:nth-child(even) {
  background-color: #e7e7e7;
}
</style>
