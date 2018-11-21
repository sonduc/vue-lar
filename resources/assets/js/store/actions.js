import * as types from './mutation_type.js'

let actions = {
  changeProId({commit}, payload) {
    commit(types.CHANGE_PROMOTION_ID, payload)
  },
  changeProDay({commit}, payload) {
    commit(types.CHANGE_PROMOTION_DAY, payload)
  }

}

export default actions
