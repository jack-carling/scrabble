<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    this.$store.dispatch('startSSE');
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Mono&family=Zen+Loop&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 1rem;
  display: flex;
  justify-content: center;
  background-color: $default-bg;
  color: $default-font-color;
  font-family: $default-font;
}
button {
  @include no-appearance;
  border: none;
  cursor: pointer;
  font-family: $default-font;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background-color: $empty-bg;
  color: $default-font-color;
  outline: none;
}
button:hover {
  opacity: 0.75;
}
p {
  margin: 0.5rem 0;
}
.flip-enter-active {
  animation: flipInY;
  animation-duration: 1s;
}
.flip-leave-to {
  animation: flipOutY;
  animation-duration: 1s;
}
.fade-enter-active {
  animation: fadeIn;
  animation-duration: 1s;
}
.fade-leave-to {
  animation: fadeOut;
  animation-duration: 1s;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
