<template>
  <div class="accepted-student">
    <h1>Accepted Student</h1>

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
      <p>
        You are in queue with
        <strong>12</strong> other students. It may take a few minutes for a current student to reach out to you.
      </p>
    </div>
  </div>
</template>

<script>
// import { db } from '@/firebase'

import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AcceptedStudent',
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
</style>
