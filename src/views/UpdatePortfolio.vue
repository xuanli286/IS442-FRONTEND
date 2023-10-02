<template>
  <div class="px-8 sm:px-12 py-11">
    <h3 class="text-white mb-8">Update Portfolio</h3>
    <div class="white-card">
      <!-- Basic Information -->
      <h3 class="text-navy-950 mb-8 font-bold">Basic Information</h3>

      <h5 class="form-label required">Portfolio Name</h5>
      <input type="text" placeholder="Enter a portfolio name" class="input-grey w-full" :class="{'invalid': error.name}" v-model="pName">
      <div class="form-invalid" v-if="error.name">{{ error.name }}</div>

      <h5 class="mt-8 form-label">Portfolio Description</h5>
      <textarea rows="5" placeholder="Write a short description or strategy about the portfolio." class="input-grey w-full" :class="{'invalid': error.desc}" v-model="pDesc"></textarea>
      <div class="form-invalid" v-if="error.desc">{{ error.desc }}</div>

      <h3 class="text-navy-950 my-8 font-bold">Add Stocks</h3>
      
      <!-- Table -->
      <StockTable :stockData="testData.stocks" :items="items" :budget="budget" v-model="stocks"/>

      <!-- Other Add Stocks -->
      <h5 class="mt-8 form-label required">Amount of Capital (SGD)</h5>
      <CapitalInput :valid="!error.budget" v-model="budget"/>
      <div class="form-invalid" v-if="error.budget">{{ error.budget }}</div>

      <h5 class="text-navy-950 my-8 font-bold">Remaining Balance: ${{ Math.round( (budget - portfolioTotal)  * 100) / 100 }}</h5>

      <!-- Create/cancel buttons -->
      <div class="grid grid-cols-3 gap-[5%] sm:gap-12">
        <button class="btn-grey" @click="cancel">Cancel</button>
        <button class="btn-navy col-span-2" @click="validate">Save Changes</button>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-model="isModal" width="50%" height="fit-content">
      <div class="text-center">
        <h3 class="text-navy-950 font-bold mb-5">Portfolio has been successfully updated</h3>
        <button class="btn-navy">Go to Overview</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import StockTable from '../components/StockTable.vue'
import CapitalInput from '../components/CapitalInput.vue'
import Modal from '../components/Modal.vue'
import axios from "axios";

export default {
  name: 'UpdatePortfolio',
  components: {
    StockTable,
    CapitalInput,
    Modal,
  },
  data(){
    return {
      pName: null,
      pDesc: null,
      stocks: [],
      items: [],
      budget: null,
      error: {},
      isModal: false,
      testData: {
        pName: "test",
        pDesc: "this is a test",
        stocks: [
          {
            "name": "AAPL",
            "price": 151.21,
            "qty": 1
          },
          {
            "name": "AAPL",
            "price": 161.21,
            "qty": 1
          },
          {
            "name": "BABA",
            "price": 86.74,
            "qty": 3
          }
        ],
        budget: 600,
      },
    }
  },
  created() {
    this.populate();
    this.retrieveStocks();
  },
  computed: {
    portfolioTotal() {
      return this.stocks.reduce((total, stock) => total + stock.total, 0);
    }
  },
  methods: {
    cancel() {
      window.history.back();
    },
    populate() {
      this.pName = this.testData.pName;
      this.pDesc = this.testData.pDesc;
      this.budget = this.testData.budget;
    },
    retrieveStocks() {
      axios.get(`http://localhost:8080/listing_status.csv`)
      .then((response) => {
        var stockRows = response.data.split("\r\n");
        for (var i=1; i<stockRows.length; i++) {
          this.items.push(stockRows[i].split(",")[0]);
        }
      })
      .catch((error) => {
        console.log(error.message);
      })
    },
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
        this.error["desc"] = "Description is too long"
      }

      if (!this.budget) {
        this.error["budget"] = "Field is required"; 
      } else {
        if (isNaN(this.budget)) {
          this.error["budget"] = "Please enter a number"; 

        } else if (this.budget < this.portfolioTotal) {
          this.error["budget"] = `Capital allocated must be at least $${ Math.round(this.portfolioTotal * 100) / 100}`; 
        }
      }

      if (!this.stockValidation()) {
        this.error["stocks"] = "Stock name cannot be empty";
      }

      if (Object.keys(this.error).length === 0) {
        this.updatePortfolio();
      } else {
        console.log(this.error);
      }
    },
    stockValidation() {
      var valid = true;
      for (var stock of this.stocks) {
        if (stock.name == "") {
          stock.empty = true;
          valid = false;
        } else {
          stock.empty = false;
        }
      }
      return valid;
    },
   updatePortfolio() {
      var stockBefore = {};
      var stockAfter = {};
      var allStockNames = [];
      var stockResult = {};

      var stockUpdate = {};

      for (var stock of this.testData.stocks) {
        stockBefore[`${stock.name}+${stock.price}`] = stock;
        allStockNames.push(`${stock.name}+${stock.price}`);
      }
      for (var stock of this.stocks) {
        stockAfter[`${stock.name}+${stock.price}`] = stock;
        if (!allStockNames.includes(`${stock.name}+${stock.price}`)) {
          allStockNames.push(`${stock.name}+${stock.price}`);
        }
      }

      for (var stock of allStockNames) {
        // add
        if (!(stock in stockBefore) && (stock in stockAfter)) {
          if ("add" in stockResult) {
            stockResult["add"][stockAfter[stock].name] = {qty: stockAfter[stock].qty, price: stockAfter[stock].price};
          } else {
            stockResult["add"] = {};
            stockResult["add"][stockAfter[stock].name] = {qty: stockAfter[stock].qty, price: stockAfter[stock].price};
          }
        }

        // delete
        if ((stock in stockBefore) && !(stock in stockAfter)) {
          if ("delete" in stockResult) {
            stockResult["delete"][stockBefore[stock].name] = {qty: stockBefore[stock].qty, price: stockBefore[stock].price};
          } else {
            stockResult["delete"] = {};
            stockResult["delete"][stockBefore[stock].name] = {qty: stockBefore[stock].qty, price: stockBefore[stock].price};
          }
        }

        // update
        if ((stock in stockBefore) && (stock in stockAfter)) {
          if (stockBefore[stock].qty != stockAfter[stock].qty) {
            if (stockAfter[stock].name in stockUpdate) {
              stockUpdate[stockAfter[stock].name].push({qty: stockAfter[stock].qty, price: stockAfter[stock].price});
            } else {
              stockUpdate[stockAfter[stock].name] = [{qty: stockAfter[stock].qty, price: stockAfter[stock].price}];
            }
          }
        }
        if (Object.keys(stockUpdate).length != 0) {
          stockResult["update"] = stockUpdate;
        }
      }

      var newPF = {
        pName: this.pName,
        pDesc: this.pDesc,
        capital: this.budget,
      }
      if (Object.keys(stockResult).length != 0) {
        newPF["stocks"] = stockResult;
      }

      console.log(newPF);

      for (stock of this.stocks) {
        stock["freeze"] = true;
      }
      this.testData.stocks = JSON.parse(JSON.stringify(this.stocks));

      this.isModal = true;
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