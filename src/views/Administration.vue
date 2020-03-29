<template>
  <div class="administration">
    <h1 class="mb-3">Administration</h1>

    <h2>Current Students</h2>
    <form @submit.prevent="addCurrentStudent" class="form-inline mb-3">
      <div class="input-group mr-2">
        <input
          v-model.trim="newCurrentStudent"
          type="text"
          class="form-control"
          placeholder="RCS ID"
          minlength="3"
          required
        />
        <div class="input-group-append">
          <span class="input-group-text" id="rpi-addon">@rpi.edu</span>
        </div>
      </div>
      <button class="btn btn-success">Add RPI Student</button>
    </form>
    <table class="table table-sm">
      <thead class="thead-dark">
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in allCurrentStudents" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.name || 'No name given.' }}</td>
          <td v-if="userEmail !== student.id">
            <button class="btn btn-sm btn-danger" @click="removeCurrentStudent(student)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>Accepted Students</h2>
    <table class="table table-sm">
      <thead class="thead-dark">
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Contact Platform</th>
          <th>Contact Details</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in allAcceptedStudets" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.contactPlatform }}</td>
          <td>{{ student.contactDetails }}</td>
          <td>
            <button class="btn btn-sm btn-danger">Ban</button>
          </td>
        </tr>
      </tbody>
    </table>

    <StudentModal v-if="selectedStudent" :student="selectedStudent" />
  </div>
</template>

<script>
import { db } from '@/firebase'
import { mapGetters } from 'vuex'

import StudentModal from '@/components/StudentModal'

export default {
  name: 'Administration',
  components: { StudentModal },
  data () {
    return {
      allCurrentStudents: [],
      allAcceptedStudets: [],
      newCurrentStudent: '',
      selectedStudent: null
    }
  },
  async mounted () {
    this.$bind('allCurrentStudents', db.collection('current'))
    this.$bind('allAcceptedStudets', db.collection('accepted'))
  },
  computed: {
    ...mapGetters(['userEmail'])
  },
  methods: {
    async addCurrentStudent () {
      if (!this.newCurrentStudent) return
      if (this.allCurrentStudents.find(student => student.id === this.newCurrentStudent + '@rpi.edu')) return alert('That user already has access.')
      if (!confirm('Are you sure you want to give access to ' + this.newCurrentStudent + '@rpi.edu?')) return

      const email = this.newCurrentStudent + '@rpi.edu'
      await db.collection('current').doc(email).set({ isAdmin: false })
      this.$store.commit('ADD_ALERT', { text: this.newCurrentStudent + ' is now able to login and talk to accepted students.' })
      this.newCurrentStudent = ''
    },
    async removeCurrentStudent (student) {
      if (student.id === this.userEmail) return
      if (!confirm('Are you sure you want to remove access from ' + student.id + '?')) return

      await db.collection('current').doc(student.id).delete()
      this.$store.commit('ADD_ALERT', { type: 'success', text: (student.id || student.name) + ' is NO LONGER able to login and talk to accepted students.' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
