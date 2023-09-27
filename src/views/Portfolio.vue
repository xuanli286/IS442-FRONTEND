<template>
    <div>
        <PortfolioBreakdown :portfolio="portfolioId" :portfolioName="portfolioName"/>
        <div class="h-1/3 w-1/3 white-card">
            <DonutChart />
        </div>
    </div>
</template>

<script>
import DonutChart from '../components/charts/DonutChart.vue';
import PortfolioBreakdown from '@/components/PortfolioBreakdown.vue';

export default {
    name: 'IndividualStock',
    components: {
        DonutChart,
        PortfolioBreakdown
    },
    data(){
        return {
            portfolioId: "someId",
            portfolioName: "High Risk Portfolio"
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