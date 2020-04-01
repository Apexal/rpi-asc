<template>
  <div
    class="loading-page d-flex justify-content-center align-items-center flex-column bg-dark text-white"
  >
    <i class="fas fa-spinner"></i>
  </div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style lang="scss" scoped>
.loading-page {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  font-size: 5em;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.fa-spinner {
  animation: rotate 1s linear 0s infinite;
}
</style>
