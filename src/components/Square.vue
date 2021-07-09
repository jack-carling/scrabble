<template>
  <div class="square" :class="background">
    <span class="content" v-html="content" :class="{ error: square.error }"></span>
    <span class="score" v-if="square.letter" :class="{ error: square.error }">{{ score }}</span>
    <div class="score" v-if="square.score">{{ square.score }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { calculateScore } from '../services/score';

export default defineComponent({
  props: {
    square: {
      type: Object,
    },
  },
  computed: {
    score(): number {
      return calculateScore(this.square?.letter);
    },
    content(): string {
      if (this.square?.letter) {
        return this.square.letter;
      }
      if (this.square?.premium) {
        if (this.square?.premium === 'STAR') {
          return '<i class="material-icons">star</i>';
        }
        return this.square.premium;
      }
      return '';
    },
    background(): string {
      if (this.square?.playable) {
        return 'letter playable';
      }
      if (this.square?.moving) {
        return 'letter moving';
      }
      if (this.square?.letter) {
        return 'letter';
      }
      if (this.square?.premium) {
        if (this.square?.premium === 'STAR') {
          return 'dl';
        }
        return this.square.premium.toLowerCase();
      }
      return 'empty';
    },
  },
});
</script>

<style lang="scss" scoped>
div.square {
  width: 100%;
  height: 100%;
  border: $default-border;
  display: flex;
  justify-content: center;
  align-items: center;
}
div.empty {
  background-color: $empty-bg;
}
div.letter {
  background-color: $letter-bg;
  color: $default-font-color;
  font-size: 1.5rem;
  position: relative;
}
div.moving {
  background-color: $moving-bg;
  border: $moving-border;
}
div.playable {
  background-color: $playable-bg;
}
span,
div.score {
  font-family: $monospace-font;
  @include no-select;
}
span.score {
  font-size: 0.8rem;
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}
span.error {
  color: $error-color;
}
div.tw,
div.tl,
div.dw,
div.dl {
  color: $premium-font-color;
}
div.tw {
  background-color: $tw;
}
div.tl {
  background-color: $tl;
}
div.dw {
  background-color: $dw;
}
div.dl {
  background-color: $dl;
}
div.score {
  width: 30px;
  height: 30px;
  background-color: $letter-bg;
  border-radius: 50%;
  font-size: 12px;
  border: $score-border;
  position: absolute;
  bottom: -15px;
  right: -15px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  @include shadow(2.5px);
}
@media screen and (max-width: 1000px) {
  div.tw,
  div.tl,
  div.dw,
  div.dl {
    font-size: 0.8rem;
    ::v-deep(i) {
      font-size: 16px;
    }
  }
  div.letter {
    font-size: 1.3rem;
  }
  span.score {
    font-size: 0.7rem;
  }
}
</style>
