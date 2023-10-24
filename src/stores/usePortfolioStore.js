import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePortfolioStore = defineStore('portfolio', () => {
  const selectedPortfolio = ref({});
  const portfoliosValue = ref([]);
  const isReroute = ref(false);
  const isOpen = ref(true);

  return { 
    selectedPortfolio,
    portfoliosValue,
    isReroute,
    isOpen,
  }
})