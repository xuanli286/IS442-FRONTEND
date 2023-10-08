<template>
  <div class="px-8 sm:px-12 py-11 font-inter">
    <div class="relative flex justify-between mb-5">
      <PortfolioDropdown @isSelect="handleSelect" />
      <CustomButton :isDelete="isDelete" />
    </div>
    <SummarizedValue :isOverview="!isDelete" :portfolio="selectedPortfolio" />
    <Portfolio v-if="isDelete" :portfolio="selectedPortfolio" />
    <Overview v-else />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import PortfolioDropdown from '@/components/PortfolioDropdown.vue';
import SummarizedValue from '@/components/SummarizedValue.vue';
import CustomButton from "@/components/CustomButton.vue";
import Portfolio from "@/views/Portfolio.vue";
import Overview from "@/views/Overview.vue";

const selectedPortfolio = ref("");

const isDelete = ref(false)

watch(() => selectedPortfolio.value.portfolioName, (newPortfolioName) => {
  isDelete.value = newPortfolioName !== 'Overview';
});

function handleSelect(portfolio) {
  selectedPortfolio.value = portfolio;
}
</script>