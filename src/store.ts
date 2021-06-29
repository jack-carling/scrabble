import { createStore } from 'vuex';

interface Origin {
  source: String;
  index: number;
}

export const store = createStore({
  state: {
    origin: { source: '', index: 0 },
    loading: false,
    round: [],
    words: [],
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
    handleWords(state: any) {
      state.words.push(state.round);
      state.round = [];
    },
  },
});
