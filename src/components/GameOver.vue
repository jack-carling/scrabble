<template>
  <main v-if="showOverlay">
    <section>
      <div class="gradient">
        <i class="material-icons">emoji_events</i>
      </div>
      <h1>Game Over</h1>
      <span>{{ gameOverInfo }}</span>
      <button @click="showOverlay = false">Close</button>
    </section>
  </main>
  <div class="back" v-else @click="refresh">
    <i class="material-icons">arrow_back</i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      showOverlay: true,
    };
  },
  computed: {
    gameOverInfo(): string {
      return this.$store.state.gameOverInfo;
    },
  },
  methods: {
    refresh() {
      window.location.reload();
    },
  },
});
</script>

<style lang="scss" scoped>
main {
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
}
section {
  width: 300px;
  border-radius: 1rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include shadow(0.5rem);
  border: $score-border;
  padding: 1rem;
  span {
    text-align: center;
  }
}
div.gradient {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    z-index: 1001;
    font-size: 48px;
    color: #ffd700;
    text-shadow: 0 0 3px #5c4d00;
  }
}
div.gradient::after {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(
    #fff 0deg 20deg,
    #eee 20deg 40deg,
    #fff 40deg 60deg,
    #eee 60deg 80deg,
    #fff 80deg 100deg,
    #eee 100deg 120deg,
    #fff 120deg 140deg,
    #eee 140deg 160deg,
    #fff 160deg 180deg,
    #eee 180deg 200deg,
    #fff 200deg 220deg,
    #eee 220deg 240deg,
    #fff 240deg 260deg,
    #eee 260deg 280deg,
    #fff 280deg 300deg,
    #eee 300deg 320deg,
    #fff 320deg 340deg,
    #eee 340deg 360deg,
    #fff 360deg 0deg
  );
  animation: spin 20s linear infinite;
}
h1 {
  margin: 0.5rem 0;
  font-family: 'Zen Loop', cursive;
  font-size: 3rem;
}
span {
  font-size: 0.8rem;
}
button {
  margin-top: 2rem;
}
div.back {
  z-index: 1000;
  position: fixed;
  top: 3rem;
  left: 3rem;
  width: 40px;
  height: 40px;
  background-color: $letter-bg;
  border-radius: 50%;
  font-size: 24px;
  border: $score-border;
  display: flex;
  justify-content: center;
  align-items: center;
  @include shadow(0.25rem);
  cursor: pointer;
}
</style>
