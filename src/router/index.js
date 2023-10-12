import { createRouter, createWebHistory } from 'vue-router';

import CreatePortfolio from "../views/CreatePortfolio.vue";
import UpdatePortfolio from "../views/UpdatePortfolio.vue";
import CommunityPortfolio from "../views/CommunityPortfolio.vue";
import UserLogs from "../views/UserLogs.vue";
import HomePage from "../views/Home.vue";
import LandingPage from "@/views/Landing.vue";
import MyProfile from "@/views/MyProfile.vue";
import VerifyEmail from "@/views/VerifyEmail.vue";
import Stock from "@/views/Stock.vue";
import { useAuth0 } from '@auth0/auth0-vue';
import { useUserStore } from "@/stores/useUserStore";
import { storeToRefs } from "pinia";
import axios from "axios";

function guardMyroute(to, from, next) {
  const { user, isAuthenticated } = useAuth0();

  const store = useUserStore();
  const {
      loginUser,
  } = storeToRefs(store);


  if (isAuthenticated.value) {
    const data = {
      name: user.value.given_name || user.value.family_name ? user.value.name : user.value.nickname,
      email: user.value.email,
      id: user.value.sub,
      picture: user.value.picture,
      updatedAt: user.value['updated_at'],
      totalCapitalAvailable: 10000,
    };
    axios.get(`http://localhost:5000/customer/${data.id}`)
    .then((response) => {
      loginUser.value = response.data.customerData;
      localStorage.setItem('token', response.data.token)
      next();
    })
    .catch((error) => {
      if (error.message.includes('404')) {
        axios.post(`http://localhost:5000/customer/`, data)
          .then((response) => {
            loginUser.value = data;
            localStorage.setItem('token', response.data.token)
            
          })
          .catch((error) => {
            console.log(error.message);
          })
      }
    })
  }
}

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
    beforeEnter: guardMyroute,
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
    path: '/update',
    name: UpdatePortfolio,
    component: UpdatePortfolio
  },
  {
    path: '/community',
    name: CommunityPortfolio,
    component: CommunityPortfolio
  },
  {
    path: '/logs',
    name: UserLogs,
    component: UserLogs
  },
  {
    path: '/profile',
    name: MyProfile,
    component: MyProfile
  },
  {
    path: '/stock/:stockTicker',
    name: 'Stock',
    component: Stock
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
