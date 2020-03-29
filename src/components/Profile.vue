<template>
  <form class="profile-form" @submit.prevent="saveProfile">
    <span
      class="badge float-right"
      :class="waiting ? 'badge-warning' : 'badge-success'"
    >{{ waiting ? 'Updating' : 'Saved'}}</span>
    <h4>Your Info</h4>
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
        <label for="topics">Do you want to talk about anything in particular?</label>
        <textarea
          v-model="accepted.topics"
          class="form-control"
          name="topics"
          id="topics"
          placeholder="(optional) Anything about the school, dorms, instructors, classes, etc."
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
              <option value="none" selected>Choose your primary platform</option>
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
    <div v-else-if="userRole === 'current'">
      <b>I can talk to accepted students over</b>
      <div class="form-group row mt-2">
        <div class="col-3" v-for="(has, platform) in current.contactPlatforms" :key="platform">
          <label class="text-capitalize">
            {{ platform }}
            <input type="checkbox" v-model="current.contactPlatforms[platform]" />
          </label>
        </div>
      </div>
    </div>

    <!-- <button type="submit" class="btn btn-primary">Submit</button> -->
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
        contactPlatforms: {
          phone: false,
          discord: false,
          skype: false,
          zoom: false,
          webex: false,
          wechat: false
        }
      },
      timeout: null,
      waiting: false
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
        } else if (this.userRole === 'current') {
          this.current.contactPlatforms = newData.contactPlatforms
        }
      }
    },
    name: 'handleChange',
    accepted: {
      handler: 'handleChange',
      deep: true
    },
    current: {
      handler: 'handleChange',
      deep: true
    }
  },
  methods: {
    async saveProfile () {
      try {
        await this.$store.dispatch('UPDATE_USER', { name: this.name, ...this[this.userRole] })
      } catch (e) {
        alert('There was an error updating your profile... Please try again later.')
        console.error(e)
      }
      this.waiting = false
    },
    handleChange () {
      this.waiting = true
      clearTimeout(this.timeout)
      this.timeout = setTimeout(this.saveProfile, 1000)
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
