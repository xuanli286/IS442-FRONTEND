<template>
    <div class="mt-10">
        <nav class="border-b text-sm flex justify-start grid grid-cols-4">
            <button 
                :class="{
                    'btn text-white text-2xl border-2 rounded-t-lg py-2': activeTab !== 'tab1',
                    'btn bg-white text-2xl border-2 border-black rounded-t-lg py-2': activeTab === 'tab1',
                }"
                @click="activeTab = 'tab1'">Company Overview</button>
            <button 
                :class="{
                    'btn text-white text-2xl border-2 rounded-t-lg py-2': activeTab !== 'tab2',
                    'btn bg-white text-black text-2xl border-2 border-black rounded-t-lg py-2': activeTab === 'tab2',
                }"
                @click="activeTab = 'tab2'">Financials</button>
        </nav>
  
        <div class="py-2">
          <div v-show="activeTab === 'tab1'" class="my-5">
            <h4 class="text-white font-semibold">Description</h4>
            <p class="my-5 text-white">{{description}}</p>
            <p class="my-5 text-white"><span class="font-semibold">Country:</span> {{country}}</p>
            <p class="my-5 text-white"><span class="font-semibold">Currency:</span> {{currency}}</p>
            <p class="my-5 text-white"><span class="font-semibold">Industry:</span> {{industry}}</p>
            <p class="my-5 text-white"><span class="font-semibold">Sector(s):</span> {{sector}}</p>
            <h4 class="text-white mt-10">Market Sentiments</h4>
            <!-- <div class="h-3/5 w-3/5 mx-auto">
                <DonutChart />
            </div> -->
          </div>
          <div v-show="activeTab === 'tab2'">
            <h4 class="text-white font-semibold">Income Statement</h4>
            <h4 class="text-white font-semibold">Balance Sheet</h4>
          </div>
        </div>
    </div>
</template>
  
<script>
import DonutChart from '../components/charts/DonutChart.vue'
    
    export default {
      components: {
        DonutChart
      },
      data() {
          return {
              activeTab: 'tab1',
              description: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services. Apple is the world's largest technology company by revenue (totalling $274.5 billion in 2020) and, since January 2021, the world's most valuable company. As of 2021, Apple is the world's fourth-largest PC vendor by unit sales, and fourth-largest smartphone manufacturer. It is one of the Big Five American information technology companies, along with Amazon, Google, Microsoft, and Facebook.",
              country: "USA",
              currency: "USD",
              industry: "Electronic Computers",
              sector: "Technology",
              stockTicker: "AAPL"
          };
      }
        
    }
</script>

<style scoped>
  h4 {
    @apply
    text-2xl
  }
</style>