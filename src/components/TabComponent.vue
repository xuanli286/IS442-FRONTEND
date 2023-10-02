<template>
    <div class="mt-10">
        <nav class="border-b text-sm flex justify-start grid grid-cols-4">
            <button class="btn text-lg lg:text-2xl border-2 rounded-t-lg py-2"
                :class="{
                    'text-white': activeTab !== 'tab1',
                    'bg-white border-black': activeTab === 'tab1',
                }"
                @click="activeTab = 'tab1'">Company Overview</button>
            <button class="btn text-lg lg:text-2xl border-2 py-2 rounded-t-lg"
                :class="{
                    'text-white': activeTab !== 'tab2',
                    'bg-white border-black': activeTab === 'tab2',
                }"
                @click="activeTab = 'tab2'">Financials</button>
        </nav>
  
        <div class="py-2">
          <div v-show="activeTab === 'tab1'" class="my-5">
            <h4 class="text-white font-semibold">Description</h4>
            <p class="my-4 text-white">{{stockInfo.description}}</p>
            <p class="my-5 text-white"><span class="font-semibold">Country:</span> {{stockInfo.country}}</p>
            <p class="my-5 text-white"><span class="font-semibold">Currency:</span> {{stockInfo.currency}}</p>
            <p class="my-5 text-white"><span class="font-semibold">Industry:</span> {{stockInfo.industry}}</p>
            <p class="my-5 text-white"><span class="font-semibold">Sector(s):</span> {{stockInfo.sector}}</p>
          </div>
          <div v-show="activeTab === 'tab2'">
            <Financials :stock="stock"/>
          </div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';
    import axios from "axios";

    const props = defineProps({
      stock: {
        type: String,
        required: true,
      }
    })

</script>
  
<script>
import DonutChart from '../components/charts/DonutChart.vue'
import Financials from '../components/Financials.vue'
    
    export default {
      components: {
        DonutChart,
        Financials,
      },
      data() {
        return {
          activeTab: 'tab1',
          stockInfo: {}
        };
      },
      created() {

        axios.get(`http://localhost:5000/stock/${this.stock}/companyOverview`)
        .then(response => {
          this.stockInfo = response.data
        })
        .catch(error => {
            console.error(error)
        });

      }
        
    }
</script>

<style scoped>
  h4 {
    @apply
    text-2xl
  }
</style>