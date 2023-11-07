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
import { ref } from "vue";

const displayRouterView = ref(false);

function guardMyRoute(to, from, next) {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const access = ["/", "/verify"];

  const store = useUserStore();
  const {
      loginUser,
  } = storeToRefs(store);

  displayRouterView.value = false;

  if (access.includes(to.path)) {
    displayRouterView.value = true;
    next();
  } else if (!isLoading.value && isAuthenticated.value && loginUser.value.id) {
    displayRouterView.value = true;
    next();
  } else {
    const checkLoading = setInterval(() => {
      if (!isLoading.value) {
        clearInterval(checkLoading);
        authenticate();
      }
    }, 100)
  }

  function authenticate() {
    if (isAuthenticated.value) {
      next();
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
        
        displayRouterView.value = true;
      })
      .catch((error) => {
        if (error.message.includes('404')) {
          axios.post(`http://localhost:5000/customer/`, data)
            .then((response) => {
              loginUser.value = data;
              localStorage.setItem('token', response.data.token)

              displayRouterView.value = true;
            })
            .catch((error) => {
              console.log(error.message);
            })
        }
      })
    } else {
      next("/");
    }
  }
}

const routes = [
  {
    path: '/',
    name: LandingPage,
    component: LandingPage,
    beforeEnter: guardMyRoute,
  },
  {
    path: '/home',
    name: HomePage,
    component: HomePage,
    beforeEnter: guardMyRoute,
  },
  {
    path: '/verify',
    name: VerifyEmail,
    component: VerifyEmail,
    beforeEnter: guardMyRoute,
  },
  {
    path: '/create',
    name: CreatePortfolio,
    component: CreatePortfolio,
    beforeEnter: guardMyRoute,
  },
  {
    path: '/update',
    name: UpdatePortfolio,
    component: UpdatePortfolio,
    beforeEnter: guardMyRoute,
  },
  {
    path: '/community',
    name: Community,
    component: Community,
    beforeEnter: guardMyRoute,
  },
  {
    path: '/community/portfolio',
    name: CommunityPortfolio,
    component: CommunityPortfolio,
    beforeEnter: guardMyRoute,
  },
  {
    path: '/logs',
    name: UserLogs,
    component: UserLogs,
    beforeEnter: guardMyRoute,
  },
  {
    path: '/profile',
    name: MyProfile,
    component: MyProfile,
    beforeEnter: guardMyRoute,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export { displayRouterView };
export default router;