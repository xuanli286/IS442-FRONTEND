<template>
    <div>
        <PortfolioBreakdown :portfolio="portfolio"/>
        <div class="grid grid-cols-3 gap-2">
            <div class="white-card">
                <p class="font-semibold mt-1 mb-4 text-navy-950">
                    Market Exposure
                </p>
                <DonutChart :isOverview="false" :portfolioId="portfolio.portfolioId"/>
            </div>
            
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
    props: {
        portfolio: {
            type: Object,
            required: true,
        },
    }

}
</script>

<style scoped>

</style>