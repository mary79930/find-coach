<template>
    <div>
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError"> <!-- !!：會判斷error若有string值，就會將string值轉換成boolean的true，若沒有string值則轉換成boolean的false -->
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <header>
                    <h2>Requests Received</h2>
                </header>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="hasRequests && !isLoading">
                    <request-item 
                        v-for="req in receiveRequests"
                        :key="req.id"
                        :email="req.userEmail"
                        :message="req.message"
                    ></request-item>
                </ul>
                <h3 v-else>You haven't received any requests yet!</h3>
            </base-card>
        </section>
    </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';

export default {
    components: {
        RequestItem,
    },
    data() {
        return {
            isLoading: false,
            error: null,
        }
    },
    computed: {
        receiveRequests() {
            return this.$store.getters['requests/requests'];
        },
        hasRequests() {
            return this.$store.getters['requests/hasRequests'];
        },
    },
    created() {
        // 將firebase真實資料寫入置地端Vuex(locally)
        this.loadRequests();
    },
    methods: {
        async loadRequests() {
            this.isLoading = true;
            try {
                await this.$store.dispatch('requests/fetchRequests');
            } catch (err) {
                this.error = err.message || 'Something failed!';
            }
            this.isLoading = false;
        },
        handleError() {
            this.error = null;
        }
    }
}
</script>


<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>