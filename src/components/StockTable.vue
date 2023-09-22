<template>
  <div>
    <div class="grid grid-cols-[120px,1fr] sm:grid-cols-[150px,1fr]">
        <div class="grid grid-rows-[1fr,auto] relative z-20" style="linear-gradient(to bottom, white 50%, gray 50%);" :class="{'bg-white': stocks.length != 0}">
          <table class="navy-1 w-full flex-grow">
            <tr>
              <th :class="{'border-effect': stocks.length == 0}">Stock</th>
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
        <div class="overflow-x-scroll relative z-10 -ml-2">
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
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
  defineEmits(['update:stockValue'])
</script>

<script>
import DataList from './DataList.vue'

export default {
  name: 'HomePage',
  components: {
    DataList,
  },
  props: {
    initStocks: {
      type: Array,
    },
    items: {
      type: Array,
    },
    budget: {
      type: Number,
    },
    stockValue: {
      type: Array,
    },
  },
  data(){
    return {
      stocks: [],
      stockNames: [],
      nextStockId: 1,
    }
  },
  created() {
    if (this.initStocks) {
      this.stocks = this.initStocks;
      console.log(this.initStocks)
    }
  },
  watch: {
    stocks: {
      handler() {
        this.$emit('update:stockValue', this.stocks);
      },
      deep: true,
    },
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
table.navy {
    border-collapse: separate;
    @apply
    text-center 
}

table.navy tr:first-child th:nth-last-child(2) {
    @apply
    rounded-tr-xl
}
table.navy tr:last-child td:nth-last-child(2) {
    @apply
    rounded-br-xl
}

table.navy td:last-child {
    @apply
    bg-transparent
    text-red-500
}
table.navy th:last-child {
    @apply
    bg-transparent
}

table.navy th {
    @apply
    bg-navy-950
    text-white
    font-semibold
    px-5
    py-2
}
table.navy td {
    @apply
    bg-gray-300
    text-navy-950
    px-5
    py-2
}
table.navy tr {
    @apply
    h-[60px]
}
/* first column */
table.navy-1 th {
    @apply
    bg-navy-950
    text-white
    font-semibold
    px-5
    py-2
}
table.navy-1 td {
    @apply
    bg-gray-300
    text-navy-950
    px-5
    py-2
}
table.navy-1 tr:not(:first-child) {
    @apply
    h-[60px];
}
table.navy-1 {
    border-collapse: separate;
    @apply
    text-center 
}
table.navy-1 tr:first-child th:first-child {
    @apply
    rounded-tl-xl
}
table.navy-1 tr:last-child td:last-child {
    @apply
    rounded-bl-xl
}
table.navy-1 .border-effect {
    padding-left: calc(1.25rem + 2px);
    @apply
    border-r-2
    border-white
}
.green-action {
  @apply
  font-semibold
  text-green-500 !important
}
.red-action {
  @apply
  font-semibold
  text-red-500 !important
}
</style>