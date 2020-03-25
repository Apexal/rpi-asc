<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
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
          <a href="#" class="nav-link">Link 1</a>
        </li>

        <template v-if="loggedIn">
          <li class="nav-item">
            <router-link :to="{name: 'Profile'}" class="nav-link">
              <strong>{{ user.profile.email }}</strong>
            </router-link>
          </li>
          <li class="nav-item" @click="logout">
            <a href="#" class="nav-link">Logout</a>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'Home'}">Login</router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import firebase from '@/firebase'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['loggedIn']),
    ...mapState(['user'])
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
