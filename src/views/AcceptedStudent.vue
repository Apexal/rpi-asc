<template>
  <div class="accepted-student">
    <h1 class="mb-3">Accepted Student</h1>

    <div class="row">
      <div class="col">
        <div class="card p-3">
          <Profile />
        </div>
      </div>
      <div class="col">
        <div v-if="currentlyClaimedBy" class="in-queue">
          <h3>You have been claimed by</h3>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ currentlyClaimedBy.name || 'Unnamed Current Student' }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ currentlyClaimedBy.id }}</h6>
              <p class="card-text">Wow</p>
            </div>
          </div>
        </div>
        <div v-else-if="user.data.inQueue" class="claimed">
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
            <strong>not</strong> currently in the queue for chatting with current students.
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
              Alternatively, are you interested in being reached out to later? You will be emailed by a current student and can coordinate a time to chat over {{ user.data.contactPlatform }}.
            </label>
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
        this.$bind('currentlyClaimedBy', this.user.data.currentlyClaimedBy)
      }
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
