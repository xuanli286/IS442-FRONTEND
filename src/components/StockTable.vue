<template>
  <div>
    <div class="grid grid-cols-[120px,1fr] sm:grid-cols-[180px,1fr]">
        <div class="grid grid-rows-[1fr,auto] relative z-20" style="linear-gradient(to bottom, white 50%, gray 50%);" :class="{'bg-white': stocks.length != 0}">
          <table class="navy-1 w-full flex-grow">
            <tr>
              <th :class="{'border-effect': stocks.length == 0}">Stock</th>
            </tr>
            <tr v-if="stocks.length == 0" class="relative">
              <td class="rounded-bl-xl"></td>
              <div class="absolute left-0 top-0 w-[150px]" style="top:calc(50% - 12px); left:calc(50vw - 166px);">No stocks added.</div>
            </tr>
            <tr v-for="(stock, idx) of stocks" :key="stock.id" class>
              <td style="padding:5px!important" class="relative" v-if="!stock.freeze">
                <DataList :empty="stock.empty" :items="items.filter(item => (!stockNames.includes(item) || stockNames[idx]) )" v-model="stock.name" @change="newStock(stock.name, idx)" />
              </td>
              <td style="padding-top:5px!important;padding-right:5px!important;padding-bottom:5px!important;padding-left:1.0625rem!important;" class="relative text-left" v-else>
                {{ stock.name }}
              </td>
            </tr>
          </table>
          <div class="h-fit" :class="{'overflow-x-scroll': scrollbarVisible}"></div>
        </div>
        <div class="overflow-x-auto relative z-10 -ml-2" ref="t2">
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
                <div class="margin-auto -translate-x-[60px] sm:-translate-x-[75px]"></div>
              </td>
              <td class="hidden"></td>
            </tr>

            <tr v-for="(stock, idx) of stocks" :key="stock.id">
              <td>{{ stock.price }}</td>

              <td>
                <button class="float-left" @click="stock.qty+=1">
                  <i class="bi bi-plus"></i>
                </button>
                {{ stock.qty }}
                <button v-if="stock.qty>1" class="float-right" @click="stock.qty-=1">
                  <i class="bi bi-dash"></i>
                </button>
                <button v-else class="float-right text-gray-400" disabled>
                  <i class="bi bi-dash"></i>
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
  },
  methods: {
    populate() {
      for (var stock of this.stockData) {
        var newStockId = this.nextStockId++;
        this.stocks.push({
          id: newStockId,
          name: stock.name,
          price: stock.price,
          qty: stock.qty,
          get total() {
            return Math.round(this.price * this.qty * 100) / 100;
          },
          action: "BUY",
          empty: false,
          freeze: true,
        });
      }
    },
    addRow() {
      const newStockId = this.nextStockId++;
      this.stocks.push({
        id: newStockId,
        name: "",
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
    newStock(name, idx) {
      let stock = this.stocks[idx];
      this.stockNames[idx] = name;
      console.log(this.stockNames)
      if (stock.name && this.items.includes(stock.name)) {
        // update properties of stocks
        stock.empty = false;

        axios.get(`http://localhost:5000/stockprice/eodprice/${stock.name}`)
        .then((response) => {
          stock.price = response.data["4. close"];
        })
        .catch((error) => {
          console.log(error.message);
        })
      }
      console.log(this.stocks);
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