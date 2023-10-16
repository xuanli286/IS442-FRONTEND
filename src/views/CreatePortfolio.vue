<template>
  <div class="px-8 sm:px-12 py-11">
    <div class="flex items-center">
      <h3 class="text-white mb-8">Create Portfolio</h3>
      <NewUserModal class="z-50"/>
    </div>
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
      <input type="month" :max="new Date().toISOString().slice(0, 7)" v-model="pDate" :class="{'invalid': error.date}" class="input-grey w-full" @input="dateVal"/>
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
      <StockTable :items="items" :budget="budget" :date="pDate" v-model="stocks"/>


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
        <button class="btn-navy col-span-2" @click="validate">Create Porfolio</button>
      </div>
    </div>
    
    <!-- Modal -->
    <Modal v-model="isModal" width="50%" height="fit-content">
      <div class="text-center">
        <h3 class="text-navy-950 font-bold mb-5">{{ modalMsg[0] }}</h3>
        <button class="btn-navy" @click="handleModal">{{ modalMsg[1] }}</button>
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
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import NewUserModal from "@/components/NewUserModal.vue";
import { ref } from 'vue';

export default {
  name: 'CreatePortfolio',
  components: {
    StockTable,
    CapitalInput,
    ToggleButton,
    Modal,
    NewUserModal,
  },
  setup() {
    const userID = useUserStore().loginUser.id;
    const capitalAvail = useUserStore().loginUser.totalCapitalAvailable;

    const isReroute = usePortfolioStore().isReroute;
    const portfoliosValue = ref(usePortfolioStore().portfoliosValue);

    return { 
      userID,
      capitalAvail,
      isReroute,
      portfoliosValue,
    }
  },
  data(){
    return {
      pName: null,
      pDesc: null,
      pDate: null,
      stocks: [],
      items: [],
      budget: 0,
      error: {},
      isModal: false,
      modalMsg: [],
      isPublic: true,
      isRebalance: true,
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
  created() {
    this.retrieveStocks();
  },
  methods: {
    cancel() {
      window.history.back();
    },
    handleModal() {
      if (this.modalMsg[0] !== "Something went wrong!") {
        this.$router.push('/home');
      }
      else {
        this.cancel();
      }
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
        this.createPortfolio();
      } else {
        console.log(this.error);
      }
    },
    createPortfolio() {
      var allStocks = {};
      for (var stock of this.stocks) {
        allStocks[stock.name] = [{"stockBoughtPrice": stock.price, "quantity": stock.qty, "dateBought": this.pDate, "allocation": Math.round(((stock.total/this.portfolioTotal*100) + Number.EPSILON)) / 100}]
      }
      const pfData = {
        "portfolioName": this.pName,
        "portfolioDescription": this.pDesc,
        "userId": this.userID,
        "dateCreated": this.pDate,
        "capital": this.budget,
        "isPublic": this.isPublic,
        "rebalancing": this.isRebalance,
        "portStock": allStocks,
      }

      axios.post(`http://localhost:5000/portfolio/create`, pfData)
      .then((response) => {
        console.log(response.data);
        console.log(pfData);
        this.modalMsg[0] = "Portfolio has been successfully created!";
        this.pName = null;
        this.pDesc = null;
        this.pDate = null;
        this.stocks.splice(0);
        this.isPublic = true;
        this.isRebalance = true;
        this.budget = 0;
        this.modalMsg[1] = "Go to Overview";
        this.portfoliosValue.push(pfData);
        this.portfoliosValue.sort((a, b) => b.portfolioValue - a.portfolioValue);
      })
      .catch((error) => {
        console.log(error.message);
        this.modalMsg[0] = "Something went wrong!";
        this.modalMsg[1] = "Back";
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