<template>
  <div class="flex flex-col">
    <Header />
    <div class="flex-grow min-h-screen bg-navy-950 font-mono">
      <RouterView/>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>