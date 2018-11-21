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
  },
  plugins: [createPersistedState()],
  getters,
  mutations,
  actions
})
