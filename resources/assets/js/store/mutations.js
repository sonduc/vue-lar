import * as types from './mutation_type.js'

let mutations = {
  [types.CHANGE_PROMOTION_ID](state, payload) {
    state.promotion_id = payload;
  },
  [types.CHANGE_PROMOTION_DAY](state, payload) {
    state.promotion_day = payload;
  },
}

export default mutations
