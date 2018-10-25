<template>
<div class="profile container">
  <div class="card" v-if="profile">
    <h2 class="deep-teal-text center">{{profile.alias}}'s Wall</h2>
    <ul class="comments collection">
      <li v-for="(comment, index) in comments" :key="index">
        <div class="teal-text">{{comment.from}}</div>
        <div class="grey-text text-darken-2">{{comment.content}}</div>
      </li>
    </ul>

    <form @submit.prevent="addComment">
      <div class="field">
        <label for="comment">Add a comment</label>
        <input type="text" name="comment" id="comment" v-model="newComment" autocomplete="off">
        <p v-if="feedback" class="red-text center">{{feedback}}</p>

        <button class="btn deep-teal">Add Comment</button>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import db from '@/firebase/init';
import firebase from 'firebase';
export default {
  name: 'Profile',
  data() {
    return {
      profile: null,
      newComment: null,
      user: null,
      comments: [],
      feedback: null
    };
  },
  methods: {
    addComment() {
      if (this.newComment) {
        db.collection('comments')
          .add({
            to: this.$route.params.id,
            from: this.user.alias,
            content: this.newComment,
            time: Date.now()
          })
          .then(() => {
            this.newComment = null;
          });
        this.feedback = null;
      } else {
        this.feedback = 'You must enter a comment to add it.';
      }
    }
  },
  created() {
    let ref = db.collection('users');

    //get user data
    ref
      .where('user_id', '==', firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.user = doc.data();
          this.user.id = doc.id;
        });
      });

    ref
      .doc(this.$route.params.id)
      .get()
      .then(user => {
        this.profile = user.data();
      });

    // get comments
    db.collection('comments')
      .where('to', '==', this.$route.params.id)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            this.comments.unshift({
              from: change.doc.data().from,
              content: change.doc.data().content
            });
          }
        });
      });
  }
};
</script>

<style lang="scss">
.profile {
  .card {
    padding: 20px;
    margin-top: 60px;
  }

  h2 {
    font-size: 2em;
    margin-top: 0;
  }

  li {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
}
</style>
