<template>
  <div class="login">
    <div class="jumbotron">
      <h1 class="display-4">Welcome, students!</h1>
      <p class="lead">You will be able to chat 1-on-1 with current RPI students on this site.</p>
    </div>
    <form class="form-inline login-form border p-3" @submit.prevent="login">
      <span id="emailHelp" class="form-text text-muted">
        Current RPI students must use their
        <strong>school email</strong>. Accepted students can use
        <strong>any email</strong>.
      </span>
      <div class="form-group mx-sm-2 my-0">
        <input
          v-model.trim="email"
          type="email"
          class="form-control"
          id="email"
          name="email"
          placeholder="Email address"
          required
        />
      </div>
      <button
        type="submit"
        class="btn mr-2"
        :class="loading ? 'btn-warning' : 'btn-primary'"
        :disabled="loading"
      >{{ loading ? 'Logging you in...' : 'Login' }}</button>
    </form>
  </div>
</template>

<script>
import { auth, db } from '@/firebase'
import { sendSignInLinkToEmail } from 'firebase/auth'
import { collection, doc, getDoc } from 'firebase/firestore'

export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      email: ''
    }
  },
  methods: {
    async login () {
      if (!this.email) return
      this.loading = true
      if (this.email.endsWith('@rpi.edu')) {
        // Check if this current student is on the allowed list
        // Allowed students will already have a document in the 'current' collection
        const userDoc = await getDoc(doc(collection(db, 'current'), this.email))

        if (!userDoc.exists()) {
          this.loading = false
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
        alert('Success! Check ' + this.email + ' for the sign-in link!')
      } catch (e) {
        localStorage.removeItem('emailForSignIn')
        alert(e)
      }

      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
