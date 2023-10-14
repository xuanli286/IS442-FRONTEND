<template>
  <div class="px-8 sm:px-12 py-11">
    <h3 class="text-white mb-8">Community Porfolios</h3>
    <!-- Search & Filter -->
    <div class="pb-10 grid grid-cols-[1fr,auto] md:grid-cols-[60%,auto,1fr] lg:grid-cols-[45%,auto,1fr] gap-8">
      <SearchInput v-model="query"/>
      <button class="btn-outline-white" @click="isModal=true">Filter</button>
      <div class="hidden md:block"></div>
    </div>
    <div class="white-card mb-10" v-for="(p, idx) of filteredData.slice( (page-1)*5, page*5 )">
      <div class="font-bold mb-2">{{ p.portfolioName }}</div>
      <div class="text-sm mb-7">Created by: {{ p.userId }}, {{ p.dateCreated }}</div>
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
import axios from "../axiosConfig";

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
      portfolios: [],
    }
  },
  created() {
    this.conditions = JSON.parse(JSON.stringify(this.defaultConditions));
    this.populate();
  },
  computed: {
    filteredData() {
      var result = JSON.parse(JSON.stringify(this.portfolios));

      if (this.query) {
        result = this.portfolios.filter((item) => ( item.portfolioName.toLowerCase().includes(this.query.toLowerCase()) || item.userId.toLowerCase().includes(this.query.toLowerCase())));
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
    populate() {
      axios.get(`http://localhost:5000/portfolio/getpublicportfolios`)
      .then((response) => {
        this.portfolios = response.data;
        console.log(this.portfolios);
      })
      .catch((error) => {
        console.log(error.message);
      })
    },
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