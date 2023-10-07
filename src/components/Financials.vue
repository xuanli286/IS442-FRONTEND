<template>

  <div class="white-card">
    <div class="mb-6 items-center">
      <button class="btn text-xs md:text-base font-semibold mr-5 pb-1" @click="pickedFinancials('incomestmt')" :class="{'border-b-4 border-navy-950' : financial == 'incomestmt'}">Income Statement</button>
      <button class="btn text-xs md:text-base font-semibold pb-1" @click="pickedFinancials('balancesheet')" :class="{'border-b-4 border-navy-950' : financial == 'balancesheet'}">Balance Sheet</button>
    </div>

    <BalanceSheet :stock="stock" v-if="financial === 'balancesheet'"/>

  </div>


</template>




<script>
  import axios from "axios";
  import BalanceSheet from "@/components/BalanceSheet.vue"
  export default {
    components: {
      BalanceSheet
    },
    props: {
      stock: {
        type: String,
        required: true,
      }
    },
    data() {
        return {
         financial: "balancesheet"
        };
    },
    created() {

    },
    methods: {
      pickedFinancials(financials) {
        if (this.financial === financials) {
          this.financial = null
        } else {
          this.financial = financials
        }
      // this.fetchStockData()
    },
    }
      
  }
</script>

<style scoped>
  h4 {
    @apply
    text-2xl
  }
</style>