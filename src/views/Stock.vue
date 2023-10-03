<template>
    <div class="px-8 sm:px-12 py-11">
        <h3 class="text-white">{{stockTicker}}</h3>
        <p class="text-white text-sm">Market Closed {{currentDate()}}</p>
        <div class="m-3"></div>
        <!-- <h4 class="text-white mt-10 mb-5">Company Overview</h4>
        <p class="text-white">{{description}}</p> -->
        <BarChart />

        <TabComponent :stock="stockTicker"/>      
        


    </div>

</template>


<script>
import axios from 'axios'
import BarChart from '../components/charts/BarChart.vue'
import LineChart from '../components/charts/LineChart.vue'
import TabComponent from "../components/TabComponent.vue"

export default {
    name: 'IndividualStock',
    components: {
        BarChart,
        LineChart,
        TabComponent
    },
    data(){
        return {
            stockTicker: "",
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

        this.stockTicker = this.$route.params.stockTicker;

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