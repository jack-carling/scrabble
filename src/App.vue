<template>
  <Lobby v-if="lobby" />
  <transition name="flip">
    <TurnError v-if="error" />
  </transition>
  <Board @incorrect-turn="displayError" />
  <section class="app">
    <Turn />
    <Rack />
    <Check @incorrect-turn="displayError" />
    <Score />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Lobby from './components/Lobby.vue';
import TurnError from './components/TurnError.vue';
import Board from './components/Board.vue';
import Turn from './components/Turn.vue';
import Rack from './components/Rack.vue';
import Check from './components/Check.vue';
import Score from './components/Score.vue';

export default defineComponent({
  components: {
    Lobby,
    TurnError,
    Board,
    Turn,
    Rack,
    Check,
    Score,
  },
  data() {
    return {
      error: false,
      timeout: 0,
    };
  },
  computed: {
    id(): string {
      return this.$store.state.id;
    },
    lobby(): boolean {
      return this.$store.state.lobby;
    },
  },
  methods: {
    displayError() {
      window.clearTimeout(this.timeout);
      this.error = true;
      this.timeout = window.setTimeout(() => {
        this.error = false;
      }, 2000);
    },
  },
  async mounted() {
    this.$store.dispatch('startSSE');
  },
  watch: {
    async id() {
      const name = prompt('What is your name?') || 'Player';
      const room = 'ABC123';
      let res: any = await fetch(`/sse/join?id=${this.id}&name=${name}&room=${room}`, { method: 'POST' });
      res = await res.json();
    },
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
