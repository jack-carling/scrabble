<template>
  <main>
    <img id="logo" src="../assets/logo.png" alt="Logo" draggable="false" />
    <section>
      <i class="material-icons leave" @click="leaveLobby">cancel</i>
      <div class="info">
        <strong>LOBBY</strong><br />
        <span>Waiting for everyone to join...</span>
      </div>
      <div class="amount">
        <div class="loading"></div>
        <span>{{ players }} / {{ max }}</span>
      </div>
      <label for="code">
        <div>{{ codeText }}</div>
        <input type="text" id="code" ref="code" v-model="code" readonly />
      </label>
      <button @click="copyCode">Copy</button>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      codeText: 'Code',
    };
  },
  computed: {
    players(): number {
      return this.$store.state.players.length;
    },
    max(): number {
      return this.$store.state.max;
    },
    code(): String {
      return this.$store.state.game.code;
    },
  },
  watch: {
    players() {
      if (this.players === this.max) {
        this.$store.commit('setLobby', false);
      }
    },
    max() {
      if (this.players === this.max) {
        this.$store.commit('setLobby', false);
      }
    },
  },
  methods: {
    leaveLobby() {
      window.location.reload();
    },
    copyCode() {
      const code = this.$refs.code as HTMLInputElement;
      code.select();
      document.execCommand('copy');
      this.codeText += ' • Copied to clipboard!';
    },
  },
});
</script>

<style lang="scss" scoped>
main {
  width: 100vw;
  height: 100vh;
  background-color: $default-bg;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  button {
    margin-top: 1rem;
    min-width: 120px;
  }
}
section {
  margin-top: 2rem;
  width: 500px;
  border: 1px solid $loading-bg;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr max-content;
  position: relative;
  label {
    font-size: 0.7rem;
    margin-right: 1rem;
    input,
    select {
      margin-top: 0.2rem;
    }
  }
  i.leave {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    opacity: 0.5;
  }
  i.leave:hover {
    opacity: 0.75;
  }
}
div.loading {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 5px solid $empty-bg;
  border-top: 5px solid $loading-bg;
  background-color: $default-bg;
  animation: spin 2s linear infinite;
  margin-right: 1rem;
}
div.amount {
  display: flex;
  align-items: center;
}
div.info,
div.amount {
  grid-column: 1 / 3;
  margin-bottom: 1rem;
  span {
    font-size: 0.8rem;
  }
}
input {
  width: 100%;
  font-size: 16px;
  padding: 5px;
  font-family: $default-font;
  appearance: none;
  border: none;
  outline: none;
}
#logo {
  max-width: 500px;
}
@media only screen and (max-width: 532px) {
  #logo {
    max-width: 100%;
  }
  section {
    max-width: 100%;
  }
}
</style>
