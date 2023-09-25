<template>
    <div class="px-8 sm:px-12 py-11">
        <div class="relative flex justify-between mb-5">
            <div>
                <PortfolioDropdown/>
            </div>
            <div>
                <button class="p-2 bg-red-600 text-white rounded w-48 font-semibold">Delete Portfolio</button>
            </div>
        </div>
        <SummarizedValue />

        <div class="white-card mb-5">
            <h4 class="font-semibold">My Porftolio</h4>
            

        </div>

        <div class="h-1/3 w-1/3 white-card">
            <DonutChart />
        </div>

        
         
    </div>

</template>


<script>
import DonutChart from '../components/charts/DonutChart.vue'
import PortfolioDropdown from '../components/PortfolioDropdown.vue'
import SummarizedValue from '../components/SummarizedValue.vue'

export default {
    name: 'IndividualStock',
    components: {
        DonutChart,
        PortfolioDropdown,
        SummarizedValue
    },
    data(){
        return {
            portfolios: [
                {
                    portfolioId: "someID",
                    portfolioName: "Portfolio 1",
                    portfolioValue: 88888888.88,
                    unrealisedPnL: 0,
                    currency: "SGD"
                },
                {
                    portfolioId: "someID2",
                    portfolioName: "Portfolio 2",
                    portfolioValue: 176.00,
                    unrealisedPnL: 0,
                    currency: "JPY"
                }
            ],
            isOpen: false
        }
    },
    computed: {

    },
    methods: {

    },
    created() {

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

</style>