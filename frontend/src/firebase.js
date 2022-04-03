// FIREBASE
import store from '@/store'

import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyB_Ll6jVASgD4taEIXAqL5zzXPMbVRgPYE',
  authDomain: 'rpi-asc.firebaseapp.com',
  databaseURL: 'https://rpi-asc.firebaseio.com',
  projectId: 'rpi-asc',
  storageBucket: 'rpi-asc.appspot.com',
  // messagingSenderId: '286097969627',
  appId: '1:286097969627:web:689cae50e9cfa02ab897fe',
  measurementId: 'G-GJBC22GSHH'
}

const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const functions = getFunctions(firebaseApp)

if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectFunctionsEmulator(functions, 'localhost', 5001)
}

auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    store.dispatch('USER_LOGGED_IN', user)
  } else {
    // User is signed out.
    store.dispatch('USER_LOGGED_OUT')
  }
})
