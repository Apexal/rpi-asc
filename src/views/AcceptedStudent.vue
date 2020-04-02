<template>
  <div class="accepted-student">
    <h1 class="mb-3">Accepted Student</h1>

    <div class="row">
      <div class="col-md">
        <div class="card p-3">
          <Profile />
        </div>
      </div>
      <div class="col-md">
        <div v-if="currentlyClaimedBy" class="in-queue py-3">
          <h3>You have been claimed by</h3>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ currentlyClaimedBy.name || 'Unnamed Current Student' }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ currentlyClaimedBy.id }}</h6>
              <p class="card-text">
                They will be reaching out to you shortly over
                <strong>{{ user.data.contactPlatform }}</strong>
                ({{ user.data.contactDetails }})
              </p>
            </div>
          </div>
        </div>
        <div v-else-if="user.data.inQueue" class="claimed py-3">
          <h3>
            You are in queue with
            <strong>12</strong> other students. It may take a few minutes for a current student to reach out to you.
          </h3>
          <p class="text-center mt-5 mb-5">
            <i class="fas fa-spinner"></i>
            <br />
            <button class="mt-3 btn btn-lg btn-danger" @click="offWaitlist">Done Chatting</button>
          </p>
        </div>
        <div v-else>
          <h3>
            You are
            <strong>not</strong> currently in the queue of
            <strong>12</strong> for chatting with current students.
          </h3>
          <button class="mt-3 btn btn-lg btn-danger" @click="onWaitlist">Join Queue</button>
          <hr />
          <div class="input-group">
            <label>
              <input
                type="checkbox"
                :checked="user.data.wantToBeContactedLater"
                @change="toggleLaterContact"
              />
              Alternatively, are you interested in being reached out to at a
              <strong>later date and time?</strong>
              You will be emailed by a current student and can coordinate a time to chat over {{ user.data.contactPlatform }}.
            </label>
          </div>
          <div v-if="user.data.wantToBeContactedLater">
            <label class="mt-2" for="contact-later-date">I can chat with a current student on</label>
            <div class="form-group row">
              <div class="col-12 col-md-6">
                <input
                  v-model="user.data.contactLaterDate"
                  type="date"
                  name="date"
                  id="contact-later-date"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <input
                  v-model="user.data.contactLaterTime"
                  type="time"
                  name="time"
                  id="contact-later-time"
                  class="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Profile from '@/components/Profile'

export default {
  name: 'AcceptedStudent',
  components: { Profile },
  data () {
    return {
      currentlyClaimedBy: null
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['userEmail'])
  },
  watch: {
    'user.data.currentlyClaimedBy': {
      immediate: true,
      handler (newClaimedBy) {
        if (newClaimedBy) {
          this.$bind('currentlyClaimedBy', this.user.data.currentlyClaimedBy)
        } else {
          this.$unbind('currentlyClaimedBy')
        }
      }
    },
    'user.data.contactLaterDate' (contactLaterDate) {
      this.$store.dispatch('UPDATE_USER', { contactLaterDate })
    },
    'user.data.contactLaterTime' (contactLaterTime) {
      this.$store.dispatch('UPDATE_USER', { contactLaterTime })
    }
  },
  methods: {
    async offWaitlist () {
      if (!confirm('Done chatting?')) return

      await this.$store.dispatch('UPDATE_USER', { inQueue: false })
    },
    async onWaitlist () {
      if (!confirm('Enter the queue?')) return

      await this.$store.dispatch('UPDATE_USER', { inQueue: true, wantToBeContactedLater: false })
    },
    async toggleLaterContact (event) {
      const checked = event.target.checked
      await this.$store.dispatch('UPDATE_USER', { wantToBeContactedLater: checked })
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
.fa-spinner {
  font-size: 5em;
  animation: spin 1s linear infinite;
}
</style>
