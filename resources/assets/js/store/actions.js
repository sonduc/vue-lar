import * as types from './mutation_type.js'

let actions = {
  changeProId({commit}, payload) {
    commit(types.CHANGE_PROMOTION_ID, payload)
  },
  changeProDay({commit}, payload) {
    commit(types.CHANGE_PROMOTION_DAY, payload)
  },
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
  }
}

export default actions
