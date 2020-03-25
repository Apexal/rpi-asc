<template>
  <form class="accepted-login" @submit.prevent="login">
    <h2>Accepted Student Login</h2>
    <div class="form-group">
      <label for="accepted-email">Email Address</label>
      <input
        v-model.trim="email"
        type="email"
        class="form-control"
        id="accepted-email"
        name="accepted-email"
        placeholder="Any email will do!"
        required
      />
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
  </form>
</template>

<script>
import firebase from '@/firebase'

export default {
  name: 'AcceptedLogin',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    async login () {
      if (!this.email) return

      try {
        const options = {
          url: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/profile' : 'https://rpi-asc.web.app/profile',
          handleCodeInApp: true
        }
        await firebase.auth().sendSignInLinkToEmail(this.email, options)
        localStorage.setItem('emailForSignIn', this.email)
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
