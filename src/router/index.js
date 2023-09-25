import { createRouter, createWebHistory } from 'vue-router';

import CreatePortfolio from "../views/CreatePortfolio.vue";
import HomePage from "../views/Home.vue";
import LandingPage from "@/views/Landing.vue";
import Profile from "@/views/Profile.vue";
import VerifyEmail from "@/views/VerifyEmail.vue";
import Stock from "@/views/Stock.vue";
import Portfolio from "@/views/Portfolio.vue";

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
  },
  {
    path: '/stock',
    name: Stock,
    component: Stock
  },
  {
    path: '/portfolio',
    name: Portfolio,
    component: Portfolio
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
