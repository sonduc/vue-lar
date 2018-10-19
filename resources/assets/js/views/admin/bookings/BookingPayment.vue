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
      <h3 class="mail-subject">Lịch sử thanh toán</h3>
        <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-xl-12">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ghi chú</th>
                        <th>Đã thanh toán</th>
                        <th>Khách còn nợ</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(detail,index) in bookingPayment" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{detail.note}}</td>
                        <td><span class="label label-success">{{detail.total_received | formatNumber}}</span></td>
                        <td>{{detail.total_debt | formatNumber}}</td>
                        <td>{{detail.status_txt}}</td>
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
    },
    bookingPayment: {
      required: true,
      default: null
    },
  },
  data() {
    return {};
  },
  methods: {
    closeModal() {
      if (this.isVisible) {
        this.$emit("closePaymentModal");
      }
    },
  },
  created(){
  },
  mounted() {
  },
};
</script>

<style>

</style>

