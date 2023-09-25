<template>
    <div class="px-8 sm:px-12 py-11">
        <h3 class="text-white">{{stockTicker}}</h3>
        <p class="text-white text-sm">Market Closed {{currentDate()}}</p>
        <div class="m-3"></div>

        <BarChart />

        <!-- <h4 class="text-white mt-10 mb-5">Company Overview</h4>

        <p class="text-white">{{description}}</p> -->

        <TabComponent/>
        


    </div>

</template>


<script>
import BarChart from '../components/charts/BarChart.vue'
import LineChart from '../components/charts/LineChart.vue'
import TabComponent from "../components/TabComponent.vue"

export default {
    name: 'IndividualStock',
    components: {
        BarChart,
        LineChart,
        TabComponent,
    },
    data(){
        return {
            stockTicker: "aapl".toUpperCase(),
            description: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services. Apple is the world's largest technology company by revenue (totalling $274.5 billion in 2020) and, since January 2021, the world's most valuable company. As of 2021, Apple is the world's fourth-largest PC vendor by unit sales, and fourth-largest smartphone manufacturer. It is one of the Big Five American information technology companies, along with Amazon, Google, Microsoft, and Facebook."

        }
    },
    computed: {

    },
    methods: {
        currentDate() {
            const current = new Date();
            const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
            return date;
        }
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