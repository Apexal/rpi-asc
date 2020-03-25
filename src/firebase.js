// FIREBASE

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
    store.commit('SET_USER_PROFILE', user)
  } else {
    // User is signed out.
    store.commit('SET_USER_PROFILE', null)
    store.commit('SET_USER_DATA', null)
  }
})

export default firebase
