import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

interface Origin {
  source: String;
  index: number;
}

declare module '@vue/runtime-core' {
  interface State {
    origin: Origin;
    round: string[];
    words: string[][];
    loading: boolean;
    players: string[];
    currentPlayer: number;
    previousPlayer: number;
    me: number;
    playerScore: number[];
    wordScore: number;
    id: string;
    max: number;
    lobby: boolean;
    differentRound: [];
    differentCheck: [];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
