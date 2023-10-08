<template>

  <div class="flex">
    <div class="white-card">
      <div class="mb-6 items-center">
        <button class="btn text-xs md:text-base font-semibold mr-5 pb-1" @click="pickedFinancials('incomestatement')" :class="{'border-b-4 border-navy-950' : financial == 'incomestatement'}">Income Statement</button>
        <button class="btn text-xs md:text-base font-semibold pb-1" @click="pickedFinancials('balancesheet')" :class="{'border-b-4 border-navy-950' : financial == 'balancesheet'}">Balance Sheet</button>
      </div>
      <FinancialsBreakdown :stock="stock" :selectedFinancials="financial"/>
    </div>
  </div>
  


</template>




<script>
  import FinancialsBreakdown from "@/components/FinancialsBreakdown.vue"
  export default {
    components: {
      FinancialsBreakdown
    },
    props: {
      stock: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        financial: "incomestatement"
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