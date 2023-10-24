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
              <th>Sector</th>
              <th>Price (USD)</th>
              <th>Quantity</th>
              <th>Total Price (USD)</th>
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
              <td>{{ stock.sector }}</td>

              <td>{{ stock.price }}</td>

              <td class="min-w-[140px]">
                <button v-if="stock.qty>1" class="float-left" @click="stock.qty-=1">
                  <i class="bi bi-dash"></i>
                </button>
                <button v-else class="float-left text-gray-400" disabled>
                  <i class="bi bi-dash"></i>
                </button>
                  <input type="number" class="cursor-only" v-model="stock.qty" min="0" max="999" @blur="qtyInput(idx)"/>
                <button class="float-right" @click="stock.qty+=1">
                  <i class="bi bi-plus"></i>
                </button>
              </td>

              <td>{{ stock.total }}</td>

              <td v-if="totalPrice>0">{{ Math.round( (stock.total/totalPrice*100)  * 100) / 100 }}</td>
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
import axios from "../axiosConfig";

export default {
  name: 'HomePage',
  components: {
    DataList,
  },
  props: {
    stockData: {
      type: Object,
    },
    items: {
      type: Array,
    },
    budget: {
      type: Number,
    },
    date: {
      type: String,
    },
    modelValue: {
      type: Array,
    },
  },
  data(){
    return {
      stocks: [],
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
    date: {
      handler() {
        this.getPrices();
      },
      deep: true,
    },
  },
  computed: {
    haveEmpty() {
      return this.stocks.some(stock => stock.empty == true);
    },
    totalPrice() {
      return this.stocks.reduce((accumulator, stock) => {
        return accumulator + ( (stock.price == 0 || stock.price == "-") ? 0 : stock.price ) * stock.qty;
      }, 0);
    },
  },
  methods: {
    populate() {
      this.stocks = [];
      
      for (let name in this.stockData) {
        let newStockId = this.nextStockId++;
        let stock = this.stockData[name][this.stockData[name].length - 1];

        axios.get(`http://localhost:5000/stock/${name}/companyOverview`)
        .then((response) => {
          this.stocks.push({
            id: newStockId,
            name: name,
            date: stock.dateBought,
            sector: response.data.sector,
            price: stock.stockBoughtPrice,
            qty: stock.quantity,
            get total() {
              return (this.price * this.qty).toFixed(2);
            },
            action: "BUY",
            empty: false,
          });
        })
        .catch((error) => {
          console.log(error.message);
        })
      }
    },
    qtyInput(idx) {
      if (!this.stocks[idx].qty || this.stocks[idx].qty <= 0) {
        this.stocks[idx].qty = 1;
      }
    },
    addRow() {
      const newStockId = this.nextStockId++;
      this.stocks.push({
        id: newStockId,
        name: "",
        date: null,
        sector: "-",
        price: "-",
        qty: 1,
        get total() {
          return ( ( (this.price == 0 || this.price == "-") ? 0 : this.price ) * this.qty ).toFixed(2);
        },
        action: "BUY",
        empty: false,
      });
    },
    deleteRow(idx) {
      this.stocks.splice(idx, 1);
    },
    newStock(idx) {
      let stock = this.stocks[idx];

      const matchIdx = this.stocks.findIndex(item => {
        return item.name === stock.name;
      });

      // stock not selected
      if (!stock.name) {
        stock.price = "-";
        stock.sector = "-";
        stock.qty = 1;
        stock.empty = true;

      // selected and unique
      } else if (this.items.includes(stock.name) && matchIdx == idx) { 
        // get sector 
        axios.get(`http://localhost:5000/stock/${stock.name}/companyOverview`)
        .then((response) => {
          stock.sector = response.data.sector
          stock.empty = false;
        })
        .catch((error) => {
          console.log(error.message);
        })

        // if portfolio date selected, get price, else price is "-"
        if (this.date) {
          axios.get(`http://localhost:5000/stockprice/getmonthlypricebydate/${stock.name}?month=${this.date.split("-")[1]}&year=${this.date.split("-")[0]}`)
          .then((response) => {
            stock.price = this.date ? response.data["4. close"] : "-";

          })
          .catch((error) => {
            console.log(error.message);
          })
        }
        
      // otherwise, stock choice is invalid, clear stock
      } else {
        this.stocks[idx].name = "";
        this.stocks[idx].sector = "-";
        stock.empty = true;
      }

    },
    getPrices() {
      for (let i=0; i<this.stocks.length; i++) {
        if (this.stocks[i].name) {
          axios.get(`http://localhost:5000/stockprice/getmonthlypricebydate/${this.stocks[i].name}?month=${this.date.split("-")[1]}&year=${this.date.split("-")[0]}`)
          .then((response) => {
            this.stocks[i].price = this.date ? response.data["4. close"] : "-";

          })
          .catch((error) => {
            console.log(error.message);
          })
        }
      }
    },
  },
}
</script>

<style scoped>
.t1-scroll {
  @apply
  opacity-0
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
  h-[65px]
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
  h-[65px];
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

.cursor-only {
  @apply
  border-none
  outline-none
  bg-transparent
  text-current
  text-base
  p-0
  text-center
  focus:caret-black
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>