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
        <div v-else class="claimed">
          <h3>
            You are in queue with
            <strong>12</strong> other students. It may take a few minutes for a current student to reach out to you.
          </h3>
          <p class="text-center mt-5 mb-5">
            <i class="fas fa-spinner"></i>
          </p>
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
