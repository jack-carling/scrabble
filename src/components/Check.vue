<template>
  <section>
    <button @click="checkWord" ref="button" class="animate__animated">Check word</button>
    <transition name="flip">
      <div v-if="loading">
        <div class="loading"></div>
      </div>
    </transition>
  </section>
  <transition name="error">
    <div v-if="error" v-html="error" class="error-container"></div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      error: '',
    };
  },
  computed: {
    round(): string[] {
      return this.$store.state.round;
    },
    loading(): boolean {
      return this.$store.state.loading;
    },
  },
  methods: {
    async checkWord() {
      this.error = '';
      if (!this.round.length || this.loading) {
        const button = this.$refs.button as HTMLElement;
        button.classList.remove('animate__jello');
        void button.offsetWidth; // Restart animation
        button.classList.add('animate__jello');
        return;
      }
      this.$store.commit('setLoading', true);

      let results = [];

      for await (let word of this.round) {
        let res: any = await fetch(`/api?word=${word}`);
        res = await res.json();
        results.push(res);
      }

      const successAll = results.every((result) => result.success === true);

      for (let result of results) {
        if (result.success) {
          this.error += `<span>${result.message}</span>`;
        } else {
          this.error += `<span class="error">${result.message}</span>`;
        }
      }

      if (successAll) {
        this.$store.commit('handleWords');
      }

      this.$store.commit('setLoading', false);
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
}
div.loading {
  width: 25px;
  height: 25px;
  margin-left: 0.5rem;
  border-radius: 50%;
  border: 5px solid $bg-empty;
  border-top: 5px solid $loading-bg;
  background-color: $main-bg-color;
  animation: spin 1s linear infinite;
}
div.error-container {
  margin-top: 0.5rem;
  ::v-deep(span) {
    display: block;
    margin-bottom: 0.5rem;
  }
  ::v-deep(span.error) {
    color: #ff0033;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.error-enter-active {
  animation: fadeIn;
  animation-duration: 1s;
}
.error-leave-to {
  animation: fadeOut;
  animation-duration: 1s;
}
</style>
