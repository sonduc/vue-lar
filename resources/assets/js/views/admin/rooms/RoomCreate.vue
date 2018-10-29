<template>
<room-form :titleHeader="titleHeader" />
</template>
<script>
import RoomForm from './RoomForm';
import Auth from "../../../services/auth";

export default {
  name: 'RoomCreate',
  components: {
    RoomForm
  },
  data(){
    return {
      titleHeader:"Chào mừng bạn đến với chức năng tạo phòng mới",
      permissions:"room.create",
    };
  },
};
</script>
