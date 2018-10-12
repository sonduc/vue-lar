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
            <form @submit.prevent="submitUpdate">
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
                  <input disabled type="text" value="Tên staff tạo booking" class="form-control">
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
                  <div class="form-group col-md-6">
                      <label>Ngày sinh</label>
                      <datepicker v-model="booking.birthday" :format="format" input-class="form-control" />
                  </div>
                  <div class="form-group col-md-6">
                      <label :style="errors.has('booking_source') ? 'color:red;' : ''">{{errors.has('booking_source') ? errors.first('booking_source') : 'Kênh liên hệ *'}}</label>
                      <multiselect :allow-empty="false" name="booking_source" v-model="booking.source" v-validate="'required'" data-vv-as="Kênh liên hệ" label="title" :options="sourceList" :searchable="true" :show-labels="false" />
                  </div>
              </div>
              <div class="form-row">
                  <div class="form-group col-md-6">
                      <label>Tỉnh thành</label>
                      <multiselect id="inputUserName" v-model="city" label="name" :options="cities" :searchable="true" :show-labels="false" />
                  </div>
                  <div class="form-group col-md-6">
                      <label>Quận/Huyện</label>
                      <multiselect :disabled="city.id == ''" id="inputUserName" v-model="district" label="name" :options="filteredDistrict" :searchable="true" :show-labels="false" />
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
import { format, location } from "../../../helpers/mixins";
import Auth from "../../../services/auth";
import Multiselect from "vue-multiselect";
import Datepicker from "vuejs-datepicker";
export default {
  mixins: [format, location],
  components: {
    Multiselect,
    Datepicker
  },
  data() {
    return {
      permissions: "booking.update",
      booking: null,
      paymentStatusList: [
        {
          value: 3,
          title: "Đã thanh toán"
        },
        {
          value: 0,
          title: "Chưa thanh toán"
        }
      ],
      paymentMethodList: [
        {
          value: 1,
          title: "Tiền mặt"
        },
        {
          value: 2,
          title: "Chuyển khoản"
        },
        {
          value: 3,
          title: "Bảo kim"
        },
        {
          value: 4,
          title: "Internet Banking"
        },
        {
          value: 5,
          title: "Thẻ Visa/MasterCard"
        }
      ],
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
      source: null,
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
      permission: "booking.edit"
    };
  },
  methods: {
    async getBooking() {
      try {
        const response = await axios.get(
          `bookings/${this.$route.params.bookingId}`,
          {
            params: {
              include: "room.details"
            }
          }
        );
        this.booking = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    submitUpdate(){
      console.log(this.booking)
    }
  },
  computed: {
    filteredDistrict() {
      let self = this;
      return this.districts.filter(function(item) {
        return item.city_id == self.city.id;
      });
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403"); // push về page 403
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
