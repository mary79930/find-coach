let timer; // global variable

export default {
    async registerCoach(context, data) {
        const userId = context.rootGetters.userId;
        const coachData = {
            firstName: data.first,
            lastName: data.last,
            description: data.desc,
            hourlyRate: data.rate,
            areas: data.areas,
        }

        const token = context.rootGetters.token;
        const response = await fetch(`https://vue-http-demo-7621b-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`, {
            method: 'PUT', // 告知Firebase有資料可覆蓋，無資料就建立資訊
            body: JSON.stringify(coachData), // 將object資訊轉換成json格式
        })

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to register!');
            throw error;
        }

        context.commit('registerCoach', {
            ...coachData,
            id: userId,
        })
    },
    async loadCoaches(context, payload) {
        // 判斷超過一分鐘才重新撈取 Firbase 資料(切換頁籤狀態時)
        context.dispatch('shouldUpdate');

        // 未點選Refresh強制重整 且離上次載入資料尚未超過一分鐘則不重新載入
        if (!payload.forceRefresh && !context.state.shouldUpdate) {
            return;
        }
        
        // 取得Firebase資料(Method:GET)
        const response = await fetch(`https://vue-http-demo-7621b-default-rtdb.firebaseio.com/coaches.json`); // 取得coaches所有資料
        const responseData = await response.json();

        // 異常處理
        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch!');
            throw error;
        }

        const coaches = [];
        
        for (const key in responseData) {
            const coach = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                description: responseData[key].description,
                hourlyRate: responseData[key].hourlyRate,
                areas: responseData[key].areas,
            };
            coaches.push(coach);
        }

        // 儲存資料至localstorage並設定過期時間
        context.dispatch('setCoachesLocalStorage', coaches);

        context.commit('setCoaches', coaches);
        context.commit('setFetchTimestamp'); // 設定撈取Firbase資料的時間戳
    },
    // 儲存資料至localstorage並設定過期時間
    setCoachesLocalStorage(context, payload) {
        const expiresIn = 3600 * 1000; //設定一小時(加+可將responseData.expiresIn由字串轉換成數字)
        const expirationDate = new Date().getTime() + expiresIn; // 計算出過期時間(Date().getTime():為現在時刻 ; expiresIn：持續的時間)

        // 儲存至localStorage & 加密 (localStorage which is an API built into the browser, it's a browser storage)
        localStorage.setItem('coaches', btoa(encodeURIComponent(JSON.stringify(payload))));
        localStorage.setItem('coachesExpiration', expirationDate);

        timer = setTimeout(function() {
            context.dispatch('removeCoaches'); // 刪除教練資訊
        }, expiresIn); // 時間過了一小時後到期即清除資訊
    },
    // 設定coaches資訊（增加此機制主要是預防使用者直接於網址手動輸入url會丟失Vuex的資料）
    setCoachesDetail(context) {
        const coachesList = localStorage.getItem('coaches'); // 取得教練資訊
        const tokenExpiration = localStorage.getItem('coachesExpiration'); // 取得教練資訊過期時間
        const expiresIn = +tokenExpiration - new Date().getTime(); // 計算剩餘多少時間需被清除資訊

        // 時間已過期即清除儲存資訊
        if (expiresIn < 0) {
            return;
        }
        // 設定剩餘多少時間需刪除資訊(手動頁面重整如F5 需重新設定過期時間)
        timer = setTimeout(function() {
            context.dispatch('removeCoaches');
        }, expiresIn);

        // 取得瀏覽器coaches的儲存資料(並解密)
        const coaches = JSON.parse(decodeURIComponent(atob(coachesList))); // Json.parse 將資料由JSON格式字串轉回原本的資料內容及型別

        // 若有教練資訊時
        if (coaches) {
            // 將教練資訊儲存至Vuex
            context.commit('setCoaches', coaches);
        }
    },
    // 刪除教練資訊
    removeCoaches() {
        localStorage.removeItem('coaches');
        localStorage.removeItem('coachesExpiration');

        clearTimeout(timer); // 取消由 setTimeout() 方法設置的定時操作
    },
    // 判斷超過一分鐘才重新撈取 Firbase 資料(切換頁籤狀態時)
    shouldUpdate(context) {
        const lastFetch = context.state.lastFetch; // 上次記載的時間戳
        // 若沒有時間戳(例：null)
        if (!lastFetch) {
            context.state.shouldUpdate =  true; // 因lastFetch尚未設置時間戳因此不阻擋並繼續執行後續程式
        } else {
            // 此時的時間戳
            const currentTimeStamp = new Date().getTime();
            // 若經計算當初設置的時間戳已經過了一分鐘則為true
            context.state.shouldUpdate = (currentTimeStamp - lastFetch) / 1000 > 60;
        }
    }
};