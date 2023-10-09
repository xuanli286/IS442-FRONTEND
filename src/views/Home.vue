<template>
  <div class="px-8 sm:px-12 py-11 font-inter">
    <div class="relative flex justify-between mb-5">
      <PortfolioDropdown @isSelect="handleSelect" />
      <div v-if="isSelected" class="flex space-x-5">
        <CustomButton type='e' :id="selectedPortfolio.portfolioId" />
        <CustomButton type='d'/>
      </div>
      <CustomButton v-else type='c'/>
    </div>
    <SummarizedValue :isOverview="!isSelected" :portfolio="selectedPortfolio" />
    <Portfolio v-if="isSelected" :portfolio="selectedPortfolio" />
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

const isSelected = ref(false)

watch(() => selectedPortfolio.value.portfolioName, (newPortfolioName) => {
  isSelected.value = newPortfolioName !== 'Overview';
});

function handleSelect(portfolio) {
  selectedPortfolio.value = portfolio;
}
</script>