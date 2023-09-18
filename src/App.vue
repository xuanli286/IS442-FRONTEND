<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex-grow bg-navy font-mono">
      <RouterView class="px-12 py-11"/>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<script>
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
}
</script>

<style>
</style>
