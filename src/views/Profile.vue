<template>
  <div class="profile">
    <h1 class="mt-5">Your {{ role }} Profile</h1>

    <form class="profile-form" @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          class="form-control"
          type="text"
          name="email"
          id="email"
          :value="user.profile.email"
          readonly
        />
      </div>
      <div class="form-group">
        <label for="name">Name</label>
        <input
          v-model.trim="name"
          class="form-control"
          type="text"
          name="name"
          id="name"
          minlength="3"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import firebase from '@/firebase'
import { mapState } from 'vuex'

export default {
  name: 'Profile',
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapState(['user']),
    role () {
      return {
        accepted: 'Accepted Student',
        faculty: 'Faculty Member',
        current: 'Current Student'
      }[this.user.profile.role] || 'User'
    }
  },
  mounted () {
    this.name = this.user.profile.displayName
  },
  watch: {
    user (newUser) {
      this.name = newUser.profile.displayName
    }
  },
  methods: {
    async saveProfile () {
      await firebase
        .auth().currentUser.updateProfile({
          displayName: this.name
        })
      this.$store.commit('SET_USER_PROFILE', firebase
        .auth().currentUser)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
