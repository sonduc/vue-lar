<template>
<comfort-form />
</template>
<script>
import ComfortForm from './ComfortForm';
import Auth from "../../../services/auth";

export default {
  name: 'ComfortCreate',
  components: {
    ComfortForm
  },
  data(){
    return {
      permissions:"comfort.create",
    };
  },
};
</script>
