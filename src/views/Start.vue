<template>
  <transition name="flip">
    <Notification :message="'Game room is full! Please create a new one.'" v-if="error" />
  </transition>
  <main>
    <img id="logo" src="../assets/logo.png" alt="Logo" draggable="false" />
    <section class="start mobile">
      <div class="mobile">
        <i class="material-icons">phone_iphone</i>
        <span>
          This game is unfortunately not well supported on mobile devices at the moment. Please enjoy on a desktop
          computer.
        </span>
      </div>
    </section>
    <section class="start" v-if="!askName">
      <div class="info">
        <strong>JOIN GAME</strong><br />
        <span v-if="!errors.join">{{ infoText[0] }}</span>
        <span v-else>{{ infoText[1] }}</span>
      </div>
      <label for="join">
        <div ref="label__join">Enter 6-digit code</div>
        <input
          type="text"
          id="join"
          placeholder="ABC123"
          maxlength="6"
          v-model="code"
          @keyup.enter="joinGame"
          autocomplete="off"
          ref="join"
        />
      </label>
      <button @click="joinGame" class="animate__animated" ref="button__join">Join Game</button>
    </section>
    <section class="start" v-if="!askName">
      <div class="info">
        <strong>CREATE GAME</strong><br />
        <span>
          Create a new game and share the code with your friends. Choose between English and Swedish language and then
          select the number of players before continuing to generate your code.
        </span>
      </div>
      <div class="lang">
        <div class="clickable" @click="handleLang('en')">
          <div class="circle" :class="{ selected: lang === 'en' }"></div>
          <img src="../assets/en.svg" alt="" />
        </div>
        <div class="clickable" @click="handleLang('sv')">
          <div class="circle" :class="{ selected: lang === 'sv' }"></div>
          <img src="../assets/sv.svg" alt="" />
        </div>
      </div>
      <label for="create">
        Number of players
        <div class="select">
          <i class="material-icons">keyboard_arrow_down</i>
          <select id="create" v-model="numberOfPlayers">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </label>
      <button @click="createGame">Create Game</button>
    </section>
    <section class="start" v-else>
      <div class="info">
        <strong>{{ headerInfo }}</strong>
        <br />
        <template v-if="headerInfo === 'JOINING GAME'">
          <span v-if="!errors.name">{{ code }} • {{ nameText[0] }}</span>
          <span v-else>{{ code }} • {{ nameText[1] }}</span>
        </template>
        <template v-else>
          <span v-if="!errors.name">{{ code }} • {{ nameText[2] }}</span>
          <span v-else>{{ code }} • {{ nameText[3] }}</span>
        </template>
      </div>
      <label for="name">
        <div ref="label__name">Name</div>
        <input
          type="text"
          id="name"
          maxlength="12"
          v-model="name"
          @keyup.enter="handleName"
          autocomplete="off"
          ref="name"
        />
      </label>
      <button @click="handleName" class="animate__animated" ref="button__join">Continue</button>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Notification from '../components/Notification.vue';
import { generateRandomCode } from '../services/random';

import { SSE } from '../services/interfaces';

