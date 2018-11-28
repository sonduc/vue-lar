<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Chi tiết chương trình khuyến mãi</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'promotion.list'}">
            <a>Chương trình khuyến mãi</a>
          </router-link>
        </li>
        <li class="breadcrumb-item active"><a href="#">Chi tiết</a></li>
      </ol>
    </div>

    <div class="card" v-if="promotionDetail != null">
      <div class="card-body row">
        <div class="container">
          <div class="col-sm-12" >
              <div class="card">
                <div class="card-header">
                  <h3>{{promotionDetail.name}}</h3>
                </div>
                <div class="card-body">
                  <div class="col-sm-12">
                    <img height="250px" width="1000px"/>
                  </div>
                  <div class="col-sm-12" style="padding-top: 20px;">
                    <p style="font-size:20px;">Áp dụng từ  <span  class="custom-date">
                    {{promotionDetail.date_start.substring(0,10)}}</span>
                        đến  <span class="custom-date">
                       {{promotionDetail.date_end.substring(0,10)}}</span></p>
                  </div>
                  <div class="col-sm-12">
                     <div v-html="promotionDetail.description"></div>
                  </div>
                </div>
              </div>
          </div>

          <div class="col-sm-12">
            <h3>Danh sách phiếu giảm giá</h3>
          </div>
          <div v-if="promotionDetail.coupons.data.length">
            <div class="col-sm-12" v-for="coupon in promotionDetail.coupons.data">
              <div class="card">
                <div class="card-header bg-success">
                  <h5><i class="icon-fa icon-fa-star"/>Mã code: {{coupon.code}} - Discount: {{coupon.discount}}%</h5>
                </div>
                <div class="card-body">
                  <p>Đã sử dụng <span class="custom-value-discount">{{coupon.used}} lần</span> trong tổng số <span class="custom-value-discount">{{coupon.usable}} lần</span> </p>
                  <p>Áp dụng cho các ngày:
                    <span v-for="day in coupon.settings.days"><span class="custom-value-discount">
                    {{day}}</span>, </span>
                  </p>
                  <p>Số tiền giảm tối đa: <span class="custom-value-discount">{{coupon.max_discount | formatNumber }}</span></p>
                  <div v-if="coupon.all_day == 1">
                    <p>Áp dụng cho <span class="custom-value-discount">tất cả các phòng</span></p>
                  </div>
                  <div v-else>
                    <p>Áp dụng cho
                      <span>{{coupon.settings.rooms.length}}</span> phòng/căn hộ
                    </p>
                    <p>Áp dụng cho
                      <span>{{coupon.settings.cities.length}}</span> tỉnh/thành phố
                    </p>
                    <p>Áp dụng cho
                      <span>{{coupon.settings.districts.length}}</span> quận/huyện
                    </p>
                  </div>
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
import Auth from "../../../services/auth";
import { format } from "../../../helpers/mixins";
export default {
  mixins: [format],
  data() {
    return {
      promotionDetail: null,
      permission: "promotion.view"
    };
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permission).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getPromotionById();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async getPromotionById() {
      try {
        const response = await axios.get(`promotions/${ this.$route.params.promotionId }`, {
          params: {
            include: "coupons"
          }
        });
        this.promotionDetail = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
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
<style>
.custom-date {
  font-size: 30px;
  color:red;
  border: 2px solid green;
  padding: 10px;
  border-radius: 25px;
}
</style>
