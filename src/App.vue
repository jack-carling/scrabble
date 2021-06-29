<template>
  <Board />
  <section class="app">
    <Rack />
    <Check />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Board from './components/Board.vue';
import Rack from './components/Rack.vue';
import Check from './components/Check.vue';

export default defineComponent({
  components: {
    Board,
    Rack,
    Check,
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Mono&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 1rem;
  background-color: $main-bg-color;
  color: $main-text-color;
  font-family: $default;
}
section.app {
  max-width: 100%;
}
#app {
  display: grid;
  grid-template-columns: 6.8fr 3.2fr;
  gap: 1rem;
}
button {
  @include no-appearance;
  border: none;
  cursor: pointer;
  font-family: $default;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background-color: $bg-empty;
  color: $main-text-color;
  outline: none;
}
button:hover {
  opacity: 0.75;
}
p {
  margin: 0.5rem 0;
}
@media only screen and (min-width: 1150px) {
  #app {
    grid-template-columns: 750px 1fr;
  }
}
.flip-enter-active {
  animation: flipInY;
  animation-duration: 1s;
}
.flip-leave-to {
  animation: flipOutY;
  animation-duration: 1s;
}
</style>
