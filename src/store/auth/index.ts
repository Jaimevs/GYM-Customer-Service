  import mutations from './mutations'
  import getters from './getters'

  export default {
    namespaced: true,
    state() {
      return {
        authenticated: false,
        username: '',
        role: 'admin'
      }
    },
    mutations,
    getters
  }
