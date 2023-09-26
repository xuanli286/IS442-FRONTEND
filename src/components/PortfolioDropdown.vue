<template>
    <button
    @click="toggleDropdown"
    class="p-3 bg-white hover:bg-gray-100 rounded w-56 font-semibold flex items-center"
    >
    <span class="flex-grow">{{ selectedPortfolio }}</span>
    <i class="bi bi-chevron-down transition ml-auto" :class="{ 'chevDown': isOpen }"></i>
    </button>

    <div v-if="isOpen" class="absolute top-12 mt-2 p-2 w-56 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
        <ul>
            <li @click="selectPortfolio(portfolioName)" class="option" v-for="portfolioName in portfolios" :key="portfolioName">
                <a>{{ portfolioName }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    emits: ['isSelect'],
    data(){
        return {
            portfolios: ["Overview", "portfolio 1", "portfolio 2" ],
            isOpen: false,
            selectedPortfolio: "Overview",
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
            this.$emit("isSelect", this.selectedPortfolio);
            this.isOpen = false; // Close the dropdown
        },

    },
    created() {
        this.selectedPortfolio = this.portfolios[0] // take first portfolio by default
        this.$emit("isSelect", this.selectedPortfolio);
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