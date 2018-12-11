import * as types from './mutation_type.js'

let mutations = {
  [types.CHANGE_PROMOTION_ID](state, payload) {
    state.promotion_id = payload;
  },
  [types.CHANGE_PROMOTION_DAY](state, payload) {
    state.promotion_day = payload;
  },
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
}

export default mutations
