<template>
  <nav class="navbar navbar-expand-lg" :class="navbarClasses">
    <div class="container">
      <span class="navbar-brand mb-0 h1">RPI ASC</span>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar-content"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbar-content">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link :to="{name: 'Home'}" class="nav-link">Home</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link :to="{name: 'Administration'}" class="nav-link">Administration</router-link>
          </li>
          <li v-else-if="userRole === 'accepted'" class="nav-item">
            <a
              href="mailto:info@cs.rpi.edu?subject=Student+Matcher+Website+Issue"
              class="nav-link"
              target="_blank"
            >
              <i class="fas fa-exclamation-triangle"></i>
              Having issues?
            </a>
          </li>
        </ul>
        <ul v-if="loggedIn" class="navbar-nav">
          <span class="navbar-text">
            Logged in as
            <strong>{{ user.data.name || user.profile.email }}</strong>
          </span>
          <li class="nav-item" @click="logout">
            <a href="#" class="nav-link">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import firebase from '@/firebase'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['loggedIn', 'userRole', 'isAdmin']),
    ...mapState(['user']),
    navbarClasses () {
      if (this.loggedIn) {
        return this.userRole === 'current' ? ['navbar-dark', 'bg-primary'] : ['navbar-dark', 'bg-danger']
      }
      return ['navbar-dark', 'bg-dark']
    }
  },
  methods: {
    async logout () {
      await firebase.auth().signOut()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
