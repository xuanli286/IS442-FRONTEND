<template>
    <button
    ref="toggle"
    @click="toggleDropdown"
    class="p-3 bg-white hover:bg-gray-100 rounded w-56 font-semibold flex items-center"
    >
    <span class="flex-grow text-navy-950">{{ selectedPortfolio }}</span>
    <i class="bi bi-chevron-down transition ml-auto text-navy-950" :class="{ 'chevDown': isOpen }"></i>
    </button>

    <div v-if="isOpen" class="absolute top-12 mt-2 p-2 w-56 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
        <ul ref="dropdown">
            <li @click="selectPortfolio(portfolio)" class="option" v-for="portfolio in portfolios" :key="portfolio">
                <a class="text-navy-950">{{ portfolio.portfolioName }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '@/stores/useUserStore';

export default {
    emits: ['isSelect'],
    setup() {
        const userID = useUserStore().loginUser.id;

        return { userID }
    },
    data(){
        return {
            portfolios: [{portfolioName: "Overview"}],
            isOpen: false,
            selectedPortfolio: "",
        }
    },
    computed: {

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
        selectPortfolio(portfolio) {
            this.selectedPortfolio = portfolio.portfolioName;
            this.$emit("isSelect", portfolio);
            this.isOpen = false; // Close the dropdown
        },

    },
    created() {

        axios.get(`http://localhost:5000/portfolio/getportfolios/${this.userID}`)
        .then((response) => {
            response.data.sort((a, b) => b.portfolioValue - a.portfolioValue);
     
            this.portfolios = this.portfolios.concat(response.data)

            this.selectPortfolio(this.portfolios[0])
            
        })
        .catch((error) => {
            console.log(error.message);
        })

    }

}
</script>

<style scoped>
  h3 {
    @apply
    text-4xl
  }
  h4 {
    @apply
    text-2xl
  }
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
</style>