<template>
  <div class="login container">

  <form @submit.prevent="login" class="card-panel">
    <h2 class="center deep-teal-text">Login</h2>

      <div class="field">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model="email"/>
      </div>

      <div class="field">
        <label for="password">Password:</label>
        <input type="password" name="password" v-model="password" autocomplete="off"/>
      </div>

      <p class="red-text center" v-if="feedback">{{feedback}}</p>

      <div class="field">
        <button class="btn deep-teal">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'Login',
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            let user = cred.user;
            this.$router.push({ name: 'Map' });
          })
          .catch(err => {
            this.feedback = err.message;
          });
        this.feedback = null;
      } else {
        this.feedback = 'You need to enter an email and password';
      }
    }
  }
};
</script>

<style lang="scss">
.login {
  max-width: 400px;
  margin-top: 60px;

  h2 {
    font-size: 2.4em;
  }

  .field {
    margin-bottom: 16px;
  }
}
</style>
