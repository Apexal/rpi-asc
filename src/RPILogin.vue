<template>
  <form class="rpi-login" @submit.prevent="login">
    <h2>Current Student Login</h2>
    <div class="form-group">
      <label for="rpi-email">RPI Email Address</label>
      <div class="input-group">
        <input
          v-model.trim="rcsID"
          type="text"
          minlength="2"
          class="form-control"
          id="rpi-email"
          name="rpi-email"
          placeholder="RCS ID"
          required
        />
        <div class="input-group-append">
          <span class="input-group-text" id="rpi-email-addon">@rpi.edu</span>
        </div>
      </div>

      <small
        id="rpi-email-help"
        class="form-text text-muted"
      >Only students approved by the faculty have access.</small>
    </div>
    <div class="form-group">
      <label for="rpi-password">Password</label>
      <input
        v-model="password"
        type="password"
        class="form-control"
        name="rpi-password"
        id="rpi-password"
        required
      />
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
  </form>
</template>

<script>
import firebase from '@/firebase'

export default {
  name: 'RPILogin',
  data () {
    return {
      rcsID: '',
      password: ''
    }
  },
  methods: {
    async login () {
      if (!this.rcsID || !this.password) return

      try {
        const user = await firebase.auth().signInWithEmailAndPassword(this.rcsID + '@rpi.edu', this.password)
        alert(JSON.stringify(user))
      } catch (e) {
        alert(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
