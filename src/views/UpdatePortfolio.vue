<template>
  <div class="px-8 sm:px-12 py-11">
    <h3 class="text-white mb-8">Update Portfolio</h3>
    <div class="white-card">
      <!-- Basic Information -->
      <h3 class="text-navy-950 mb-8 font-bold">Basic Information</h3>

      <h5 class="form-label required">Portfolio Name</h5>
      <input type="text" placeholder="Enter a portfolio name" class="input-grey w-full" :class="{'invalid': error.name}" v-model="pName" @input="nameVal">
      <div class="form-invalid" v-if="error.name">{{ error.name }}</div>

      <h5 class="mt-8 form-label">Portfolio Description</h5>
      <textarea rows="5" placeholder="Write a short description or strategy about the portfolio." class="input-grey w-full" :class="{'invalid': error.desc}" v-model="pDesc" @input="descVal"></textarea>
      <div class="form-invalid" v-if="error.desc">{{ error.desc }}</div>
      
      <!-- Portfolio Date -->
      <h5 class="mt-8 form-label required">Portfolio Date</h5>
      <input type="month" :max="new Date().toISOString().slice(0, 7)" v-model="pDate" :class="{'invalid': error.date}" class="input-grey w-full" @input="dateVal" disabled/>
      <div class="form-invalid" v-if="error.date">{{ error.date }}</div>

      <!-- Capital -->
      <h5 class="mt-8 form-label required">Amount of Capital (USD)</h5>
      <CapitalInput :valid="!error.budget" v-model="budget" @input="budgetVal"/>
      <div class="form-invalid" v-if="error.budget">{{ error.budget }}</div>

      <h3 class="text-navy-950 my-8 font-bold">Add Stocks</h3>
      <div class="text-red-500 mb-2" v-if="error.date && stocks.length != 0">
        <i class="bi bi-exclamation-circle text-xl"></i>
        Please select a portfolio date!
      </div>

      <!-- Table -->
      <StockTable :stockData="stockData" :items="items" :budget="budget" :date="pDate" v-model="stocks"/>

      <!-- Portfolio Settings -->
      <h3 class="text-navy-950 mb-8 font-bold">Portfolio Settings</h3>

      <h5 class="mt-8 form-label">Rebalancing</h5>
      <ToggleButton v-model="isRebalance" left="On" right="Off"/>

      <h5 class="mt-8 form-label">Visibility</h5>
      <ToggleButton v-model="isPublic" left="Public" right="Private"/>

      <!-- Balance -->
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
    const capitalAvail = useUserStore().loginUser.totalCapitalAvailable;

    return { userID, capitalAvail }
  },
  data(){
    return {
      pID: this.$route.query.pID,
      pName: null,
      pDesc: null,
      pDate: null,
      stocks: [],
      items: [],
      budget: null,
      error: {},
      isModal: false,
      modalMsg: "",
      isPublic: null,
      isRebalance: null,
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
      return this.stocks.reduce((total, stock) => Number(total) + Number(stock.total), 0);
    }
  },
  watch: {
    stocks() {
      if (this.stocks.length == 1) {
        this.dateVal();
      }

      this.stockVal();
    },
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    populate() {
      axios.get(`http://localhost:5000/portfolio/${this.pID}`)
      .then((response) => {
        if (this.userID == response.data.userId) {
          this.pName = response.data.portfolioName;
          this.pDesc = response.data.portfolioDescription;
          this.pDate = response.data.dateCreated;
          this.budget = response.data.capital;
          this.isPublic = response.data.public;
          this.isRebalance = response.data.rebalancing;
          this.stockData = response.data.portStock;
          console.log(response.data)
        } else {
          console.log("who u");
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.$router.go(-1);
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

    // validation
    nameVal() {
      if ("name" in this.error) {
        delete this.error["name"];
      }

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
    },
    descVal() {
      if ("desc" in this.error) {
        delete this.error["desc"];
      }
      
      if (this.pDesc && this.pDesc.length > 250) {
        this.error["desc"] = "Description is too long"
      }
    },
    dateVal() {
      if ("date" in this.error) {
        delete this.error["date"];
      }

      if (!this.pDate) {
        this.error["date"] = "Field is required";
      }
    },
    budgetVal() {
      if ("budget" in this.error) {
        delete this.error["budget"];
      }
      
      if (this.budget == null) {
        this.error["budget"] = "Field is required or invalid"; 
      } else {
        if (isNaN(this.budget)) {
          this.error["budget"] = "Please enter a number"; 
        } else if (this.portfolioTotal < this.capitalAvail && this.budget < this.portfolioTotal) {
          this.error["budget"] = `Capital allocated must be at least $${ Math.round(this.portfolioTotal * 100) / 100}`; 
        } else if (this.budget > this.capitalAvail) {
          this.error["budget"] = `Capital allocated exceeds your available capital of $${this.capitalAvail}`;
        } else if (this.portfolioTotal > this.capitalAvail) {
          this.error["budget"] = `Total price of stocks exceeds your available capital of $${this.capitalAvail}`;
        } else if (this.portfolioTotal == this.capitalAvail && this.budget != this.portfolioTotal) {
          this.error["budget"] = `Capital allocated must be $${this.capitalAvail};`
        }
      }
    },
    stockVal() {
      var valid = true;
      for (var stock of this.stocks) {
        if (!stock.name) {
          stock.empty = true;
          valid = false;
        } else {
          stock.empty = false;
        }
      }

      if ("stocks" in this.error) {
        delete this.error["stocks"];
      }

      if (!valid) {
        this.error["stocks"] = "Invalid/empty stock input";
      }

      return valid;
    },
    validate() {
      this.nameVal();
      this.descVal();
      this.dateVal();
      this.budgetVal();
      this.stockVal();

      if (Object.keys(this.error).length === 0) {
        this.updatePortfolio();
      } else {
        console.log(this.error);
      }
    },
    updatePortfolio() {
      var allStocks = {};
      for (var stock of this.stocks) {
        allStocks[stock.name] = [{"stockBoughtPrice": stock.price, "quantity": stock.qty, "dateBought": this.pDate, "allocation": Math.round(((stock.total/this.portfolioTotal*100) + Number.EPSILON)) / 100}]
      }

      // newPf
      var newPf = {
        "portfolioId": this.pID,
        "portfolioName": this.pName,
        "portfolioDescription": this.pDesc,
        "userId": this.userID,
        "dateCreated": this.pDate,
        "capital": this.budget,
        "public": this.isPublic,
        "rebalancing": this.isRebalance,
        "portStock": allStocks,
      }

      console.log(newPf);
      
      axios.post(`http://localhost:5000/portfolio/updateportfolio`, newPf)
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