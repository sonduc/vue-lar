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
            back-button-text="Quay lại" title="Tạo đặt phòng" :subtitle="room != null ? room.details.data[0].name : ''">
            <!-- <tab-content :before-change="validateBeforeNext" title="Thông tin khách hàng"> -->
            <tab-content title="Thông tin khách hàng">
              <section ref="step1">
                <div class="row" v-if="room !== null">
                  <div class="col-lg-2" v-if="room.rent_type == 1 || room.rent_type == 3  || room.rent_type == 0">
                    <div class="custom-control custom-radio">
                      <input id="customControlValidation3" value="1" v-model="booking.booking_type" type="radio" class="custom-control-input"
                        name="radio-stacked" required>
                      <label class="custom-control-label" for="customControlValidation3">
                        Đặt theo ngày
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-2" v-if="room.rent_type == 2 || room.rent_type == 3  || room.rent_type == 0">
                    <div class="custom-control custom-radio mb-3">
                      <input id="customControlValidation4" value="2" v-model="booking.booking_type" type="radio" class="custom-control-input"
                        name="radio-stacked" required>
                      <label class="custom-control-label" for="customControlValidation4">
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
                    <div class="form-group" v-if="booking.booking_type == 2">
                      <label :style="errors.has('checkin_hour') ? 'color:red;' : ''">{{errors.has('checkin_hour')
                        ? errors.first('checkin_hour') : 'Giờ nhận phòng *'}}</label>
                      <multiselect name="checkin_hour" v-model="checkin_hour" v-validate="booking.booking_type == 2 ? 'required' : ''" data-vv-as="Giờ nhận phòng" :options="hoursData" :searchable="true" :show-labels="false" />
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('name') ? 'color:red;' : ''">{{errors.has('name')
                        ? errors.first('name') : 'Họ và tên *'}}</label>
                      <input name="name" v-validate="'required'" data-vv-as="Họ và tên" autofocus type="text" v-model="booking.name"
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
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label :style="errors.has('checkout_date') ? 'color:red;' : ''">{{errors.has('checkout_date')
                        ? errors.first('checkout_date') : 'Ngày trả phòng *'}}</label>
                      <datepicker name="checkout_date" v-validate="booking.booking_type == 1 ? 'required' : ''"
                        :disabled="booking.booking_type == 2" data-vv-as="Ngày trả phòng" :format="format" v-model="booking.checkout"
                        :disabled-dates="disabledCheckout" input-class="form-control" />
                    </div>
                    <div class="form-group" v-if="booking.booking_type == 2">
                      <label :style="errors.has('checkout_hour') ? 'color:red;' : ''">{{errors.has('checkout_hour')
                        ? errors.first('checkout_hour') : 'Giờ trả phòng *'}}</label>
                      <multiselect name="checkout_hour" v-validate="booking.booking_type == 2 ? 'required' : ''"
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
                        ? errors.first('number_guest') : 'Khách *'}}</label>
                      <input name="number_guest" v-validate="'required|numeric'" data-vv-as="Khách" type="text" v-model="booking.number_of_guests"
                        class="form-control">
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
                        <label>Hình thức thanh toán</label>
                        <input type="email" class="form-control">
                      </div>
                      <div class="form-group">
                        <label>Số tiền thanh toán</label>
                        <input type="text" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-6">

                      <div class="form-group">
                        <label>Trạng thái thanh toán</label>
                        <multiselect v-model="booking.payment_status" value="value" label="title" :options="paymentStatusList" :searchable="true" :show-labels="false" />
                      </div>
                      <div class="form-group">
                        <label>Trạng thái thanh toán</label>
                        <input type="email" class="form-control">
                      </div>
                      <div class="form-group">
                        <label>Giảm giá</label>
                        <input type="password" class="form-control">
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
            <h6><i class="icon-fa icon-fa-warning"></i> Warning</h6>
          </div>
          <div class="card-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Alias enim excepturi exercitationem ipsum labore provident quam ut velit vero
              voluptatum!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import Auth from "../../../services/auth";
import { hoursList } from "../../../helpers/mixins";
import { Tabs, Tab } from "vue-tabs-component";
import Multiselect from "vue-multiselect";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import Datepicker from "vuejs-datepicker";
export default {
  mixins: [hoursList],
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
      checkout_hour: null,
      checkin_hour: null,
      booking: {
        checkin: null,
        checkout: null,
        booking_type: 1,
        payment_status: 3
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
    }
  },
  methods: {
    async getRoom() {
      try {
        const response = await axios.get(
          `http://ws-api.lc/api/rooms/${
            this.$route.params.roomId
          }?include=details`
        );
        return (this.room = response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async validateBeforeNext() {
      const result = await this.$validator.validateAll();
      if (result) {
        // eslint-disable-next-line
        return true;
      } else {
        return window.scroll({
          top: 80,
          behavior: "smooth"
        });
      }
    },
    async onSubmit() {
      const result = await this.$validator.validateAll();
      if (result) {
        console.log(result);
      } else {
        return window.scroll({
          top: 80,
          behavior: "smooth"
        });
      }
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403"); // push về page 403
          } else {
            this.getRoom(); //fetch data sau khi check permissions của người đang đăng nhập
          }
        });
      }
    });
  }
};
</script>

<style>
</style>
