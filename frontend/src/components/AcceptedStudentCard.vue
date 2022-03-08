<template>
  <div class="card mb-4">
    <div class="card-body">
      <h5 class="card-title">{{ acceptedStudent.name || 'Unnamed Student' }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ acceptedStudent.id }}</h6>
      <p class="card-text">
        Contact
        <strong>{{ acceptedStudent.name || acceptedStudent.id }}</strong>
        through
        <strong class="text-capitalize">{{ acceptedStudent.contactPlatform }}</strong>
      </p>
      <div class="input-group mb-3">
        <input class="form-control" type="text" :value="acceptedStudent.contactDetails" readonly />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            title="Copy"
            @click="copyToClipboard(acceptedStudent.contactDetails)"
          >
            <i class="fas fa-clipboard"></i>
          </button>
        </div>
      </div>
      <b>Discussion Topics</b>
      <p>"{{ acceptedStudent.topics || 'None given.' }}"</p>
      <a href="#" class="card-link" @click="releaseClaimedAcceptedStudent">Done Chatting</a>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import { collection, doc, updateDoc } from 'firebase/firestore'

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
        await updateDoc(doc(collection(db, 'accepted'), this.acceptedStudent.id), {
          inQueue: false,
          currentlyClaimedBy: null,
          previouslyClaimedBy: [...(this.acceptedStudent.previouslyClaimedBy || []), this.userEmail]
        })
        // await db.collection('accepted').doc(this.acceptedStudent.id).update()

        this.$store.commit('ADD_ALERT', { type: 'success', text: `You have released ${this.acceptedStudent.name || this.acceptedStudent.id}!` })
      } catch (e) {
        this.$store.commit('ADD_ALERT', { type: 'danger', text: 'Failed to release claimed student. Please try again later...' })
      }
    },
    copyToClipboard (text) {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      this.$store.commit('ADD_ALERT', { type: 'info', text: 'Copied details!' })
    }
  }
}
</script>

<style>
</style>
