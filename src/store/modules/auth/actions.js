let timer; // global variable

export default {
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'login',
        })
    },
    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'signup',
        })
    },
    async auth(context, payload) {
        const mode = payload.mode;
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDtRmtwfCW8VuUybkn9U1CR3Y1FVLsBzFU';

        if (mode === 'signup') {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDtRmtwfCW8VuUybkn9U1CR3Y1FVLsBzFU';
        }
        const response = await fetch(
            url, 
            {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true,
            }), // 將object資訊轉換成json格式
        })

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
            throw error;
        }

        const expiresIn = +responseData.expiresIn * 1000; //設定一小時(加+可將responseData.expiresIn由字串轉換成數字)
        const expirationDate = new Date().getTime() + expiresIn; // 計算出過期時間(Date().getTime():為現在時刻 ; expiresIn：持續的時間)

        // 儲存至localStorage (localStorage which is an API built into the browser, it's a browser storage)
        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate);

        timer = setTimeout(function() {
            context.dispatch('autoLogout');
        }, expiresIn); // 登入時間過了一小時後到期即登出

        // 儲存至VueX
        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId,
        });
    },
    trylogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const expiresIn = +tokenExpiration - new Date().getTime(); // 計算剩餘多少時間需被登出

        // 登入時間已過期
        if (expiresIn < 0) {
            return;
        }

        // 設定剩餘多少時間需登出(手動頁面重整如F5 需重新設定過期時間)
        timer = setTimeout(function() {
            context.dispatch('autoLogout');
        }, expiresIn);

        // 登入時間尚未過期繼續維持登入狀態
        if (token && userId) {
            context.commit('setUser', {
                token: token,
                userId: userId
            });
        }
    },
    logout(context) {
        // 刪除瀏覽器的儲存資料
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer); // 取消由 setTimeout() 方法設置的定時操作

        context.commit('setUser', {
            token: null,
            userId: null,
        })
    },
    autoLogout(context) {
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};