<template>
  <div class="accepted-student">
    <h1 class="mb-3">Accepted Student</h1>

    <div class="row">
      <div class="col-md">
        <div class="card p-3">
          <Profile />
        </div>
      </div>
      <div class="col-md">
        <div v-if="currentlyClaimedBy" class="in-queue py-3">
          <h3>You have been claimed by</h3>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ currentlyClaimedBy.name || 'Unnamed Current Student' }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ currentlyClaimedBy.id }}</h6>
              <p class="card-text">
                They will be reaching out to you shortly over
                <strong>{{ user.data.contactPlatform }}</strong>
                ({{ user.data.contactDetails }})
              </p>
            </div>
          </div>
        </div>
        <div v-else-if="user.data.inQueue" class="claimed py-3">
          <h3>
            You are in queue with
            <strong>{{ queueCount }}</strong> other students. It may take a few minutes for a current student to reach out to you. Remain here for updates.
          </h3>
          <p class="text-center mt-5 mb-5">
            <i class="fas fa-spinner"></i>
            <br />
            <button class="mt-3 btn btn-lg btn-danger" @click="offWaitlist">Done Chatting</button>
          </p>
        </div>
        <div v-else>
          <div v-if="queueOpen">
            <h3>
              You are
              <strong>not</strong> currently in the queue of
              <strong>{{ queueCount }}</strong> for chatting with current students. Join the queue to be contacted.
            </h3>
            <div class="text-center">
              <button class="mt-3 btn btn-lg btn-danger join-queue" @click="onWaitlist">Join Queue</button>
            </div>
          </div>
          <hr>
          <div class="input-group">
            <label class="h5">
              <input
                type="checkbox"
                :checked="user.data.wantToBeContactedLater"
                @click="toggleLaterContact"
                ref="contact-later-checkbox"
              />
              Contact me at a
              <strong>later date and time?</strong>
              You will be emailed by a faculty member and can coordinate a time to chat over
              <span
                class="text-capitalize"
              >{{ user.data.contactPlatform }}</span> with a current RPI student.
            </label>
          </div>
          <div>
            <label
              class="mt-2"
              for="contact-later-date"
            >Choose a preferred time to be contacted (just for reference)</label>
            <div class="form-group row">
              <div class="col-12 col-md-6">
                <input
                  v-model="user.data.contactLaterDate"
                  type="date"
                  name="date"
                  id="contact-later-date"
                  class="form-control"
                  @change="handleContactLaterChange"
                />
              </div>
              <div class="col-12 col-md-6">
                <input
                  v-model="user.data.contactLaterTime"
                  type="time"
                  name="time"
                  id="contact-later-time"
                  class="form-control"
                  @change="handleContactLaterChange"
                />
              </div>

              <div class="col-12 col-md-10">
                <select
                  v-model="user.data.contactLaterTimezone"
                  @change="handleContactLaterChange"
                  name="time-zone"
                  id="contact-later-time-zone"
                  class="custom-select"
                >
                  <option value>Choose your timezone</option>
                  <option
                    timeZoneId="1"
                    gmtAdjustment="GMT-12:00"
                    useDaylightTime="0"
                    value="-12"
                  >(GMT-12:00) International Date Line West</option>
                  <option
                    timeZoneId="2"
                    gmtAdjustment="GMT-11:00"
                    useDaylightTime="0"
                    value="-11"
                  >(GMT-11:00) Midway Island, Samoa</option>
                  <option
                    timeZoneId="3"
                    gmtAdjustment="GMT-10:00"
                    useDaylightTime="0"
                    value="-10"
                  >(GMT-10:00) Hawaii</option>
                  <option
                    timeZoneId="4"
                    gmtAdjustment="GMT-09:00"
                    useDaylightTime="1"
                    value="-9"
                  >(GMT-09:00) Alaska</option>
                  <option
                    timeZoneId="5"
                    gmtAdjustment="GMT-08:00"
                    useDaylightTime="1"
                    value="-8"
                  >(GMT-08:00) Pacific Time (US & Canada)</option>
                  <option
                    timeZoneId="6"
                    gmtAdjustment="GMT-08:00"
                    useDaylightTime="1"
                    value="-8"
                  >(GMT-08:00) Tijuana, Baja California</option>
                  <option
                    timeZoneId="7"
                    gmtAdjustment="GMT-07:00"
                    useDaylightTime="0"
                    value="-7"
                  >(GMT-07:00) Arizona</option>
                  <option
                    timeZoneId="8"
                    gmtAdjustment="GMT-07:00"
                    useDaylightTime="1"
                    value="-7"
                  >(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                  <option
                    timeZoneId="9"
                    gmtAdjustment="GMT-07:00"
                    useDaylightTime="1"
                    value="-7"
                  >(GMT-07:00) Mountain Time (US & Canada)</option>
                  <option
                    timeZoneId="10"
                    gmtAdjustment="GMT-06:00"
                    useDaylightTime="0"
                    value="-6"
                  >(GMT-06:00) Central America</option>
                  <option
                    timeZoneId="11"
                    gmtAdjustment="GMT-06:00"
                    useDaylightTime="1"
                    value="-6"
                  >(GMT-06:00) Central Time (US & Canada)</option>
                  <option
                    timeZoneId="12"
                    gmtAdjustment="GMT-06:00"
                    useDaylightTime="1"
                    value="-6"
                  >(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                  <option
                    timeZoneId="13"
                    gmtAdjustment="GMT-06:00"
                    useDaylightTime="0"
                    value="-6"
                  >(GMT-06:00) Saskatchewan</option>
                  <option
                    timeZoneId="15"
                    gmtAdjustment="GMT-05:00"
                    useDaylightTime="1"
                    value="-5"
                    selected
                  >(GMT-05:00) Eastern Time (US & Canada)</option>
                  <option
                    timeZoneId="14"
                    gmtAdjustment="GMT-05:00"
                    useDaylightTime="0"
                    value="-5"
                  >(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                  <option
                    timeZoneId="16"
                    gmtAdjustment="GMT-05:00"
                    useDaylightTime="1"
                    value="-5"
                  >(GMT-05:00) Indiana (East)</option>
                  <option
                    timeZoneId="17"
                    gmtAdjustment="GMT-04:00"
                    useDaylightTime="1"
                    value="-4"
                  >(GMT-04:00) Atlantic Time (Canada)</option>
                  <option
                    timeZoneId="18"
                    gmtAdjustment="GMT-04:00"
                    useDaylightTime="0"
                    value="-4"
                  >(GMT-04:00) Caracas, La Paz</option>
                  <option
                    timeZoneId="19"
                    gmtAdjustment="GMT-04:00"
                    useDaylightTime="0"
                    value="-4"
                  >(GMT-04:00) Manaus</option>
                  <option
                    timeZoneId="20"
                    gmtAdjustment="GMT-04:00"
                    useDaylightTime="1"
                    value="-4"
                  >(GMT-04:00) Santiago</option>
                  <option
                    timeZoneId="21"
                    gmtAdjustment="GMT-03:30"
                    useDaylightTime="1"
                    value="-3.5"
                  >(GMT-03:30) Newfoundland</option>
                  <option
                    timeZoneId="22"
                    gmtAdjustment="GMT-03:00"
                    useDaylightTime="1"
                    value="-3"
                  >(GMT-03:00) Brasilia</option>
                  <option
                    timeZoneId="23"
                    gmtAdjustment="GMT-03:00"
                    useDaylightTime="0"
                    value="-3"
                  >(GMT-03:00) Buenos Aires, Georgetown</option>
                  <option
                    timeZoneId="24"
                    gmtAdjustment="GMT-03:00"
                    useDaylightTime="1"
                    value="-3"
                  >(GMT-03:00) Greenland</option>
                  <option
                    timeZoneId="25"
                    gmtAdjustment="GMT-03:00"
                    useDaylightTime="1"
                    value="-3"
                  >(GMT-03:00) Montevideo</option>
                  <option
                    timeZoneId="26"
                    gmtAdjustment="GMT-02:00"
                    useDaylightTime="1"
                    value="-2"
                  >(GMT-02:00) Mid-Atlantic</option>
                  <option
                    timeZoneId="27"
                    gmtAdjustment="GMT-01:00"
                    useDaylightTime="0"
                    value="-1"
                  >(GMT-01:00) Cape Verde Is.</option>
                  <option
                    timeZoneId="28"
                    gmtAdjustment="GMT-01:00"
                    useDaylightTime="1"
                    value="-1"
                  >(GMT-01:00) Azores</option>
                  <option
                    timeZoneId="29"
                    gmtAdjustment="GMT+00:00"
                    useDaylightTime="0"
                    value="0"
                  >(GMT+00:00) Casablanca, Monrovia, Reykjavik</option>
                  <option
                    timeZoneId="30"
                    gmtAdjustment="GMT+00:00"
                    useDaylightTime="1"
                    value="0"
                  >(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
                  <option
                    timeZoneId="31"
                    gmtAdjustment="GMT+01:00"
                    useDaylightTime="1"
                    value="1"
                  >(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                  <option
                    timeZoneId="32"
                    gmtAdjustment="GMT+01:00"
                    useDaylightTime="1"
                    value="1"
                  >(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
                  <option
                    timeZoneId="33"
                    gmtAdjustment="GMT+01:00"
                    useDaylightTime="1"
                    value="1"
                  >(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                  <option
                    timeZoneId="34"
                    gmtAdjustment="GMT+01:00"
                    useDaylightTime="1"
                    value="1"
                  >(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
                  <option
                    timeZoneId="35"
                    gmtAdjustment="GMT+01:00"
                    useDaylightTime="1"
                    value="1"
                  >(GMT+01:00) West Central Africa</option>
                  <option
                    timeZoneId="36"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="1"
                    value="2"
                  >(GMT+02:00) Amman</option>
                  <option
                    timeZoneId="37"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="1"
                    value="2"
                  >(GMT+02:00) Athens, Bucharest, Istanbul</option>
                  <option
                    timeZoneId="38"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="1"
                    value="2"
                  >(GMT+02:00) Beirut</option>
                  <option
                    timeZoneId="39"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="1"
                    value="2"
                  >(GMT+02:00) Cairo</option>
                  <option
                    timeZoneId="40"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="0"
                    value="2"
                  >(GMT+02:00) Harare, Pretoria</option>
                  <option
                    timeZoneId="41"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="1"
                    value="2"
                  >(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
                  <option
                    timeZoneId="42"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="1"
                    value="2"
                  >(GMT+02:00) Jerusalem</option>
                  <option
                    timeZoneId="43"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="1"
                    value="2"
                  >(GMT+02:00) Minsk</option>
                  <option
                    timeZoneId="44"
                    gmtAdjustment="GMT+02:00"
                    useDaylightTime="1"
                    value="2"
                  >(GMT+02:00) Windhoek</option>
                  <option
                    timeZoneId="45"
                    gmtAdjustment="GMT+03:00"
                    useDaylightTime="0"
                    value="3"
                  >(GMT+03:00) Kuwait, Riyadh, Baghdad</option>
                  <option
                    timeZoneId="46"
                    gmtAdjustment="GMT+03:00"
                    useDaylightTime="1"
                    value="3"
                  >(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
                  <option
                    timeZoneId="47"
                    gmtAdjustment="GMT+03:00"
                    useDaylightTime="0"
                    value="3"
                  >(GMT+03:00) Nairobi</option>
                  <option
                    timeZoneId="48"
                    gmtAdjustment="GMT+03:00"
                    useDaylightTime="0"
                    value="3"
                  >(GMT+03:00) Tbilisi</option>
                  <option
                    timeZoneId="49"
                    gmtAdjustment="GMT+03:30"
                    useDaylightTime="1"
                    value="3.5"
                  >(GMT+03:30) Tehran</option>
                  <option
                    timeZoneId="50"
                    gmtAdjustment="GMT+04:00"
                    useDaylightTime="0"
                    value="4"
                  >(GMT+04:00) Abu Dhabi, Muscat</option>
                  <option
                    timeZoneId="51"
                    gmtAdjustment="GMT+04:00"
                    useDaylightTime="1"
                    value="4"
                  >(GMT+04:00) Baku</option>
                  <option
                    timeZoneId="52"
                    gmtAdjustment="GMT+04:00"
                    useDaylightTime="1"
                    value="4"
                  >(GMT+04:00) Yerevan</option>
                  <option
                    timeZoneId="53"
                    gmtAdjustment="GMT+04:30"
                    useDaylightTime="0"
                    value="4.5"
                  >(GMT+04:30) Kabul</option>
                  <option
                    timeZoneId="54"
                    gmtAdjustment="GMT+05:00"
                    useDaylightTime="1"
                    value="5"
                  >(GMT+05:00) Yekaterinburg</option>
                  <option
                    timeZoneId="55"
                    gmtAdjustment="GMT+05:00"
                    useDaylightTime="0"
                    value="5"
                  >(GMT+05:00) Islamabad, Karachi, Tashkent</option>
                  <option
                    timeZoneId="56"
                    gmtAdjustment="GMT+05:30"
                    useDaylightTime="0"
                    value="5.5"
                  >(GMT+05:30) Sri Jayawardenapura</option>
                  <option
                    timeZoneId="57"
                    gmtAdjustment="GMT+05:30"
                    useDaylightTime="0"
                    value="5.5"
                  >(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                  <option
                    timeZoneId="58"
                    gmtAdjustment="GMT+05:45"
                    useDaylightTime="0"
                    value="5.75"
                  >(GMT+05:45) Kathmandu</option>
                  <option
                    timeZoneId="59"
                    gmtAdjustment="GMT+06:00"
                    useDaylightTime="1"
                    value="6"
                  >(GMT+06:00) Almaty, Novosibirsk</option>
                  <option
                    timeZoneId="60"
                    gmtAdjustment="GMT+06:00"
                    useDaylightTime="0"
                    value="6"
                  >(GMT+06:00) Astana, Dhaka</option>
                  <option
                    timeZoneId="61"
                    gmtAdjustment="GMT+06:30"
                    useDaylightTime="0"
                    value="6.5"
                  >(GMT+06:30) Yangon (Rangoon)</option>
                  <option
                    timeZoneId="62"
                    gmtAdjustment="GMT+07:00"
                    useDaylightTime="0"
                    value="7"
                  >(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                  <option
                    timeZoneId="63"
                    gmtAdjustment="GMT+07:00"
                    useDaylightTime="1"
                    value="7"
                  >(GMT+07:00) Krasnoyarsk</option>
                  <option
                    timeZoneId="64"
                    gmtAdjustment="GMT+08:00"
                    useDaylightTime="0"
                    value="8"
                  >(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                  <option
                    timeZoneId="65"
                    gmtAdjustment="GMT+08:00"
                    useDaylightTime="0"
                    value="8"
                  >(GMT+08:00) Kuala Lumpur, Singapore</option>
                  <option
                    timeZoneId="66"
                    gmtAdjustment="GMT+08:00"
                    useDaylightTime="0"
                    value="8"
                  >(GMT+08:00) Irkutsk, Ulaan Bataar</option>
                  <option
                    timeZoneId="67"
                    gmtAdjustment="GMT+08:00"
                    useDaylightTime="0"
                    value="8"
                  >(GMT+08:00) Perth</option>
                  <option
                    timeZoneId="68"
                    gmtAdjustment="GMT+08:00"
                    useDaylightTime="0"
                    value="8"
                  >(GMT+08:00) Taipei</option>
                  <option
                    timeZoneId="69"
                    gmtAdjustment="GMT+09:00"
                    useDaylightTime="0"
                    value="9"
                  >(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                  <option
                    timeZoneId="70"
                    gmtAdjustment="GMT+09:00"
                    useDaylightTime="0"
                    value="9"
                  >(GMT+09:00) Seoul</option>
                  <option
                    timeZoneId="71"
                    gmtAdjustment="GMT+09:00"
                    useDaylightTime="1"
                    value="9"
                  >(GMT+09:00) Yakutsk</option>
                  <option
                    timeZoneId="72"
                    gmtAdjustment="GMT+09:30"
                    useDaylightTime="0"
                    value="9.5"
                  >(GMT+09:30) Adelaide</option>
                  <option
                    timeZoneId="73"
                    gmtAdjustment="GMT+09:30"
                    useDaylightTime="0"
                    value="9.5"
                  >(GMT+09:30) Darwin</option>
                  <option
                    timeZoneId="74"
                    gmtAdjustment="GMT+10:00"
                    useDaylightTime="0"
                    value="10"
                  >(GMT+10:00) Brisbane</option>
                  <option
                    timeZoneId="75"
                    gmtAdjustment="GMT+10:00"
                    useDaylightTime="1"
                    value="10"
                  >(GMT+10:00) Canberra, Melbourne, Sydney</option>
                  <option
                    timeZoneId="76"
                    gmtAdjustment="GMT+10:00"
                    useDaylightTime="1"
                    value="10"
                  >(GMT+10:00) Hobart</option>
                  <option
                    timeZoneId="77"
                    gmtAdjustment="GMT+10:00"
                    useDaylightTime="0"
                    value="10"
                  >(GMT+10:00) Guam, Port Moresby</option>
                  <option
                    timeZoneId="78"
                    gmtAdjustment="GMT+10:00"
                    useDaylightTime="1"
                    value="10"
                  >(GMT+10:00) Vladivostok</option>
                  <option
                    timeZoneId="79"
                    gmtAdjustment="GMT+11:00"
                    useDaylightTime="1"
                    value="11"
                  >(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
                  <option
                    timeZoneId="80"
                    gmtAdjustment="GMT+12:00"
                    useDaylightTime="1"
                    value="12"
                  >(GMT+12:00) Auckland, Wellington</option>
                  <option
                    timeZoneId="81"
                    gmtAdjustment="GMT+12:00"
                    useDaylightTime="0"
                    value="12"
                  >(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                  <option
                    timeZoneId="82"
                    gmtAdjustment="GMT+13:00"
                    useDaylightTime="0"
                    value="13"
                  >(GMT+13:00) Nuku'alofa</option>
                </select>
              </div>

              <div class="col-12 col-md-2">
                <span
                  class="badge"
                  :class="contactLaterSaved ? 'badge-success' : 'badge-warning'"
                >{{ contactLaterSaved ? 'Saved' : 'Saving...'}}</span>
              </div>
            </div>
          </div>
        </div>

        <hr />
        <p v-if="queueOpen" class="text-muted">
          The queue will close at
          <strong>{{ queueEnd }}</strong>
          ({{ queueEndFromNow }})
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Profile from '@/components/Profile'

import { functions } from '@/firebase'
import { onSnapshot } from '@firebase/firestore'
import { httpsCallable } from '@firebase/functions'

export default {
  name: 'AcceptedStudent',
  components: { Profile },
  data () {
    return {
      queueCount: 0,
      currentlyClaimedByUnSub: null,
      currentlyClaimedBy: null,
      contactLaterTimeout: null,
      contactLaterSaved: true
    }
  },
  computed: {
    ...mapState(['user', 'now']),
    ...mapGetters(['userEmail', 'queueOpen']),
    queueEnd () {
      return this.$store.state.queueEnd.format('h:mma')
    },
    queueEndFromNow () {
      return this.$store.state.queueEnd.from(this.now)
    },
    profileSet () {
      return this.user.data.name && this.user.data.contactPlatform && this.user.data.contactDetails
    },
    contactLaterInfoSet () {
      return this.user.data.contactLaterDate && this.user.data.contactLaterTime && this.user.data.contactLaterTimezone
    }
  },
  mounted () {
    setInterval(this.updateQueueCount, 60 * 1000 * 2)
    this.updateQueueCount()
  },
  watch: {
    'user.data.currentlyClaimedBy': {
      immediate: true,
      handler (newClaimedBy) {
        if (newClaimedBy) {
          this.currentlyClaimedByUnSub = onSnapshot(this.user.data.currentlyClaimedBy, (doc) => {
            this.currentlyClaimedBy = {
              id: doc.id,
              ...doc.data()
            }
          })
        } else if (this.currentlyClaimedBy) {
          this.currentlyClaimedByUnSub()
          this.currentlyClaimedBy = null
        }
      }
    }
  },
  methods: {
    async updateQueueCount () {
      try {
        const getQueueCount = httpsCallable(functions, 'queueCount')
        const result = await getQueueCount({})
        this.queueCount = this.user.data.inQueue ? result.data.length - 1 : result.data.length
      } catch (e) {
        this.queueCount = 0
      }
    },
    async offWaitlist () {
      if (!confirm('Done chatting?')) return

      await this.$store.dispatch('UPDATE_USER', { inQueue: false })
    },
    async onWaitlist () {
      if (this.user.data.contactPlatform === 'none' || !this.user.data.contactDetails) return alert('Please enter your contact platform and details first!')
      if (!confirm('Enter the queue?')) return

      await this.$store.dispatch('UPDATE_USER', { inQueue: true, queueEnterTime: new Date(), wantToBeContactedLater: false })
    },
    handleContactLaterChange () {
      this.contactLaterSaved = false
      clearTimeout(this.contactLaterTimeout)
      this.contactLaterTimeout = setTimeout(this.updateContactLater, 1000)
    },
    async updateContactLater () {
      const updates = {}
      // contactLaterDate: this.user.data.contactLaterDate, contactLaterTime: this.user.data.contactLaterTime, contactLaterTimezone: this.user.data.contactLaterTimezone
      if (this.user.data.contactLaterDate) { updates.contactLaterDate = this.user.data.contactLaterDate }
      if (this.user.data.contactLaterTime) { updates.contactLaterTime = this.user.data.contactLaterTime }
      if (this.user.data.contactLaterTimezone) { updates.contactLaterTimezone = this.user.data.contactLaterTimezone }

      await this.$store.dispatch('UPDATE_USER', updates)
      this.contactLaterSaved = true
    },
    async toggleLaterContact (event) {
      // Ensure they've given all data
      if (!this.profileSet) {
        this.$refs['contact-later-checkbox'].checked = false
        return alert('Please fill out your profile and contact details first!')
      }
      if (!this.contactLaterInfoSet) {
        this.$refs['contact-later-checkbox'].checked = false
        return alert('Please choose a preferred time to be contacted first!')
      }

      const checked = event.target.checked
      await this.$store.dispatch('UPDATE_USER', { wantToBeContactedLater: checked })

      if (checked) {
        alert('The CS Faculty have been directly notified and you will be contacted soon!')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
.fa-spinner {
  font-size: 5em;
  animation: spin 1s linear infinite;
}

.join-queue {
  font-size: 2.5em;
}
</style>
