<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Bookings</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Bookings</a></li>
        <li class="breadcrumb-item"><a href="#">Create</a></li>
      </ol>
      <div class="page-actions">
        <a @click="$refs.dark_html_modal.open()" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-plus" /> New User
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-9">
        <div class="card">
          <form-wizard @on-complete="onSubmit" next-button-text="Tiếp tục" finish-button-text="Tạo đặt phòng"
            back-button-text="Quay lại" :title="room != null ? room.details.data[0].name : ''" :subtitle="room != null ? room.details.data[0].address : ''">
            <tab-content :before-change="validateBeforeNext" title="Thông tin khách hàng">
              <!-- <tab-content title="Thông tin khách hàng"> -->
              <section>
                <div class="row" v-if="room !== null">
                  <div class="col-lg-2" v-if="room.rent_type == 2 || room.rent_type == 3">
                    <div class="custom-control custom-radio">
                      <input id="customControlValidation3" value="2" v-model="booking.booking_type" type="radio" class="custom-control-input"
                        name="radio-stacked" required>
                      <label class="custom-control-label" :style="booking.booking_type == null ?'color:red' : ''" for="customControlValidation3">
                        Đặt theo ngày
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-2" v-if="room.rent_type == 1 || room.rent_type == 3">
                    <div class="custom-control custom-radio mb-3">
                      <input id="customControlValidation4" value="1" v-model="booking.booking_type" type="radio" class="custom-control-input"
                        name="radio-stacked" required>
                      <label class="custom-control-label" :style="booking.booking_type == null ?'color:red' : ''" for="customControlValidation4">
                        Đặt theo giờ
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-8"></div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label :style="errors.has('checkin_date') ? 'color:red;' : ''">{{errors.has('checkin_date')
                        ? errors.first('checkin_date') : 'Ngày nhận phòng *'}}</label>
                      <datepicker name="checkin_date" data-vv-as="Ngày nhận phòng" v-validate="'required'" v-model="booking.checkin"
                        :disabled-dates="disabledCheckin" :format="format" input-class="form-control" />
                    </div>
                    <div class="form-group" v-if="booking.booking_type == 1">
                      <label :style="errors.has('checkin_hour') ? 'color:red;' : ''">{{errors.has('checkin_hour')
                        ? errors.first('checkin_hour') : 'Giờ nhận phòng *'}}</label>
                      <multiselect :allow-empty="false" name="checkin_hour" v-model="checkin_hour" v-validate="booking.booking_type == 1 ? 'required' : ''"
                        data-vv-as="Giờ nhận phòng" :options="hoursData" :searchable="true" :show-labels="false" />
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('name') ? 'color:red;' : ''">
                          {{errors.has('name')? errors.first('name') : 'Họ và tên *'}}
                      </label>
                      <input name="name" v-validate="'required'" data-vv-as="Họ và tên" type="text" v-model="booking.name"
                        class="form-control">
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('email') ? 'color:red;' : ''">{{errors.has('email')
                        ? errors.first('email') : 'Email *'}}</label>
                      <input name="email" data-vv-as="Email" v-validate="'required|email'" v-model="booking.email" type="text"
                        class="form-control">
                    </div>
                    <div class="form-group">
                      <label>Ngày sinh</label>
                      <datepicker v-model="booking.birthday" :format="format" input-class="form-control" />
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('booking_source') ? 'color:red;' : ''">{{errors.has('booking_source')
                        ? errors.first('booking_source') : 'Nguồn đặt phòng *'}}</label>
                      <multiselect
                        :allow-empty="false" name="booking_source"
                        v-model="source"
                        v-validate="'required'"
                        data-vv-as="Nguồn đặt phòng" label="title" :options="sourceList" :searchable="true"
                        :show-labels="false" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label :style="errors.has('checkout_date') ? 'color:red;' : ''">{{errors.has('checkout_date')
                        ? errors.first('checkout_date') : 'Ngày trả phòng *'}}</label>
                      <datepicker name="checkout_date" v-validate="booking.booking_type == 2 ? 'required' : ''"
                        :disabled="booking.booking_type == 1" data-vv-as="Ngày trả phòng" :format="format" v-model="booking.checkout"
                        :disabled-dates="disabledCheckout" input-class="form-control" />
                    </div>
                    <div class="form-group" v-if="booking.booking_type == 1">
                      <label :style="errors.has('checkout_hour') ? 'color:red;' : ''">{{errors.has('checkout_hour')
                        ? errors.first('checkout_hour') : 'Giờ trả phòng *'}}</label>
                      <multiselect :allow-empty="false" name="checkout_hour" v-validate="booking.booking_type == 1 ? 'required' : ''"
                        v-model="checkout_hour" data-vv-as="Giờ trả phòng" :options="hoursData" :searchable="true"
                        :show-labels="false" />
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('phone') ? 'color:red;' : ''">{{errors.has('phone')
                        ? errors.first('phone') : 'Số điện thoại *'}} </label>
                      <input name="phone" type="text" data-vv-as="Số điện thoại" v-validate="'required|numeric'"
                        v-model="booking.phone" class="form-control">
                    </div>

                    <div class="form-group">
                      <label>Giới tính</label>
                      <select v-model="booking.sex" class="form-control ls-select2">
                        <option value="0">Không xác định</option>
                        <option value="1">Nam</option>
                        <option value="2">Nữ</option>
                        <option value="3">Khác</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label :style="errors.has('number_guest') ? 'color:red;' : ''">{{errors.has('number_guest')
                        ? errors.first('number_guest') : 'Số khách *'}}</label>
                      <input name="number_guest" v-validate="'required|numeric'" data-vv-as="Số khách" type="text" v-model.number="booking.number_of_guests"
                        class="form-control">
                    </div>
                    <div class="form-group">
                      <label>Mã giảm giá</label>
                      <div class="input-group">
                        <input :disabled="true" type="text" v-model="booking.coupon" class="form-control">
                        <div class="input-group-append">
                          <button v-if="booking.price_discount > 0" @click="removeCoupon" class="btn btn-sm btn-primary"><i
                              class="icon-fa icon-fa-times"></i></button>
                          <button v-else @click="applyCoupon" class="btn btn-sm btn-primary"><i class="icon-fa icon-fa-check"></i></button>
                        </div>
                      </div>

                    </div>

                  </div>
                  <div class="col-lg-12">
                    <div class="custom-control custom-checkbox mb-3">
                      <input id="customControlValidation1" v-model="old_booking" type="checkbox" class="custom-control-input"
                        required />
                      <label class="custom-control-label" for="customControlValidation1">
                        Đặt phòng trong quá khứ
                      </label>
                    </div>
                    <div class="custom-control custom-checkbox mb-3">
                      <input id="customControlValidation2" v-model="booking_for_other" type="checkbox" class="custom-control-input"
                        required />
                      <label class="custom-control-label" for="customControlValidation2">
                        Đặt phòng cho người khác
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-12" v-if="booking_for_other">
                    <div class="card">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-sm-12">
                            <div class="form-group">
                              <label>Tên người nhận *</label>
                              <input autofocus type="text" v-model="booking.name_received" class="form-control">
                            </div>
                            <div class="form-group">
                              <label>Email người nhận *</label>
                              <input v-model="booking.email_received" type="text" class="form-control">
                            </div>
                            <div class="form-group">
                              <label>SĐT người nhận *</label>
                              <input v-model="booking.email_received" type="text" class="form-control">
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
                        <label>Hình thức thanh toán *</label>
                        <multiselect :allow-empty="false" v-model="payment_method" value="value" label="title" :options="paymentMethodList"
                          :searchable="true" :show-labels="false" />
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('money_received') ? 'color:red;' : ''">{{errors.has('money_received')
                          ? errors.first('money_received') : 'Số tiền thanh toán *'}}</label>
                        <input name="money_received" v-model.number="booking.money_received" v-validate="'numeric'" type="number" class="form-control" data-vv-as="Số tiền thanh toán" >
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('price_discount') ? 'color:red;' : ''">{{errors.has('price_discount')
                          ? errors.first('price_discount') : 'Giảm giá'}}</label>
                        <input name="price_discount" data-vv-as="Giảm giá" v-model.number="booking.price_discount"
                          v-validate="'numeric'" type="number" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Trạng thái thanh toán *</label>
                        <multiselect :allow-empty="false" v-model="payment_status" value="value" label="title" :options="paymentList"
                          :searchable="true" :show-labels="false" />
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('additional_fee') ? 'color:red;' : ''">{{errors.has('additional_fee')
                          ? errors.first('additional_fee') : 'Phụ thu'}}</label>
                        <input name="additional_fee" data-vv-as="Phụ thu" v-model.number="booking.additional_fee"
                          v-validate="'numeric'" type="number" class="form-control">
                      </div>
                      <div class="form-group">
                        <label>Trạng thái booking *</label>
                        <multiselect :allow-empty="false" v-model="status" value="value" label="title" :options="statusList"
                          :searchable="true" :show-labels="false" />
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
            <h6><i class="icon-fa icon-fa-warning"></i> Thanh toán</h6>
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
                    <span v-if="('days' in booking)" class="label label-success">{{ booking.days + ' Ngày'}}</span>
                    <span v-if="('hours' in booking)" class="label label-success">{{ booking.hours + ' Giờ'}}</span>
                  </td>
                </tr>
                <tr>
                  <td>Giá gốc</td>
                  <td></td>
                  <td><span class="label label-danger">{{booking.price_original | formatNumber}}</span></td>
                </tr>
                <tr>
                  <td>Khuyến mãi</td>
                  <td></td>
                  <td><span class="label label-success">{{booking.price_discount | formatNumber}}</span></td>
                </tr>
                <tr>
                  <td>Phụ thu</td>
                  <td></td>
                  <td><span class="label label-danger">{{booking.additional_fee | formatNumber}}</span></td>
                </tr>
                <tr>
                  <td>Giảm giá</td>
                  <td></td>
                  <td><span class="label label-success">{{booking.coupon_discount | formatNumber}}</span></td>
                </tr>
                <tr>
                  <td>Tổng tiền</td>
                  <td></td>
                  <td><span class="label label-danger"><b>{{totalFeeCalculated | formatNumber}}</b></span></td>
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
export default {
  mixins: [hoursList, format, constant],
  components: {
    FormWizard,
    TabContent,
    Tabs,
    Tab,
    Multiselect,
    Datepicker
  },
  data() {
    return {
      current_user: null,
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
      booking: {
        checkin: null,
        checkout: null,
        booking_type: null,
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
      disabledCheckout: {
        to: ""
      },
      disabledCheckin: {
        to: new Date()
      },
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
      booking_for_other: false
    };
  },
  watch: {
    booking: {
      handler(val) {
        this.disabledCheckout.to = val.checkin;
        if (val.booking_type == 2) {
          this.checkin = val.checkin + " " + this.checkin_hour;
          this.checkout = val.checkin + " " + this.checkout_hour;
        }
      },
      deep: true
    },
    old_booking: {
      handler(val) {
        this.old_booking == true
          ? (this.disabledCheckin.to = "")
          : (this.disabledCheckin.to = new Date());
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
    }
  },
  computed: {
    totalFeeCalculated() {
      return (
        this.booking.total_fee +
        this.booking.additional_fee -
        this.booking.price_discount
      );
    }
  },
  methods: {
    async getRoom() {
      try {
        const response = await axios.get(
          `rooms/${this.$route.params.roomId}?include=details`
        );
        return (this.room = response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async validateBeforeNext() {
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
      } else {
        const result = this.$validator.validateAll();
        if (result) {
          // eslint-disable-next-line
          // Calculate the booking fee
          const response = await axios.post(`bookings/price-calculator/`, {
            additional_fee: 0,
            price_discount: 0,
            room_id: this.room.id,
            checkin:
              this.booking.booking_type == 2
                ? this.booking.checkin.toISOString().substr(0, 10) + " 14:00:00"
                : this.booking.checkin.toISOString().substr(0, 10) +
                  " " +
                  this.checkin_hour,
            checkout:
              this.booking.booking_type == 2
                ? this.booking.checkout.toISOString().substr(0, 10) +
                  " 12:00:00"
                : this.booking.checkin.toISOString().substr(0, 10) +
                  " " +
                  this.checkout_hour,
            coupon: this.booking.coupon,
            number_of_guests: this.booking.number_of_guests,
            booking_type: this.booking.booking_type
          });
          // console.log(response.data.data.total_fee);
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
      // console.log(this.booking)
      const result = this.$validator.validateAll();
      if (result) {
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
                ? this.booking.checkin.toISOString().substr(0, 10) + " 14:00:00"
                : this.booking.checkin.toISOString().substr(0, 10) +
                  " " +
                  this.checkin_hour,
            checkout:
              this.booking.booking_type == 2
                ? this.booking.checkout.toISOString().substr(0, 10) +
                  " 12:00:00"
                : this.booking.checkin.toISOString().substr(0, 10) +
                  " " +
                  this.checkout_hour,
            additional_fee: this.booking.additional_fee,
            money_received: this.booking.money_received,
            price_discount: this.booking.price_discount,
            coupon: this.booking.coupon,
            note: "Ai wanna săm wai",
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
          })
          .catch(error => {
            let err = error.response.data.data.errors;
            window.toastr["error"]("There was an error", "Error");
          });
      } else {
        return window.scroll({
          top: 0,
          behavior: "smooth"
        });
      }
    },
    async applyCoupon() {
      this.$swal(
        "Xin lỗi",
        "Chức năng này đang trong quá trình phát triển",
        "warning"
      );
      // if (this.booking.coupon.trim() !== "") {
      //   this.$swal(
      //     "Chúc mừng",
      //     "Mã giảm giá được áp dụng thành công",
      //     "success"
      //   );
      //   try {
      //     // this.booking.price_discount = 120000;
      //     // Get discount base on coupon ( must return by number )
      //     // const response = await axios.get(
      //     // `rooms/${this.$route.params.roomId}?include=details`
      //     // );
      //     // return;
      //   } catch (error) {
      //     if (error) {
      //       this.$swal("Xin lỗi", "Mã giảm giá không hợp lệ", "error");
      //     }
      //   }
      // } else {
      //   this.$swal("Xin lỗi", "Mã giảm giá không được bỏ trống", "warning");
      // }
    },
    async removeCoupon() {
      // this.$swal("Thành công", "Mã giảm giá đã được loại bỏ", "success");
      // try {
      //   this.booking.coupon = "";
      //   this.booking.price_discount = 0;
      //   // Recalculate the discount
      //   // const response = await axios.get(
      //   // `rooms/${this.$route.params.roomId}?include=details`
      //   // );
      //   // return;
      // } catch (error) {
      //   if (error) {
      //     this.$swal(
      //       "Xin lỗi",
      //       "Có lỗi xảy ra, vui lòng kiểm tra lại",
      //       "error"
      //     );
      //   }
      // }
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
          }
        });
      }
    });
  }
};
</script>

<style>
</style>
