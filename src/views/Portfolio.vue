<template>
    <div>
        <PortfolioBreakdown :portfolioId="portfolioId" :portfolioName="portfolioName"/>
        <div class="grid grid-cols-3 gap-2">
            <!-- <div class="white-card"> -->
            <DonutChart :isOverview="false" :portfolioId="portfolioId"/>

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
            portfolioId: "06lcHYp5MKVnsIvH12QJ",
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