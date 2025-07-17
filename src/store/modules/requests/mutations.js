export default {
    // 新增回饋資訊
    addrequest(state, payload) {
        state.requests.push(payload);
    },
    // 列出該教練陳列的回饋資訊
    setRequests(state, payload) {
        state.requests = payload;
    }
}