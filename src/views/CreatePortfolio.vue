<template>
  <div>
    <h3 class="text-white mb-8">Create Portfolio</h3>
    <div class="white-card">
      <!-- Basic Information -->
      <h3 class="text-navy-950 mb-8 font-bold">Basic Information</h3>

      <h5 class="text-navy-950 mb-2 font-bold">Portfolio Name</h5>
      <input type="text" placeholder="Enter a portfolio name" class="input-grey w-full">

      <h5 class="text-navy-950 mt-8 mb-2 font-bold">Portfolio Description</h5>
      <textarea rows="5" placeholder="Write a short description or strategy about the portfolio." class="input-grey w-full"></textarea>
      
      <h3 class="text-navy-950 my-8 font-bold">Add Stocks</h3>
      
      <!-- Table -->
      <StockTable :items="items" :budget="budget" :stock-value="stocks" @update:stock-value="newValue => stocks = newValue"/>

      <!-- Other Add Stocks -->
      <h5 class="text-navy-950 mt-8 mb-2 font-bold">Amount of Capital (SGD)</h5>
      <CapitalInput v-model="budget" class="mb-8"/>

      <h5 class="text-navy-950 my-8 font-bold">Remaining Balance: ${{ Math.round( (budget - portfolioTotal)  * 100) / 100 }}</h5>

      <!-- Create/cancel buttons -->
      <div class="grid grid-cols-3 gap-[5%] sm:gap-12">
        <button class="btn-grey">Cancel</button>
        <button class="btn-navy col-span-2">Create Porfolio</button>
      </div>
    </div>
  </div>
</template>

<script>
import StockTable from '../components/StockTable.vue'
import CapitalInput from '../components/CapitalInput.vue'

export default {
  name: 'CreatePortfolio',
  components: {
    StockTable,
    CapitalInput,
  },
  data(){
    return {
      stocks: [],
      items: ["APPL", "AOS", "TSCO", "DDW"],
      budget: null,
    }
  },
  computed: {
    portfolioTotal() {
      return this.stocks.reduce((total, stock) => total + stock.total, 0);
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