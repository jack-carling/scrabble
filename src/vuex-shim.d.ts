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
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
