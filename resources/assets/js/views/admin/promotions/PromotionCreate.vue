<template>
<promotion-form />
</template>
<script>
import PromotionForm from './PromotionForm';
import Auth from "../../../services/auth";

export default {
  name: 'PromotionCreate',
  components: {
    PromotionForm
  },
  data(){
    return {
      permissions:"promotion.create",
    };
  },
};
</script>
