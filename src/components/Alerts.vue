<template>
  <div class="alerts">
    <div
      v-for="(alert, index) in alerts"
      :key="index"
      class="alert alert-dismissible fade show"
      :class="'alert-' + alert.type"
      role="alert"
    >{{ alert.text }}</div>
  </div>
</template>

<script>
export default {
  name: 'Alerts'
}
</script>

<style lang="scss" scoped>
</style>
