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
      <div class="grid grid-cols-[120px,1fr] sm:grid-cols-[150px,1fr]">
        <div class="grid grid-rows-[1fr,auto]" :class="{spacing: stocks.length == 0, '-mr-[2px]': stocks.length != 0}">
          <table class="navy-1 w-full flex-grow">
            <tr>
              <th :class="{'spacing-inside': stocks.length == 0}">Stock</th>
            </tr>
            <tr v-if="stocks.length == 0">
              <td></td>
            </tr>
            <tr v-for="(stock, idx) of stocks" :key="stock.id">
              <td style="padding:5px!important" class="relative">
                <DataList :items="items.filter(item => (!stockNames.includes(item) || stockNames[idx]) )" :model-value="stock.name" @update:model-value="newValue => stock.name = newValue" @input="newStock(stock.name, idx)" />
              </td>
            </tr>
          </table>
          <div class="overflow-x-scroll h-fit"></div>
        </div>
        <div class="overflow-x-scroll">
          <table class="navy w-full">
            <tr>
              <th>Price (SGD)</th>
              <th>Quantity</th>
              <th>Total Price (SGD)</th>
              <th>Allocation (%)</th>
              <th>ACTION</th>
              <th :class='{hidden: stocks.length == 0}'></th>
            </tr>
            <tr v-if="stocks.length == 0">
              <td colspan="5">
                <div class="margin-auto -translate-x-[60px] sm:-translate-x-[75px]">No stocks added.</div>
              </td>
              <td class="hidden"></td>
            </tr>

            <tr v-for="(stock, idx) of stocks" :key="stock.id">
              <td>{{ stock.price }}</td>

              <td>
                <i class="bi bi-plus float-left cursor-pointer" @click="stock.qty+=1"></i>
                {{ stock.qty }}
                <i class="bi bi-dash float-right cursor-pointer" @click="stock.qty-=1"></i>
              </td>

              <td>{{ stock.total }}</td>

              <td>{{ Math.round( (stock.total/budget*100)  * 100) / 100 }}</td>

              <td v-if="stock.action=='BUY'" class="green-action">{{ stock.action }}</td>
              <td v-else class="red-action">{{ stock.action }}</td>
              
              <td :class='{hidden: stocks.length == 0}'><i class="bi bi-trash-fill cursor-pointer" @click="deleteRow(idx)"></i></td>
            </tr>

          </table>
        </div>
      </div>

      <!-- [ + ] -->
      <div class="w-full text-center mt-4">
        <button class="btn-navy-dense" @click="addRow()">+</button>
      </div>

      <!-- Other Add Stocks -->
      <h5 class="text-navy-950 mt-8 mb-2 font-bold">Amount of Capital (SGD)</h5>
      <CapitalInput v-model="budget" class="mb-8"/>

      <h5 class="text-navy-950 my-8 font-bold">Remaining Balance: ${{ Math.round( (budget - portfolioTotal)  * 100) / 100 }}</h5>

      <!-- Create/cancel buttons -->
      <div class="grid grid-cols-3 gap-12">
        <button class="btn-grey">Cancel</button>
        <button class="btn-navy col-span-2">Create Porfolio</button>
      </div>
    </div>
  </div>
</template>

<script>
import DataList from '../components/DataList.vue'
import CapitalInput from '../components/CapitalInput.vue'

export default {
  name: 'CreatePortfolio',
  components: {
    DataList,
    CapitalInput,
  },
  data(){
    return {
      stocks: [],
      stockNames: [],
      items: ["APPL", "AOS", "TSCO", "DDW"],
      nextStockId: 1,
      budget: null,
    }
  },
  computed: {
    portfolioTotal() {
      // Compute the total portfolio value by summing up the 'total' property of each stock
      return this.stocks.reduce((total, stock) => total + stock.total, 0);
    }
  },
  methods: {
    addRow() {
      const newStockId = this.nextStockId++;
      this.stocks.push({
        id: newStockId,
        name: "",
        price: 0,
        qty: 0,
        get total() {
          return this.price * this.qty;
        },
        action: "BUY"
      });
      this.stockNames.push("");
    },
    deleteRow(idx) {
      this.stocks.splice(idx, 1);
      this.stockNames.splice(idx, 1);
      console.log(this.stocks);
    },
    newStock(name, idx) {
      let stock = this.stocks[idx];
      this.stockNames[idx] = name;
      console.log(this.stockNames)
      if (this.items.includes(stock.name)) {
        // update properties of stocks
        stock.price = 10;
        console.log(stock)
      }
    },
  },
}
</script>

<style scoped>
  h3 {
    @apply
    text-2xl
  }
  .green-action {
    @apply
    text-green-500
    font-semibold
  }
  .red-action {
    @apply
    text-red-500
    font-semibold
  }
  .spacing {
    @apply
    -mr-[4px]
  }
  .spacing-inside {
    padding-right: calc(1.25rem + 1px);
    @apply
    border-r-2
    border-white
  }
</style>