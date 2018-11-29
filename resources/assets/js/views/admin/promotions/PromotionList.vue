<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Danh sách chương trình khuyến mãi</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
        <li class="breadcrumb-item active">Danh sách chương trình khuyến mãi</li>
      </ol>
      <div class="page-actions">
        <router-link :to="{ name: 'promotion.create'}">
          <a style="color:white" class="btn btn-primary">
            <i class="icon-fa icon-fa-plus" /> Thêm mới
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
                <label for="firstName" class="col-sm-4 col-form-label">
                  Tên chương trình khuyến mãi</label>
                <div class="col-sm-8">
                  <input v-model="name" id="firstName" type="text" class="form-control" placeholder="Nhập tên...">
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-form-label">Trạng thái</label>
                <div class="col-sm-3">
                  <multiselect  v-model="status" label="value" :options="promotion_status"
                    :searchable="true" :show-labels="false" />
                </div>
                <label for="firtName" class="col-sm-2 col-form-label">Tháng</label>
                <div class="col-sm-2">
                  <multiselect v-model="month" label="value" :options="monthsData"
                    :searchable="true" :show-labels="false" />
                </div>
                <label for="lastName" class="col-sm-1 col-form-label">Năm</label>
                <div class="col-sm-2">
                  <multiselect v-model="year" label="value" :options="yearsData"
                    :searchable="true" :show-labels="false" />
                </div>
              </div>
            </div>
          </div>
          <button @click="applyFilter(1)" class="btn btn-success btn-sm">Áp dụng</button>
          <button @click="resetFilter(1)" class="btn btn-info btn-sm">Làm mới</button>
        </div>
      </div>

      <sweet-modal style="z-index:1" width="60%" ref="showListCoupon" overlay-theme="dark">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã code</th>
              <th>Discount</th>
              <th>Giảm tối đa</th>
              <th>Số lần đã sử dụng</th>
              <th>Áp dụng cho</th>
              <th>Thời gian áp dụng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(coupon, index) in listCoupon" :key="index">
              <td>{{index + 1}}</td>
              <td>{{coupon.code}}</td>
              <td>{{coupon.discount}} %</td>
              <td>{{coupon.max_discount | formatNumber}}</td>
              <td>{{coupon.used}}/{{coupon.usable}}</td>
              <td v-if="coupon.all_day == 0">
                <p>{{coupon.settings.rooms.length}} phòng/căn hộ</p>
                <p>{{coupon.settings.cities.length}} tỉnh/thành phố</p>
                <p>{{coupon.settings.districts.length}} quận/huyện</p>
              </td>
              <td v-else>
                <p>Tất cả phòng/căn hộ</p>
              </td>
              <td>
                <p v-for="d in coupon.settings.days">{{d}}</p>
              </td>
              <td>
                <div class="btn-group" role="group" aria-label="First group">
                  <button @click="openUpdateCoupon(coupon.id)"
                    :disabled="Object.keys(currentPromotion).length === 0
                      && currentPromotion.constructor === Object ?
                      false : checkDueDate(currentPromotion.date_end)"
                    v-tooltip.top-center="'Cập nhật discount'" type="button"
                    class="btn btn-sm btn-icon btn-outline-primary">
                    <i class="icon-fa icon-fa-pencil" /> Chỉnh sửa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="openCreateCoupon()" type="button"
          :disabled="Object.keys(currentPromotion).length === 0
            && currentPromotion.constructor === Object ?
            false : checkDueDate(currentPromotion.date_end)"
          class="btn btn-sm btn-icon btn-success">
          <i class="icon-fa icon-fa-plus" />Thêm coupon
        </button>
      </sweet-modal>

      <div class="mailbox-content">
        <lottie v-if="loading" :options="defaultOptions" :height="150" :width="150"></lottie>
        <table v-else class="table">
          <thead >
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Thời gian áp dụng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(promotion,index) in promotions" :key="index"
              :class="{'read' : promotion.status }">
              <td>{{index+1}}</td>
              <td class="cell-content">
                <div class="content">
                  <div class="content-name">
                    {{ promotion.name }}
                  </div>
                </div>
              </td>
              <td width="20%">
                <div class="content-subject">
                  <div>Từ ngày: {{ promotion.date_start | formatDate }}</div>
                  <div>Đến ngày: {{ promotion.date_end | formatDate }}</div>
                </div>
              </td>
              <td width="10%">
                <div>
                  <button v-if="checkDueDate(promotion.date_end,promotion)"
                    disabled="true" type="button"
                    class="btn btn-sm btn-icon btn-secondary pl-3 pr-4" >Hết hạn
                  </button>
                  <button v-else-if="promotion.status == 1" type="button"
                    @click="updateStatus(1,promotion)"
                    v-tooltip.top-center="'Click để thay đổi trạng thái'"
                    class="btn btn-sm btn-icon btn-success">Đang chạy
                  </button>
                  <button v-else type="button" @click="updateStatus(0,promotion)"
                    v-tooltip.top-center="'Click để thay đổi trạng thái'"
                    class="btn btn-sm btn-icon btn-danger" >Tạm dừng
                  </button>
                </div>
              </td>
              <td width="10%">
                <div class="btn-group" role="group" aria-label="First group">
                  <button @click="openListCoupon(promotion)" type="button"
                    v-tooltip.top-center="'Danh sách coupon'"
                    class="btn btn-sm btn-icon btn-outline-primary">
                    <i class="icon-fa icon-fa-tag" />coupon
                  </button>
                  <button @click="openUpdatePromotion(promotion.id)" type="button"
                    v-tooltip.top-center="'Cập nhật khuyến mãi'"
                    class="btn btn-sm btn-icon btn-outline-primary">
                    <i class="icon-fa icon-fa-pencil" />
                  </button>
                  <button @click="openDetailPromotion(promotion.id)" type="button"
                    v-tooltip.top-center="'Chi tiết khuyến mãi'"
                    class="btn btn-sm btn-icon btn-outline-primary">
                    <i class="icon-fa icon-fa-share" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { SweetModal } from "sweet-modal-vue";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import Auth from "../../../services/auth";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
