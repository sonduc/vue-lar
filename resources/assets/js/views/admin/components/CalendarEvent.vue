<template>
  <div :data-content='event.description'>
    <div>
      <i class="icon" :class="[event.icon]"></i>
      {{ event.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CalendarEvent",
  props: {
    event: {}
  },
};
</script>

<style scoped>
div {
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  min-height: 25px;
}
</style>
