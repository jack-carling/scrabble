<template>
  <main>
    <section>
      <span> Waiting for everyone to join...</span>
      <span>{{ players }} / {{ max }}</span>
      <div class="loading"></div>
      <button>Cancel</button>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    players(): number {
      return this.$store.state.players.length;
    },
    max(): number {
      return this.$store.state.max;
    },
  },
  watch: {
    players() {
      if (this.players === this.max) {
        this.$store.commit('setLobby', false);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
main {
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.25);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: grid;
  place-items: center;
}
span {
  margin-bottom: 1rem;
}
section {
  background-color: $bg-letter;
  width: max-content;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: $shadow;
}
div.loading {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 5px solid $bg-empty;
  border-top: 5px solid $loading-bg;
  background-color: $bg-letter;
  animation: spin 2s linear infinite;
  margin-bottom: 1rem;
}
</style>
