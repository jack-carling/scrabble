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
      @click="test(i)"
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
interface Connections {
  path: string;
  index: number;
}
interface Letters {
  index: number;
  letters: Array<string>;
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
    loading(): boolean {
      return this.$store.state.loading;
    },
    words(): Array<string> {
      return this.$store.state.words;
    },
  },
  methods: {
    test(i: number) {
      console.log(i);
    },
    handleResize() {
      const board = this.$refs.board as HTMLElement;
      board.style.height = board.clientWidth + 'px';
    },
    handleDrag(square: Square, index: number, e: any) {
      if (!square.letter || this.loading || !square.playable) {
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

      //this.handlePlayable();
      // FIX THIS
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

      let direction = '';

      if (this.round.length <= 1) {
        this.handlePosition(direction);
        return;
      }

      const first = this.round[0].index;
      const second = this.round[1].index;
      const isRightEdge = first % 15 === 15 - 1;
      const distanceToRightEdge = 15 - (first % 15);

      if (second > first + distanceToRightEdge) {
        direction = 'vertical';
      } else if (second < first + distanceToRightEdge && !isRightEdge) {
        direction = 'horizontal';
      } else {
        direction = 'error';
      }

      /*if (this.round[0].index + 1 === this.round[1].index && !isRightEdge) {
        direction = 'horizontal';
      } else if (this.round[0].index + 15 === this.round[1].index) {
        direction = 'vertical';
      } else {
        direction = 'error';
      }*/

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
        this.handlePosition(direction);
        return;
      }
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i].playable) {
          this.board[i].error = true;
        }
      }
    },
    handleScore(connections: Array<Connections>, direction: string) {
      let lettersNorth: Array<Letters> = [];
      let lettersEast: Array<Letters> = [];
      let lettersSouth: Array<Letters> = [];
      let lettersWest: Array<Letters> = [];

      let words = [];

      if (connections.length) {
        for (let connection of connections) {
          if (connection.path === 'north') {
            let max = 0;
            let letters = [];
            do {
              max++;
              const index = connection.index - max * 15;
              if (!this.board[index]?.letter) break;
              letters.push(this.board[index]?.letter);
            } while (max < 15);
            letters = letters.reverse();
            lettersNorth.push({ index: connection.index, letters });
          }
          if (connection.path === 'east') {
            let max = 0;
            let letters = [];
            do {
              max++;
              const index = connection.index + max;
              if (!this.board[index]?.letter) break;
              letters.push(this.board[index]?.letter);
            } while (max < 15);
            lettersEast.push({ index: connection.index, letters });
          }
          if (connection.path === 'south') {
            let max = 0;
            let letters = [];
            do {
              max++;
              const index = connection.index + max * 15;
              if (!this.board[index]?.letter) break;
              letters.push(this.board[index]?.letter);
            } while (max < 15);
            lettersSouth.push({ index: connection.index, letters });
          }
          if (connection.path === 'west') {
            let max = 0;
            let letters = [];
            do {
              max++;
              const index = connection.index - max;
              if (!this.board[index]?.letter) break;
              letters.push(this.board[index]?.letter);
            } while (max < 15);
            letters = letters.reverse();
            lettersWest.push({ index: connection.index, letters });
          }
        }
      }

      let mainWord = '';
      for (let letter of this.round) {
        mainWord += letter.letter;
      }

      if (this.round[0].index === 112 && this.round.length === 1) {
        words.push(this.round[0].letter);
      }

      if (!direction) {
        const north = lettersNorth[0]?.letters.join('') ?? '';
        const east = lettersEast[0]?.letters.join('') ?? '';
        const south = lettersSouth[0]?.letters.join('') ?? '';
        const west = lettersWest[0]?.letters.join('') ?? '';

        const horizontal = west + mainWord + east;
        const vertical = north + mainWord + south;

        if (horizontal.length > 1) {
          words.push(horizontal);
        }
        if (vertical.length > 1) {
          words.push(vertical);
        }
      }

      if (direction === 'horizontal') {
        if (lettersWest.length) {
          mainWord = lettersWest[0].letters.join('') + mainWord;
        }
        if (lettersEast.length) {
          mainWord = mainWord + lettersEast[0].letters.join('');
        }
        words.push(mainWord);
        for (let i = 0; i < lettersNorth.length; i++) {
          const index = lettersNorth[i].index;
          const found = lettersSouth.findIndex((x) => index === x.index);
          const north = lettersNorth[i]?.letters.join('') ?? '';
          const south = lettersSouth[found]?.letters.join('') ?? '';
          const newWord = north + this.board[index].letter + south;
          words.push(newWord);
          lettersSouth.splice(found, 1);
        }
        for (let i = 0; i < lettersSouth.length; i++) {
          const index = lettersSouth[i].index;
          const newWord = this.board[index].letter + lettersSouth[i].letters.join('');
          words.push(newWord);
        }
      }

      if (direction === 'vertical') {
        if (lettersNorth.length) {
          mainWord = lettersNorth[0].letters.join('') + mainWord;
        }
        if (lettersSouth.length) {
          mainWord = mainWord + lettersSouth[0].letters.join('');
        }
        words.push(mainWord);
        for (let i = 0; i < lettersWest.length; i++) {
          const index = lettersWest[i].index;
          const found = lettersEast.findIndex((x) => index === x.index);
          const west = lettersWest[i]?.letters.join('') ?? '';
          const east = lettersEast[found]?.letters.join('') ?? '';
          const newWord = west + this.board[index].letter + east;
          words.push(newWord);
          lettersEast.splice(found, 1);
        }
        for (let i = 0; i < lettersEast.length; i++) {
          const index = lettersEast[i].index;
          const newWord = this.board[index].letter + lettersEast[i].letters.join('');
          words.push(newWord);
        }
      }

      console.log('WORDS:', words);

      /*let letters = [];
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

      const payload = word.join('');*/

      this.$store.commit('setWord', 'TEST'); // Handle words in array instead
    },
    handlePosition(direction: string) {
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
        this.handleScore(connections, direction);
        return;
      }

      if (!direction) {
        const index = this.round[0].index;
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

      if (direction === 'horizontal') {
        const first = this.round[0].index;
        const last = this.round[this.round.length - 1].index;

        if (this.board[first - 1]?.letter) {
          connections.push({
            index: first,
            path: 'west',
          });
        }
        if (this.board[first - 15]?.letter) {
          connections.push({
            index: first,
            path: 'north',
          });
        }
        if (this.board[first + 15]?.letter) {
          connections.push({
            index: first,
            path: 'south',
          });
        }

        if (this.board[last + 1]?.letter) {
          connections.push({
            index: last,
            path: 'east',
          });
        }
        if (this.board[last - 15]?.letter) {
          connections.push({
            index: last,
            path: 'north',
          });
        }
        if (this.board[last + 15]?.letter) {
          connections.push({
            index: last,
            path: 'south',
          });
        }
        if (this.round.length > 2) {
          for (let i = 1; i < this.round.length - 1; i++) {
            const index = this.round[i].index;
            if (this.board[index - 15]?.letter) {
              connections.push({
                index,
                path: 'north',
              });
            }
            if (this.board[index + 15]?.letter) {
              connections.push({
                index,
                path: 'south',
              });
            }
          }
        }
      }

      if (direction === 'vertical') {
        const first = this.round[0].index;
        const last = this.round[this.round.length - 1].index;

        if (this.board[first - 1]?.letter) {
          connections.push({
            index: first,
            path: 'west',
          });
        }
        if (this.board[first - 15]?.letter) {
          connections.push({
            index: first,
            path: 'north',
          });
        }
        if (this.board[first + 1]?.letter) {
          connections.push({
            index: first,
            path: 'east',
          });
        }

        if (this.board[last + 1]?.letter) {
          connections.push({
            index: last,
            path: 'east',
          });
        }
        if (this.board[last + 15]?.letter) {
          connections.push({
            index: last,
            path: 'south',
          });
        }
        if (this.board[last - 1]?.letter) {
          connections.push({
            index: last,
            path: 'west',
          });
        }
        if (this.round.length > 2) {
          for (let i = 1; i < this.round.length - 1; i++) {
            const index = this.round[i].index;
            if (this.board[index - 1]?.letter) {
              connections.push({
                index,
                path: 'west',
              });
            }
            if (this.board[index + 1]?.letter) {
              connections.push({
                index,
                path: 'east',
              });
            }
          }
        }
      }

      if (connections.length) {
        this.handleScore(connections, direction);
      } else {
        for (let i = 0; i < this.round.length; i++) {
          const index = this.round[i].index;
          this.board[index].error = true;
        }
      }
    },
    handleWords() {
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
        this.handleWords();
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
