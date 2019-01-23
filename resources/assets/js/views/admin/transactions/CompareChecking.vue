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
              <!-- <div class="form-group row" v-if="rent_type.id == 2 || rent_type.id == 3"> -->
              <div class="form-group row">
                <label for="lastName" class="col-sm-1 col-md-2 col-form-label">Từ</label>
                <div class="col-sm-5 col-md-4">
                  <datepicker v-model="date_start" :format="format" input-class="form-control"/>
                </div>
                <label for="lastName" class="col-sm-1 col-md-2 col-form-label">Đến</label>
                <div class="col-sm-5 col-md-4">
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
            <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12"></div>
          </div>
          <button @click="applyFilter(1)" class="btn btn-success btn-sm">Áp dụng</button>
          <button @click="resetFilter(1)" class="btn btn-info btn-sm">Làm mới</button>
        </div>
      </div>
      <!-- <div class="mailbox-content"> -->
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h6>Tất cả giao dịch</h6>
            </div>
            <div class="card-body">
              <table-component v-if="data_test !== null" :data="data_test" table-class="table">
                <table-column show="id" label="Mã giao dịch"/>
                <table-column show="date" label="Ngày đối soát"/>
                <table-column show="total_debit" :formatter="formatter" label="Tổng Debit"/>
                <table-column show="total_credit" :formatter="formatter" label="Tổng Credit"/>
                <table-column show="total_bonus" :formatter="formatter" label="Tổng thưởng"/>
                <table-column
                  show="total_compare_checking"
                  :formatter="formatter"
                  label="Tổng đối soát"
                />
                <table-column show="user.data.name" label="Chủ nhà"/>
                <table-column label="Trạng thái">
                  <template slot-scope="row">
                    <button
                      @click="updateCompareCheckingStatus('status',row)"
                      :class="row.status == 0 ? 'btn btn-danger btn-sm' : 'btn btn-success btn-sm'"
                    >{{row.status_txt}}</button>
                  </template>
                </table-column>
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
        <!-- </div> -->
      </div>
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
      date_start: null,
      date_end: null,
      date: null,
      merchants: [],
      data_test: null,
      merchant: {
        id: ""
      },
      disabledCheckout: {
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
    async getCompareChecking({ page, filter, sort }) {
      try {
        const response = await axios.get(`compare-checking`, {
          params: {
            include: "user",
            page: page,
            merchant: this.merchant.id,
            date_start: this.date_start,
            date_end: this.date_end
          }
        });
        let paginate = response.data.meta.pagination;
        this.data_test = response.data.data;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
      } catch (error) {
        if (error) {
          // console.log(error);
          window.toastr["error"](
            "Không thể lấy được dữ liệu đối soát",
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

    formatter(value, rowProperties) {
      return numeral(value).format("0,0");
    },
    applyFilter(page) {
      this.getCompareChecking({
        page
      });
    },
    resetFilter(page) {
      this.q = "";
      this.date_start = null;
      this.date_end = null;
      this.merchant = {
        id: ""
      };
      this.getCompareChecking({
        page
      });
    },
    async updateCompareCheckingStatus(option = "status", compare_checking) {
      // console.log(compare_checking);
      let response = await axios
        .put(
          `compare-checking/prop-update/${
            compare_checking.id
          }?option=${option}`,
          {
            status: compare_checking.status == 1 ? 0 : 1
          }
        )
        .then(result => {
          if (result) {
            this.getCompareChecking({});
            window.toastr["success"](
              "Đã thay đổi trạng thái đối soát",
              "Success"
            );
          } else {
            window.toastr["error"]("Something wrong!", "Error");
          }
        });
    },
    reloadData(page) {
      this.getCompareChecking({
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
            this.getCompareChecking({});
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
