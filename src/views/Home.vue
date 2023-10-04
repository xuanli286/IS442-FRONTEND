<template>
    <div class="px-8 sm:px-12 py-11 font-inter">
        <div class="relative flex justify-between mb-5">
            <PortfolioDropdown @isSelect="handleSelect" :userId="user.sub"/>
            <CustomButton :isDelete="isDelete"/>
        </div>
        <SummarizedValue :isOverview="!isDelete"/>
        <Portfolio v-if="isDelete" :portfolio="selectedPortfolio"/>
        <Overview v-else/>
    </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { user, isAuthenticated } = useAuth0();
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