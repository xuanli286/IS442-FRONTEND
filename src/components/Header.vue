<template>
  <div class="header font-inter">
    <img src="../assets/gs-logo.svg" class="md:w-[120px] w-[100px] cursor-pointer" @click="handleLogo"/>
    <div class="col"></div>
    <div v-if="!isAuthenticated">
      <button class="text-graybrown font-semibold hover:text-navy-950" @click="handleLogin">Client Login</button>
    </div>
    <div v-else class="relative -m-5 z-50">
      <div class="profile" @click="displayProfileMenu" ref="profile">
        <img class="rounded-full w-10 md:w-12" :src="user.picture || require('@/assets/pfp.png')"/>
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
        <template v-for="item of navItems">
          <li class="option" :class="{ 'bg-gray-200': $route.path == item.path, 'hover:bg-gray-50': $route.path != item.path}" @click="handleRedirect(item.path)">
            <i :class="['bi', item.icon, 'pr-2']"></i>
            {{ item.name }}
          </li>
        </template>
        <hr/>
        <li class="option hover:bg-gray-50" @click="handleLogout">
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
      navItems: [
        {name: "My Profile", icon: "bi-person-circle", path: "/profile"},
        {name: "My Portfolios", icon: "bi-briefcase-fill", path: "/home"},
        {name: "Community", icon: "bi-people-fill", path: "/community"},
        {name: "Logs", icon: "bi-file-earmark-text", path: "/logs"},
      ],
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
    },
    handleRedirect(redirectPath) {
      this.$router.push({path: redirectPath});
      this.isActive = false;
    },
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
    transition: max-height 0.1s ease-in-out, padding 0.1s ease-in-out, border 0.1s ease-in-out;
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
    cursor-pointer
    rounded-md
  }
</style>