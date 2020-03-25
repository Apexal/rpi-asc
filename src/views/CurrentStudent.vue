<template>
  <div class="mt-5 current-student">
    <h1>Hello Current Student</h1>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate natus ipsum placeat neque ullam voluptates nesciunt voluptatum rem praesentium rerum in exercitationem aspernatur, dolorum incidunt facilis? Cumque commodi aut mollitia.</p>
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
</template>

<script>
import { db } from '@/firebase'

// const queue = firebase.firestore()

export default {
  name: 'CurrentStudent',
  data () {
    return {
      acceptedStudentsQueue: []
    }
  },
  async mounted () {
    try {
      await this.$bind('acceptedStudentsQueue', db.collection('accepted'))
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
