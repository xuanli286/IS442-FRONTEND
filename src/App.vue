<template>
  <div class="flex flex-col min-h-screen">
    <div v-if="!isAuthenticated">
      <button @click="handleLogin">Log in</button>
    </div>
    <button v-else @click="handleLogout">Log Out</button>
    <Header />
    <div class="flex-grow bg-navy-950 font-mono">
      <RouterView class="px-8 sm:px-12 py-11"/>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

const handleLogin = () => {
  loginWithRedirect({
    appState: {
      target: '/profile',
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
</script>