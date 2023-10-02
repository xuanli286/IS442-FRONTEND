<template>
    <div class="px-8 sm:px-12 py-11 font-inter">
        <div class="relative flex justify-between mb-5">
            <PortfolioDropdown @isSelect="handleSelect" :userId="'google-oauth2_113348502313853368765'"/>
            <CustomButton :isDelete="isDelete"/>
        </div>
        <SummarizedValue :isOverview="!isDelete"/>
        <Portfolio v-if="isDelete" :portfolio="selectedPortfolio"/>
        <Overview v-else :top3Portfolios="top3Portfolios" />
    </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { user, isAuthenticated } = useAuth0();
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import PortfolioDropdown from '@/components/PortfolioDropdown.vue';
import SummarizedValue from '@/components/SummarizedValue.vue';
import CustomButton from "@/components/CustomButton.vue";
import Portfolio from "@/views/Portfolio.vue";
import Overview from "@/views/Overview.vue";
import { useUserStore } from "@/stores/useUserStore";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { storeToRefs } from "pinia";

const store = useUserStore();
const {
    loginUser,
} = storeToRefs(store);

const portfolioStore = usePortfolioStore();
const {
    portfolios,
    top3Portfolios,
} = storeToRefs(portfolioStore);

const selectedPortfolio = ref("");

const isDelete = ref(false)

watch(() => selectedPortfolio.value.portfolioName, (newPortfolioName) => {
  isDelete.value = newPortfolioName !== 'Overview';
});

function handleSelect(portfolio) {
  selectedPortfolio.value = portfolio;
}

if (isAuthenticated.value) {
  onMounted(async () => {
    const data = {
      name: user.value.given_name || user.value.family_name ? user.value.name : user.value.nickname,
      email: user.value.email,
      id: user.value.sub.replace('|', '_'),
      picture: user.value.picture,
      updatedAt: user.value['updated_at'],
      totalCapitalAvailable: 10000,
    };
    axios.get(`http://localhost:5000/customer/${data.id}`)
      .then((response) => {
        loginUser.value = response.data;
      })
      .catch((error) => {
        if (error.message.includes('404')) {
          axios.post(`http://localhost:5000/customer/`, data)
            .then((response) => {
              loginUser.value = data;
            })
            .catch((error) => {
              console.log(error.message);
            })
        }
      })
    axios.get(`http://localhost:5000/portfolio/getportfolios/${data.id}`)
      .then((response) => {
        response.data.sort((a, b) => b.portfolioValue - a.portfolioValue);
        portfolios.value = response.data;
        const performingPortfolios = portfolios.value.slice(0,3);
        for (let i of performingPortfolios) {
          let key = `${i.portfolioName} [${i.portfolioId}]`;
          top3Portfolios.value[key] = {
            portfolioId: i.portfolioId,
            portfolioName: i.portfolioName,
            portfolioValue: i.portfolioValue,
            unrealisedPnL: i.unrealisedPnL,
            dateCreated: i.dateCreated,
            capital: i.capital,
          }
        }
      })
      .catch((error) => {
          console.log(error.message);
      })
  });
}
</script>