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
