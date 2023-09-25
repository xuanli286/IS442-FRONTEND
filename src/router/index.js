import { createRouter, createWebHistory } from 'vue-router';

import CreatePortfolio from "../views/CreatePortfolio.vue";
import HomePage from "../views/Home.vue";
import LandingPage from "@/views/Landing.vue";
import Profile from "@/views/Profile.vue";
import VerifyEmail from "@/views/VerifyEmail.vue";

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
    path: '/verify',
    name: VerifyEmail,
    component: VerifyEmail
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
