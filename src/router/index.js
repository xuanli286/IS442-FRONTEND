import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "../views/Home.vue";
import LandingPage from "@/views/Landing.vue";
import CreatePortfolio from "../views/CreatePortfolio.vue";
import Profile from "@/views/Profile.vue";

const routes = [
  {
    path: '/',
    name: LandingPage,
    component: LandingPage
  },
  {
    path: '/home',
    name: HomePage,
    component: HomePage
  },
  {
    path: '/create',
    name: CreatePortfolio,
    component: CreatePortfolio
  },
  {
    path: '/profile',
    name: Profile,
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
