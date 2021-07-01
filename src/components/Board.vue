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
import { calculateScore } from '../services/score';

import Square from './Square.vue';

interface Square {
  letter: string;
  premium: string;
  moving: boolean;
  playable: boolean;
  error: boolean;
  score: number;
}
interface Origin {
  source: String;
  index: number;
}
interface Connections {
  path: string;
  index: number;
}
interface Letters {
  index: number;
  letter: string;
}

export default defineComponent({
  data() {
    return {
      board: [] as Array<Square>,
      round: [] as Array<Letters>,
    };
  },
  components: {
    Square,
  },
  emits: ['incorrect-turn'],
  computed: {
    origin(): Origin {
      return this.$store.state.origin;
    },
    loading(): boolean {
      return this.$store.state.loading;
    },
    words(): string[][] {
      return this.$store.state.words;
    },
    id(): string {
      return this.$store.state.id;
    },
    currentPlayer(): number {
      return this.$store.state.currentPlayer;
    },
    me(): number {
      return this.$store.state.me;
    },
    differentRound(): Letters[] {
      return this.$store.state.differentRound;
    },
  },
  methods: {
    handleResize() {
      const board = this.$refs.board as HTMLElement;
      board.style.height = board.clientWidth + 'px';
    },
    handleDrag(square: Square, index: number, e: any) {
      if (!square.letter || this.loading || !square.playable) {
        e.preventDefault();
        return;
      }
      if (this.currentPlayer !== this.me) {
        e.preventDefault();
        this.$emit('incorrect-turn');
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
      if (this.currentPlayer !== this.me) {
        e.preventDefault();
        this.$emit('incorrect-turn');
        return;
      }

      let data = e.dataTransfer.getData('text/plain');
      data = JSON.parse(data);

      if (data.origin === 'rack') {
        if (square.letter) {
          e.preventDefault();
          return;
        }
        this.$store.commit('setOrigin', { source: 'rack', index: data.index });
      } else {
        if (square.letter && !square.playable) {
          e.preventDefault();
          return;
        } else if (square.letter) {
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
      this.$store.commit('clearWords');

      this.round = [];
      for (let i = 0; i < this.board.length; i++) {
        this.board[i].error = false;
        this.board[i].score = 0;
        if (this.board[i].playable) {
          this.round.push({ letter: this.board[i].letter, index: i });
        }
      }
      this.round.sort((a, b) => (a.index > b.index ? 1 : -1));

      let direction = '';

      if (this.round.length <= 1) {
        this.handleAdjacent(direction);
        return;
      }

      const first = this.round[0].index;
      const second = this.round[1].index;

      const firstColumn = Math.floor(first / 15);
      const secondColumn = Math.floor(second / 15);
      const firstRow = first % 15;
      const secondRow = second % 15;

      if (firstColumn === secondColumn) {
        direction = 'horizontal';
      } else if (firstRow === secondRow) {
        direction = 'vertical';
      } else {
        direction = 'error';
      }

      for (let i = 0; i < this.round.length; i++) {
        if (direction === 'horizontal') {
          const index = this.round[i].index;
          if (!this.board[index - 1]?.letter && !this.board[index + 1]?.letter) {
            direction = 'error';
          }
        }
        if (direction === 'vertical') {
          const index = this.round[i].index;
          if (!this.board[index - 15]?.letter && !this.board[index + 15]?.letter) {
            direction = 'error';
          }
        }
      }

      if (direction === 'horizontal') {
        const columns = [] as number[];
        this.round.map((x) => {
          const column = Math.floor(x.index / 15);
          columns.push(column);
        });
        const set = new Set(columns);
        if (set.size > 1) {
          direction = 'error';
        }
      }

      if (direction === 'vertical') {
        const rows = [] as number[];
        this.round.map((x) => {
          const row = x.index % 15;
          rows.push(row);
        });
        const set = new Set(rows);
        if (set.size > 1) {
          direction = 'error';
        }
      }

      if (direction !== 'error') {
        this.handleAdjacent(direction);
        return;
      }
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i].playable) {
          this.board[i].error = true;
        }
      }
    },
    handleFirstWord() {
      let words: Array<string> = [];
      let word = '';
      for (let play of this.round) {
        word += play.letter;
      }

      words.push(word);

      this.$store.commit('setWords', words);
      this.handleScore(this.round);
    },
    handleWords(connections: Array<Connections>, direction: string) {
      let verticalWords: any = [];
      let horizontalWords: any = [];

      let words: Array<string> = [];

      for (let connection of connections) {
        if (connection.path === 'north') {
          const index = connection.index;
          let max = 0;
          verticalWords.push({
            letter: this.board[index].letter,
            index: connection.index,
          });
          do {
            max++;
            if (!this.board[index - max * 15]?.letter) break;
            verticalWords.push({
              letter: this.board[index - max * 15].letter,
              index: index - max * 15,
            });
          } while (max < 15);
        }
        if (connection.path === 'south') {
          const index = connection.index;
          let max = 0;
          verticalWords.push({
            letter: this.board[index].letter,
            index: connection.index,
          });
          do {
            max++;
            if (!this.board[index + max * 15]?.letter) break;
            verticalWords.push({
              letter: this.board[index + max * 15].letter,
              index: index + max * 15,
            });
          } while (max < 15);
        }
        if (connection.path === 'west') {
          const index = connection.index;
          let max = 0;
          horizontalWords.push({
            letter: this.board[index].letter,
            index: connection.index,
          });
          do {
            max++;
            if (!this.board[index - max]?.letter) break;
            horizontalWords.push({
              letter: this.board[index - max].letter,
              index: index - max,
            });
          } while (max < 15);
        }
        if (connection.path === 'east') {
          const index = connection.index;
          let max = 0;
          horizontalWords.push({
            letter: this.board[index].letter,
            index: connection.index,
          });
          do {
            max++;
            if (!this.board[index + max]?.letter) break;
            horizontalWords.push({
              letter: this.board[index + max].letter,
              index: index + max,
            });
          } while (max < 15);
        }
      }

      horizontalWords.sort((a: Letters, b: Letters) => (a.index > b.index ? 1 : -1));
      verticalWords.sort((a: Letters, b: Letters) => (a.index > b.index ? 1 : -1));

      let matrix: any = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

      if (!direction) {
        if (horizontalWords.length) {
          const set = new Set();
          for (let word of horizontalWords) {
            const stringified = JSON.stringify(word);
            set.add(stringified);
          }
          horizontalWords = Array.from(set);
          let word = '';
          for (let i = 0; i < horizontalWords.length; i++) {
            horizontalWords[i] = JSON.parse(horizontalWords[i]);
            word += horizontalWords[i].letter;
          }
          words.push(word);
        }
        if (verticalWords.length) {
          const set = new Set();
          for (let word of verticalWords) {
            const stringified = JSON.stringify(word);
            set.add(stringified);
          }
          verticalWords = Array.from(set);
          let word = '';
          for (let i = 0; i < verticalWords.length; i++) {
            verticalWords[i] = JSON.parse(verticalWords[i]);
            word += verticalWords[i].letter;
          }
          words.push(word);
        }
      }

      if (direction === 'horizontal') {
        const set = new Set();
        for (let word of horizontalWords) {
          const stringified = JSON.stringify(word);
          set.add(stringified);
        }
        horizontalWords = Array.from(set);
        let word = '';
        for (let i = 0; i < horizontalWords.length; i++) {
          horizontalWords[i] = JSON.parse(horizontalWords[i]);
          word += horizontalWords[i].letter;
        }
        words.push(word);

        for (let word of verticalWords) {
          const column = word.index % 15;
          const exists = matrix[column].find((x: Letters) => x.index === word.index);
          if (!exists) {
            matrix[column].push(word);
          }
        }
      }

      if (direction === 'vertical') {
        const set = new Set();
        for (let word of verticalWords) {
          const stringified = JSON.stringify(word);
          set.add(stringified);
        }
        verticalWords = Array.from(set);
        let word = '';
        for (let i = 0; i < verticalWords.length; i++) {
          verticalWords[i] = JSON.parse(verticalWords[i]);
          word += verticalWords[i].letter;
        }
        words.push(word);

        for (let word of horizontalWords) {
          const column = Math.floor(word.index / 15);
          const exists = matrix[column].find((x: Letters) => x.index === word.index);
          if (!exists) {
            matrix[column].push(word);
          }
        }
      }

      for (let i = 0; i < matrix.length; i++) {
        let word = '';
        for (let j = 0; j < matrix[i].length; j++) {
          word += matrix[i][j].letter;
        }
        if (word) {
          words.push(word);
        }
      }

      this.$store.commit('setWords', words);
      this.handleScore([...verticalWords, ...horizontalWords]);
    },
    handleAdjacent(direction: string) {
      if (!this.round.length) return;

      if (!this.board[112].letter) {
        for (let i = 0; i < this.round.length; i++) {
          const index = this.round[i].index;
          this.board[index].error = true;
        }
        return;
      }

      let connections: Array<Connections> = [];

      if (!this.words.length) {
        this.handleFirstWord();
        return;
      }

      for (let i = 0; i < this.round.length; i++) {
        const index = this.round[i].index;
        if (this.board[index - 15]?.letter) {
          connections.push({
            index,
            path: 'north',
          });
        }
        if (this.board[index + 1]?.letter) {
          connections.push({
            index,
            path: 'east',
          });
        }
        if (this.board[index + 15]?.letter) {
          connections.push({
            index,
            path: 'south',
          });
        }
        if (this.board[index - 1]?.letter) {
          connections.push({
            index,
            path: 'west',
          });
        }
      }

      let connected = false;
      for (let connection of connections) {
        let { index, path } = connection;

        if (path === 'north') {
          index = index - 15;
        } else if (path === 'east') {
          index = index + 1;
        } else if (path === 'south') {
          index = index + 15;
        } else if (path === 'west') {
          index = index - 1;
        }
        if (this.board[index].letter && !this.board[index].playable) {
          connected = true;
          break;
        }
      }

      if (connections.length && connected) {
        this.handleWords(connections, direction);
      } else {
        for (let i = 0; i < this.round.length; i++) {
          const index = this.round[i].index;
          this.board[index].error = true;
        }
      }
    },
    handleScore(data: Array<Letters>) {
      let total = 0;
      for (let i = 0; i < data.length; i++) {
        const letter = data[i].letter;
        const score = calculateScore(letter);
        total += score;
      }

      for (let square of this.round) {
        const index = square.index;
        const letter = square.letter;
        const premium = this.board[index].premium;

        if (premium) {
          const occurrence = data.filter((x) => x.index === index);
          const times = occurrence.length;

          if (premium === 'DL') {
            const score = calculateScore(letter);
            total += score * times;
          }
          if (premium === 'TL') {
            const score = calculateScore(letter);
            total += score * 2 * times;
          }
          if (premium === 'DW') {
            let subtotal = 0;
            this.round.map((x) => {
              const score = calculateScore(x.letter);
              subtotal += score;
            });
            total += subtotal * times;
          }
          if (premium === 'TW') {
            let subtotal = 0;
            this.round.map((x) => {
              const score = calculateScore(x.letter);
              subtotal += score;
            });
            total += subtotal * 2 * times;
          }
        }
      }

      if (this.round.length === 7) total += 50;

      const index = this.round[this.round.length - 1].index;
      this.board[index].score = total;
      this.$store.commit('setWordScore', total);
    },
    makeAllWordsUnplayable() {
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i].playable) {
          this.board[i].playable = false;
          this.board[i].score = 0;
        }
      }
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
    words: {
      handler() {
        this.makeAllWordsUnplayable();
      },
      deep: true,
    },
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
    async round() {
      if (this.currentPlayer !== this.me) return;

      const data = JSON.stringify(this.round);
      let res = await fetch(`/sse/play?id=${this.id}`, {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
      });
      res = await res.json();
    },
    differentRound() {
      if (this.currentPlayer === this.me) return;
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i].playable) {
          this.board[i].letter = '';
          this.board[i].playable = false;
        }
      }
      for (let diff of this.differentRound) {
        const index = diff.index;
        const letter = diff.letter;
        this.board[index].letter = letter;
        this.board[index].playable = true;
      }
      this.handlePlayable();
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