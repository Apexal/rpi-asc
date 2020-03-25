<template>
  <div class="mt-5 current-student">
    <h1>Hello Current Student</h1>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate natus ipsum placeat neque ullam voluptates nesciunt voluptatum rem praesentium rerum in exercitationem aspernatur, dolorum incidunt facilis? Cumque commodi aut mollitia.</p>

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
                v-for="(acceptedStudent, key) in acceptedStudentsQueue"
                :key="acceptedStudent.id"
                class="list-group-item"
              >
                <p data-toggle="collapse" :data-target="'#drop-' + key" class="mb-0">
                  <strong>{{ acceptedStudent.id }}</strong>
                </p>
                <div class="collapse" :id="'drop-' + key">
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt atque alias vitae? Nostrum vitae, iste ipsum aliquid odio a natus?</p>
                  <button class="btn btn-primary">Claim</button>
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
              <h5 class="card-title">{{ claimedAcceptedStudent.id }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Accepted Student</h6>
              <p
                class="card-text"
              >Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="card-link">Done Chatting</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'

// const queue = firebase.firestore()

export default {
  name: 'CurrentStudent',
  data () {
    return {
      acceptedStudentsQueue: [],
      claimedAcceptedStudents: []
    }
  },
  // firestore: {
  //   acceptedStudentsQueue: db.collection('accepted')
  // }
  async mounted () {
    try {
      await this.$bind('acceptedStudentsQueue', db.collection('accepted').where('inQueue', '==', true))
      await this.$bind('claimedAcceptedStudents', db.collection('accepted').where('inQueue', '==', false).where('currentlyClaimedBy', '==', db.collection('current').doc(this.$store.state.user.profile.email)))
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
