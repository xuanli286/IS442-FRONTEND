import { createRouter, createWebHistory } from 'vue-router';

import CreatePortfolio from "../views/CreatePortfolio.vue";
import UpdatePortfolio from "../views/UpdatePortfolio.vue";
import Community from "../views/Community.vue";
import CommunityPortfolio from "../views/CommunityPortfolio.vue";
import UserLogs from "../views/UserLogs.vue";
import HomePage from "../views/Home.vue";
import LandingPage from "@/views/Landing.vue";
import MyProfile from "@/views/MyProfile.vue";
import VerifyEmail from "@/views/VerifyEmail.vue";
import { useAuth0 } from '@auth0/auth0-vue';
import { useUserStore } from "@/stores/useUserStore";
import { storeToRefs } from "pinia";
import axios from "axios";

const routes = [
  {
    path: '/',
    name: LandingPage,
    component: LandingPage
  },
  {
    path: '/home',
    name: HomePage,
    component: HomePage,
  },
  {
    path: '/verify',
    name: VerifyEmail,
    component: VerifyEmail
  },
  {
    path: '/create',
    name: CreatePortfolio,
    component: CreatePortfolio,
  },
  {
    path: '/update',
    name: UpdatePortfolio,
    component: UpdatePortfolio,
  },
  {
    path: '/community',
    name: Community,
    component: Community,
  },
  {
    path: '/community/portfolio',
    name: CommunityPortfolio,
    component: CommunityPortfolio,
  },
  {
    path: '/logs',
    name: UserLogs,
    component: UserLogs,
  },
  {
    path: '/profile',
    name: MyProfile,
    component: MyProfile,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router