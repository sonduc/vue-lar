<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Danh sách giao dịch</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Giao dịch</a>
        </li>
        <li class="breadcrumb-item active">List</li>
      </ol>
    </div>

    <div class="mailbox">
      <div class="card">
        <div class="card-header">
          <h6>Bộ lọc</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
              <div class="form-group row">
                <label for="firstName" class="col-sm-2 col-md-3 col-form-label">Tên chủ nhà</label>
                <div class="col-sm-10 col-md-9">
                  <input
                    v-model="q"
                    id="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Nhập vào tên chủ nhà"
                  >
                </div>
              </div>
            </div>

            <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
              <!-- <div class="form-group row" v-if="rent_type.id == 2 || rent_type.id == 3"> -->
              <div class="form-group row">
                <label for="lastName" class="col-sm-3 col-md-3 col-form-label">Tạo từ</label>
                <div class="col-sm-3 col-md-3">
                  <datepicker v-model="date_start" :format="format" input-class="form-control"/>
                </div>
                <label for="lastName" class="col-sm-1 col-md-1 col-form-label">Đến</label>
                <div class="col-sm-3 col-md-3">
                  <datepicker
                    :disabled-dates="disabledCheckout"
                    v-model="date_end"
                    :format="format"
                    input-class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-md-3 col-form-label">Loại giao dịch</label>
                <div class="col-sm-10 col-md-9">
                  <multiselect
                    v-model="transaction_type"
                    label="value"
                    :options="transaction_types"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-md-3 col-form-label">Chủ nhà</label>
                <div class="col-sm-10 col-md-9">
                  <multiselect
                    v-model="merchant"
                    label="name"
                    :options="merchants"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
              <div class="form-group row">
                <label for="email" class="col-sm-3 col-md-3 col-form-label">Phòng</label>
                <div class="col-sm-7 col-md-7">
                  <multiselect
                    v-model="room"
                    label="name"
                    :options="rooms"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="lastName" class="col-sm-3 col-md-3 col-form-label">Đối soát từ</label>
                <div class="col-sm-3 col-md-3">
                  <datepicker
                    v-model="date_checking_start"
                    :format="format"
                    input-class="form-control"
                  />
                </div>
                <label for="lastName" class="col-sm-1 col-md-1 col-form-label">Đến</label>
                <div class="col-sm-3 col-md-3">
                  <datepicker
                    :disabled-dates="disabledCheckoutDateChecking"
                    v-model="date_checking_end"
                    :format="format"
                    input-class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          <button @click="applyFilter(1)" class="btn btn-success btn-sm">Áp dụng</button>
          <button @click="resetFilter(1)" class="btn btn-info btn-sm">Làm mới</button>
          <hr>
          <h6>Tạo đối soát</h6>
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
              <div class="form-group row">
                <label for="email" class="col-sm-3 col-md-3 col-form-label">Chủ nhà</label>
                <div class="col-sm-9 col-md-9">
                  <multiselect
                    v-model="merchant_compare_checking"
                    label="name"
                    :options="merchants"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
              <div class="form-group row">
                <label for="lastName" class="col-sm-3 col-md-3 col-form-label">Ngày đối soát</label>
                <div class="col-sm-4 col-md-4">
                  <datepicker v-model="date" :format="format" input-class="form-control"/>
                </div>
                <button
                  class="btn btn-danger btn-sm col-sm-5 col-md-5"
                  @click="createCompareChecking"
                >Tạo đối soát</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="mailbox-content"> -->
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h6>Tất cả giao dịch</h6>
              <!-- <div class="card-actions"></div> -->
              <div class="card-body">
                <table-component
                  v-if="data_transactions !== null"
                  :data="data_transactions"
                  table-class="table"
                >
                  <table-column show="transaction_id" label="Mã giao dịch"/>
                  <table-column show="type_txt" label="Loại giao dịch"/>
                  <table-column label="Mã đặt phòng">
                    <template slot-scope="row">
                      <button
                        v-if="row.booking.data.length !== 0"
                        class="btn btn-xs btn-outline-primary"
                      >{{row.booking.data.code}}</button>
                    </template>
                  </table-column>
                  <table-column show="debit" :formatter="formatter" label="debit"/>
                  <table-column show="credit" :formatter="formatter" label="credit"/>
                  <table-column show="bonus" :formatter="formatter" label="bonus"/>
                  <table-column show="comission" label="Comission"/>
                  <table-column show="user.data.name" label="Chủ nhà"/>
                  <table-column label="Trạng thái">
                    <template slot-scope="row">
                      <button
                        :class="row.status == 0 ? 'btn btn-danger btn-sm' : 'btn btn-success btn-sm'"
                      >{{row.status_txt}}</button>
                    </template>
                  </table-column>
                  <table-column show="date" label="Ngày đối soát"/>
                  <table-column show="created_at" label="Thời gian tạo"/>
                </table-component>
              </div>
              <div class="card-footer">
                <pagination
                  @clicked="reloadData"
                  :total-pages="totalPages"
                  :current-page="currentPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
    <!-- All Modal Here -->
  </div>
