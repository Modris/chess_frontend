import { createRouter, createWebHistory } from "vue-router";
import MainPage from '@/components/MainPage.vue'
import GameHistoryAll from '@/components/GameHistoryAll.vue';


const routes = [
    {
        path: "/",
        component: MainPage
    },
      {
        path: "/history",
        alias: ['/history', `/history/page/:id`],
        component: GameHistoryAll
      }

];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_ENV),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    //return { top: 0 }
  },
});

export default router;
