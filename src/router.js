import { createRouter, createWebHistory } from 'vue-router';

import CoachDetail from './pages/coaches/CoachDetail.vue';
import CoachesList from './pages/coaches/CoachesList.vue';
import CoachRegistration from './pages/coaches/CoachRegistration.vue';
import ContactCoach from './pages/requests/ContactCoach.vue';
import RequestsReceived from './pages/requests/RequestsReceived.vue';
import NotFound from './pages/NotFound.vue';
import UserAuth from './pages/auth/UserAuth.vue';
import store from './store/index.js';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/coaches' },
        { path: '/coaches', component: CoachesList },
        {
            path: '/coaches/:id',
            component: CoachDetail,
            props: true,
            children: [
                { path: 'contact', component: ContactCoach }  // /coaches/c1/contact
            ]
        },
        { path: '/register', component: CoachRegistration, meta: { requiresAuth: true } },  // requiresAuth 為 true 表示進入該頁面需登入狀態
        { path: '/requests', component: RequestsReceived, meta: { requiresAuth: true } },  // requiresAuth 為 true 表示進入該頁面需登入狀態
        { path: '/auth', component: UserAuth, meta: {requiresUnauth : true }},  // requiresUnauth 為 true 表示進入該頁面需在沒有登入的狀態
        { path: '/:notfound(.*)', component: NotFound },
    ]
});

router.beforeEach(function(to, _, next) {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) { // 當頁面有要求須登入(requiresAuth 為 true），但尚未登入的情況（!store.getters.isAuthenticated 為 true)
        next('/auth'); // 尚未登入但該頁面需登入狀態才可造訪，需導致登入頁
    } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) { // 當已登入狀態（store.getters.isAuthenticated 為 true)，但該頁面限制未登入才可進入（requiresUnauth 為 true)
        next('/coaches'); // 已登入狀態該頁面不可造訪，需導至教練頁面
    } else {
        next(); // 不阻擋皆導至原設定的連結頁面
    }
});

export default router;