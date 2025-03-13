import { GET_USERNAME, IS_USER_AUTHENTICATED } from '@/store/storeconstants'

export default {
  [GET_USERNAME]: (state) => {
    return state.username
  },
  [IS_USER_AUTHENTICATED]: (state) => {
    return state.authenticated
  }
}