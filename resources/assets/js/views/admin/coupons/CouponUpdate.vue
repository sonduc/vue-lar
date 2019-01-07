<template>
<coupon-form v-if="couponDetail" :titleCard="titleCard" type="Update" :data-coupon="couponDetail"/>
</template>
<script>
import CouponForm from './CouponForm';
import Auth from "../../../services/auth";
export default {
  name: 'CouponUpdate',
  components: {
    CouponForm
  },
  data(){
    return {
      couponDetail: null,
      permissions:"coupon.update",
      titleCard:"Cập nhật phiếu giảm giá",
    };
  },
  methods: {
    async getCouponById() {
      try {
        const response = await axios.get(`coupons/${ this.$route.params.couponId }`);
        this.couponDetail = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu phiếu giảm giá này hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    }
  },
  created() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403"); // push về page 403
          } else {
            this.getCouponById();
          }
        });
      }
    });
  }
};
</script>
