import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePortfolioStore = defineStore('portfolio', () => {
  const selectedPortfolio = ref("");
  const portfoliosValue = ref({});
  const top3Portfolios = ref({});

  return { 
    selectedPortfolio,
    portfoliosValue,
    top3Portfolios,
  }
})