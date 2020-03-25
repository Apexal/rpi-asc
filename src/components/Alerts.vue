<template>
  <div class="alerts">
    <div
      v-for="(alert, index) in $store.state.alerts"
      :key="index"
      class="alert alert-dismissible fade show"
      :class="'alert-' + alert.type"
      role="alert"
    >
      {{ alert.text }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alerts'
}
</script>

<style lang="scss" scoped>
</style>
