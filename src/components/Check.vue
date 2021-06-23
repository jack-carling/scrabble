<template>
  <section>
    <button @click="checkWord">Check word</button>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    word(): string {
      return this.$store.state.word;
    },
  },
  methods: {
    checkWord() {
      console.log(this.word);
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  margin-top: 0.5rem;
}
</style>
