import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePortfolioStore = defineStore('portfolio', () => {
  const portfolios = ref([]);
  const top3Portfolios = ref({});

  return { 
    portfolios,
    top3Portfolios,
  }
})