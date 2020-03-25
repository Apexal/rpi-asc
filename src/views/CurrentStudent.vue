<template>
  <div class="current-student">
    <h1>Hello Current Student</h1>
    <p>Thank you for volunteering your time! Below is a queue of students waiting to chat with you, current students. Click on their names to see details on what they have specified they'd like to talk about and what platform they can be contacted over. Click "Claim" on a student if you are able to talk to them at that moment.</p>

    <div class="row">
      <div class="col">
        <div class="queue">
          <div class="card">
            <div class="card-header">
              Accepted Student Queue
              <span
                class="badge badge-primary"
              >{{ acceptedStudentsQueue.length }} waiting</span>
            </div>
            <ul class="list-group list-group-flush">
              <li
                v-if="acceptedStudentsQueue.length === 0"
                class="list-group-item text-muted"
              >No accepted students are on the queue at this moment. Please hold.</li>
              <li
                v-for="(queuedAcceptedStudent, key) in acceptedStudentsQueue"
                :key="queuedAcceptedStudent.id"
                class="list-group-item"
              >
                <p data-toggle="collapse" :data-target="'#drop-' + key" class="mb-0">
                  <strong>{{ queuedAcceptedStudent.name || 'Unnamed Student' }}</strong>
                  <span
                    v-if="queuedAcceptedStudent.previouslyClaimedBy.includes(userEmail)"
                    class="badge badge-warning"
                  >already spoken to</span>
                </p>
                <div class="collapse" :id="'drop-' + key">
                  <p>sadasd</p>
                  <button
                    class="btn btn-primary"
                    @click="claimAcceptedStudent(queuedAcceptedStudent)"
                  >Claim</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="claimed">
          <div
            class="card"
            v-for="claimedAcceptedStudent in claimedAcceptedStudents"
            :key="claimedAcceptedStudent.id"
          >
            <div class="card-body">
              <h5 class="card-title">{{ claimedAcceptedStudent.name || 'Unnamed Student' }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ claimedAcceptedStudent.id }}</h6>
              <p class="card-text">
                Contact
                <strong>{{ claimedAcceptedStudent.name || claimedAcceptedStudent.id }}</strong>
                through {{ claimedAcceptedStudent.contactPlatform }}
              </p>
              <a
                href="#"
                class="card-link"
                @click="releaseClaimedAcceptedStudent(claimedAcceptedStudent)"
              >Done Chatting</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import { mapGetters } from 'vuex'

export default {
  name: 'CurrentStudent',
  data () {
    return {
      acceptedStudentsQueue: [],
      claimedAcceptedStudents: []
    }
  },
  computed: {
    ...mapGetters(['userRole', 'userEmail'])
  },
  async mounted () {
    try {
      await this.$bind('acceptedStudentsQueue', db.collection('accepted').where('inQueue', '==', true))
      await this.$bind('claimedAcceptedStudents', db.collection('accepted').where('inQueue', '==', false).where('currentlyClaimedBy', '==', db.collection('current').doc(this.userEmail)))
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    async claimAcceptedStudent (queuedAcceptedStudent) {
      // Take the accepted student off of the queue, and set their current claimant to the logged in user
      try {
        await db.collection('accepted').doc(queuedAcceptedStudent.id).update({
          inQueue: false,
          currentlyClaimedBy: db.collection('current').doc(this.$store.state.user.profile.email)
        })

        this.$store.commit('ADD_ALERT', { type: 'success', text: `You have claimed ${queuedAcceptedStudent.name || queuedAcceptedStudent.id}! Please reach out to them now with the details they provided.` })
      } catch (e) {
        this.$store.commit('ADD_ALERT', { type: 'danger', text: 'Failed to claim accepted student. Please try again later...' })
      }
    },
    async releaseClaimedAcceptedStudent (claimedAcceptedStudent) {
      try {
        await db.collection('accepted').doc(claimedAcceptedStudent.id).update({
          inQueue: false,
          currentlyClaimedBy: null,
          previouslyClaimedBy: [...(claimedAcceptedStudent.previouslyClaimedBy || []), this.userEmail]
        })

        this.$store.commit('ADD_ALERT', { type: 'success', text: `You have released ${claimedAcceptedStudent.name || claimedAcceptedStudent.id}!` })
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e)
        }
        this.$store.commit('ADD_ALERT', { type: 'danger', text: 'Failed to release claimed student. Please try again later...' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
