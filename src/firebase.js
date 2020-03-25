// FIREBASE
// import Vue from 'vue'
import store from '@/store'

// core Firebase SDK

import * as firebase from 'firebase/app'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB_Ll6jVASgD4taEIXAqL5zzXPMbVRgPYE',
  authDomain: 'rpi-asc.firebaseapp.com',
  databaseURL: 'https://rpi-asc.firebaseio.com',
  projectId: 'rpi-asc',
  storageBucket: 'rpi-asc.appspot.com',
  messagingSenderId: '286097969627',
  appId: '1:286097969627:web:689cae50e9cfa02ab897fe'
}

firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    store.dispatch('USER_LOGGED_IN', user)
  } else {
    // User is signed out.
    store.dispatch('USER_LOGGED_OUT')
  }
})

export const db = firebase.firestore()
export default firebase
