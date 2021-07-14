import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

import { Origin, Info, Disconnections } from './services/interfaces';

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
    playerData: string[];
    disconnections: Disconnections[];
    swap: boolean;
    emptyBoard: boolean;
    zeroSquaresSelected: boolean;
    gameOver: boolean;
    gameOverInfo: string;
    lateGameSkips: boolean[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
