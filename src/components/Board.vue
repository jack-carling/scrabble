<template>
  <div class="board" ref="board">
    <Square
      v-for="(square, i) in board"
      :key="i"
      :square="square"
      draggable="true"
      @dragstart="handleDrag(square, i, $event)"
      @dragover.prevent="setDropEffect"
      @drop="handleDrop(square, $event)"
      @dragend="handleStop(square)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { initialize } from '../services/board';
import { score } from '../services/score';

import Square from './Square.vue';

interface Square {
  letter: string;
  premium: string;
  moving: boolean;
  playable: boolean;
  error: boolean;
  score: number;
}
interface SquareRound {
  letter: string;
  index: number;
}
interface Origin {
  source: String;
  index: number;
}

export default defineComponent({
  data() {
    return {
      board: [] as Array<Square>,
      round: [] as Array<SquareRound>,
    };
  },
  components: {
    Square,
  },
  computed: {
    origin(): Origin {
      return this.$store.state.origin;
    },
  },
  methods: {
    handleResize() {
      const board = this.$refs.board as HTMLElement;
      board.style.height = board.clientWidth + 'px';
    },
    handleDrag(square: Square, index: number, e: any) {
      if (!square.letter) {
        e.preventDefault();
        return;
      }
      for (let i = 0; i < this.board.length; i++) {
        this.board[i].error = false;
        this.board[i].score = 0;
      }
      e.dataTransfer.effectAllowed = 'move';
      square.moving = true;
      const data = JSON.stringify({ letter: square.letter, index, origin: 'board' });
      e.dataTransfer.setData('text/plain', data);
    },
    setDropEffect(e: any) {
      e.dataTransfer.dropEffect = 'move';
    },
    handleDrop(square: Square, e: any) {
      let data = e.dataTransfer.getData('text/plain');
      data = JSON.parse(data);

      if (data.origin === 'rack') {
        if (square.letter) {
          e.preventDefault();
          return;
        }
        this.$store.commit('setOrigin', { source: 'rack', index: data.index });
      } else {
        if (square.letter) {
          this.board[data.index].letter = square.letter;
        } else {
          this.board[data.index].letter = '';
          this.board[data.index].playable = false;
        }
      }
      square.letter = data.letter;
      square.playable = true;
      this.handlePlayable();
    },
    handleStop(square: Square) {
      square.moving = false;

      this.handlePlayable();
    },
    handlePlayable() {
      this.$store.commit('setWord', '');

      this.round = [];
      for (let i = 0; i < this.board.length; i++) {
        this.board[i].error = false;
        this.board[i].score = 0;
        if (this.board[i].playable) {
          this.round.push({ letter: this.board[i].letter, index: i });
        }
      }
      this.round.sort((a, b) => (a.index > b.index ? 1 : -1));

      if (this.round.length <= 1) {
        this.handleScore();
        return;
      }

      const first = this.round[0].index;
      const isRightEdge = first % 15 === 15 - 1;

      let direction = '';

      if (this.round[0].index + 1 === this.round[1].index && !isRightEdge) {
        direction = 'horizontal';
      } else if (this.round[0].index + 15 === this.round[1].index) {
        direction = 'vertical';
      } else {
        direction = 'error';
      }

      for (let i = 0; i < this.round.length; i++) {
        if (direction === 'horizontal') {
          if (this.round[i].index !== first + i) {
            direction = 'error';
          }
        }
        if (direction === 'vertical') {
          if (this.round[i].index !== first + i * 15) {
            direction = 'error';
          }
        }
      }

      if (direction !== 'error') {
        this.handleScore();
        return;
      }
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i].playable) {
          this.board[i].error = true;
        }
      }
    },
    handleScore() {
      if (this.round.length === 0) return;
      let letters = [];
      let word = [];
      for (let i = 0; i < this.round.length; i++) {
        const index = this.round[i].index;
        const letter = this.board[index];
        letters.push(letter);
        word.push(letter.letter);
      }
      let total = 0;
      let premiums = [];
      for (let i of letters) {
        let letterScore = score(i.letter);
        if (i.premium === 'DL') letterScore = letterScore * 2;
        if (i.premium === 'TL') letterScore = letterScore * 3;
        if (i.premium === 'DW' || i.premium === 'TW') premiums.push(i.premium);
        total += letterScore;
      }
      for (let i of premiums) {
        if (i === 'DW') total = total * 2;
        if (i === 'TW') total = total * 3;
      }

      if (this.round.length === 7) total += 50;

      const index = this.round[this.round.length - 1].index;
      this.board[index].score = total;

      const payload = word.join('');

      this.$store.commit('setWord', payload);
    },
  },
  mounted() {
    this.board = initialize();
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    origin: {
      handler() {
        if (this.origin.source === 'board') {
          this.board[this.origin.index].letter = '';
          this.board[this.origin.index].playable = false;
          for (let i = 0; i < this.board.length; i++) {
            this.board[i].error = false;
            this.board[i].score = 0;
          }
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
div.board {
  width: 100%;
  max-width: 750px;
  height: 750px;
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  grid-template-rows: repeat(15, 1fr);
}
</style>
