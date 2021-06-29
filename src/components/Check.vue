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
    <p v-if="error">{{ error }}</p>
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
    word(): string {
      return this.$store.state.word;
    },
    loading(): boolean {
      return this.$store.state.loading;
    },
  },
  methods: {
    async checkWord() {
      this.error = '';
      if (!this.word || this.loading) {
        const button = this.$refs.button as HTMLElement;
        button.classList.remove('animate__jello');
        void button.offsetWidth; // Restart animation
        button.classList.add('animate__jello');
        return;
      }
      this.$store.commit('setLoading', true);
      //console.log(this.word);
      let res: any = await fetch(`/api?word=${this.word}`);
      res = await res.json();
      this.$store.commit('setLoading', false);
      if (!res.success) {
        this.error = res.message;
      } else {
        this.$store.commit('handleWords');
      }
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
