<template>
  <div class="current-student">
    <h1 class="mb-3">Hello Current Student</h1>
    <p>Thank you for volunteering your time! Below is a queue of students waiting to chat with you, current students. Click on their names to see details on what they have specified they'd like to talk about and what platform they can be contacted over. Click "Claim" on a student if you are able to talk to them at that moment.</p>

    <div class="row">
      <div class="col">
        <div class="card p-3">
          <Profile />
        </div>
      </div>
      <div class="col">
        <div class="queue">
          <div class="card">
            <div class="card-header">
              <span
                class="badge badge-primary float-right"
              >{{ acceptedStudentsQueue.length }} waiting</span>
              Accepted Student Queue
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
                <p data-toggle="collapse" :data-target="'#drop-' + key" class="clickable mb-0">
                  <strong>{{ queuedAcceptedStudent.name || 'Unnamed Student' }}</strong>
                  <span
                    v-if="queuedAcceptedStudent.previouslyClaimedBy.includes(userEmail)"
                    class="badge badge-warning"
                  >already spoken to</span>
                </p>
                <div class="collapse" :id="'drop-' + key">
                  <div class="form-group">
                    <input
                      class="form-control"
                      type="text"
                      :value="queuedAcceptedStudent.id"
                      readonly
                    />
                  </div>
                  <div class="form-group">
                    <textarea
                      rows="2"
                      class="form-control"
                      :value="queuedAcceptedStudent.topics"
                      placeholder="No topics mentioned."
                      readonly
                    ></textarea>
                  </div>
                  <div class="form-group row">
                    <div class="col">
                      <input
                        class="form-control"
                        type="text"
                        :value="queuedAcceptedStudent.contactPlatform"
                        readonly
                      />
                    </div>
                    <div class="col">
                      <input
                        class="form-control"
                        type="text"
                        :value="queuedAcceptedStudent.contactDetails"
                        readonly
                      />
                    </div>
                  </div>

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
      <div v-if="claimedAcceptedStudents.length > 0" class="col">
        <div class="claimed">
          <AcceptedStudentCard
            v-for="claimedAcceptedStudent in claimedAcceptedStudents"
            :key="claimedAcceptedStudent.id"
            :accepted-student="claimedAcceptedStudent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import { mapGetters } from 'vuex'

import Profile from '@/components/Profile'
import AcceptedStudentCard from '@/components/AcceptedStudentCard'

export default {
  name: 'CurrentStudent',
  components: { AcceptedStudentCard, Profile },
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
