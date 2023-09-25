<template>
    <button
    @click="toggleDropdown"
    class="p-2 bg-white hover:bg-gray-100 rounded w-56 font-semibold"
    >
    {{ selectedPortfolio }}
    <i class="bi bi-chevron-down"></i>
    </button>

    <div v-if="isOpen" class="absolute mt-2 p-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
        <ul>
            <li @click="selectPortfolio(portfolioName)" class="option" v-for="portfolioName in portfolios" :key="portfolioName">
                <a>{{ portfolioName }}</a>
            </li>
        </ul>
    </div>
</template>

<script>

export default {

    data(){
        return {
            portfolios: ["portfolio 1", "portfolio 2" ],
            isOpen: false,
            selectedPortfolio: null,
        }
    },
    computed: {

    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        selectPortfolio(portfolio) {
            this.selectedPortfolio = portfolio;
            this.isOpen = false; // Close the dropdown
        },

    },
    created() {
        this.selectedPortfolio = this.portfolios[0] // take first portfolio by default
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

</style>