import Pagination from "../../../components/paginate/ServerPagination";
import { monthsList, yearsList, format } from "../../../helpers/mixins";
export default {
  mixins: [monthsList, yearsList, format],
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
      promotions: [],
      promotion_status: [],
      listCoupon: null,
      currentProId: 1,
      currentPromotion:new Object(),
      status: {
        id: null
      },
      month: {
        id: null,
      },
      year: {
        value: null,
      },
      name: '',
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
            this.getPromotions({});
            this.getPromotionStatus();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    ...mapActions(['changeProId','changeProDay']),

    async getPromotions({ page, filter, sort }) {
      try {
        const response = await axios.get(`promotions`, {
          params: {
            include: "coupons",
            page: page,
            limit: 6,
            q: this.name,
            status: this.status.id,
            month: this.month.id,
            year: this.year.value
          }
        });
        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.promotions = response.data.data;
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
        this.promotion_status = response.data;
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
        showCloseButton: true,
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
                  this.$swal("Success!", "Trạng thái đã được thay đổi", "success");
                } else {
                  this.$swal(
                    "Xin lỗi", "Trạng thái chưa được thay đổi",
                    "error");
                }
              });
          } else {
            let response = axios
              .put(`promotions/single-update/${promotion.id}?option=status`, {
                status:1
              })
              .then(result => {
                if (result) {
                  this.reloadData(this.currentPage);
                  this.$swal("Success!", "Trạng thái đã được thay đổi", "success");
                } else {
                  this.$swal(
                    "Xin lỗi", "Trạng thái chưa được thay đổi",
                    "error");
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
    openListCoupon(promotion) {
      this.listCoupon = promotion.coupons.data;
      this.currentProId = promotion.id;
      this.currentPromotion = promotion;
      this.changeProId(promotion.id);
      let day = {
        startDay: promotion.date_start,
        endDay: promotion.date_end
      };
      this.changeProDay(day);
      this.$refs.showListCoupon.open();
    },
    openUpdatePromotion(id) {
      this.$router.push({
        name: "promotion.update",
        params: {
          promotionId: id
        }
      });
    },
    openDetailPromotion(id) {
      this.$router.push({
        name: "promotion.detail",
        params: {
          promotionId: id
        }
      });
    },
    openCreateCoupon() {
      this.$refs.showListCoupon.close();
      this.$router.push({
        name: "coupon.create",
      });
    },
    openUpdateCoupon(id) {
      this.$refs.showListCoupon.close();
      this.$router.push({
        name: "coupon.update",
        params: {
          couponId: id
        }
      });
    },
    applyFilter(page) {
      this.getPromotions({
        page
      });
    },
    resetFilter(page) {
      this.name = '';
      this.status = {
        id: null
      };
      this.month = {
        id: null
      };
      this.year = {
        value: null
      };
      this.getPromotions({
        page
      });
    },
    checkDueDate(date,promotion) {
      let current = new Date();
      let currentDate = current.toISOString().substring(0, 10);
      let Time1 = this.convertDateToMiliSecond(currentDate);

      let end_Date = date.substring(0,10);
      let Time2 = this.convertDateToMiliSecond(end_Date);
      if(Time1 >= Time2) {
        this.updateStatusDueDate(promotion.status,promotion)
        return true;
      }
    },
    convertDateToMiliSecond(date) {
      let d = new Date(date);
      let time = d.getTime();
      return time;
    },
    reloadData(page) {
      this.getPromotions({
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
    },
  }
};
</script>
