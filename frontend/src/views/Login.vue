<template>
  <div class="login">
    <div class="jumbotron">
      <h1 class="display-4">Welcome, students!</h1>
      <p class="lead">You will be able to chat 1-on-1 with current RPI students on this site.</p>
    </div>
    <code>{{ status }}</code>
    <form class="form-inline login-form border p-3" @submit.prevent="login">
        <span id="emailHelp" class="form-text text-muted">
          Current RPI students must use their
          <strong>@rpi.edu email</strong>. Accepted students can use their
          <strong>personal email</strong>.
        </span>
        <div class="form-group mx-sm-2 my-0">
          <input
            v-model.trim="email"
            type="email"
            class="form-control"
            id="email"
            name="email"
            placeholder="Email address"
            :disabled="status === 1"
            required
          />
        </div>
        <button
          type="submit"
          class="btn mr-2"
          :class="status === 1 ? 'btn-warning' : 'btn-primary'"
          :disabled="status === 1"
        >{{ status === 1 ? 'Sending sign-in email...' : 'Login' }}</button>
    </form>
  </div>
</template>

<script>
import { auth, db } from '@/firebase'
import { sendSignInLinkToEmail } from 'firebase/auth'
import { collection, doc, getDoc } from 'firebase/firestore'

const NOT_STARTED = 0
const SENDING_EMAIL = 1
const SENT_EMAIL = 2

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      status: NOT_STARTED
    }
  },
  methods: {
    async login () {
      if (!this.email) return
      this.status = SENDING_EMAIL

      if (this.email.endsWith('@rpi.edu')) {
        // Check if this current student is on the allowed list
        // Allowed students will already have a document in the 'current' collection
        const userDoc = await getDoc(doc(collection(db, 'current'), this.email))

        if (!userDoc.exists()) {
          this.status = NOT_STARTED
          return alert('You have not been granted permission by the faculty.')
        }
      }

      try {
        const options = {
          url: process.env.NODE_ENV === 'development' ? 'http://localhost:8081/' : 'https://rpi-asc.web.app/',
          handleCodeInApp: true
        }
        await sendSignInLinkToEmail(auth, this.email, options)
        localStorage.setItem('emailForSignIn', this.email)
        this.status = SENT_EMAIL
        alert('Success! Check ' + this.email + ' for the sign-in link!')
      } catch (e) {
        localStorage.removeItem('emailForSignIn')
        alert(e)
        this.status = NOT_STARTED
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
