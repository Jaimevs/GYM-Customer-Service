import {
    SET_AUTHENTICATION,
    SET_USERNAME
} from "../storeconstants.js"

export default {
    [SET_AUTHENTICATION](state, authenticated) {
        state.authenticated  = authenticated
    },
    [SET_USERNAME](state, username) {
        state.username = username
    },
}