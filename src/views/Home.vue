<template>
  <component :is="component" />
</template>

<script>
import Login from '@/views/Login'
import CurrentStudent from '@/views/CurrentStudent'
import AcceptedStudent from '@/views/AcceptedStudent'

export default {
  name: 'Home',
  computed: {
    component () {
      if (this.$store.getters.loggedIn) {
        return this.$store.getters.userRole === 'accepted' ? AcceptedStudent : CurrentStudent
      }

      return Login
    }
  }
}
</script>
