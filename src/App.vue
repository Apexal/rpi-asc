<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <main class="container">
      <router-view />
    </main>

    <footer></footer>
  </div>
</template>
<script>
import firebase from '@/firebase'
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: { Navbar },
  async mounted () {
    // Confirm the link is a sign-in with email link.
    alert(window.location.href)
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn') || window.prompt('Please provide your email for confirmation')

      try {
        await firebase.auth().signInWithEmailLink(email, window.location.href)
      } catch (e) {
        alert(e)
      } finally {
        window.localStorage.removeItem('emailForSignIn')
      }
    }
  }
}
</script>
<style lang="scss">
</style>
