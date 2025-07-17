export default {
    requests(state, _, _2, rootGetters) {
        const coachId = rootGetters.userId;
        return state.requests.filter(req => req.coachId === coachId);
    },
    hasRequests(_, getters) {
        // 若有資料則顯示true，若無資料顯示false
        return getters.requests && getters.requests.length > 0;
    },
}