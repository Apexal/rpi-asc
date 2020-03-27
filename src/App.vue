<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <main class="container mt-5">
      <Alerts />
      <router-view />
    </main>

    <footer class="footer bg-light mt-5 p-5">
      <div class="container">
        <span class="text-muted">
          Created by Frank Matranga '22 ITWS & CS and support by the Department of Computer Science |
          <a
            href="#"
          >
            <i class="fab fa-github"></i> Source Code
          </a>
        </span>
      </div>
    </footer>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
import Alerts from '@/components/Alerts'

export default {
  name: 'App',
  components: { Navbar, Alerts }
}
</script>
<style lang="scss">
</style>
