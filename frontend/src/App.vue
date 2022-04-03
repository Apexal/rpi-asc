<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <transition name="fade" mode="in-out">
      <Loading v-if="!$store.state.loaded" />
    </transition>
    <main v-if="$store.state.loaded" class="container mt-5">
      <Alerts />
      <router-view />
    </main>

    <footer class="footer bg-light mt-5 p-5 text-muted text-center">
      <div class="container">
        <p>
          Created by an
          <a
            href="https://handbook.rcos.io"
            target="_blank"
            rel="noopener noreferrer"
          >RCOS Student</a> and supported by the Department of Computer Science
        </p>
        <a target="_blank" href="https://github.com/Apexal/rpi-asc">
          <i class="fab fa-github"></i> Source Code
        </a>
      </div>
    </footer>
  </div>
</template>
<script>
// import messaging from '@/messaging'
import Loading from '@/views/Loading'

import Navbar from '@/components/Navbar'
import Alerts from '@/components/Alerts'

export default {
  name: 'App',
  components: { Navbar, Alerts, Loading }
}
</script>
<style lang="scss">
html,
body {
  min-height: 100vh;
}
.clickable {
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>
