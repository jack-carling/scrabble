<template>
  <div class="rack" ref="rack">
    <Square
      v-for="(square, i) in rack"
      :key="i"
      :square="square"
      draggable="true"
      @dragstart="handleDrag(square, i, $event)"
      @dragover.prevent="setDropEffect"
      @drop="handleDrop(square, $event)"
      @dragend="handleStop(square)"
      class="animate__animated"
      :ref="`square${i}`"
    />
  </div>
  <span>Tiles left: {{ remainingSquares }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Square from './Square.vue';

import { Squares, Origin, LetterOrigin, SSE } from '../services/interfaces';

export default defineComponent({
  data() {
    return {
      rack: [] as Squares[],
      returnToRackIndex: 0,
    };
  },
  components: {
    Square,
  },
  computed: {
    origin(): Origin {
      return this.$store.state.origin;
    },
    loading(): boolean {
      return this.$store.state.loading;
    },
    id(): string {
      return this.$store.state.id;
    },
    lobby(): boolean {
      return this.$store.state.lobby;
    },
    words(): string[][] {
      return this.$store.state.words;
    },
    previousPlayer(): number {
      return this.$store.state.previousPlayer;
    },
    me(): number {
      return this.$store.state.me;
    },
    remainingSquares(): number {
      return this.$store.state.remainingSquares;
    },
    returnToRack(): string[] {
      return this.$store.state.returnToRack;
    },
  },
  methods: {
    handleResize() {
      const rack = this.$refs.rack as HTMLElement;
      const height = rack.clientWidth / 350;
      rack.style.height = height * 50 + 'px';
    },
    handleDrag(square: Squares, index: number, e: DragEvent) {
      if (!square.letter || this.loading) {
        e.preventDefault();
        return;
      }
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      square.moving = true;
      const data = JSON.stringify({ letter: square.letter, index, origin: 'rack' });
      e.dataTransfer?.setData('text/plain', data);
    },
    setDropEffect(e: DragEvent) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    },
    handleDrop(square: Squares, e: DragEvent) {
      const transfer = e.dataTransfer?.getData('text/plain');
      if (!transfer) return;
      const data: LetterOrigin = JSON.parse(transfer);

      if (data.origin === 'board') {
        if (square.letter) {
          e.preventDefault();
          return;
        }
        this.$store.commit('setOrigin', { source: 'board', index: data.index });
      } else {
        if (square.letter) {
          this.rack[data.index].letter = square.letter;
        } else {
          this.rack[data.index].letter = '';
        }
      }
      square.letter = data.letter;
    },
    handleStop(square: Squares) {
      square.moving = false;
    },
    animateSquare(i: number) {
      const square = (this.$refs[`square${i}`] as any).$el as HTMLElement;
      this.$nextTick(() => {
        square.classList.remove('animate__bounce');
        void square.offsetWidth; // Restart animation
        square.classList.add('animate__bounce');
      });
    },
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    origin: {
      handler() {
        if (this.origin.source === 'rack') {
          this.rack[this.origin.index].letter = '';
        }
      },
      deep: true,
    },
    async lobby() {
      const response: Response = await fetch(`/sse/squares?id=${this.id}&count=7`);
      const data: SSE = await response.json();
      if (data.success) {
        if (!data.data) return;
        const squares = JSON.parse(data.data);
        this.rack = [...squares];
      }
    },
    words: {
      async handler() {
        if (this.previousPlayer !== this.me) return;

        let count = 7;
        for (let square of this.rack) {
          if (square.letter) {
            count--;
          }
        }
        if (!count) return;

        const response: Response = await fetch(`/sse/squares?id=${this.id}&count=${count}`);
        const data: SSE = await response.json();
        if (data.success) {
          if (!data.data) return;
          const squares = JSON.parse(data.data);
          for (let i = 0; i < this.rack.length; i++) {
            if (!this.rack[i].letter) {
              this.rack[i].letter = squares[count - 1].letter;
              this.animateSquare(i);
              count--;
            }
          }
        }
      },
      deep: true,
    },
    returnToRack: {
      handler() {
        for (let i = this.returnToRackIndex; i < this.returnToRack.length; i++) {
          console.log(this.returnToRack[i]);
          const letter = this.returnToRack[i];
          for (let i = 0; i < this.rack.length; i++) {
            if (!this.rack[i].letter) {
              this.rack[i].letter = letter;
              break;
            }
          }
        }
        this.returnToRackIndex = this.returnToRack.length;
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
div.rack {
  display: grid;
  width: 100%;
  max-width: 350px;
  height: 50px;
  grid-template-columns: repeat(7, 1fr);
}
span {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.7rem;
}
</style>
