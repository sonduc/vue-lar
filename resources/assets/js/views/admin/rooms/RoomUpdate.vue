<template>
<room-form v-if="roomDetail" type="edit" :data-room="roomDetail" />
</template>
<script>
import RoomForm from './RoomForm'
import Auth from "../../../services/auth";

export default {
  name: 'UpdateRoom',
  components: {
    RoomForm
  },
  data(){
    return {
      roomDetail: null,
    };
  },
  methods: {
    async getRoomById() {
      try {
        const response = await axios.get(
          `rooms/${ this.$route.params.roomId }`,
          {
            params: {
              include: "details,user,prices"
            }
          }
        );
        this.roomDetail = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
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
            this.getRoomById();
          }
        });
      }
    });
  }
};
</script>
