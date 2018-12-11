<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Bookings</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Bookings</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Create</a>
        </li>
      </ol>
      <div class="page-actions">
        <a @click="$refs.dark_html_modal.open()" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-plus"/> New User
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-9">
        <div class="card">
          <form-wizard
            @on-complete="onSubmit"
            next-button-text="Tiếp tục"
            finish-button-text="Tạo đặt phòng"
            back-button-text="Quay lại"
            :title="room != null ? room.details.data[0].name : ''"
            :subtitle="room != null ? room.details.data[0].address : ''"
          >
            <tab-content :before-change="validateBeforeNext" title="Thông tin khách hàng">
              <!-- <tab-content title="Thông tin khách hàng"> -->
              <section>
                <div class="row" v-if="room !== null">
                  <div
                    class="col-lg-2"
                    v-if="room.rent_type == 2 || room.rent_type == 3"
                    style="margin-bottom: 20px;"
                  >
                    <div class="custom-control custom-radio">
                      <input
                        id="customControlValidation3"
                        value="2"
                        v-model="booking.booking_type"
                        type="radio"
                        class="custom-control-input"
                        name="radio-stacked"
                        required
                      >
                      <label
                        class="custom-control-label"
                        :style="booking.booking_type == null ?'color:red' : ''"
                        for="customControlValidation3"
                      >Đặt theo ngày</label>
                    </div>
                  </div>
                  <div
                    class="col-lg-2"
                    v-if="room.rent_type == 1 || room.rent_type == 3"
                    style="margin-bottom: 20px;"
                  >
                    <div class="custom-control custom-radio mb-3">
                      <input
                        id="customControlValidation4"
                        value="1"
                        v-model="booking.booking_type"
                        type="radio"
                        class="custom-control-input"
                        name="radio-stacked"
                        required
                      >
                      <label
                        class="custom-control-label"
                        :style="booking.booking_type == null ?'color:red' : ''"
                        for="customControlValidation4"
                      >Đặt theo giờ</label>
                    </div>
                  </div>
                  <div class="col-lg-8"></div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label :style="errors.has('checkin_date') ? 'color:red;' : ''">
                        {{errors.has('checkin_date')
                        ? errors.first('checkin_date') : 'Chọn ngày *'}}
                      </label>
                      <homestay-date-picker
                        v-if="booking.booking_type == 2 && blocked_dates != null"
                        format="DD/MM/YYYY"
                        :disabledDates="blocked_dates"
                        :minNights="1"
                        ref="datepicker"
                        @check-in-changed="setStartDate"
                        @check-out-changed="setEndDate"
                        name="checkin_date"
                      ></homestay-date-picker>

                      <datepicker
                        v-if="booking.booking_type == 1"
                        :disabled-dates="disabledDatesCheckin"
                        name="checkin_date"
                        input-class="form-control"
                        data-vv-as="Ngày nhận phòng"
                        v-validate="'required'"
                        v-model="checkin"
                        :format="format"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        :style="errors.has('name') ? 'color:red;' : ''"
                      >{{errors.has('name')? errors.first('name') : 'Họ và tên *'}}</label>
                      <input
                        name="name"
                        v-validate="'required'"
                        data-vv-as="Họ và tên"
                        type="text"
                        v-model="booking.name"
                        class="form-control"
                      >
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('email') ? 'color:red;' : ''">
                        {{errors.has('email')
                        ? errors.first('email') : 'Email *'}}
                      </label>
                      <input
                        name="email"
                        data-vv-as="Email"
                        v-validate="'required|email'"
                        v-model="booking.email"
                        type="text"
                        class="form-control"
                      >
                    </div>
                    <div class="form-group">
                      <label>Ngày sinh</label>
                      <datepicker
                        v-model="booking.birthday"
                        :format="format"
                        input-class="form-control"
                      />
                    </div>
                    <div class="form-group" v-if="booking.booking_type == 1">
                      <label>Giới tính</label>
                      <select v-model="booking.sex" class="form-control ls-select2">
                        <option value="0">Không xác định</option>
                        <option value="1">Nam</option>
                        <option value="2">Nữ</option>
                        <option value="3">Khác</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <div class="custom-control custom-checkbox mb-3">
                        <input
                          id="customControlValidation1"
                          v-model="old_booking"
                          type="checkbox"
                          class="custom-control-input"
                          required
                        >
                        <label
                          class="custom-control-label"
                          for="customControlValidation1"
                        >Đặt phòng trong quá khứ</label>
                      </div>
                      <div class="custom-control custom-checkbox mb-3">
                        <input
                          id="customControlValidation2"
                          v-model="booking_for_other"
                          type="checkbox"
                          class="custom-control-input"
                          required
                        >
                        <label
                          class="custom-control-label"
                          for="customControlValidation2"
                        >Đặt phòng cho người khác</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group" v-if="booking.booking_type == 1">
                      <label :style="errors.has('checkin_hour') ? 'color:red;' : ''">
                        {{errors.has('checkin_hour')
                        ? errors.first('checkin_hour') : 'Giờ nhận phòng *'}}
                      </label>
                      <multiselect
                        :allow-empty="false"
                        name="checkin_hour"
                        v-model="checkin_hour"
                        v-validate="booking.booking_type == 1 ? 'required' : ''"
                        data-vv-as="Giờ nhận phòng"
                        :options="hoursData"
                        :searchable="true"
                        :show-labels="false"
                      />
                    </div>
                    <div class="form-group" v-if="booking.booking_type == 1">
                      <label :style="errors.has('checkout_hour') ? 'color:red;' : ''">
                        {{errors.has('checkout_hour')
                        ? errors.first('checkout_hour') : 'Giờ trả phòng *'}}
                      </label>
                      <multiselect
                        :allow-empty="false"
                        name="checkout_hour"
                        v-validate="booking.booking_type == 1 ? 'required' : ''"
                        v-model="checkout_hour"
                        data-vv-as="Giờ trả phòng"
                        :options="hoursData"
                        :searchable="true"
                        :show-labels="false"
                      />
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('phone') ? 'color:red;' : ''">
                        {{errors.has('phone')
                        ? errors.first('phone') : 'Số điện thoại *'}}
                      </label>
                      <input
                        name="phone"
                        type="text"
                        data-vv-as="Số điện thoại"
                        v-validate="'required|numeric|min:10|max:14'"
                        v-model="booking.phone"
                        class="form-control"
                      >
                    </div>

                    <div
                      class="form-group"
                      v-if="booking.booking_type == 2"
                      style="margin-top:32px;"
                    >
                      <label>Giới tính</label>
                      <select v-model="booking.sex" class="form-control ls-select2">
                        <option value="0">Không xác định</option>
                        <option value="1">Nam</option>
                        <option value="2">Nữ</option>
                        <option value="3">Khác</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label :style="errors.has('number_guest') ? 'color:red;' : ''">
                        {{errors.has('number_guest')
                        ? errors.first('number_guest') : 'Số khách *'}}
                      </label>
                      <input
                        name="number_guest"
                        v-validate="'required|numeric|min_value:1|max_value:'+ max_number_guest"
                        data-vv-as="Số khách"
                        type="text"
                        v-model.number="booking.number_of_guests"
                        class="form-control"
                      >
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('booking_source') ? 'color:red;' : ''">
                        {{errors.has('booking_source')
                        ? errors.first('booking_source') : 'Nguồn đặt phòng *'}}
                      </label>
                      <multiselect
                        :allow-empty="false"
                        name="booking_source"
                        v-model="source"
                        v-validate="'required'"
                        data-vv-as="Nguồn đặt phòng"
                        label="title"
                        :options="sourceList"
                        :searchable="true"
                        :show-labels="false"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12" v-if="booking_for_other">
                    <div class="card">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-sm-12">
                            <div class="form-group">
                              <label>Tên người nhận *</label>
                              <input
                                autofocus
                                type="text"
                                v-model="booking.name_received"
                                class="form-control"
                              >
                            </div>
                            <div class="form-group">
                              <label>Email người nhận *</label>
                              <input
                                v-model="booking.email_received"
                                type="text"
                                class="form-control"
                              >
                            </div>
                            <div class="form-group">
                              <label>SĐT người nhận *</label>
                              <input
                                v-model="booking.email_received"
                                type="text"
                                class="form-control"
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </tab-content>

            <tab-content title="Thanh toán">
              <div class="card">
                <div class="card-header">
                  <div class="caption">Thông tin giá phòng</div>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label :style="errors.has('payment_method') ? 'color:red;' : ''">
                          {{errors.has('payment_method')
                          ? errors.first('payment_method') : 'Hình thức thanh toán *'}}
                        </label>
                        <multiselect
                          :allow-empty="false"
                          v-model="payment_method"
                          value="value"
                          label="title"
                          :options="paymentMethodList"
                          v-validate="'required'"
                          data-vv-as="Hình thức thanh toán"
                          name="payment_method"
                          :searchable="true"
                          :show-labels="false"
                        />
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('money_received') ? 'color:red;' : ''">
                          {{errors.has('money_received')
                          ? errors.first('money_received') : 'Số tiền thanh toán'}}
                        </label>
                        <input
                          name="money_received"
                          v-model.number="booking.money_received"
                          v-validate="'numeric'"
                          type="number"
                          class="form-control"
                          data-vv-as="Số tiền thanh toán"
                        >
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('price_discount') ? 'color:red;' : ''">
                          {{errors.has('price_discount')
                          ? errors.first('price_discount') : 'Giảm giá'}}
                        </label>
                        <input
                          name="price_discount"
                          data-vv-as="Giảm giá"
                          v-model.number="booking.price_discount"
                          v-validate="'numeric'"
                          type="number"
                          class="form-control"
                        >
                      </div>
                      <div class="form-group">
                        <label>Mã giảm giá</label>
                        <div class="input-group">
                          <input
                            type="text"
                            :disabled="booking.coupon_discount > 0 ? true : false"
                            v-model="booking.coupon"
                            class="form-control"
                          >
                          <div class="input-group-append">
                            <button
                              v-if="booking.coupon_discount > 0"
                              @click="removeCoupon"
                              class="btn btn-sm btn-primary"
                            >
                              <i class="icon-fa icon-fa-times"></i>
                            </button>
                            <button v-else @click="applyCoupon" class="btn btn-sm btn-primary">
                              <i class="icon-fa icon-fa-check"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label :style="errors.has('payment_status') ? 'color:red;' : ''">
                          {{errors.has('payment_status')
                          ? errors.first('payment_status') : 'Trạng thái thanh toán * '}}
                        </label>
                        <multiselect
                          :allow-empty="false"
                          v-model="payment_status"
                          value="value"
                          label="title"
                          :options="paymentList"
                          v-validate="'required'"
                          data-vv-as="Trạng thái thanh toán"
                          name="payment_status"
                          :searchable="true"
                          :show-labels="false"
                        />
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('additional_fee') ? 'color:red;' : ''">
                          {{errors.has('additional_fee')
                          ? errors.first('additional_fee') : 'Phụ thu'}}
                        </label>
                        <input
                          name="additional_fee"
                          data-vv-as="Phụ thu"
                          v-model.number="booking.additional_fee"
                          v-validate="'numeric'"
                          type="number"
                          class="form-control"
                        >
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('status') ? 'color:red;' : ''">
                          {{errors.has('status')
                          ? errors.first('status') : 'Trạng thái booking * '}}
                        </label>
                        <multiselect
                          :allow-empty="false"
                          v-model="status"
                          value="value"
                          label="title"
                          :options="statusList"
                          name="status"
                          v-validate="'required'"
                          data-vv-as="Trạng thái booking"
                          :searchable="true"
                          :show-labels="false"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
          </form-wizard>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card" style="position:fixed">
          <div class="card-header bg-warning">
            <h6>
              <i class="icon-fa icon-fa-warning"></i> Thanh toán
            </h6>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  <th width="100px"></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Thời gian</td>
                  <td></td>
                  <td>
                    <span
                      v-if="('days' in booking)"
                      class="label label-success"
                    >{{ booking.days + ' Ngày'}}</span>
                    <span
                      v-if="('hours' in booking)"
                      class="label label-success"
                    >{{ booking.hours + ' Giờ'}}</span>
                  </td>
                </tr>
                <tr>
                  <td>Giá gốc</td>
                  <td></td>
                  <td>
                    <span class="label label-danger">{{booking.price_original | formatNumber}}</span>
                  </td>
                </tr>
                <tr>
                  <td>Giảm giá</td>
                  <td></td>
                  <td>
                    <span class="label label-success">{{booking.price_discount | formatNumber}}</span>
                  </td>
                </tr>
                <tr>
                  <td>Phụ thu</td>
                  <td></td>
                  <td>
                    <span class="label label-danger">{{booking.additional_fee | formatNumber}}</span>
                  </td>
                </tr>
                <tr>
                  <td>Khuyến mãi</td>
                  <td></td>
                  <td>
                    <span class="label label-success">{{booking.coupon_discount | formatNumber}}</span>
                  </td>
                </tr>
                <tr>
                  <td>Tổng tiền</td>
                  <td></td>
                  <td>
                    <span class="label label-danger">
                      <b>{{totalFeeCalculated | formatNumber}}</b>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import Auth from "../../../services/auth";
