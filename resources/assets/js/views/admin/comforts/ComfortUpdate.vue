<template>
<comfort-form v-if="comfortDetail" type="Update" :data-comfort="comfortDetail" />
</template>
<script>
import ComfortForm from './ComfortForm';
import Auth from "../../../services/auth";

export default {
  name: 'ComfortUpdate',
  components: {
    ComfortForm
  },
  data(){
    return {
      comfortDetail: null,
      permissions:"comfort.update",
    };
  },
  methods: {
    async getComfortById() {
      try {
        const response = await axios.get(`comforts/${ this.$route.params.comfortId }`,
          {
            params: {
              include: "details"
            }
          });
        this.comfortDetail = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu tiện ích phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
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
            this.getComfortById();
          }
        });
      }
    });
  }
};
</script>


