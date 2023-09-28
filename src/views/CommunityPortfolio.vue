<template>
  <div class="px-8 sm:px-12 py-11">
    <h3 class="text-white mb-8">Community</h3>
    <!-- Search & Filter -->
    <div class="pb-10 grid grid-cols-[1fr,auto] md:grid-cols-[60%,auto,1fr] lg:grid-cols-[45%,auto,1fr] gap-8">
      <SearchInput v-model="query"/>
      <button class="btn-outline-white" @click="isModal=true">Filter</button>
      <div class="hidden md:block"></div>
    </div>
    <div class="white-card mb-10" v-for="(p, idx) of filteredData.slice( (page-1)*5, page*5 )">
      <div class="font-bold mb-2">{{ p.portfolioName }}</div>
      <div class="text-sm mb-7">Created by: {{ p.username }}, {{ p.dateCreated }}</div>
      <div class="">Portfolio Value: ${{ p.portfolioValue }}</div>
    </div>

    <!-- Pagination -->
    <Pagination class="mb-10 float-right" :maxPage="Math.ceil(filteredData.length/5)" v-model="page"/>

    <!-- Modal -->
    <Modal v-model="isModal" width="50%" height="fit-content">
      <h3 class="text-navy-950 mb-8">Sort By</h3>
      <div v-for="(condition, ppty, idx) in conditions" class="mb-2">
        <label>
          <input type="radio" v-model="option" name="sortby" :value="ppty"> {{ condition.name }}
        </label>
        <i class="pl-3 text-lg bi cursor-pointer" :class="{'bi-sort-up': condition.ascending, 'bi-sort-down': !condition.ascending}" @click="condition.ascending = !condition.ascending"></i>
      </div>
      <button class="btn-navy mt-6" style="font-weight:normal !important" @click="clearConditions">Clear</button>
    </Modal>
  </div>
</template>

<script>
import SearchInput from '../components/SearchInput.vue'
import Pagination from '../components/Pagination.vue'
import Modal from '../components/Modal.vue'

export default {
  name: 'CommunityPortfolio',
  components: {
    SearchInput,
    Pagination,
    Modal,
  },
  data(){
    return {
      query: "",
      page: 1,
      isModal: false,
      defaultConditions: {
        dateCreated: {name: "Date Created", ascending: false},
        portfolioValue: {name: "Portfolio Value", ascending: false},
      },
      option: "",
      conditions: {},
      testData: [
      {
        "dateCreated": "2023-08-10",
        "username": "john_doe",
        "portfolioName": "Tech Stocks",
        "portfolioValue": 100000
      },
      {
        "dateCreated": "2023-09-11",
        "username": "jane_smith",
        "portfolioName": "Blue Chip Investments",
        "portfolioValue": 75000
      },
      {
        "dateCreated": "2023-11-28",
        "username": "investor123",
        "portfolioName": "Tech Research Stocks",
        "portfolioValue": 120000
      },
      {
        "dateCreated": "2023-09-13",
        "username": "trader_mike",
        "portfolioName": "Energy Sector",
        "portfolioValue": 85000
      },
      {
        "dateCreated": "2023-04-10",
        "username": "finance_guru",
        "portfolioName": "Diversified Holdings",
        "portfolioValue": 200000
      },
      // 6
      {
        "dateCreated": "2023-12-15",
        "username": "stock_buff",
        "portfolioName": "Value Investments",
        "portfolioValue": 90000
      },
      {
        "dateCreated": "2023-06-21",
        "username": "trader_ann",
        "portfolioName": "Healthcare Stocks",
        "portfolioValue": 110000
      },
      {
        "dateCreated": "2023-09-17",
        "username": "investorX",
        "portfolioName": "Financial Sector",
        "portfolioValue": 95000
      },
      {
        "dateCreated": "2023-10-19",
        "username": "portfolio_guy",
        "portfolioName": "Small Caps",
        "portfolioValue": 80000
      },
      {
        "dateCreated": "2023-03-14",
        "username": "stock_lover",
        "portfolioName": "Tech Innovators",
        "portfolioValue": 130000
      },
      // 11
      {
        "dateCreated": "2023-08-20",
        "username": "stock_sucks",
        "portfolioName": "please",
        "portfolioValue": 1000
      }
    ]
    }
  },
  created() {
    this.conditions = JSON.parse(JSON.stringify(this.defaultConditions));
  },
  computed: {
    filteredData() {
      var result = JSON.parse(JSON.stringify(this.testData));

      if (this.query) {
        result = this.testData.filter((item) => ( item.portfolioName.toLowerCase().includes(this.query.toLowerCase()) || item.username.toLowerCase().includes(this.query.toLowerCase())));
      }
      if (this.option) {
        if (this.option == "dateCreated") {
          result = result.sort((a, b) => this.conditions[this.option].ascending ? ( new Date(a[this.option]) - new Date(b[this.option]) ): ( new Date(b[this.option]) - new Date(a[this.option]) ));
        } else {
          result = result.sort((a, b) => this.conditions[this.option].ascending ? ( a[this.option] - b[this.option] ): ( b[this.option] - a[this.option] ));
        }
      }

      return result;
    },
  },
  methods: {
    clearConditions() {
      this.option = "";
      this.conditions = {...JSON.parse(JSON.stringify(this.defaultConditions))};
    }
  },
}
</script>

<style scoped>
  h3 {
    @apply
    text-2xl
  }
</style>