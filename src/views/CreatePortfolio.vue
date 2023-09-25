<template>
  <div class="px-8 sm:px-12 py-11">
    <h3 class="text-white mb-8">Create Portfolio</h3>
    <div class="white-card">
      <!-- Basic Information -->
      <h3 class="text-navy-950 mb-8 font-bold">Basic Information</h3>

      <h5 class="text-navy-950 mb-2 font-bold">Portfolio Name</h5>
      <input type="text" placeholder="Enter a portfolio name" class="input-grey w-full" v-model="pName">

      <h5 class="text-navy-950 mt-8 mb-2 font-bold">Portfolio Description</h5>
      <textarea rows="5" placeholder="Write a short description or strategy about the portfolio." class="input-grey w-full" v-model="pDesc"></textarea>
      
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
        <button class="btn-navy col-span-2" @click="validate">Create Porfolio</button>
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
      pName: null,
      pDesc: null,
      stocks: [],
      items: ["APPL", "AOS", "TSCO", "DDW"],
      budget: null,
      error: {}
    }
  },
  computed: {
    portfolioTotal() {
      return this.stocks.reduce((total, stock) => total + stock.total, 0);
    }
  },
  methods: {
    validate() {
      this.error = {};
      const allowedCharactersPattern = /^[a-zA-Z0-9\s\-_]+$/;
      
      if (!this.pName) {
        this.error["name"] = "Field is required";
      } else {
        if ( !(this.pName.length >= 3 && this.pName.length <= 20) ) {
          this.error["name"] = "Name must be within 3-50 characters";
        }
        if (!allowedCharactersPattern.test(this.pName)) {
          this.error["name"] =  "Name can only contain letters, numbers, spaces, hypens and underscores";
        }
      }

      if (this.pDesc && this.pDesc.length > 250) {
        this.error["desc"] = "Please enter a shorter description"
      }

      if (!this.budget) {
        this.error["budget"] = "Field is required"; 
      } else {
        if (isNaN(this.budget)) {
          this.error["budget"] = "Please enter a number"; 

        } else if (this.budget < this.portfolioTotal) {
          this.error["budget"] = `Capital allocated must be at least $${this.portfolioTotal}`; 
        }
      }

      if (!this.stockValidation()) {
        this.error["stocks"] = "Stock name cannot be empty";
      }

      if (Object.keys(this.error).length === 0) {
        this.createPortfolio();
      } else {
        console.log(this.error);
      }
    },
    stockValidation() {
      for (var stock of this.stocks) {
        if (stock.name == "") {
          stock.empty = false;
          return false;
        } else {
          stock.empty = true;
        }
      }
      return true;
    },
    createPortfolio() {
      var allStocks = [];
      for (var stock of this.stocks) {
        allStocks.push({"name": stock.name, "qty": stock.qty});
      }
      const newPF = {
        pName: this.pName,
        pDesc: this.pDesc,
        stocks: allStocks,
        capital: this.budget,
      }
      
      console.log(newPF);
    },
  },
}
</script>

<style scoped>
  h3 {
    @apply
    text-2xl
  }
</style>