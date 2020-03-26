<template>
  <div class="card mb-4">
    <div class="card-body">
      <h5 class="card-title">{{ acceptedStudent.name || 'Unnamed Student' }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ acceptedStudent.id }}</h6>
      <p class="card-text">
        Contact
        <strong>{{ acceptedStudent.name || acceptedStudent.id }}</strong>
        through {{ acceptedStudent.contactPlatform }}
      </p>
      <a href="#" class="card-link" @click="releaseClaimedAcceptedStudent">Done Chatting</a>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import { mapGetters } from 'vuex'

export default {
  name: 'AcceptedStudentCard',
  props: { acceptedStudent: { type: Object, required: true } },
  computed: {
    ...mapGetters(['userRole', 'userEmail'])
  },
  methods: {
    async releaseClaimedAcceptedStudent () {
      try {
        await db.collection('accepted').doc(this.acceptedStudent.id).update({
          inQueue: false,
          currentlyClaimedBy: null,
          previouslyClaimedBy: [...(this.acceptedStudent.previouslyClaimedBy || []), this.userEmail]
        })

        this.$store.commit('ADD_ALERT', { type: 'success', text: `You have released ${this.acceptedStudent.name || this.acceptedStudent.id}!` })
      } catch (e) {
        this.$store.commit('ADD_ALERT', { type: 'danger', text: 'Failed to release claimed student. Please try again later...' })
      }
    }
  }
}
</script>

<style>
</style>
