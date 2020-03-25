<template>
  <div class="profile">
    <h1>Your {{ roleName }} Profile</h1>

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
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['userRole']),
    roleName () {
      return {
        accepted: 'Accepted Student',
        current: 'Current Student'
      }[this.userRole] || 'User'
    }
  },
  mounted () {
    this.name = this.user.data.name
  },
  watch: {
    'user.data.name' (newName) {
      this.name = newName
    }
  },
  methods: {
    async saveProfile () {
      await this.$store.dispatch('UPDATE_USER', { name: this.name })
      this.$store.commit('ADD_ALERT', { type: 'success', text: 'Updated your profile!' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
