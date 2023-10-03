<template>
  <div class="px-8 sm:px-12 py-11">
    <h3 class="text-white mb-8">Create Portfolio</h3>
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
      <StockTable :items="items" :budget="budget" v-model="stocks"/>

      <!-- Other Add Stocks -->
      <h5 class="mt-8 form-label required">Amount of Capital (SGD)</h5>
      <CapitalInput :valid="!error.budget" v-model="budget"/>
      <div class="form-invalid" v-if="error.budget">{{ error.budget }}</div>

      <h5 class="text-navy-950 my-8 font-bold">Remaining Balance: ${{ Math.round( (budget - portfolioTotal)  * 100) / 100 }}</h5>

      <!-- Create/cancel buttons -->
      <div class="grid grid-cols-3 gap-[5%] sm:gap-12">
        <button class="btn-grey" @click="cancel">Cancel</button>
        <button class="btn-navy col-span-2" @click="validate">Create Porfolio</button>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-model="isModal" width="50%" height="fit-content">
      <div class="text-center">
        <h3 class="text-navy-950 font-bold mb-5">Portfolio has been successfully created</h3>
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
import { useUserStore } from "@/stores/useUserStore";
import { storeToRefs } from "pinia";

export default {
  name: 'CreatePortfolio',
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
      userID: useUserStore().loginUser.id,
    }
  },
  computed: {
    portfolioTotal() {
      return this.stocks.reduce((total, stock) => total + stock.total, 0);
    }
  },
  created() {
    this.retrieveStocks();
  },
  methods: {
    cancel() {
      window.history.back();
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
        this.error["stocks"] = "Invalid/empty stock input";
      }

      if (Object.keys(this.error).length === 0) {
        this.createPortfolio();
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
      this.isModal = true;

      this.pName = null;
      this.pDesc = null;
      this.stocks.splice(0);
      this.budget = null;
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