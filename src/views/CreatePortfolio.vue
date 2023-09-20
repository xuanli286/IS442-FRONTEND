<template>
  <div>
    <h3 class="text-white mb-8">Create Portfolio</h3>
    <div class="white-card">
      <h3 class="text-navy-950 mb-8 font-bold">Basic Information</h3>

      <h5 class="text-navy-950 mb-2 font-bold">Portfolio Name</h5>
      <input type="text" placeholder="Enter a portfolio name" class="input-grey w-full">

      <h5 class="text-navy-950 mt-8 mb-2 font-bold">Portfolio Description</h5>
      <textarea rows="5" placeholder="Write a short description or strategy about the portfolio." class="input-grey w-full"></textarea>
      
      <h3 class="text-navy-950 my-8 font-bold">Add Stocks</h3>
      <div class="overflow-x-auto">
        <table class="navy w-full">
          <tr>
            <th>Stock</th>
            <th>Price (SGD)</th>
            <th>Quantity</th>
            <th>Total Price (SGD)</th>
            <th>Allocation (%)</th>
            <th>ACTION</th>
            <th></th>
          </tr>
          <tr v-if="stocks.length == 0">
            <td colspan="6">No stocks added.</td>
            <td></td>
          </tr>

          <tr v-for="(stock, idx) of stocks" :key="stock.id">
            <td style="padding:5px!important" class="relative">
              <DataList :items="items.filter(item => !stockNames.includes(item))" v-model="stock.name" @change="newStock(idx)" />
            </td>

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
            
            <td><i class="bi bi-trash-fill" @click="deleteRow(idx)"></i></td>
          </tr>

        </table>
      </div>
      <div class="w-full text-center mt-4">
        <button class="btn-navy-dense" @click="addRow()">+</button>
      </div>

      <h5 class="text-navy-950 mt-8 mb-2 font-bold">Amount of Capital (SGD)</h5>
      <CapitalInput v-model="budget" class="mb-8"/>

      <h5 class="text-navy-950 my-8 font-bold">Remaining Balance: ${{ Math.round( (budget - portfolioTotal)  * 100) / 100 }}</h5>

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
      items: ["APPL", "AOS"],
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
    newStock(idx) {
      let stock = this.stocks[idx];
      if (this.items.includes(stock.name)) {
        // update properties of stocks
        stock.price = 10;
        console.log(stock)
        this.stockNames[idx] = stock.name;
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
</style>