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

      <!-- Portfolio Visibility -->
      <h3 class="text-navy-950 mb-8 font-bold">Portfolio Visbility</h3>
      <ToggleButton v-model="isPublic" left="Public" right="Private"/>

      <!-- Create/cancel buttons -->
      <div class="grid grid-cols-3 gap-[5%] sm:gap-12">
        <button class="btn-grey" @click="cancel">Cancel</button>
        <button class="btn-navy col-span-2" @click="validate">Create Porfolio</button>
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
import axios from "axios";
import { useUserStore } from "@/stores/useUserStore";

export default {
  name: 'CreatePortfolio',
  components: {
    StockTable,
    CapitalInput,
    ToggleButton,
    Modal,
  },
  setup() {
    const userID = useUserStore().loginUser.id.split("|")[1];

    return { userID }
  },
  data(){
    return {
      pName: null,
      pDesc: null,
      stocks: [],
      items: [],
      budget: 0,
      error: {},
      isModal: false,
      modalMsg: "",
      isPublic: true,
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

      if (this.budget == null) {
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
      var allStocks = {};
      for (var stock of this.stocks) {
        if (stock.name in allStocks) {
          allStocks[stock.name].push({"stockBoughtPrice": stock.price, "quantity": stock.qty, "dateBought": stock.date})
        } else {
          allStocks[stock.name] = [{"stockBoughtPrice": stock.price, "quantity": stock.qty, "dateBought": stock.date}]
        }
      }
      const pfData = {
        "portfolioName": this.pName,
        "portfolioDescription": this.pDesc,
        "userId": this.userID,
        "dateCreated": new Date().toLocaleDateString('en-GB'),
        "capital": this.budget,
        "isPublic": this.isPublic,
        "portStock": allStocks,
      }

      axios.post(`http://localhost:5000/portfolio/create`, pfData)
      .then((response) => {
        console.log(response.data);
        console.log(pfData);
        this.modalMsg = "Portfolio has been successfully created!";
        this.pName = null;
        this.pDesc = null;
        this.stocks.splice(0);
        this.budget = 0;
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