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
      <StockTable :stockData="stockData" :items="items" :budget="budget" v-model="stocks"/>

      <!-- Other Add Stocks -->
      <h5 class="mt-8 form-label required">Amount of Capital (SGD)</h5>
      <CapitalInput :valid="!error.budget" v-model="budget"/>
      <div class="form-invalid" v-if="error.budget">{{ error.budget }}</div>

      <h5 class="text-navy-950 my-8 font-bold">Remaining Balance: ${{ Math.round( (budget - portfolioTotal)  * 100) / 100 }}</h5>

      <!-- Portfolio Visibility -->
      <h3 class="text-navy-950 mb-8 font-bold">Portfolio Visbility</h3>
      <ToggleButton v-model="isPublic" left="Public" right="Private"/>

      <!-- Create/cancel buttons -->
      <div class="grid grid-cols-3 gap-[5%] sm:gap-12">
        <button class="btn-grey" @click="cancel">Cancel</button>
        <button class="btn-navy col-span-2" @click="validate">Save Changes</button>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-model="isModal" width="50%" height="fit-content">
      <div class="text-center">
        <h3 class="text-navy-950 font-bold mb-5">{{ modalMsg }}</h3>
        <button class="btn-navy">Go to Overview</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import StockTable from '../components/StockTable.vue'
import CapitalInput from '../components/CapitalInput.vue'
import ToggleButton from '../components/ToggleButton.vue'
import Modal from '../components/Modal.vue'
import axios from "../axiosConfig";
import { useUserStore } from "@/stores/useUserStore";

export default {
  name: 'UpdatePortfolio',
  components: {
    StockTable,
    CapitalInput,
    ToggleButton,
    Modal,
  },
  setup() {
    const userID = useUserStore().loginUser.id;

    return { userID }
  },
  data(){
    return {
      // For testing: ?pID=I393f7rMWhtOe0fj1fTx
      pID: this.$route.query.pID,
      pName: null,
      pDesc: null,
      stocks: [],
      items: [],
      budget: null,
      error: {},
      isModal: false,
      modalMsg: "",
      isPublic: null,
      stockData: {},
    }
  },
  created() {
    if (this.pID) {
      this.populate();
      this.retrieveStocks();
    } else {
      this.$router.go(-1);
    }
  },
  computed: {
    portfolioTotal() {
      return this.stocks.reduce((total, stock) => total + stock.total, 0);
    }
  },
  methods: {
    cancel() {
      this.$router.push('/home');
    },
    populate() {
      axios.get(`http://localhost:5000/portfolio/${this.pID}`)
      .then((response) => {
        if (this.userID == response.data.userId) {
          this.pName = response.data.portfolioName;
          this.pDesc = response.data.portfolioDescription;
          this.budget = response.data.capital;
          this.isPublic = response.data.isPublic;
          this.stockData = response.data.portStock;
          console.log(response.data)
        } else {
          console.log("who u");
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.$router.push('/home');
      })
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
        if (!stock.name || !stock.date) {
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
      var stockResult = { add: {}, delete: {}, update: {} };

      // stockBefore
      for (var name in this.stockData) {
        var i = 0;
        for (var stock of this.stockData[name]) {
          stockBefore[`${name}.${stock.dateBought}`] = {"name": name, "price": stock.stockBoughtPrice, "date": stock.dateBought, "qty": stock.quantity, "idx": i};
          allStockNames.push(`${name}.${stock.dateBought}`);
          i++;
        }
      }

      // stockAfter
      for (var stock of this.stocks) {
        stockAfter[`${stock.name}.${stock.date}`] = stock;
        if (!allStockNames.includes(`${stock.name}.${stock.date}`)) {
          allStockNames.push(`${stock.name}.${stock.date}`);
        }
      }

      // stockResult
      for (var stock of allStockNames) {
        // add
        if (!(stock in stockBefore) && (stock in stockAfter)) {
          var s1 = stockAfter[stock];
          var n1 = stockAfter[stock].name;

          if (n1 in stockResult.add) {
            stockResult.add[n1].push({"quantity": s1.qty, "dateBought": s1.date, "stockBoughtPrice": s1.price});
          } else {
            stockResult.add[n1] = [{"quantity": s1.qty, "dateBought": s1.date, "stockBoughtPrice": s1.price}];
          }
        }

        // delete
        if ((stock in stockBefore) && !(stock in stockAfter)) {
          var s2 = stockBefore[stock];
          var n2 = stockBefore[stock].name;

          if (!(n2 in stockResult.delete)) {
            stockResult.delete[n2] = [];
          }
          stockResult.delete[n2].push(stockBefore[stock].idx);
        }

        // update
        if ((stock in stockBefore) && (stock in stockAfter)) {
          if (stockBefore[stock].qty != stockAfter[stock].qty) {
            var s3 = stockAfter[stock];
            var n3 = stockAfter[stock].name;

            if (!(n3 in stockResult.update)) {
              stockResult.update[n3] = {};
            }
            stockResult.update[n3][stockBefore[stock].idx] = {"quantity": s3.qty, "dateBought": s3.date, "stockBoughtPrice": s3.price};
          }
        }

      }

      // newPf
      var newPf = {
        "portfolioId": this.pID,
        "portfolioName": this.pName,
        "portfolioDescription": this.pDesc,
        "userId": this.userID,
        "capital": this.budget,
        "isPublic": this.isPublic,
      }

      if (Object.keys(stockResult.add).length != 0) {
        newPf["add"] = stockResult.add;
      }
      if (Object.keys(stockResult.delete).length != 0) {
        newPf["delete"] = stockResult.delete;
      }
      if (Object.keys(stockResult.update).length != 0) {
        newPf["update"] = stockResult.update;
      }

      console.log(newPf);
      
      axios.post(`http://localhost:5000/portfolio/updateportfolio/`, newPf)
      .then((response) => {
        console.log(response.data);
        this.modalMsg = "Portfolio has been successfully updated!";
        
        // get updated portfolio
        this.populate();
      })
      .catch((error) => {
        console.log(error.message);
        this.modalMsg = "Something went wrong!"
      })

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