<template >
<coupon-form :titleCard="titleCard"/>
</template>
<script>
import CouponForm from './CouponForm';
import Auth from "../../../services/auth";
export default {
  name: 'CouponCreate',
  components: {
    CouponForm
  },
  data(){
    return {
      permissions:"coupon.create",
      titleCard:"Tạo mới phiếu giảm giá",
    };
  },
};
</script>
