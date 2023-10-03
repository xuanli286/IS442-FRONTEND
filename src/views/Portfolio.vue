<template>
    <div>
        <PortfolioBreakdown :portfolio="portfolio"/>
        <div class="grid grid-cols-3 gap-2">
            <DonutChart :isOverview="false" :portfolioId="portfolio.portfolioId"/>
        </div>
        
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        portfolio: {
            type: Object,
            required: true,
        },
    })
</script>

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
            // portfolioId: "06lcHYp5MKVnsIvH12QJ",
            // portfolioName: "High Risk Portfolio"
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