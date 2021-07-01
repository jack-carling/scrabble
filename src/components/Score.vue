<template>
  <section>
    <div class="title">
      <span>Score</span>
      <div></div>
    </div>
    <div class="scores">
      <div v-for="(player, i) in players" :key="i">
        <i class="material-icons" :class="{ leader: getScore(i) === highestScore }">emoji_events</i>
        <span>{{ player }}</span>
        <span>{{ getScore(i) }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    players(): string[] {
      return this.$store.state.players;
    },
    playerScore(): number[] {
      return this.$store.state.playerScore;
    },
    highestScore(): number {
      const highestScore = Math.max(...this.playerScore);
      if (highestScore === 0) {
        return -1;
      }
      return highestScore;
    },
  },
  methods: {
    getScore(i: number) {
      return this.playerScore[i];
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  margin-top: 1rem;
  max-width: 350px;
}

div.title {
  font-size: 0.8rem;
  position: relative;
  span {
    display: inline-block;
    background-color: $main-bg-color;
    padding-right: 0.5rem;
  }
  div {
    width: 100%;
    height: 100%;
    border-top: 1px solid $bg-empty;
    position: absolute;
    transform: translateY(-50%);
    z-index: -1;
  }
}
div.scores {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  div {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    align-items: center;
  }
  div:not(:first-of-type) {
    margin-top: 0.5rem;
  }
  div i {
    font-size: 18px;
    margin-right: 1rem;
    color: rgba($color: #000000, $alpha: 0.1);
  }
  div i.leader {
    color: #ffd700;
  }
}
</style>
