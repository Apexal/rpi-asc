import Vue from 'vue'
import VueRouter from 'vue-router'

import firebase from '@/firebase'
import store from '@/store'

import Home from '@/views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
  // {
  //   path: '/faculty',
  //   name: 'Faculty',
  //   component: () => import('@/views/Faculty.vue')
  // },
  // {
  //   path: '/profile',
  //   name: 'Profile',
  //   component: () => import('@/views/Profile.vue'),
  //   meta: {
  //     requiresAuth: true
  //   }
  // },
  {
    path: '/administration',
    name: 'Administration',
    component: () => import('@/views/Administration.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes
})

router.beforeEach(async (to, from, next) => {
  // Confirm the link is a sign-in with email link.
  if (firebase.auth().isSignInWithEmailLink(window.location.href) && !store.getters.loggedIn) {
    const email = window.localStorage.getItem('emailForSignIn') || window.prompt('Please provide your email for confirmation')

    try {
      await firebase.auth().signInWithEmailLink(email, window.location.href)
      return next('/profile')
    } catch (e) {
      alert(e)
    } finally {
      window.localStorage.removeItem('emailForSignIn')
    }
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.loggedIn) return next('/')
  if (to.matched.some(record => record.meta.requiresAdmin) && (!store.getters.loggedIn || !store.getters.isAdmin)) return next('/')

  return next()
})

export default router
