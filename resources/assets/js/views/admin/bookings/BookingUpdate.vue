<template>
  <div class="main-content" v-if="booking !== null">
    <div class="page-header">
      <h3 class="page-title">Edit Booking #{{booking.code}}</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Booking</a></li>
        <li class="breadcrumb-item active">Edit</li>
      </ol>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <h6>{{booking.room.data.details.data[0].name}}</h6>
          </div>
          <div class="card-body">
            <form @submit.prevent="onSubmit">
              <div class="form-row">
                <div class="form-group col-md-3">
                  <label>Ngày nhận phòng</label>
                  <input disabled type="text" v-model="booking.checkin" class="form-control">
                </div>
                <div class="form-group col-md-3">
                  <label>Ngày trả phòng</label>
                  <input disabled type="text" v-model="booking.checkout" class="form-control">
                </div>
                <div class="form-group col-md-3">
                  <label>Loại đặt phòng</label>
                  <input disabled type="text" v-model="booking.booking_type_txt" class="form-control">
                </div>
                <div class="form-group col-md-3">
                  <label>Người tạo</label>
                  <input disabled type="text" v-model="booking.booking_status.data.user.data.name" class="form-control">
                </div>
              </div>
              <hr />
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label
                    :style="errors.has('name') ? 'color:red;' : ''">
                      {{errors.has('name') ? errors.first('name') : 'Họ và tên *'}}
                  </label>
                  <input name="name" v-validate="'required'" data-vv-as="Họ và tên" type="text" v-model="booking.name"
                    class="form-control">
                </div>
                <div class="form-group col-md-6">
                  <label :style="errors.has('phone') ? 'color:red;' : ''">{{errors.has('phone')
                    ? errors.first('phone') : 'Số điện thoại *'}} </label>
                  <input name="phone" type="text" data-vv-as="Số điện thoại" v-validate="'required|numeric'" v-model="booking.phone"
                    class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label :style="errors.has('email') ? 'color:red;' : ''">{{errors.has('email')
                    ? errors.first('email') : 'Email *'}}</label>
                  <input name="email" data-vv-as="Email" v-validate="'required|email'" v-model="booking.email" type="text"
                    class="form-control">
                </div>
                <div class="form-group col-md-6">
                  <label>Gender</label>
                  <div>
                    <div class="form-check form-check-inline">
                      <input v-model="booking.sex" id="checkMale" class="form-check-input" type="radio" name="gender"
                        value="1">
                      <label class="form-check-label" for="checkMale">Nam</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="booking.sex" id="checkFemale" class="form-check-input" type="radio" name="gender"
                        value="2">
                      <label class="form-check-label" for="checkFemale">Nữ</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="booking.sex" id="checkFemale" class="form-check-input" type="radio" name="gender"
                        value="3">
                      <label class="form-check-label" for="checkFemale">Khác</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Ngày sinh</label>
                  <datepicker v-model="birthday" :format="format" input-class="form-control" />
                </div>
                <div class="form-group col-md-6">
                  <label
                    :style="errors.has('number_guest') ? 'color:red;' : ''">
                      {{errors.has('number_guest') ? errors.first('number_guest') : 'Số khách *'}}
                  </label>
                  <input
                    name="number_guest"
                    v-validate="'required|numeric|min:1'"
                    data-vv-as="Số khách"
                    type="text"
                    v-model.number="booking.number_of_guests"
                    class="form-control">
                </div>
              </div>
              <hr />
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label :style="errors.has('name_received') ? 'color:red;' : ''">{{errors.has('name_received')
                    ? errors.first('name_received') : 'Tên người nhận *'}}</label>
                  <input name="name_received" v-validate="'required'" data-vv-as="Tên người nhận" type="text" v-model="booking.name_received"
                    class="form-control">
                </div>
                <div class="form-group col-md-6">
                  <label :style="errors.has('phone_received') ? 'color:red;' : ''">{{errors.has('phone_received')
                    ? errors.first('phone_received') : 'Số điện thoại *'}} </label>
                  <input name="phone_received" type="text" data-vv-as="Số điện thoại" v-validate="'required|numeric'"
                    v-model="booking.phone_received" class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label :style="errors.has('email_received') ? 'color:red;' : ''">{{errors.has('email_received')
                    ? errors.first('email_received') : 'Email *'}}</label>
                  <input name="email_received" data-vv-as="Email" v-validate="'required|email'" v-model="booking.email_received"
                    type="text" class="form-control">
                </div>
              </div>
              <hr />
              <div class="form-row">
                <div
                  class="form-group col-md-6">
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
                <div class="form-group col-md-6">
                  <label
                    :style="errors.has('booking_source') ? 'color:red;' : ''">
                    {{errors.has('booking_source') ? errors.first('booking_source') : 'Nguồn liên hệ *'}}
                  </label>
                  <multiselect
                    :allow-empty="false"
                    name="booking_source"
                    v-model="source"
                    v-validate="'required'"
                    data-vv-as="Nguồn liên hệ"
                    label="title"
                    :options="bookingSource"
                    :searchable="true"
                    :show-labels="false"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Hình thức thanh toán</label>
                  <multiselect :allow-empty="false" v-model="payment_method" value="value" label="title" :options="paymentMethodList"
                  :searchable="true" :show-labels="false" />
                </div>
                <div class="form-group col-md-6">
                  <label>Trạng thái thanh toán</label>
                  <multiselect :allow-empty="false" v-model="payment_status" value="value" label="title" :options="paymentList"
                  :searchable="true" :show-labels="false" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label
                    :style="errors.has('additional_fee') ? 'color:red;' : ''">
                    {{errors.has('additional_fee')? errors.first('additional_fee') : 'Phụ thu'}}
                  </label>
                  <input name="additional_fee" data-vv-as="Phụ thu" v-model.number="booking.additional_fee"
                  v-validate="'numeric'" type="number" class="form-control">
                </div>
                <div class="form-group col-md-6">
                  <label :style="errors.has('price_discount') ? 'color:red;' : ''">{{errors.has('price_discount')
                    ? errors.first('price_discount') : 'Giảm giá'}}
                  </label>
                  <input
                    name="price_discount"
                    data-vv-as="Giảm giá"
                    v-model.number="booking.price_discount"
                    v-validate="'numeric'"
                    type="number"
                    class="form-control">
                </div>
              </div>
              <div class="form-row">
                <!-- <div class="form-group col-md-6">
                  <label>Tỉnh thành</label>
                  <multiselect id="inputUserName" v-model="city" label="name" :options="cities" :searchable="true" :show-labels="false" />
                </div>
                <div class="form-group col-md-6">
                  <label>Quận/Huyện</label>
                  <multiselect :disabled="city.id == ''" id="inputUserName" v-model="district" label="name" :options="filteredDistrict" :searchable="true" :show-labels="false" />
                </div> -->
                <div class="form-group col-md-6">
                  <label>Trạng thái booking</label>
                  <multiselect
                    :allow-empty="false"
                    v-model="status"
                    value="value"
                    label="title"
                    :options="statusList"
                    :searchable="true"
                    :show-labels="false" />
                </div>
              </div>
              <button
                class="btn btn-primary"
                type="submit">
                  Cập nhật
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, location, constant } from "../../../helpers/mixins";
import Auth from "../../../services/auth";
import Multiselect from "vue-multiselect";
import Datepicker from "vuejs-datepicker";
export default {
  mixins: [format, location, constant],
  components: {
    Multiselect,
    Datepicker
  },
  data() {
    return {
      permissions: "booking.update",
      booking: null,
      checkout_hour: null,
      checkin_hour: null,
      disabledCheckout: {
        to: ""
      },
      disabledCheckin: {
        to: new Date()
      },
      format: "yyyy-MM-dd",
      room: null,
      list: [
        {
          name: null,
          value: null
        }
      ],
      old_booking: false,
      booking_for_other: false,
      city: {
        id: ""
      },
      district: {
        id: ""
      },
    };
  },
  watch: {
    booking: {
      handler(val) {
        this.disabledCheckout.to = val.checkin;
        // this.booking.birthday = val.birthday.toISOString().substr(0, 10);
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
    }
  },
  methods: {
    async getBooking() {
      try {
        const response = await axios.get(
          `bookings/${this.$route.params.bookingId}`,
          {
            params: {
              include: "booking_status.user,room.details"
            }
          }
        );
        this.booking = response.data.data;
        // console.log(response.data.data)
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async onSubmit() {
      const result = this.$validator.validateAll();
      if (result) {
        let response = await axios
          .put(`bookings/${this.booking.id}`, {
            name: this.booking.name,
            phone: this.booking.phone,
            sex: this.booking.sex,
            birthday: this.birthday.toISOString().substr(0, 10),
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
            checkin: this.booking.checkin,
            checkout: this.booking.checkout,
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
            room_id: this.booking.room_id
          })
          .then(response => {
            this.$swal("Thành công", "Cập nhật booking thành công", "success");
          });
      } else {
        return window.scroll({
          top: 80,
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
  computed: {
    filteredDistrict() {
      let self = this;
      return this.districts.filter(function(item) {
        return item.city_id == self.city.id;
      });
    },
    birthday() {
      if (this.booking != null) {
        return new Date(this.booking.birthday);
      }
    },
    source: {
      get: function() {
        return {
          value: this.booking.source,
          title: this.booking.source_txt
        };
      },
      set: function(val) {
        this.booking.source = val.value;
        this.booking.source_txt = val.title;
        return {
          value: val.value,
          title: val.title
        };
      }
    },
    payment_method: {
      get: function() {
        return {
          value: this.booking.payment_method,
          title: this.booking.payment_method_txt
        };
      },
      set: function(val) {
        this.booking.payment_method = val.value;
        this.booking.payment_method_txt = val.title;
        return {
          value: val.value,
          title: val.title
        };
      }
    },
    payment_status: {
      get: function() {
        return {
          value: this.booking.payment_status,
          title: this.booking.payment_status_txt
        };
      },
      set: function(val) {
        this.booking.payment_status = val.value;
        this.booking.payment_status_txt = val.title;
        return {
          value: val.value,
          title: val.title
        };
      }
    },
    status: {
      get: function() {
        return {
          value: this.booking.status,
          title: this.booking.status_txt
        };
      },
      set: function(val) {
        this.booking.status = val.value;
        this.booking.status_txt = val.title;
        return {
          value: val.value,
          title: val.title
        };
      }
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403"); // push về page 403
          } else {
            this.getBooking();
          }
        });
      }
    });
  }
};
</script>

<style>
</style>
