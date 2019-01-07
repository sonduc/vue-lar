<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Danh sách chương trình khuyến mãi</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item active">Danh sách chương trình khuyến mãi</li>
      </ol>
      <div class="page-actions">
        <router-link :to="{ name: 'promotion.create'}">
          <a style="color:white" class="btn btn-primary">
            <i class="icon-fa icon-fa-plus"/> Thêm mới
          </a>
        </router-link>
      </div>
    </div>
    <div class="mailbox">
      <div class="card">
        <div class="card-header">
          <h6>Bộ lọc</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group row">
                <label for="firstName" class="col-sm-4 col-form-label">Mã giảm giá</label>
                <div class="col-sm-8">
                  <input
                    v-model="name"
                    id="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Nhập tên..."
                  >
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group row">
                <label for="email" class="col-sm-4 col-form-label">Trạng thái</label>
                <div class="col-sm-8">
                  <multiselect
                    v-model="status"
                    label="value"
                    :options="coupon_status"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
            </div>
          </div>
          <button @click="applyFilter(1)" class="btn btn-success btn-sm">Áp dụng</button>
          <button @click="resetFilter(1)" class="btn btn-info btn-sm">Làm mới</button>
        </div>
      </div>

      <sweet-modal style="z-index:1" width="60%" ref="showListCoupon" overlay-theme="dark">
        <button @click="openCreateCoupon()" type="button" class="btn btn-sm btn-icon btn-success">
          <i class="icon-fa icon-fa-plus"/>Thêm coupon
        </button>
      </sweet-modal>

      <div class="mailbox-content">
        <lottie v-if="loading" :options="defaultOptions" :height="150" :width="150"></lottie>
        <table v-else class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Thời gian áp dụng</th>
              <th>Mức giảm</th>
              <th>Giảm tối đa</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(coupon,index) in coupons" :key="index" :class="{'read' : coupon.status }">
              <td width="10%">{{index+1}}</td>
              <td class="cell-content" width="10%">
                <div class="content">
                  <div class="content-name">{{ coupon.code }}</div>
                </div>
              </td>
              <td width="20%">
                <div class="content-subject">
                  <div>Từ ngày: {{ (coupon.promotion_id == null ? coupon.settings.date_start : coupon.promotion.data.date_start) | formatDate }}</div>
                  <div>Đến ngày: {{ (coupon.promotion_id == null ? coupon.settings.date_end : coupon.promotion.data.date_end) | formatDate }}</div>
                </div>
              </td>
              <td class="cell-content" width="10%">
                <div class="content">
                  <div class="content-name">{{ coupon.discount }}%</div>
                </div>
              </td>
              <td class="cell-content" width="10%">
                <div class="content">
                  <div class="content-name">{{ coupon.max_discount | formatNumber }}</div>
                </div>
              </td>
              <td class="cell-content" width="10%">
                <div class="content">
                  <button
                    v-if="coupon.status == 0"
                    type="button"
                    class="btn btn-sm btn-danger mailbox-action"
                  >Ngừng hoạt động</button>
                  <button
                    v-if="coupon.status == 1"
                    type="button"
                    class="btn btn-sm btn-success mailbox-action"
                  >Đang hoạt động</button>
                </div>
              </td>
              <td class="cell-content" width="10%">
                <div class="btn-group" role="group" aria-label="First group">
                  <button class="btn btn-sm btn-primary mailbox-action">
                    <i class="icon-fa icon-fa-pencil"/> Chi tiết
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { SweetModal } from "sweet-modal-vue";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import Auth from "../../../services/auth";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
import Pagination from "../../../components/paginate/ServerPagination";
import { format } from "../../../helpers/mixins";
export default {
  mixins: [format],
  components: {
    Pagination,
    Multiselect,
    Datepicker,
    SweetModal,
    Lottie
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData
      },
      coupons: [],
      coupon_status: [],
      listCoupon: null,
      currentProId: 1,
      currentPromotion: new Object(),
      status: {
        id: null
      },
      name: "",
      totalPages: null,
      currentPage: null,
      count: null,
      loading: true
    };
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getCoupons({});
            this.getPromotionStatus();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    ...mapActions(["changeProId", "changeProDay"]),

    async getCoupons({ page, filter, sort }) {
      try {
        const response = await axios.get(`coupons`, {
          params: {
            include: "promotion",
            page: page,
            limit: 10,
            q: this.name,
            status: this.status.id
          }
        });
        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.coupons = response.data.data;
        this.loading = false;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getPromotionStatus() {
      try {
        const response = await axios.get(`promotions/status-list`);
        this.coupon_status = response.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async updateStatus(status, promotion) {
      this.$swal({
        title: "Bạn có muốn thay đổi trạng thái chương trình khuyến mãi không",
        type: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Quay lại",
        showCloseButton: true
      }).then(result => {
        if (result.value) {
          if (status == 1) {
            let response = axios
              .put(`promotions/single-update/${promotion.id}?option=status`, {
                status: 0
              })
              .then(result => {
                if (result) {
                  this.reloadData(this.currentPage);
                  this.$swal(
                    "Success!",
                    "Trạng thái đã được thay đổi",
                    "success"
                  );
                } else {
                  this.$swal(
                    "Xin lỗi",
                    "Trạng thái chưa được thay đổi",
                    "error"
                  );
                }
              });
          } else {
            let response = axios
              .put(`promotions/single-update/${promotion.id}?option=status`, {
                status: 1
              })
              .then(result => {
                if (result) {
                  this.reloadData(this.currentPage);
                  this.$swal(
                    "Success!",
                    "Trạng thái đã được thay đổi",
                    "success"
                  );
                } else {
                  this.$swal(
                    "Xin lỗi",
                    "Trạng thái chưa được thay đổi",
                    "error"
                  );
                }
              });
          }
        }
      });
    },
    updateStatusDueDate(status, promotion) {
      if (status == 1) {
        let response = axios
          .put(`promotions/single-update/${promotion.id}?option=status`, {
            status: 0
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
            }
          });
      }
    },

    openCreateCoupon() {
      this.$router.push({
        name: "coupon.create"
      });
    },

    applyFilter(page) {
      this.getCoupons({
        page
      });
    },
    resetFilter(page) {
      this.name = "";
      this.status = {
        id: null
      };
      this.month = {
        id: null
      };
      this.year = {
        value: null
      };
      this.getCoupons({
        page
      });
    },
    checkDueDate(date, promotion) {
      let current = new Date();
      let currentDate = current.toISOString().substring(0, 10);
      let Time1 = this.convertDateToMiliSecond(currentDate);

      let end_Date = date.substring(0, 10);
      let Time2 = this.convertDateToMiliSecond(end_Date);
      if (Time1 >= Time2) {
        this.updateStatusDueDate(promotion.status, promotion);
        return true;
      }
    },
    convertDateToMiliSecond(date) {
      let d = new Date(date);
      let time = d.getTime();
      return time;
    },
    reloadData(page) {
      this.getCoupons({
        page
      });
    },
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    }
  }
};
</script>
