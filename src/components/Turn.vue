<template>
  <section>
    <span class="current" v-html="currentTurn"></span>
    <div class="indicator">
      <div ref="indicator"></div>
    </div>
    <div class="turns" ref="turns">
      <div v-for="(player, i) in players" :key="i" :style="{ left: spaces[i] + 'px' }"></div>
    </div>
    <div class="names">
      <span v-for="(player, i) in players" :key="i" :class="{ disconnected: playerData[i].disconnected }">
        {{ player }}
      </span>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Data {
  id: String;
  disconnected: Boolean;
}

export default defineComponent({
  data() {
    return {
      spaces: [] as number[],
    };
  },
  computed: {
    players(): string[] {
      return this.$store.state.players;
    },
    currentPlayer(): number {
      return this.$store.state.currentPlayer;
    },
    me(): number {
      return this.$store.state.me;
    },
    currentTurn(): string {
      const name = this.players[this.currentPlayer];
      if (!name) return '&nbsp;';
      if (this.currentPlayer === this.me) return `It's your turn`;
      if (name.charAt(name.length - 1) === 's' || name.charAt(name.length - 1) === 'S') {
        return `${name}' turn`;
      } else {
        return `${name}'s turn`;
      }
    },
    playerData(): Data[] {
      return this.$store.state.playerData;
    },
  },
  mounted() {
    this.positionTurns();
    window.addEventListener('resize', this.positionTurns);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.positionTurns);
  },
  methods: {
    positionTurns() {
      this.spaces = [];
      const turns = this.$refs.turns as HTMLElement;
      const width = turns.clientWidth;
      const space = (width - this.players.length * 10) / (this.players.length * 2);
      let position = 0;
      for (let i = 0; i < this.players.length; i++) {
        const first = 0;
        const last = this.players.length - 1;
        if (i === first) {
          this.spaces.push(space + position);
          position += space;
        } else {
          this.spaces.push(space * 2 + position + i * 10);
          position += space * 2;
        }
      }
      this.positionIndicator();
    },
    positionIndicator() {
      const indicator = this.$refs.indicator as HTMLElement;
      indicator.style.left = `${this.spaces[this.currentPlayer]}px`;
    },
  },
  watch: {
    currentPlayer() {
      this.positionIndicator();
    },
    players: {
      handler() {
        this.positionTurns();
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  margin-bottom: 2rem;
  max-width: 350px;
}
div.turns {
  width: 100%;
  border-top: 2px solid $main-text-color;
  position: relative;
  margin-top: 5px;
  div {
    width: 10px;
    height: 10px;
    background-color: $main-text-color;
    position: absolute;
    border-radius: 50%;
    top: -6px;
  }
}
div.indicator {
  width: 100%;
  height: 12px;
  margin-top: 0.5rem;
  position: relative;
  div {
    width: 10px;
    height: 10px;
    position: absolute;
    background-color: $dl;
    clip-path: polygon(100% 0, 0 0, 50% 100%);
    transition: left 1s ease;
  }
}
div.names {
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  span {
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
  }
  span.disconnected {
    opacity: 0.25;
    color: $error-color;
  }
}
span.current {
  margin-top: 1rem;
  width: 100%;
  display: block;
  text-align: center;
}
</style>
