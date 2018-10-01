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
      <h3 class="mail-subject">Booking information</h3>
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-sm-6">
              <div class="card">
                <div class="card-header">
                  <div class="caption">
                    <h5><b>{{booking.room.data.details.data[0].name}}</b></h5>
                    <p>{{booking.room.data.details.data[0].address}}</p>
                  </div>
                  <div class="actions">
                    <button class="btn btn-primary btn-sm">
                      <i class="icon-fa icon-fa-plus" /> Add New
                    </button>
                    <button class="btn btn-danger btn-sm">
                      <i class="icon-fa icon-fa-trash" /> Delete
                    </button>
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
                              <p>#{{booking.code}}</p>
                            </div>
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
                        <td class="cell-content">
                          <div class="content">
                            <div class="content-subject">
                              <p>Thông tin thanh toán</p>
                            </div>
                          </div>
                        </td>
                        <td class="cell-content">
                          <div class="content">
                            <div class="content-subject">
                                
                              <p> <i class="icon-fa icon-fa-file" style="color: green"></i> {{booking.payment_status_txt}}</p>
                            </div>
                            <hr/>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
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
  }
};
</script>
