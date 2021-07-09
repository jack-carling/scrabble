<template>
  <Lobby v-if="lobby" />
  <transition name="flip">
    <Notification :message="'Please wait for your turn!'" v-if="error" />
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

import Lobby from '../components/Lobby.vue';
import Notification from '../components/Notification.vue';
import Board from '../components/Board.vue';
import Turn from '../components/Turn.vue';
import Rack from '../components/Rack.vue';
import Check from '../components/Check.vue';
import Score from '../components/Score.vue';

import { Info, SSE } from '../services/interfaces';

export default defineComponent({
  components: {
    Lobby,
    Notification,
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
    game(): Info {
      return this.$store.state.game;
    },
    max(): number {
      return this.$store.state.max;
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
    const room = this.game.code;
    const name = this.game.name;
    if (!room || !name) this.$router.push('/');
    const response: Response = await fetch(`/sse/join?id=${this.id}&name=${name}&room=${room}&max=${this.max}`, {
      method: 'POST',
    });
    const data: SSE = await response.json();

    if (data.success) {
      this.$store.commit('setMax', data.max);
    } else {
      if (data.message === 'Error: Room is full.') {
        this.$store.commit('setLobbyError', 'full');
        this.$router.push('/');
      } else {
        this.$router.push('/');
      }
    }
  },
});
</script>

<style lang="scss">
section.app {
  max-width: 100%;
}
#app {
  width: 1150px;
  display: grid;
  grid-template-columns: 6.8fr 3.2fr;
  gap: 1rem;
}
@media only screen and (min-width: 1150px) {
  #app {
    grid-template-columns: 750px 1fr;
  }
}
</style>
