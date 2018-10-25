import Vue from 'vue';
import Router from 'vue-router';
import Map from '@/components/Map';
import Profile from '@/components/Profile';
import Signup from '@/components/Signup';
import Login from '@/components/Login';
import firebase from 'firebase';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Map',
      component: Map,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  // check if route requires auth
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    // check auth state
    let user = firebase.auth().currentUser;
    if (user) {
      next();
    } else {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router;
