import { createRouter, createWebHistory } from 'vue-router';

import Start from './views/Start.vue';
import Game from './views/Game.vue';

const routes = [
  {
    path: '/',
    component: Start,
  },
  {
    path: '/game',
    component: Game,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router };
