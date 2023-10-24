<template>
    
    <PortfolioBreakdown class="mb-5" :portfolio="portfolio"/>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-3 mb-5">
        <div class="white-card grid grid-cols-1">
            <p class="font-semibold text-navy-950">
                Market Exposure
            </p>
            <DonutChart :isOverview="false" :portfolioId="portfolio.portfolioId"/>
        </div>
        <div class="white-card col-span-2">
            <div class="relative mb-5">
                <button
                ref="toggle"
                @click="toggleDropdown"
                class="stockButton hover:bg-gray-100 w-24"
                >
                <span class="flex-grow text-navy-950 text-xs">{{ stockTicker }}</span>
                <i class="bi bi-chevron-down transition ml-auto text-navy-950" :class="{ 'chevDown': isOpen }"></i>
                </button>

                <div v-if="isOpen" class="absolute top-10 mt-2 p-2 w-24 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                    <ul ref="dropdown">
                        <li @click="selectStocks(stock)" class="option" v-for="stock of stocks" :key="stock">
                            <a class="text-navy-950 text-xs">{{ stock }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <CandleStick v-if="loaded" :stockTicker="stockTicker"/>
        </div>
    </div>
    <TabComponent v-if="loaded" :stock="stockTicker"/>

</template>

<script>
import DonutChart from '../components/charts/DonutChart.vue';
import PortfolioBreakdown from '@/components/PortfolioBreakdown.vue';
import CandleStick from '../components/charts/CandleStick.vue'
import TabComponent from "../components/TabComponent.vue"
import axios from "../axiosConfig";

export default {
    name: 'Portfolio',
    components: {
        DonutChart,
        PortfolioBreakdown,
        TabComponent,
        CandleStick
    },
    props: {
        portfolio: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isOpen: false,
            stocks: [],
            stockTicker: "",
            loaded: false,
        }
    },
    mounted() {
        document.addEventListener('click', (event) => {
            if (this.$refs.toggle && this.$refs.dropdown && !this.$refs.toggle.contains(event.target) && !this.$refs.dropdown.contains(event.target)) {
                this.isOpen = false;
            }
        });
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        selectStocks(stock) {
            this.$emit("isSelect", stock);
            this.isOpen = false; // Close the dropdown
            this.stockTicker = stock;
        },
        fetchStocks() {
            axios.get(`http://localhost:5000/portfolio/${this.portfolio.portfolioId}`)
            .then((response) => {

                this.stocks = Object.keys(response.data.portStock).sort();

                this.stockTicker = this.stocks[0]
                this.loaded = true;
                
            })
            .catch((error) => {
                console.log(error.message);
            })
        }

    },
    mounted() {

        this.fetchStocks();

    },
    watch: {
        portfolio: "fetchStocks"
    }

}
</script>


<style scoped>
  .option {
    @apply
    p-2
    hover:bg-gray-100
    cursor-pointer
    rounded-md
  }
  .chevDown {
    @apply
    rotate-180
  }
  .stockButton {
    @apply
    p-2 
    border-2 
    rounded-lg 
    border-navy-950 
    w-24 
    font-semibold 
    flex 
    items-center
  }
</style>