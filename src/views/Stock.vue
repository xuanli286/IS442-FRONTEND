<template>
    <div class="px-8 sm:px-12 py-11">
        <h3 class="text-white">{{stockTicker}}</h3>
        <p class="text-white text-sm">Market Closed {{currentDate()}}</p>
        <div class="m-3"></div>
        <CandleStick :stockTicker="stockTicker"/>
        <TabComponent :stock="stockTicker"/>  
    </div>

</template>


<script>
import CandleStick from '../components/charts/CandleStick.vue'
import TabComponent from "../components/TabComponent.vue"

export default {
    name: 'IndividualStock',
    components: {
        CandleStick,
        TabComponent,
    },
    data(){
        return {
            stockTicker: "MSFT",
        }
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