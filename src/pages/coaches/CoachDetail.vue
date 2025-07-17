<template>
    <div>
        <section>
            <base-card>
                <h2>{{ fullName }}</h2>
                <h3>${{ rate }}/hour</h3>
            </base-card>
        </section>
        <section>
            <base-card>
                <header>
                    <h2>Interested? Reach out now!</h2>
                    <base-button link :to="contactLink">Contact</base-button>
                </header>
                <router-view></router-view> <!-- 此嵌入 ContactCoach 頁面 -->
            </base-card>
        </section>
        <section>
            <base-card>
                <base-badge 
                    v-for="area in areas" 
                    :key="area" 
                    :type="area" 
                    :title="area"
                ></base-badge>
                <p>{{ description }}</p>
            </base-card>
        </section>
    </div>
</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            selectedCoach: null,
        }
    },
    computed: {
        fullName() {
            return this.selectedCoach.firstName + ' ' + this.selectedCoach.lastName;
        },
        areas() {
            return this.selectedCoach.areas;
        },
        rate() {
            return this.selectedCoach.hourlyRate;
        },
        description() {
            return this.selectedCoach.description;
        },
        contactLink() {
            // 若已經將 contact 表單展開（ url 路徑若包含 contact 時）
            if (this.$route.path.includes('contact')) {
                return ''; // 不再導新的網址
            }
            return this.$route.path + '/contact';
        }
    },
    created() {
        // 設定coaches個別詳細資訊
        this.$store.dispatch('coaches/setCoachesDetail');
        // 取得教練資訊
        const coaches = this.$store.getters['coaches/coaches'];
        // 取得教練個別
        const coachDetail = coaches.find(coach => coach.id === this.id);
        // 撈取不到教練資訊時（預防手動在網址上隨意輸入不當id及教練資訊已過期)
        if (!coachDetail) {
            window.location.replace('/coaches'); // 直接轉跳至教練列表頁
            return; // 不繼續執行後續程式碼
        }
        // 將取得的資訊寫進selectedCoach裡
        this.selectedCoach = coachDetail;
    },
}
</script>
