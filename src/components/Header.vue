<template>
  <div class="header font-inter">
    <img src="../assets/gs-logo.svg" class="md:w-[120px] w-[100px] cursor-pointer" @click="handleLogo"/>
    <div class="col"></div>
    <div v-if="!isAuthenticated">
      <button class="text-graybrown font-semibold hover:text-navy-950" @click="handleLogin">Client Login</button>
    </div>
    <div v-else class="relative -m-5 z-50">
      <div class="profile" @click="displayProfileMenu" ref="profile">
        <img class="rounded-full w-10 md:w-12" :src="user.picture"/>
        <div class="hidden sm:block">
          <div class="text-md md:text-lg font-semibold text-graybrown">
            <p v-if="user.given_name || user.family_name">{{ user.name}}</p>
            <p v-else>{{ user.nickname }}</p>
          </div>
          <div class="text-xs text-graybrown">Investment Advisor</div>
        </div>
        <i class="bi bi-chevron-down transition" :class="{ 'chevDown': isActive }"></i>
      </div>

      <ul class="dropdown z-50" :class="{ 'active': isActive }" ref="dropdown">
        <li class="sm:hidden grid grid-cols-[auto,1fr] gap-3 p-4">
          <img class="rounded-full w-10 md:w-12" :src="user.picture"/>
          <div class="text-graybrown">
            <p v-if="user.given_name || user.family_name">{{ user.name}}</p>
            <p v-else>{{ user.nickname }}</p>
            <div class="text-xs text-graybrown">Investment Advisor</div>
          </div>
        <hr/>
        </li>
        <li class="option" @click="handleProfile">
          <i class="bi bi-person-circle pr-2"></i>
          My Profile
        </li>
        <RouterLink to="/home">
        <li class="option">
          <i class="bi bi-briefcase-fill pr-2"></i>
          My Portfolios
        </li>
        </RouterLink>
        <RouterLink to="/logs">
        <li class="option">
          <i class="bi bi-file-earmark-text pr-2"></i>
          Logs
        </li>
        </RouterLink>
        <hr/>
        <li class="option" @click="handleLogout">
          <i class="bi bi-box-arrow-right pr-2"></i>
          Log out
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter  } from "vue-router";

const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
const router = useRouter();

const handleLogin = () => {
  loginWithRedirect({
    appState: {
      target: '/home',
    }
  })
}

const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    }
  })
}

const handleProfile = () => {
  router.push({path: '/profile'});
}

const handleLogo = () => {
  if (isAuthenticated.value) {
    router.push({path: '/home'});
  }
  else {
    router.push({path: '/'});
  }
}
</script>

<script>
export default {
  name: 'HeaderBlock',
  data() {
    return {
      isActive: false,
    }
  },
  mounted() {
    document.addEventListener('click', (event) => {
      if (this.$refs.profile && this.$refs.dropdown && !this.$refs.profile.contains(event.target) && !this.$refs.dropdown.contains(event.target)) {
        this.isActive = false;
      }
    });
  },
  methods: {
    displayProfileMenu() {
      this.isActive = !this.isActive;
    }
  },
}
</script>

<style scoped>
  .header {
    @apply
    grid
    grid-rows-1
    grid-cols-[auto,1fr,auto]
    gap-3
    items-center
    bg-[#fff]
    py-7
    px-12
  }
  .profile {
    @apply
    grid
    grid-cols-[auto,auto,auto]
    gap-3
    items-center
    hover:bg-gray-50
    p-5
    rounded-lg
    cursor-pointer
  }
  .chevDown {
    @apply
    rotate-180
  }
  .dropdown {
    width: calc(100vw - 3.5rem);
    @apply
    absolute
    px-4
    /*md:top-[108.938px]
    top-[101px]*/
    top-full
    sm:left-0
    right-0
    sm:w-auto
    mobile:w-[60vw]
    bg-white
    rounded-lg
    shadow-lg
    overflow-hidden
    max-h-0;
    transition: max-height 0.2s ease-in-out, padding 0.2s ease-in-out, border 0.2s ease-in-out;
  }
  .dropdown.active {
    @apply
    max-h-[100vh]
    py-4
    border
    border-gray-200;
  }
  .option {
    @apply
    p-4
    hover:bg-gray-100
    cursor-pointer
    rounded-md
  }
</style>