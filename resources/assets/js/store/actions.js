import * as types from './mutation_type.js'

let actions = {
  // PROMOTION
  changeProId({commit}, payload) {
    commit(types.CHANGE_PROMOTION_ID, payload)
  },
  changeProDay({commit}, payload) {
    commit(types.CHANGE_PROMOTION_DAY, payload)
  },
  // ROOM_GOOGLE_MAP
  searchRoomGoogleMap({commit}, payload) {
    commit(types.CHANGE_ROOM_GOOGLE_MAP, payload)
  },
  changeCountRoomGMap({commit}, payload) {
    commit(types.CHANGE_COUNT_ROOM_GOOGLE_MAP, payload)
  },
  changeSearchMapStatus({commit}, payload) {
    commit(types.SEARCH_MAP_STATUS, payload)
  },
  changeInfoSearchRoom({commit}, payload) {
    commit(types.INFO_SEARCH_ROOM, payload)
  },
  // ROOM_CALENDAR
  changeRoomBookingDate({commit}, payload) {
    commit(types.ROOM_BOOKING_DATE, payload)
  },
  changeActionDateCalendar({commit}, payload) {
    commit(types.ACTION_DATE_CALENDAR, payload)
  },
  changeStatusRoomCalendar({commit}, payload) {
    commit(types.STATUS_ROOM_CALENDAR, payload)
  },
  changeRoomCalendarId({commit}, payload) {
    commit(types.ROOM_CALENDAR_ID, payload)
  },
}

export default actions
