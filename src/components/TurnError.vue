<template>
  <section>
    <i class="material-icons">notifications</i>
    Please wait for your turn!
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style lang="scss" scoped>
section {
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
}
i {
  margin-right: 0.5rem;
  color: $main-text-color;
}
</style>
