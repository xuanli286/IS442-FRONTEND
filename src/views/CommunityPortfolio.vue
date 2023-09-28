<template>
  <div class="px-8 sm:px-12 py-11">
    <SearchInput class="w-2/5"/> <button class="btn-outline-white">Filter</button>
    <div class="white-card"></div>
  </div>
</template>

<script>
import SearchInput from '../components/SearchInput.vue'

export default {
  name: 'CommunityPortfolio',
  components: {
    SearchInput,
  },
  data(){
    return {
    }
  },
  methods: {
    
  },
}
</script>

<style scoped>
  h3 {
    @apply
    text-2xl
  }
</style>