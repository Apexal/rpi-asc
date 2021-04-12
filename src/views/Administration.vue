<template>
  <div class="administration">
    <h1 class="mb-3">Administration</h1>

    <h2>Current Students ({{ allCurrentStudents.length }})</h2>
    <div class="card my-3">
      <div class="card-body d-flex text-center stats">
        <span>{{ totalConversations }} total conversations</span>
        <span>{{ contactLater.length }} contact later</span>
        <span>{{ neverQueued.length }} never queued</span>
      </div>
    </div>
    <form @submit.prevent="addCurrentStudents" class="form-inline mb-3">
      <div class="input-group mr-2">
        <input
          v-model.trim="newCurrentStudents"
          type="text"
          class="form-control"
          placeholder="Emails or RCS IDs comma separated"
          minlength="3"
          required
        />
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
    <h2>Accepted Students ({{ allAcceptedStudets.length }})</h2>
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

    <hr />
    <div class="row">
      <div class="col-12 col-md-6">
        <h3>Contact Later</h3>

        <div v-for="s in contactLater" :key="s.id" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ s.name || 'Unnamed Student' }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ s.id }}</h6>
            <p class="card-text">
              <!-- <span>{{ s.contactLaterDate }}</span>
              <span>{{ s.contactLaterTime }}</span>
              <span>{{ s.contactLaterTimezone }}</span>-->
              <strong>{{ contactLaterDisplay(s) }}</strong>
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <h3>Never Queued</h3>
        <ul>
          <li v-for="s in neverQueued" :key="s.id">{{ s.name || 'Unnammed' }} ({{ s.id }})</li>
        </ul>
      </div>
    </div>

    <StudentModal v-if="selectedStudent" :student="selectedStudent" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
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
      newCurrentStudents: '',
      selectedStudent: null
    }
  },
  async mounted () {
    this.$bind('allCurrentStudents', db.collection('current'))
    this.$bind('allAcceptedStudets', db.collection('accepted'))
  },
  computed: {
    ...mapGetters(['userEmail']),
    totalConversations () {
      return this.allAcceptedStudets.reduce((acc, s) => acc + s.previouslyClaimedBy.length, 0)
    },
    contactLater () {
      return this.allAcceptedStudets.filter(s => s.wantToBeContactedLater)
    },
    neverQueued () {
      return this.allAcceptedStudets.filter(s => s.previouslyClaimedBy.length === 0 && !s.inQueue)
    }
  },
  methods: {
    async addCurrentStudents () {
      if (!this.newCurrentStudents) return

      const addedEmails = []
      const batch = db.batch()
      for (let item of this.newCurrentStudents.split(/[\n,\t\s]/)) {
        item = item.trim().toLowerCase()
        if (item.length === 0) continue
        if (!item.endsWith('@rpi.edu')) item += '@rpi.edu'

        if (!this.allCurrentStudents.find(student => student.id === item)) {
          batch.set(db.collection('current').doc(item), {
            isAdmin: false,
            contactPlatforms: {
              phone: false,
              text: false,
              discord: false,
              skype: false,
              zoom: false,
              webex: false,
              wechat: false
            }
          })

          addedEmails.push(item)
        }
      }

      console.log('Added current students', addedEmails)

      await batch.commit()

      this.$store.commit('ADD_ALERT', { text: addedEmails.length + ' new current students are now able to login and talk to accepted students.' })
      this.newCurrentStudents = ''
    },
    async removeCurrentStudent (student) {
      if (student.id === this.userEmail) return
      if (!confirm('Are you sure you want to remove access from ' + student.id + '?')) return

      await db.collection('current').doc(student.id).delete()
      this.$store.commit('ADD_ALERT', { type: 'success', text: (student.id || student.name) + ' is NO LONGER able to login and talk to accepted students.' })
    },
    contactLaterDisplay (s) {
      if (s.contactLaterDate && s.contactLaterTime && s.contactLaterTimezone) {
        const timeZone = s.contactLaterTimezone
        const negative = timeZone.startsWith('-')
        const hours = Math.abs(parseFloat(timeZone))

        const timeZoneStr = (negative ? '-' : '+') + String(Math.floor(hours)).padStart(2, '0') + ':' + '00'

        const final = s.contactLaterDate + 'T' + s.contactLaterTime + ':00' + timeZoneStr
        const date = dayjs(final)

        return date.format('MMMM D h:mm a')
      }

      return 'No preferred time given.'
    }
  }
}
</script>

<style lang="scss" scoped>
.stats span {
  flex: 1;
}
</style>
