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
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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

export default defineComponent({
  data() {
    return {
      rack: [
        {
          letter: 'A',
          premium: '',
          moving: false,
        },
        {
          letter: 'B',
          premium: '',
          moving: false,
        },
        {
          letter: 'C',
          premium: '',
          moving: false,
        },
        {
          letter: 'D',
          premium: '',
          moving: false,
        },
        {
          letter: 'E',
          premium: '',
          moving: false,
        },
        {
          letter: 'F',
          premium: '',
          moving: false,
        },
        {
          letter: 'G',
          premium: '',
          moving: false,
        },
      ] as Array<Square>,
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
  },
  methods: {
    handleResize() {
      const rack = this.$refs.rack as HTMLElement;
      const height = rack.clientWidth / 350;
      rack.style.height = height * 50 + 'px';
    },
    handleDrag(square: Square, index: number, e: any) {
      if (!square.letter || this.loading) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.effectAllowed = 'move';
      square.moving = true;
      const data = JSON.stringify({ letter: square.letter, index, origin: 'rack' });
      e.dataTransfer.setData('text/plain', data);
    },
    setDropEffect(e: any) {
      e.dataTransfer.dropEffect = 'move';
    },
    handleDrop(square: Square, e: any) {
      let data = e.dataTransfer.getData('text/plain');
      data = JSON.parse(data);
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
    handleStop(square: Square) {
      square.moving = false;
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
</style>
