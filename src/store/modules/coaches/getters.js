export default {
    // return coaches information
    coaches(state) {
        return state.coaches;
    },
    // check if we have coaches or not
    hasCoaches(state) {
        return state.coaches && state.coaches.length > 0;
    },
    isCoach(_, getters, _2, rootGetters) {
        const coaches = getters.coaches;
        const userId = rootGetters.userId;
        // 確認所有教練裡面是否有符合該userId（檢查我們是否註冊過教練身份了）
        return coaches.some(coach => coach.id === userId)
    },
};