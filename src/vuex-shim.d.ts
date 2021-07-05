import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

interface Origin {
  source: String;
  index: number;
}
interface Info {
  code: String;
  name: String;
  max: Number;
}
interface Data {
  id: String;
  disconnected: Boolean;
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
    lobbyError: string;
    differentRound: [];
    differentCheck: [];
    game: Info;
    remainingSquares: number;
    returnToRack: string[];
    playerData: Data[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
