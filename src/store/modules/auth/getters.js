export default {
    userId(state) {
        return state.userId;
    },
    token(state) {
        return state.token;
    },
    // 是否通過身份認證（有token為true代表通過，無token為false代表未通過）
    isAuthenticated(state) {
        return !!state.token; // !!回傳為Boolean值（true/false)
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    }
}