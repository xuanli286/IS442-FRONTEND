import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePortfolioStore = defineStore('portfolio', () => {
  const portfoliosValue = ref({});
  const top3Portfolios = ref({});

  return { 
    portfoliosValue,
    top3Portfolios,
  }
})