import { hoursList, format, constant } from "../../../helpers/mixins";
import { Tabs, Tab } from "vue-tabs-component";
import Multiselect from "vue-multiselect";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import Datepicker from "vuejs-datepicker";
import HomestayDatePicker from "vue-hotel-datepicker";
export default {
  mixins: [hoursList, format, constant],
  components: {
    FormWizard,
    TabContent,
    Tabs,
    Tab,
    Multiselect,
    Datepicker,
    HomestayDatePicker
  },
  data() {
    return {
      current_user: null,
      endDate: null,
      maxNights: null,
      sourceList: [
        {
          value: 1,
          title: "Trang fanpage"
        },
        {
          value: 2,
          title: "Tổng đài"
        },
        {
          value: 3,
          title: "Qua Team Sale"
        },
        {
          value: 4,
          title: "Qua Website"
        },
        {
          value: 5,
          title: "Qua AirBnb"
        },
        {
          value: 5,
          title: "Qua Booking.com"
        }
      ],
      payment_method: null,
      payment_status: null,
      status: null,
      source: null,
      checkout_hour: null,
      checkin_hour: null,
      checkin: null,
      checkout: null,
      booking: {
        days: 0,
        hours: 0,
        booking_type: 2,
        birthday: null,
        payment_status: 3,
        price_discount: 0,
        coupon: "",
        additional_fee: 0,
        service_fee: 0,
        price_original: 0,
        coupon_discount: 0,
        total_fee: 0,
        status: 1
      },
      disabledDatesCheckin: {
        to: new Date(),
        dates: []
      },

      blocked_dates: null,
      format: "yyyy-MM-dd",
      room: null,
      permissions: "booking.create",
      list: [
        {
          name: null,
          value: null
        }
      ],
      old_booking: false,
      booking_for_other: false,
      max_number_guest: null
    };
  },
  watch: {
    old_booking: {
      handler(val) {
        this.old_booking == true
          ? (this.disabledDatesCheckin.to = "")
          : (this.disabledDatesCheckin.to = new Date());
      }
    },
    payment_method: {
      handler(val) {
        this.booking.payment_method = val.value;
      },
      deep: true
    },
    payment_status: {
      handler(val) {
        this.booking.payment_status = val.value;
      },
      deep: true
    },
    status: {
      handler(val) {
        this.booking.status = val.value;
      },
      deep: true
    },
    source: {
      handler(val) {
        this.booking.source = val.value;
      },
      deep: true
    },
    blocked_dates: {
      handler(val) {
        this.disabledDatesCheckin.dates = [];
        val.forEach(element => {
          this.disabledDatesCheckin.dates.push(new Date(element));
        });
      }
    },
    checkin: {
      handler(val) {
        if (val != null && this.booking.booking_type == 2) {
          this.checkout = null;
          let checkinChoose = val.toISOString().substr(0, 10);
          let addTwoDay = this.addTwoDay(checkinChoose);
          let index = this.blocked_dates.indexOf(addTwoDay);
          if (index > -1) {
            this.setEndDate(new Date(addTwoDay));
          }
        }
      }
    }
  },
  computed: {
    totalFeeCalculated() {
      return (
        this.booking.total_fee +
        this.booking.additional_fee -
        this.booking.price_discount -
        this.booking.coupon_discount
      );
    }
  },
  methods: {
    addDay(date) {
      let beforeAddDay = new Date(date);
      let timeDay = 86400000;
      let afterAddDay = new Date(beforeAddDay.getTime() + timeDay);
      return afterAddDay;
    },
    addTwoDay(date) {
      let beforeAddDay = new Date(date);
      let timeDay = 86400000 * 2;
      let afterAddDay = new Date(beforeAddDay.getTime() + timeDay);
      let afterDay = afterAddDay.toISOString().substr(0, 10);
      return afterDay;
    },
    setStartDate: function(newCheckin) {
      if (newCheckin) {
        this.$refs.datepicker.setCheckIn(newCheckin);
        this.checkin = newCheckin;
      }
    },
    setEndDate: function(newCheckout) {
      if (newCheckout) {
        this.$refs.datepicker.setCheckOut(newCheckout);
        this.checkout = newCheckout;
      }
    },
    async getRoomBlock() {
      try {
        const response = await axios.get(
          `rooms/schedule/${this.$route.params.roomId}`
        );
        this.blocked_dates = [];
        this.blocked_dates = response.data.data.blocks;
      } catch (error) {
        window.toastr["error"]("There was an error", "Error");
      }
    },
    async getRoom() {
      try {
        const response = await axios.get(`rooms/${this.$route.params.roomId}`, {
          params: {
            include: "details,blocks"
          }
        });
        this.max_number_guest =
          response.data.data.max_guest +
          response.data.data.max_additional_guest;
        return (this.room = response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async validateBeforeNext() {
      let minusHour;
      if (this.booking.booking_type == 1) {
        let checkinHour = new Date("1/1/1999 " + this.checkin_hour);
        let checkoutHour = new Date("1/1/1999 " + this.checkout_hour);
        minusHour = checkoutHour.getTime() - checkinHour.getTime();
      }
      if (this.booking.booking_type == null) {
        this.$swal({
          title: "Xin lỗi",
          text: "Loại đặt phòng không thể bỏ trống",
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Quay lại",
          cancelButtonText: "Quay lại",
          showCloseButton: false,
          showLoaderOnConfirm: false
        }).then(result => {
          return window.scroll({
            top: 0,
            behavior: "smooth"
          });
        });
      } else if (this.checkin == null) {
        window.toastr["error"]("Vui lòng chọn ngày checkin", "Error");
      } else if (this.booking.booking_type == 2 && this.checkout == null) {
        window.toastr["error"]("Vui lòng chọn ngày checkout", "Error");
      } else if (this.booking.booking_type == 1 && minusHour < 0) {
        window.toastr["error"](
          "Chọn giờ trả phòng phải lớn hơn giờ nhận phòng",
          "Error"
        );
      } else if (
        this.booking.booking_type == 1 &&
        minusHour > 0 &&
        minusHour < 14400000
      ) {
        window.toastr["error"]("Bạn phải đặt ít nhất 4 giờ", "Error");
      } else {
        let index;
        if (this.checkout != null) {
          // console.log(this.checkout);
          index = this.blocked_dates.indexOf(
            this.checkout.toISOString().substr(0, 10)
          );
          // console.log(index);
          if (index == -1) {
            this.checkout = this.addDay(this.checkout);
          }
        }
        const result = this.$validator.validateAll();
        if (result) {
          // console.log(
          //   this.addDay(this.checkin)
          //     .toISOString()
          //     .substr(0, 10) + " 14:00:00"
          // );
          // console.log(this.checkout.toISOString().substr(0, 10) + " 12:00:00");
          const response = await axios.post(`bookings/price-calculator/`, {
            additional_fee: 0,
            price_discount: 0,
            room_id: this.room.id,
            checkin:
              this.booking.booking_type == 2
                ? this.addDay(this.checkin)
                    .toISOString()
                    .substr(0, 10) + " 14:00:00"
                : this.checkin.toISOString().substr(0, 10) +
                  " " +
                  this.checkin_hour,
            checkout:
              this.booking.booking_type == 2
                ? this.checkout.toISOString().substr(0, 10) + " 12:00:00"
                : this.checkin.toISOString().substr(0, 10) +
                  " " +
                  this.checkout_hour,
            coupon: this.booking.coupon,
            number_of_guests: this.booking.number_of_guests,
            booking_type: this.booking.booking_type
          });
          if (response.data.data) {
            if ("days" in response.data.data) {
              this.booking.days = response.data.data.days;
            } else {
              this.booking.hours = response.data.data.hours;
            }
            this.booking.additional_fee = response.data.data.additional_fee;
            this.booking.price_discount = response.data.data.price_discount;
            this.booking.price_original = response.data.data.price_original;
            this.booking.total_fee = response.data.data.total_fee;
            this.booking.service_fee = response.data.data.service_fee;
            this.booking.coupon_discount = response.data.data.coupon_discount;
          }
          return true;
        } else {
          return window.scroll({
            top: 20,
            behavior: "smooth"
          });
        }
      }
    },
    async onSubmit() {
      const result = this.$validator.validateAll();
      if (result) {
        this.$swal({
          title: "Bạn có muốn tạo booking này không",
          text: "",
          type: "warning",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          showCloseButton: false,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            let response = await axios
              .post(`bookings`, {
                name: this.booking.name,
                phone: this.booking.phone,
                sex: this.booking.sex,
                birthday:
                  this.booking.birthday !== null
                    ? this.booking.birthday.toISOString().substr(0, 10)
                    : null,
                email: this.booking.email,
                email_received: this.booking_for_other
                  ? this.booking.email_received
                  : this.booking.email,
                name_received: this.booking_for_other
                  ? this.booking.name_received
                  : this.booking.name,
                phone_received: this.booking_for_other
                  ? this.booking.phone_received
                  : this.booking.phone,
                room_id: this.room.id,
                checkin:
                  this.booking.booking_type == 2
                    ? this.addDay(this.checkin)
                        .toISOString()
                        .substr(0, 10) + " 14:00:00"
                    : this.checkin.toISOString().substr(0, 10) +
                      " " +
                      this.checkin_hour,
                checkout:
                  this.booking.booking_type == 2
                    ? this.checkout.toISOString().substr(0, 10) + " 12:00:00"
                    : this.checkin.toISOString().substr(0, 10) +
                      " " +
                      this.checkout_hour,
                additional_fee: this.booking.additional_fee,
                money_received: this.booking.money_received,
                price_discount: this.booking.price_discount,
                coupon_discount: this.booking.coupon_discount,
                coupon:
                  this.booking.coupon_discount > 0 ? this.booking.coupon : null,
                note: this.booking.note,
                status: this.booking.status,
                number_of_guests: this.booking.number_of_guests,
                booking_type: this.booking.booking_type,
                payment_method: this.booking.payment_method,
                payment_status: this.booking.payment_status,
                source: this.booking.source,
                confirm: this.booking.confirm,
                staff_id: this.current_user.id
              })
              .then(response => {
                this.$swal("Thành công", "Booking đã được tạo", "success");
                this.$router.push({ name: "booking.list" });
              })
              .catch(error => {
                let err = error.response.data.data.errors;
                window.toastr["error"](err, "Error");
              });
          }
        });
      } else {
        return window.scroll({
          top: 0,
          behavior: "smooth"
        });
      }
    },
    async applyCoupon() {
      if (this.booking.coupon.trim() !== "") {
        let day = new Date();
        let currentDay = day.toISOString().substring(0, 10);
        let response = await axios
          .post("coupons/calculate-discount", {
            coupon: this.booking.coupon,
            price_original: this.booking.price_original,
            room_id: this.room.id,
            city_id: this.room.city_id,
            district_id: this.room.district_id,
            day: currentDay
          })
          .then(response => {
            this.booking.coupon_discount = response.data.data.price_discount;
            this.$swal("Thành công", response.data.data.message, "success");
          })
          .catch(error => {
            this.$swal("Xin lỗi", error.response.data.data.error, "error");
          });
      } else {
        this.$swal("Xin lỗi", "Mã giảm giá không được bỏ trống", "warning");
      }
    },
    async removeCoupon() {
      this.$swal("Thành công", "Mã giảm giá đã được loại bỏ", "success");
      try {
        this.booking.coupon = "";
        this.booking.price_discount = 0;
        this.booking.coupon_discount = 0;
      } catch (error) {
        if (error) {
          this.$swal(
            "Xin lỗi",
            "Có lỗi xảy ra, vui lòng kiểm tra lại",
            "error"
          );
        }
      }
    }
  },
  mounted() {
    Auth.getCurrentUser().then(res => {
      this.current_user = res;
    });
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403"); // push về page 403
          } else {
            this.getRoom();
            this.getRoomBlock();
          }
        });
      }
    });
  }
};
</script>

<style>
</style>
