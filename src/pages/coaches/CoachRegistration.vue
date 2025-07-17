<template>
    <section>
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError"> <!-- !!：會判斷error若有string值，就會將string值轉換成boolean的true，若沒有string值則轉換成boolean的false -->
            <p>{{ error }}</p>
        </base-dialog>
        <base-card>
            <h2>Register as a coach now!</h2>
            <coach-form @save-data="saveData"></coach-form>
        </base-card>
    </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';

export default {
    components: {
        CoachForm
    },
    data() {
        return {
            error: null,
        }
    },
    methods: {
        async saveData(data) {
            try {
                await this.$store.dispatch('coaches/registerCoach', data);
                // 取得所有教練資訊
                const coaches = this.$store.getters['coaches/coaches'];
                // 儲存資料至localstorage並設定過期時間
                this.$store.dispatch('coaches/setCoachesLocalStorage', coaches);
            } catch (err) {
                this.error = err.message || 'Something failed!';
                return;
            }
            // 導網址於教練列表且無法返回前一頁
            this.$router.replace('/coaches');
        },
        handleError() {
            this.error = null;
        }
    }
}
</script>
