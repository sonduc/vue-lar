import * as types from './mutation_type.js'

let mutations = {
  // PROMOTION
  [types.CHANGE_PROMOTION_ID](state, payload) {
    state.promotion_id = payload;
  },
  [types.CHANGE_PROMOTION_DAY](state, payload) {
    state.promotion_day = payload;
  },
  // ROOM_GOOGLE_MAP
  [types.CHANGE_ROOM_GOOGLE_MAP](state, payload) {
    state.room_google_map = payload;
  },
  [types.CHANGE_COUNT_ROOM_GOOGLE_MAP](state, payload) {
    state.count_room_gm = payload;
  },
  [types.SEARCH_MAP_STATUS](state, payload) {
    state.search_map_status = payload;
  },
  [types.INFO_SEARCH_ROOM](state, payload) {
    state.info_search_room = payload;
  },
  // ROOM_CALENDAR
  [types.ROOM_BOOKING_DATE](state, payload) {
    state.room_booking_date = payload;
  },
  [types.ACTION_DATE_CALENDAR](state, payload) {
    state.action_date_calendar = payload;
  },
  [types.STATUS_ROOM_CALENDAR](state, payload) {
    state.status_room_calendar = payload;
  },
  [types.ROOM_CALENDAR_ID](state, payload) {
    state.room_calendar_id = payload;
  },

}

export default mutations
