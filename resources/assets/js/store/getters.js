let getters = {
  // PROMOTION
  getPromotionId(state) {
    return state.promotion_id;
  },
  getPromotionDay(state) {
    return state.promotion_day;
  },
  // ROOM_GOOGLE_MAP
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
  },
  // ROOM_CALENDAR
  getRoomBookingDate(state) {
    return state.room_booking_date;
  },
  getActionDateCalendar(state) {
    return state.action_date_calendar;
  },
  getStatusRoomCalendar(state) {
    return state.status_room_calendar;
  },
  getRoomCalendarId(state) {
    return state.room_calendar_id;
  },
}

export default getters
