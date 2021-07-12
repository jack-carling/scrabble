<template>
  <section class="notification">
    <i class="material-icons">notifications</i>
    {{ message }}
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    message: {
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
section.notification {
  z-index: 999;
  position: fixed;
  top: 3rem;
  left: 3rem;
  background-color: $letter-bg;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  border: $score-border;
  font-size: 0.8rem;
  @include shadow(0.5rem);
}
i {
  margin-right: 0.5rem;
  color: $default-font-color;
}
</style>
