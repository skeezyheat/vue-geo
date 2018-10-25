<template>
  <div class="signup container">
    <form class="card-panel" @submit.prevent="signup">
      <h2 class="center deep-teal-text">Signup</h2>
        <div class="field">
          <label for="email">Email:</label>
          <input type="email" name="email" v-model="email" autocomplete="off"/>
        </div>

        <div class="field">
          <label for="password">Password:</label>
          <input type="password" name="password" v-model="password" autocomplete="off"/>
        </div>

        <div class="field">
          <label for="alias">Alias:</label>
          <input type="text" name="alias" v-model="alias" autocomplete="off"/>
        </div>
        <p class="red-text center" v-if="feedback">{{feedback}}</p>
        <div class="field center">
          <button class="btn deep-teal">Submit</button>
        </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init';
import firebase from 'firebase';
import functions from 'firebase/functions';
import slugify from 'slugify';
export default {
  name: 'Signup',
  data() {
    return {
      email: null,
      password: null,
      alias: null,
      feedback: null,
      slug: null
    };
  },
  methods: {
    signup() {
      if (this.alias && this.email && this.password) {
        this.slug = slugify(this.alias, {
          replacement: '-',
          remove: /[!@#$%^&*()'";:,.]/g,
          lower: true
        });

        let checkAlias = firebase.functions().httpsCallable('checkAlias');
        checkAlias({ slug: this.slug }).then(res => {
          if (!res.data.unique) {
            this.feedback = 'This alias already exists.';
          } else {
            firebase
              .auth()
              .createUserWithEmailAndPassword(this.email, this.password)
              .then(cred => {
                let user = cred.user;
                db.collection('users')
                  .doc(this.slug)
                  .set({
                    alias: this.alias,
                    geolocation: null,
                    user_id: user.uid
                  });
              })
              .then(() => {
                this.$router.push({ name: 'Map' });
              })
              .catch(err => {
                console.log(err);
                this.feedback = err.message;
              });
          }
        });
      } else {
        this.feedback = 'You must enter an alias.';
      }
    }
  }
};
</script>

<style lang="scss">
.signup {
  max-width: 400px;
  margin-top: 60px;

  h2 {
    font-size: 2.4em;
  }

  .field {
    margin-bottom: 6px;
  }
}
</style>
