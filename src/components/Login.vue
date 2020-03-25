<template>
  <form class="form-inline login-form border p-3" @submit.prevent="login">
    <div class="form-group mx-sm-3">
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
    <button type="submit" class="btn btn-primary">Login with Email</button>
  </form>
</template>

<script>
import firebase from '@/firebase'

export default {
  name: 'Login',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    async login () {
      if (!this.email) return
      if (this.email.endsWith('@rpi.edu')) {
        // Check if this current student is on the allowed list
        // Allowed students will already have a document in the 'current' collection
        const doc = await firebase.firestore().collection('current').doc(this.email).get()
        if (!doc.exists) return alert('You have not been granted permission by the faculty.')
      }

      try {
        const options = {
          url: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/profile' : 'https://rpi-asc.web.app/profile',
          handleCodeInApp: true
        }
        await firebase.auth().sendSignInLinkToEmail(this.email, options)
        localStorage.setItem('emailForSignIn', this.email)
        alert('Success! Check ' + this.email + ' for the sign-in link!')
      } catch (e) {
        localStorage.removeItem('emailForSignIn')
        alert(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
