<template>
  <div class="current-student">
    <h1 class="mb-3">Hello Current Student</h1>
    <p>Thank you for volunteering your time! Below is a queue of students waiting to chat with you, current students. Click on their names to see details on what they have specified they'd like to talk about and what platform they can be contacted over. Click "Claim" on a student if you are able to talk to them at that moment.</p>

    <div class="row">
      <div class="col-md">
        <div class="card p-3">
          <Profile />
        </div>
      </div>
      <div class="col-md">
        <div class="queue py-3">
          <div class="card">
            <div class="card-header">
              <p class="float-right m-0">
                <span class="badge badge-info">{{ filteredQueue.length }} matches</span>
                <span class="badge badge-primary">{{ acceptedStudentsQueue.length }} waiting</span>
              </p>Accepted Student Queue
            </div>
            <ul class="list-group list-group-flush">
              <li
                v-if="filteredQueue.length === 0"
                class="list-group-item text-muted"
              >No{{ filterOtherPlatforms ? ' matching': '' }} accepted students are on the queue at this moment. Please wait!</li>
              <li
                v-for="(queuedAcceptedStudent, key) in filteredQueue"
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
                <div class="collapse mt-3" :id="'drop-' + key">
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

        <p class="text-muted p-1 mt-1">
          <span
            v-if="filterOtherPlatforms"
          >Only showing accepted students who are on the platforms you indicated.</span>
          <span v-else>
            Showing
            <strong>all</strong> accepted students.
          </span>
          <br />
          <a
            href="#"
            @click="filterOtherPlatforms = !filterOtherPlatforms"
          >{{ filterOtherPlatforms ? 'Show all' : 'Only show matches' }}</a>
        </p>
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
import { mapState, mapGetters } from 'vuex'

import Profile from '@/components/Profile'
import AcceptedStudentCard from '@/components/AcceptedStudentCard'

export default {
  name: 'CurrentStudent',
  components: { AcceptedStudentCard, Profile },
  data () {
    return {
      acceptedStudentsQueue: [],
      claimedAcceptedStudents: [],
      filterOtherPlatforms: true
    }
  },
  computed: {
    ...mapGetters(['userRole', 'userEmail']),
    ...mapState(['user']),
    userContactPlatforms () {
      return Object.keys(this.user.data.contactPlatforms).filter(platform => this.user.data.contactPlatforms[platform])
    },
    filteredQueue () {
      if (this.filterOtherPlatforms) {
        return this.acceptedStudentsQueue.filter(acceptedStudent => this.userContactPlatforms.includes(acceptedStudent.contactPlatform))
      }
      return this.acceptedStudentsQueue
    }
  },
  async mounted () {
    try {
      await this.bind()
    } catch (e) {
    }
  },
  methods: {
    async bind () {
      await this.$bind('acceptedStudentsQueue', db.collection('accepted')
        .where('inQueue', '==', true))

      await this.$bind('claimedAcceptedStudents', db.collection('accepted')
        .where('inQueue', '==', false)
        .where('currentlyClaimedBy', '==', db.collection('current').doc(this.userEmail)))
    },
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