export default defineComponent({
  components: {
    Notification,
  },
  data() {
    return {
      code: '',
      numberOfPlayers: 2,
      loading: false,
      infoText: [
        'Enter the code provided by a friend to join their game.',
        'This code is not valid, please try another one or create a new game.',
      ],
      errors: {
        join: false,
        name: false,
      },
      askName: false,
      name: '',
      headerInfo: '',
      nameText: [
        'Almost ready to join! What is your name?',
        'Almost ready to join! Please enter between 2-12 characters.',
        'Almost ready to start! What is your name?',
        'Almost ready to start! Please enter between 2-12 characters.',
      ],
      error: false,
      timeout: 0,
      lang: 'en',
    };
  },
  methods: {
    displayError() {
      window.clearTimeout(this.timeout);
      this.error = true;
      this.timeout = window.setTimeout(() => {
        this.error = false;
      }, 4000);
    },
    animateButton(button: HTMLElement) {
      button.classList.remove('animate__jello');
      void button.offsetWidth; // Restart animation
      button.classList.add('animate__jello');
    },
    async joinGame() {
      if (this.loading) return;
      this.code = this.code.trim();
      const label = this.$refs.label__join as HTMLElement;
      if (this.code.length !== 6) {
        this.$nextTick(() => {
          label.classList.add('error');
          const button = this.$refs.button__join as HTMLElement;
          this.animateButton(button);
        });
        return;
      }
      this.loading = true;
      const response: Response = await fetch(`/sse/lobby?room=${this.code}`);
      const data: SSE = await response.json();
      if (!data.success) {
        this.errors.join = true;
        this.$nextTick(() => {
          label.classList.add('error');
          const button = this.$refs.button__join as HTMLElement;
          this.animateButton(button);
        });
      } else {
        this.$store.commit('setGameCode', this.code);
        this.headerInfo = 'JOINING GAME';
        this.askName = true;
        this.$nextTick(() => {
          const input = this.$refs.name as HTMLInputElement;
          input.focus();
        });
      }
      this.loading = false;
    },
    createGame() {
      const players = Number(this.numberOfPlayers);
      this.code = generateRandomCode();
      this.$store.commit('setGameCode', this.code);
      this.$store.commit('setMax', players);
      this.headerInfo = 'CREATING GAME';
      this.askName = true;
      this.$nextTick(() => {
        const input = this.$refs.name as HTMLInputElement;
        input.focus();
      });
    },
    handleName() {
      const label = this.$refs.label__name as HTMLElement;
      if (this.name.length < 2) {
        this.errors.name = true;
        this.$nextTick(() => {
          label.classList.add('error');
          const button = this.$refs.button__join as HTMLElement;
          this.animateButton(button);
        });
      } else {
        this.$store.commit('setGameName', this.name);
        this.$router.push('/game');
      }
    },
    handleLang(lang: string) {
      this.lang = lang;
    },
  },
  mounted() {
    if (this.$store.state.lobbyError === 'full') {
      this.displayError();
    }
    const input = this.$refs.join as HTMLInputElement;
    input.focus();
  },
  watch: {
    code() {
      const label = this.$refs.label__join as HTMLElement;
      label.classList.remove('error');
      this.errors.join = false;
    },
    name() {
      const label = this.$refs.label__name as HTMLElement;
      label.classList.remove('error');
      this.errors.name = false;
    },
  },
});
</script>

<style lang="scss" scoped>
main {
  grid-column: 1 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin-top: 1rem;
    min-width: 120px;
  }
  p {
    margin: 0 0 2rem 0;
    text-align: center;
  }
}
section.start {
  width: 500px;
  display: grid;
  grid-template-columns: 1fr max-content;
  border: 1px solid $loading-bg;
  padding: 1rem;
  margin-top: 2rem;
  div.info {
    grid-column: 1 / 3;
    margin-bottom: 1.5rem;
    span {
      font-size: 0.8rem;
    }
  }
  div.lang {
    grid-column: 1 / 3;
    margin-bottom: 1.5rem;
    border: 1px solid $loading-bg;
    display: flex;
    div.clickable {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      cursor: pointer;
      img {
        max-width: 20px;
        margin-right: 2rem;
      }
      div.circle {
        margin-right: 0.5rem;
        border: 2px solid $loading-bg;
        border-radius: 50%;
        min-width: 10px;
        min-height: 10px;
      }
      div.circle.selected {
        background-color: $empty-bg;
      }
    }
  }
  div.mobile {
    grid-column: 1 / 3;
    display: flex;
    align-items: center;
    i {
      margin-right: 1rem;
    }
    span {
      font-size: 0.8rem;
    }
  }
  label {
    font-size: 0.7rem;
    margin-right: 1rem;
    input,
    select {
      margin-top: 0.2rem;
    }
  }
  label div.error {
    color: $error-color;
  }
}
section.mobile {
  display: none;
}
#logo {
  max-width: 500px;
}
input {
  width: 100%;
  font-size: 16px;
  padding: 5px;
  font-family: $default-font;
  @include no-appearance;
  border: none;
  outline: none;
}
select {
  display: block;
  width: 100%;
  font-size: 16px;
  padding: 5px;
  font-family: $default-font;
  @include no-appearance;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: #fff;
}
div.select {
  position: relative;
  i {
    height: 24px;
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    pointer-events: none;
  }
}
@media only screen and (max-width: 532px) {
  #logo {
    max-width: 100%;
  }
  section {
    max-width: 100%;
  }
  section.mobile {
    display: block;
  }
}
</style>
