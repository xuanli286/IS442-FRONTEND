import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "../views/Home.vue";
import CreatePortfolio from "../views/CreatePortfolio.vue";

const routes = [
  {
    path: '/',
    name: HomePage,
    component: HomePage
  },
  {
    path: '/create',
    name: CreatePortfolio,
    component: CreatePortfolio
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
