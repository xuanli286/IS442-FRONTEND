<template>
  <div v-if="isReroute" class="px-8 sm:px-12 py-11 font-inter">
    <div class=" relative flex justify-between mb-5">
      <PortfolioDropdown @isSelect="handleSelect" :portfolio="selectedPortfolio"/>
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
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import PortfolioDropdown from '@/components/PortfolioDropdown.vue';
import SummarizedValue from '@/components/SummarizedValue.vue';
import CustomButton from "@/components/CustomButton.vue";
import Portfolio from "@/components/Portfolio.vue";
import Overview from "@/views/Overview.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import axios from "axios";
import { useRouter } from "vue-router";

const {user, isAuthenticated} = useAuth0();
const router = useRouter();

const isSelected = ref(false);

const store = usePortfolioStore();
const {
  selectedPortfolio,
  portfoliosValue,
  isReroute,
  isOpen,
} = storeToRefs(store);

onMounted(async () => {
  if (isAuthenticated) {
    try {
      const response = await axios.get(`http://localhost:5000/portfolio/getportfolios/${user.value.sub}`);
      if (response.data.length > 0) {
        isReroute.value = true;
        portfoliosValue.value = response.data;
      }
      else {
        isReroute.value = false;
        isOpen.value = true;
        router.push('/create');
      }
    }
    catch(error) {
      console.log(error.message);
    }
  }
})

watch(() => selectedPortfolio.value.portfolioName, (newPortfolioName) => {
  isSelected.value = newPortfolioName !== 'Overview';
  if (isSelected.value) {
    window.scrollTo(0, 0);
  }
});

function handleSelect(portfolio) {
  selectedPortfolio.value = portfolio;
}
</script>