<template>
  <div class="administration">
    <h1>Administration</h1>

    <h2>Current Students</h2>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th>Email</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in allCurrentStudents" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
        </tr>
      </tbody>
    </table>
    <h2>Accepted Students</h2>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Contact Platform</th>
          <th>Contact Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in allAcceptedStudets" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.contactPlatform }}</td>
          <td>{{ student.contactDetails }}</td>
        </tr>
      </tbody>
    </table>

    <StudentModal v-if="selectedStudent" :student="selectedStudent" />
  </div>
</template>

<script>
import { db } from '@/firebase'

import StudentModal from '@/components/StudentModal'

export default {
  name: 'Administration',
  components: { StudentModal },
  data () {
    return {
      allCurrentStudents: [],
      allAcceptedStudets: [],
      selectedStudent: null
    }
  },
  async mounted () {
    this.$bind('allCurrentStudents', db.collection('current'))
    this.$bind('allAcceptedStudets', db.collection('accepted'))
  }
}
</script>

<style lang="scss" scoped>
</style>
