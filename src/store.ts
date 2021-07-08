import { createStore } from 'vuex';

interface Origin {
  source: String;
  index: number;
}
interface Data {
  id: String;
  disconnected: Boolean;
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
    previousPlayer: 0,
    me: 0,
    playerScore: [],
    wordScore: 0,
    id: '',
    max: 4,
    lobby: true,
    lobbyError: '',
    differentRound: [],
    differentCheck: [],
    game: {
      code: '',
      name: '',
    },
    remainingSquares: 100,
    returnToRack: [],
    playerData: [],
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
      do {
        if (!state.playerData[state.currentPlayer].disconnected) break;
        state.currentPlayer++;
      } while (state.playerData[state.currentPlayer].disconnected);

      state.previousPlayer = state.currentPlayer - 1;
      if (state.previousPlayer < 0) {
        state.previousPlayer = state.players.length - 1;
      }
    },
    setLobby(state: any, payload: boolean) {
      state.lobby = payload;
    },
    setGameCode(state: any, payload: string) {
      state.game.code = payload;
    },
    setGameName(state: any, payload: string) {
      state.game.name = payload;
    },
    setMax(state: any, payload: number) {
      state.max = payload;
    },
    setLobbyError(state: any, payload: string) {
      state.lobbyError = payload;
    },
    returnToRack(state: any, payload: string) {
      state.returnToRack.push(payload);
    },
  },
  actions: {
    startSSE({ state, commit }) {
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
            state.playerData[data.player] = { id: data.id, disconnected: false };
          }
        }
        if (message.setBoard) {
          state.differentRound = message.data;
        }
        if (message.checkBoard) {
          state.differentCheck.push('check');
        }
        if (message.remaining) {
          state.remainingSquares = message.remainingSquares;
        }
        if (message.disconnect) {
          const index = state.playerData.findIndex((x: Data) => x.id === message.id);
          state.playerData[index].disconnected = true;
        }
        if (message.skip) {
          commit('setWords', '*SKIP*');
          commit('handleRound');
        }
      });
    },
  },
});
