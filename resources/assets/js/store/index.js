import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'
import mutations from './mutations.js'
import actions from './actions.js'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    promotion_id: null,
    promotion_day: {
      startDay: null,
      endDay: null
    },
    room_google_map: null,
    count_room_gm: null,
    search_map_status: 0,
    info_search_room: {
      name: null,
      price_range: null,
      city_id: null,
      city_name: null,
      district_id: null,
      district_name: null
    }
  },
  plugins: [createPersistedState()],
  getters,
  mutations,
  actions
})