</template>

<script type="text/babel">
import { TableComponent, TableColumn } from "vue-table-component";
import { SweetModal } from "sweet-modal-vue";
import Auth from "../../../services/auth";
import numeral from "numeral";
import Multiselect from "vue-multiselect";
import Datepicker from "vuejs-datepicker";
import Pagination from "../../../components/paginate/ServerPagination";

export default {
  components: {
    TableComponent,
    TableColumn,
    SweetModal,
    Datepicker,
    Multiselect,
    Pagination
  },
  data() {
    return {
      format: "yyyy-MM-dd",
      q: "",
      date_start: null,
      date_end: null,
      date_checking_start: null,
      date_checking_end: null,
      date: new Date(),
      rooms: [],
      transaction_types: [],
      merchants: [],
      data_transactions: null,
      merchant: {
        id: ""
      },
      merchant_compare_checking: {
        id: ""
      },
      room: {
        id: ""
      },
      transaction_type: {
        id: ""
      },
      disabledCheckout: {
        to: ""
      },
      disabledCheckoutDateChecking: {
        to: ""
      },
      totalPages: null,
      currentPage: null,
      count: null,
      permissions: "transaction.view"
    };
  },
  install(Vue, options) {
    Vue.component("SweetModal", SweetModal);
  },
  methods: {
    async getTransactions({ page, filter, sort }) {
      try {
        const response = await axios.get(`transactions`, {
          params: {
            include: "user,booking,room",
            page: page,
            date_start: this.date_start,
            date_end: this.date_end,
            checking_start: this.date_checking_start,
            checking_end: this.date_checking_end,
            property: this.room.id,
            merchant: this.merchant.id,
            type: this.transaction_type.id
          }
        });
        let paginate = response.data.meta.pagination;
        this.data_transactions = response.data.data;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        // console.log(this.data_transactions);
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Không thể lấy được dữ liệu giao dịch",
            "Error"
          );
        }
      }
    },
    async getTransactionTypes() {
      try {
        const response = await axios.get(`transaction-types`);

        this.transaction_types = response.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Không thể lấy được dữ liệu loại giao dịch",
            "Error"
          );
        }
      }
    },
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
          window.toastr["error"]("Không lấy được dữ liệu chủ nhà", "Error");
        }
      }
    },
    async getRooms() {
      try {
        const response = await axios.get(`rooms/get-name`);
        this.rooms = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("Không lấy được dữ liệu phòng", "Error");
        }
      }
    },
    formatter(value, rowProperties) {
      return numeral(value).format("0,0");
    },
    applyFilter(page) {
      this.getTransactions({
        page
      });
    },
    resetFilter(page) {
      this.q = "";
      this.date_start = null;
      this.date_end = null;
      this.getTransactions({
        page
      });
    },

    createCompareChecking() {
      if (this.merchant_compare_checking.name) {
        this.$swal({
          title: "Bạn chắc chắn muốn tạo đối soát?",
          text: `Chủ nhà: ${
            this.merchant_compare_checking.name
          } - ngày ${this.date.toISOString().substr(0, 10)}`,
          type: "warning",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "Tạo đối soát",
          cancelButtonText: "Quay lại",
          showCloseButton: false,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            let response = await axios
              .post(`transactions/combine-manual`, {
                user_id: this.merchant_compare_checking.id,
                date: this.date.toISOString().substr(0, 10)
              })
              .then(response => {
                console.log(response);
                this.$swal("Thành công", "Đã tạo đối soát", "success");
                // this.getTransactions({});
                this.reloadData(this.currentPage);
              })
              .catch(error => {
                let err = error.response.data.data.errors;
                err.forEach(element => {
                  window.toastr["error"](element, "Error");
                });
              });
          }
        });
      } else {
        this.$swal("Có lỗi", "Vui lòng chọn chủ nhà muốn đối soát", "error");
      }
    },
    reloadData(page) {
      this.getTransactions({
        page
      });
    }
  },
  watch: {
    date_start: {
      handler(val) {
        this.disabledCheckout.to = val;
      },
      deep: true
    },
    date_checking_start: {
      handler(val) {
        this.disabledCheckoutDateChecking.to = val;
      },
      deep: true
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getMerchants();
            this.getTransactionTypes();
            this.getRooms();
            this.getTransactions({});
          }
        });
      }
    });
  }
};
</script>
<style scoped>
.swal2-container {
  z-index: 10000;
}
.sweet-modal-overlay {
  z-index: 1000;
}
</style>
