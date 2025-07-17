import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js';

export default {
    namespaced: true,
    state() { 
        return {
            lastFetch: null, // 設定最後撈取Firebase資料的時間戳
            shouldUpdate: null, // 用於判斷是否需要重新撈取Firebase資料
            coaches: [], // 所有教練
        }
    },
    mutations,
    actions,
    getters
};