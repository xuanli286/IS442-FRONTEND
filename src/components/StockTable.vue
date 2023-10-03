<template>
  <div>
    <div class="grid grid-cols-[120px,1fr] sm:grid-cols-[auto,1fr]">
        <div class="grid grid-rows-[1fr,auto] relative z-20" style="linear-gradient(to bottom, white 50%, gray 50%);" :class="{'bg-white': stocks.length != 0}">
          <table class="navy-1 w-full flex-grow">
            <tr>
              <th v-if="haveEmpty" style="background-color:transparent;"></th>
              <th :class="{'border-effect': stocks.length == 0, 'rounded-tl-xl': haveEmpty}" class="w-[180px]">Stock</th>
            </tr>
            <tr v-if="stocks.length == 0" class="relative">
              <td class="rounded-bl-xl"></td>
              <div class="absolute left-0 top-0 w-[150px]" style="top:calc(50% - 12px); left:calc(50vw - 166px);">No stocks added.</div>
            </tr>
            <tr v-for="(stock, idx) of stocks" :key="stock.id">
              <td v-if="stock.empty" style="background-color:transparent;padding:5px!important">
                <i class="bi bi-exclamation-circle text-red-500 text-xl"></i>
              </td>
              <td v-else-if="haveEmpty" style="background-color:transparent;padding:5px!important"></td>

              <td style="padding:5px!important" class="relative">
                <DataList :empty="stock.empty" :items="items" v-model="stock.name" @change="newStock(idx)" />
              </td>
            </tr>
          </table>
          <div class="h-fit t1-scroll" :class="{'overflow-x-scroll': scrollbarVisible}"></div>
        </div>
        <div class="overflow-x-auto relative z-10 -ml-2" ref="t2">
          <table class="navy w-full">
            <tr>
              <th>Date Purchased</th>
              <th>Price (SGD)</th>
              <th>Quantity</th>
              <th>Total Price (SGD)</th>
              <th>Allocation (%)</th>
              <th>ACTION</th>
              <th :class='{hidden: stocks.length == 0}'></th>
            </tr>
            <tr v-if="stocks.length == 0">
              <td colspan="6">
                <div class="margin-auto -translate-x-[60px] sm:-translate-x-[75px]"></div>
              </td>
              <td class="hidden"></td>
            </tr>

            <tr v-for="(stock, idx) of stocks" :key="stock.id">
              <td style="padding:5px 5px 5px 11px!important">
                <input type="month" :max="new Date().toISOString().slice(0, 7)" v-model="stock.date" @change="newStock(idx)" class="input-month"/>
              </td>

              <td>{{ stock.price }}</td>

              <td>
                <button v-if="stock.qty>1" class="float-left" @click="stock.qty-=1">
                  <i class="bi bi-dash"></i>
                </button>
                <button v-else class="float-left text-gray-400" disabled>
                  <i class="bi bi-dash"></i>
                </button>
                {{ stock.qty }}
                <button class="float-right" @click="stock.qty+=1">
                  <i class="bi bi-plus"></i>
                </button>
              </td>

              <td>{{ stock.total }}</td>

              <td v-if="budget && budget>0">{{ Math.round( (stock.total/budget*100)  * 100) / 100 }}</td>
              <td v-else>-</td>

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
defineEmits(['update:modelValue'])
</script>

<script>
import DataList from './DataList.vue'
import axios from "axios";

export default {
  name: 'HomePage',
  components: {
    DataList,
  },
  props: {
    stockData: {
      type: Array,
    },
    items: {
      type: Array,
    },
    budget: {
      type: Number,
    },
    modelValue: {
      type: Array,
    },
  },
  data(){
    return {
      stocks: [],
      stockNames: [],
      nextStockId: 1,
      scrollbarVisible: false,
    }
  },
  created() {
    if (this.stockData) {
      this.populate();
    }    
  },
  mounted() {
    if (this.$refs.t2) {
      this.scrollbarVisible = this.$refs.t2.scrollWidth > this.$refs.t2.clientWidth;
    }

    window.addEventListener('resize', () => {
      if (this.$refs.t2) {
        this.scrollbarVisible = this.$refs.t2.scrollWidth > this.$refs.t2.clientWidth;
      }
    });
  },
  watch: {
    stocks: {
      handler() {
        this.$emit('update:modelValue', this.stocks);
        setTimeout(() => {
          this.scrollbarVisible = this.$refs.t2.scrollWidth > this.$refs.t2.clientWidth;
        }, 0.1);
      },
      deep: true,
    },
    stockData: {
      handler() {
        this.populate();
      },
      deep: true,
    },
  },
  computed: {
    haveEmpty() {
      return this.stocks.some(stock => stock.empty == true);
    },
  },
  methods: {
    populate() {
      this.stocks = [];
      this.stockNames = [];

      for (var stock of this.stockData) {
        var newStockId = this.nextStockId++;
        this.stocks.push({
          id: newStockId,
          name: stock.name,
          date: stock.date,
          price: stock.price,
          qty: stock.qty,
          get total() {
            return Math.round(this.price * this.qty * 100) / 100;
          },
          action: "BUY",
          empty: false,
        });

        this.stockNames.push(`${stock.name}.${stock.date}`);
      }
    },
    addRow() {
      const newStockId = this.nextStockId++;
      this.stocks.push({
        id: newStockId,
        name: "",
        date: null,
        price: 0,
        qty: 1,
        get total() {
          return this.price * this.qty;
        },
        action: "BUY",
        empty: false,
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

      if (!stock.name || !stock.date) {
        stock.price = 0;
      } else if (this.items.includes(stock.name) && !this.stockNames.includes(`${stock.name}.${stock.date}`)) {        
        axios.get(`http://localhost:5000/stockprice/getmonthlypricebydate/${stock.name}?month=${stock.date.split("-")[1]}&year=${stock.date.split("-")[0]}`)
        .then((response) => {
          stock.price = response.data["4. close"];
          stock.empty = false;
        })
        .catch((error) => {
          console.log(error.message);
        })
      } else {
        this.stocks[idx].name = "";
        this.stocks[idx].date = "";
        this.stockNames[idx] = "";
        stock.empty = true;
      }

      this.stockNames[idx] = `${stock.name}.${stock.date}`;
      console.log(this.stockNames);
      console.log(this.stocks);
    },
  },
}
</script>

<style scoped>
.t1-scroll {
  @apply
  opacity-0
}

.input-month {
  @apply
  bg-transparent
  rounded-xl
  p-3
  w-full
  text-navy-950
  placeholder:text-navy-800
}
.input-month:focus {
  background-color: rgb(0, 0, 0, 0.1);
  outline: 2px solid;
  @apply
  outline-navy-950
  -outline-offset-2
  placeholder:text-navy-800
}

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
  bg-gray-200
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
  bg-gray-200
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