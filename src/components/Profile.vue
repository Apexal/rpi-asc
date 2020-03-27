<template>
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

    <div v-if="userRole === 'accepted'" class="accepted">
      <div class="form-group">
        <label
          for="topics"
        >Do you want to talk about anything in particular? Concerns about the school?</label>
        <textarea
          v-model="accepted.topics"
          class="form-control"
          name="topics"
          id="topics"
          placeholder="(optional) Any questions?"
        ></textarea>
      </div>
      <div class="form-row">
        <div class="col">
          <div class="form-group">
            <label for="contact-platform">Contact platform</label>
            <select
              v-model.trim="accepted.contactPlatform"
              class="custom-select"
              id="contact-platform"
            >
              <option selected>Choose your primary platform</option>
              <option value="phone">Phone</option>
              <option value="discord">Discord</option>
              <option value="skype">Skype</option>
              <option value="zoom">Zoom</option>
              <option value="webex">WebEx</option>
              <option value="wechat">WeChat</option>
            </select>
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="contact-details">How to reach you there</label>
            <input
              v-model.trim="accepted.contactDetails"
              type="text"
              id="contact-details"
              class="form-control"
              placeholder="Phone #, username, etc."
              required
            />
          </div>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data () {
    return {
      name: '',
      accepted: {
        contactPlatform: '',
        contactDetails: '',
        topics: ''
      },
      current: {

      }
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
  watch: {
    'user.data': {
      immediate: true,
      handler (newData) {
        this.name = newData.name

        if (this.userRole === 'accepted') {
          this.accepted.contactPlatform = newData.contactPlatform
          this.accepted.contactDetails = newData.contactDetails
          this.accepted.topics = newData.topics
        }
      }
    }
  },
  methods: {
    async saveProfile () {
      await this.$store.dispatch('UPDATE_USER', { name: this.name, ...this[this.userRole] })
      this.$store.commit('ADD_ALERT', { type: 'success', text: 'Updated your profile!' })
    }
  }
}
</script>

<style lang="scss" scoped>
textarea {
  min-height: 50px;
  max-height: 300px;
}
</style>
