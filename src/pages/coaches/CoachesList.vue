<template>
    <div>
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError"> <!-- !!：會判斷error若有string值，就會將string值轉換成boolean的true，若沒有string值則轉換成boolean的false -->
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <coach-filter @change-filter="setFilters"></coach-filter>
        </section>
        <section>
            <base-card>
                <div class="controls">
                    <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
                    <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">Login to Register as Coach</base-button>
                    <base-button v-if="isLoggedIn && !isCoach && !isLoading" link to="/register">Register as Coach</base-button> <!-- 顯示條件：已登入狀態(isLoggedIn)、目前尚未是教練身份(!isCoach)、尚未在Loading狀態(!isLoading) -->
                </div>
                <!-- 資料尚未回傳時 顯示讀取中狀態 op -->
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <!-- 資料尚未回傳時 顯示讀取中狀態 ed -->
                <!-- 有coaches資料且不在讀取狀態 op -->
                <ul v-else-if="hasCoaches">
                    <coach-item 
                        v-for="coach in filteredCoaches" 
                        :key="coach.id" 
                        :id="coach.id" 
                        :first-name="coach.firstName" 
                        :last-name="coach.lastName"
                        :rate="coach.hourlyRate"
                        :areas="coach.areas"
                    ></coach-item>
                </ul>
                <!-- 有coaches資料且不在讀取狀態 ed -->
                <h3 v-else>No coaches found.</h3>
            </base-card>
        </section>
    </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';

export default {
    components: {
        CoachItem,
        CoachFilter
    },
    data() {
        return {
            isLoading: false,
            error: null,
            activeFilters: {
                frontend: true,
                backend: true,
                career: true,
            }
        }
    },
    computed: {
        // 是否已登入
        isLoggedIn() {
            return this.$store.getters.isAuthenticated;
        },
        // 是否為教練身份
        isCoach() {
            return this.$store.getters['coaches/isCoach'];
        },
        filteredCoaches() {
            const coaches =  this.$store.getters['coaches/coaches'];
            // 進行過濾需顯示的內容
            return coaches.filter(coach => {
                // 若畫面設定(activeFilters)要顯示frontend，並且教練專業領域（area)有包含frontend，即顯示該教練
                if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
                    return true;
                }
                // 若畫面設定(activeFilters)要顯示backend，並且教練專業領域（area)有包含backend，即顯示該教練
                if (this.activeFilters.backend && coach.areas.includes('backend')) {
                    return true;
                }
                // 若畫面設定(activeFilters)要顯示frontend，並且教練專業領域（area)有包含career，即顯示該教練
                if (this.activeFilters.career && coach.areas.includes('career')) {
                    return true;
                }
                // 若皆非則不顯示該教練
                return false;
            });
        },
        hasCoaches() {
            // 不在讀取狀態(isLoading是false）且有回傳的資料
            return !this.isLoading && this.$store.getters['coaches/hasCoaches'];
        }
    },
    created() {
        // 將firebase真實資料寫入置地端Vuex(locally)
        this.loadCoaches();
    },
    methods: {
        setFilters(updateFilters) {
            this.activeFilters = updateFilters;
        },
        async loadCoaches(refresh = false) {
            this.isLoading = true; // 設定讀取畫面
            try {
                await this.$store.dispatch('coaches/loadCoaches', {forceRefresh: refresh});
            } catch (err) {
                this.error = err.message || 'Something went wrong!';
            }
            this.isLoading = false; // 已讀取完畢不再需顯示讀取畫面
        },
        // 將錯誤跳窗關閉
        handleError() {
            this.error = null;
        }
    }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
