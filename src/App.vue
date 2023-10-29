<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="grow bg-navy-950" v-if="displayRouterView">
      <RouterView />
    </div>
    <div class="flex grow bg-navy-950 justify-center items-center flex-col" v-else>
      <div class="loading-animation mb-5"></div>
      <h1 class="text-4xl text-white">Loading...</h1>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

import { displayRouterView } from '@/router/index.js'
</script>

<style scoped>
  .loading-animation {
    animation: spin 1s linear infinite;
    @apply
    w-[50px]
    h-[50px]
    border-4
    border-gray-600
    border-t-gray-200
    rounded-[50%]
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>