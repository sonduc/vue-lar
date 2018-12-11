let getters = {
  getPromotionId(state) {
    return state.promotion_id;
  },
  getPromotionDay(state) {
    return state.promotion_day;
  },
  getRoomGoogleMap(state) {
    return state.room_google_map;
  },
  getCountRoomGMap(state) {
    return state.count_room_gm;
  },
  getSearchMapStatus(state) {
    return state.search_map_status;
  },
  getInfoSearchRoom(state) {
    return state.info_search_room;
  }
}

export default getters
