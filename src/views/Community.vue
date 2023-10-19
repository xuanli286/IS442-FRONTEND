<template>
  <div class="px-8 sm:px-12 py-11">
    <h3 class="text-white mb-8">Community Porfolios</h3>
    <!-- Search & Filter -->
    <div class="pb-10 grid grid-cols-[1fr,auto] md:grid-cols-[50%,auto,1fr] lg:grid-cols-[40%,auto,1fr] gap-8">
      <SearchInput v-model="query" @clear="query = ''"/>
      <button class="btn-outline-white font-bold" @click="isModal=true">Filter</button>
      <div class="hidden md:block"></div>
    </div>
    <div class="bg-white rounded-md mb-10 hover:shadow-xl transition-transform transform hover:scale-[1.01]" v-for="(p, idx) of filteredData.slice( (page-1)*5, page*5 )">
      <RouterLink :to="`/community/portfolio?pID=${p.portfolioId}`">
        <div class="p-8">
          <div class="font-bold mb-2">{{ p.portfolioName }}</div>
          <div class="text-sm mb-7">Created by: {{ p.username }}, {{ p.dateCreated }}</div>
          <div class="">Portfolio Value: ${{ p.portfolioValue }}</div>
        </div>
      </RouterLink>
    </div>

    <!-- Pagination -->
    <Pagination class="mb-10 float-right" :maxPage="Math.max(1, Math.ceil(filteredData.length/5))" v-model="page"/>

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
  name: 'Community',
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
        result = this.portfolios.filter((item) => ( item.portfolioName.toLowerCase().includes(this.query.toLowerCase()) || item.username.toLowerCase().includes(this.query.toLowerCase())));
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
    async populate() {
      await axios.get(`http://localhost:5000/portfolio/getpublicportfolios`)
      .then((response) => {
        this.portfolios = response.data;
        for (let i=0; i<this.portfolios.length; i++) {
          axios.get(`http://localhost:5000/customer/${this.portfolios[i].userId}`)
          .then((response) => {
            this.portfolios[i].username = response.data.customerData.name;
          })
          .catch((error) => {
            this.portfolios[i].username = this.portfolios[i].userId;
          })
        }
      })
      .catch((error) => {
        console.log(error.message);
      })
      console.log(this.portfolios);
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