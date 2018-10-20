<template>
  <div v-if="!(Object.keys(booking).length === 0 && booking.constructor === Object)" class="mailbox-modal">
    <div class="mail-header">
      <div class="mail-actions">
        <ul class="mail-action-list">
          <li class="action" @click="closeModal">
            <a v-tooltip.top-center="'Go Back'" href="#">
              <i class="icon-fa icon-fa-arrow-left" />
            </a>
          </li>
          <li class="action">
            <a v-tooltip.top-center="'Report'" href="#">
              <i class="icon-fa icon-fa-exclamation" />
            </a>
          </li>
          <li class="action">
            <a v-tooltip.top-center="'Trash'" href="#">
              <i class="icon-fa icon-fa-trash" />
            </a>
          </li>
          <li class="action">
            <a v-tooltip.top-center="'Forward'" href="#">
              <i class="icon-fa icon-fa-envelope-open icon-fa-fw" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="mail-body">
      <h4 class="mail-subject">Chi Tiết Booking</h4>

      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-header">
              <div class="caption">
                <h5><b>{{booking.room.data.details.data[0].name}}</b></h5>
                <p>{{booking.room.data.details.data[0].address}}</p>
              </div>
              <div class="actions">
                <router-link :to="'/admin/bookings/update/'+booking.id" class="btn btn-primary btn-sm">
                  <i class="icon-fa icon-fa-pencil" /> Sửa booking
                </router-link>
              </div>
            </div>
            <div class="card-body">
              <table class="table table-hover">
                <tbody>
                  <tr>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>Mã đặt phòng</p>
                        </div>
                      </div>
                    </td>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <button disabled type="button" class="btn btn-sm btn-outline-secondary">
                            #{{booking.code}}
                          </button>
                        </div>
                        <hr />
                        <div class="content-subject">
                          <p>{{booking.status_txt}}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>Thông tin người nhận</p>
                        </div>
                      </div>
                    </td>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>{{booking.name_received}}</p>
                        </div>
                        <div class="content-subject">
                          <p>{{booking.email_received}}</p>
                        </div>
                        <div class="content-subject">
                          <p>{{booking.phone_received}}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>Thông tin người đặt</p>
                        </div>
                      </div>
                    </td>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>{{booking.name}}</p>
                        </div>
                        <div class="content-subject">
                          <p>{{booking.email}}</p>
                        </div>
                        <div class="content-subject">
                          <p>{{booking.phone}}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>Nhận phòng</p>
                        </div>
                      </div>
                      <div class="content">
                        <div class="content-subject">
                          <p>Trả phòng</p>
                        </div>
                      </div>
                    </td>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>{{booking.checkin}}</p>
                        </div>
                      </div>
                      <div class="content">
                        <div class="content-subject">
                          <p>{{booking.checkout}}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-header">
              <div class="caption">
                <h5><b>Thông tin thanh toán</b></h5>
                <p>#{{booking.code}}</p>
              </div>
              <div class="actions">
                <button class="btn btn-primary btn-sm">
                  <i class="icon-fa icon-fa-plus" /> Send Invoice
                </button>
              </div>
            </div>
            <div class="card-body">
              <table class="table table-hover">
                <tbody>
                  <tr>
                    <td width="20%" class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>Trạng thái thanh toán</p>
                          <p></p>
                        </div>
                      </div>
                    </td>
                    <td class="cell-content">
                    </td>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p style="color: green" v-if="booking.payment_status == 3"> <i class="icon-fa icon-fa-check-circle"
                              style="color: green"></i> {{booking.payment_status_txt}}</p>
                          <p style="color: red" v-if="booking.payment_status == 1"> <i class="icon-fa icon-fa-times-circle"
                              style="color: red"></i> {{booking.payment_status_txt}}</p>
                        </div>
                        <hr />
                        <div class="content-subject">
                          <p>{{booking.payment_method_txt}}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td width="20%" class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>Thông tin thanh toán</p>
                        </div>
                      </div>
                    </td>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>Giá phòng</p>
                        </div>
                        <div class="content-subject">
                          <p>Giảm giá</p>
                        </div>
                        <div class="content-subject">
                          <p>Tổng tiền</p>
                        </div>
                      </div>
                    </td>
                    <td class="cell-content">
                      <div class="content">
                        <div class="content-subject">
                          <p>{{booking.price_original | formatNumber}}</p>
                        </div>
                        <div class="content-subject">
                          <p>{{booking.price_discount | formatNumber}}</p>
                        </div>
                        <div class="content-subject">
                          <p>{{booking.booking_fee | formatNumber}}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { format } from "../../../helpers/mixins";
export default {
  mixins: [format],
  props: {
    isVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    booking: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    closeModal() {
      if (this.isVisible) {
        this.$emit("close");
      }
    }
  },
  created() {
    console.log(this.booking);
  }
};
</script>
