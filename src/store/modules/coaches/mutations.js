export default {
    // 教練註冊
    registerCoach(state, payload) {
        state.coaches.push(payload);
    },
    // 設定教練資料
    setCoaches(state, payload) {
        state.coaches = payload;
    },
    // 設定時間戳
    setFetchTimestamp(state) {
        state.lastFetch = new Date().getTime(); // 此刻的時間戳
    }
};