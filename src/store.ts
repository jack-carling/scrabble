import { createStore } from 'vuex';

interface Origin {
  source: String;
  index: number;
}

let SSE: EventSource;

export const store = createStore({
  state: {
    origin: { source: '', index: 0 },
    loading: false,
    round: [],
    words: [],
    players: [],
    currentPlayer: 0,
    me: 0,
    playerScore: [],
    wordScore: 0,
    id: '',
    max: 2,
    lobby: true,
    differentRound: [],
    differentCheck: [],
  },
  mutations: {
    setOrigin(state: any, payload: Origin) {
      state.origin.source = '';
      state.origin.source = payload.source;
      state.origin.index = payload.index;
    },
    clearWords(state: any) {
      state.round = [];
    },
    setWords(state: any, payload: string[]) {
      state.round = payload;
    },
    setLoading(state: any, payload: boolean) {
      state.loading = payload;
    },
    setWordScore(state: any, payload: number) {
      state.wordScore = payload;
    },
    handleRound(state: any) {
      state.words.push(state.round);
      state.round = [];
      state.playerScore[state.currentPlayer] += state.wordScore;
      state.wordScore = 0;
      if (state.currentPlayer === state.players.length - 1) {
        state.currentPlayer = 0;
      } else {
        state.currentPlayer++;
      }
    },
    setLobby(state: any, payload: boolean) {
      state.lobby = payload;
    },
  },
  actions: {
    startSSE({ state }) {
      SSE = new EventSource('/sse');
      SSE.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.initial) {
          state.id = message.id;
        }
        if (message.setPlayers) {
          for (let data of message.data) {
            if (data.id === state.id) state.me = data.player;
            state.players[data.player] = data.name;
            state.playerScore[data.player] = 0;
          }
        }
        if (message.setBoard) {
          state.differentRound = message.data;
        }
        if (message.checkBoard) {
          state.differentCheck.push('check');
        }
      });
    },
  },
});
