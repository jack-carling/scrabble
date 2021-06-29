import { createStore } from 'vuex';

interface Origin {
  source: String;
  index: number;
}

export const store = createStore({
  state: {
    origin: { source: '', index: 0 },
    word: '',
    loading: false,
    words: [],
  },
  mutations: {
    setOrigin(state: any, payload: Origin) {
      state.origin.source = '';
      state.origin.source = payload.source;
      state.origin.index = payload.index;
    },
    setWord(state: any, payload: string) {
      state.word = payload;
    },
    setLoading(state: any, payload: boolean) {
      state.loading = payload;
    },
    handleWords(state: any) {
      state.words.push(state.word);
      state.word = '';
    },
  },
});
