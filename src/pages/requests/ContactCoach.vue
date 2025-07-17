<template>
    <div>
      <base-dialog :show="!!error" title="An error occurred!" @close="handleError"> <!-- !!：會判斷error若有string值，就會將string值轉換成boolean的true，若沒有string值則轉換成boolean的false -->
          <p>{{ error }}</p>
      </base-dialog>
      <form @submit.prevent="submitForm">
          <div class="form-control">
              <label for="email">Your E-Mail</label>
              <input type="email" id="email" v-model.trim="email" />
          </div>
          <div class="form-control">
              <label for="message">Message</label>
              <textarea rows="5" id="message" v-model.trim="message"></textarea>
          </div>
          <p class="errors" v-if="!formIsValid">Please enter a valid email and non-empty message.</p>
          <div class="actions">
              <base-button>Send Message</base-button>
          </div>
      </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            message: '',
            formIsValid: true,
            error: null,
        }
    },
    methods: {
        async submitForm() {
            this.formIsValid = true;
            // 驗證
            if (
                this.email === '' || 
                !this.email.includes('@') || 
                this.message === ''
            ) {
                this.formIsValid = false;
                return;
            }
            try {
                // 新增訊息給指定教練
                await this.$store.dispatch('requests/contactCoach', {
                  coachId: this.$route.params.id,
                  email: this.email,
                  message: this.message,
                });
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


<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>