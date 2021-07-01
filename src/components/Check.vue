<template>
  <main>
    <section>
      <div class="button">
        <button @click="checkWord(true)" ref="button__check" class="animate__animated">Check word</button>
        <transition name="flip">
          <div v-if="loading">
            <div class="loading"></div>
          </div>
        </transition>
      </div>
      <div class="button">
        <button @click="showConfirmation('skip')" ref="button__skip" class="animate__animated">Skip turn</button>
        <transition name="fade">
          <span v-if="confirmSkip">
            Are you sure?
            <i class="material-icons yes">check_circle</i>
            <i class="material-icons no" @click="confirmSkip = false">cancel</i>
          </span>
        </transition>
      </div>
      <div class="button">
        <button @click="showConfirmation('swap')" ref="button__swap" class="animate__animated">Swap letters</button>
        <transition name="fade">
          <span v-if="confirmSwap">
            Are you sure?
            <i class="material-icons yes">check_circle</i>
            <i class="material-icons no" @click="confirmSwap = false">cancel</i>
          </span>
        </transition>
      </div>
    </section>
    <div v-html="info" class="container" ref="container" @scroll="handleScroll"></div>
    <div class="checkbox">
      <label for="checkbox">
        <input type="checkbox" id="checkbox" v-model="autoScroll" />
        <div>
          <i class="material-icons">clear</i>
        </div>
        Auto-scroll
      </label>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      info: '',
      autoScroll: true,
      scrollTop: 0,
      confirmSkip: false,
      confirmSwap: false,
    };
  },
  computed: {
    round(): string[] {
      return this.$store.state.round;
    },
    loading(): boolean {
      return this.$store.state.loading;
    },
    players(): string[] {
      return this.$store.state.players;
    },
    currentPlayer(): number {
      return this.$store.state.currentPlayer;
    },
    me(): number {
      return this.$store.state.me;
    },
    id(): string {
      return this.$store.state.id;
    },
    differentCheck(): string[] {
      return this.$store.state.differentCheck;
    },
  },
  emits: ['incorrect-turn'],
  methods: {
    showConfirmation(type: string) {
      if (type === 'skip') {
        if (this.currentPlayer !== this.me) {
          this.$emit('incorrect-turn');
          const button = this.$refs.button__skip as HTMLElement;
          this.animateButton(button);
          return;
        }
        this.confirmSkip = !this.confirmSkip;
        this.confirmSwap = false;
      }
      if (type === 'swap') {
        if (this.currentPlayer !== this.me) {
          this.$emit('incorrect-turn');
          const button = this.$refs.button__swap as HTMLElement;
          this.animateButton(button);
          return;
        }
        this.confirmSwap = !this.confirmSwap;
        this.confirmSkip = false;
      }
    },
    animateButton(button: HTMLElement) {
      button.classList.remove('animate__jello');
      void button.offsetWidth; // Restart animation
      button.classList.add('animate__jello');
    },
    async checkWord(callFetch: boolean) {
      if (this.currentPlayer !== this.me && callFetch) {
        this.$emit('incorrect-turn');
        const button = this.$refs.button__check as HTMLElement;
        this.animateButton(button);
        return;
      }
      if (!this.round.length || this.loading) {
        const button = this.$refs.button__check as HTMLElement;
        this.animateButton(button);
        return;
      }

      if (callFetch) {
        let res = await fetch(`/sse/check?id=${this.id}`, { method: 'POST' });
        res = await res.json();
      }

      this.$store.commit('setLoading', true);

      let results = [];

      for await (let word of this.round) {
        let res: any = await fetch(`/api?word=${word}`);
        res = await res.json();
        results.push(res);
      }

      const successAll = results.every((result) => result.success === true);

      let player = this.players[this.currentPlayer];
      if (this.currentPlayer === this.me) player = 'You';

      this.info += `<div>`;
      const time = this.displayTime();
      this.info += `<span class="time">${time}</span>`;
      for (let result of results) {
        if (result.success) {
          this.info += `<span>${player} checked ${result.message}</span>`;
        } else {
          this.info += `<span class="error">${player} checked ${result.message}</span>`;
        }
      }

      if (successAll) {
        const words = this.round.join(', ');
        const score = this.$store.state.wordScore;

        this.info += `${player} played ${words} for ${score} points.`;

        this.$store.commit('handleRound');
      }

      this.info += `</div>`;

      this.$store.commit('setLoading', false);
    },
    displayTime(): string {
      const d = new Date();
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    },
    handleScroll() {
      const container = this.$refs.container as HTMLElement;
      const top = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const containerHeight = container.clientHeight;
      if (containerHeight + top === scrollHeight) {
        this.autoScroll = true;
      }
      if (top < this.scrollTop) {
        this.autoScroll = false;
      }
      this.scrollTop = top;
    },
  },
  watch: {
    info() {
      window.setTimeout(() => {
        if (this.autoScroll) {
          const container = this.$refs.container as HTMLElement;
          const top = container.scrollHeight;
          container.scrollTo({ top, behavior: 'smooth' });
        }
      }, 50);
    },
    differentCheck: {
      handler() {
        if (this.currentPlayer !== this.me) this.checkWord(false);
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
main {
  max-width: 350px;
}
section {
  margin-top: 0.5rem;
  div.button {
    display: flex;
    align-items: center;
  }
  div.button:not(:first-of-type) {
    margin-top: 0.5rem;
  }
}
div.button {
  span {
    font-size: 0.7rem;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
  }
  span i {
    font-size: 20px;
    margin-left: 0.5rem;
    cursor: pointer;
  }
  span i:nth-child(2) {
    margin-left: 0.25rem;
  }
  span i.yes {
    color: $success-color;
  }
  span i.no {
    color: $error-color;
  }
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
div.container {
  width: 100%;
  border: 1px solid $loading-bg;
  background-color: $bg-letter;
  height: 200px;
  margin-top: 1rem;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  font-size: 0.8rem;
  overflow-y: auto;
  position: relative;
  ::v-deep(div) {
    margin-bottom: 0.25rem;
    padding-top: 0.25rem;
  }
  ::v-deep(div:not(:first-of-type)) {
    border-top: 1px solid $loading-bg;
  }
  ::v-deep(span) {
    display: block;
    line-height: 1.25;
  }
  ::v-deep(span:not(.time)) {
    padding-right: 2rem;
  }
  ::v-deep(span.error) {
    color: $error-color;
  }
  ::v-deep(span.time) {
    position: absolute;
    color: $loading-bg;
    right: 1rem;
  }
}
input[type='checkbox'] {
  display: none;
}
div.checkbox {
  margin-top: 0.2rem;
  font-size: 10px;
  @include no-select;
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  div {
    margin-right: 0.2rem;
    width: 14px;
    height: 14px;
    border: 1px solid $loading-bg;
    background-color: $bg-letter;
    display: grid;
    place-items: center;
  }
  div i {
    font-size: 12px;
  }
  input:checked ~ div i {
    display: block;
  }
  input ~ div i {
    display: none;
  }
}
button {
  min-width: 110px;
}
</style>
