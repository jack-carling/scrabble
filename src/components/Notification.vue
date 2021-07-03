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
  position: fixed;
  top: 3rem;
  left: 3rem;
  background-color: $bg-letter;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  border: $score-border;
  box-shadow: $shadow;
  font-size: 0.8rem;
}
i {
  margin-right: 0.5rem;
  color: $main-text-color;
}
</style>
