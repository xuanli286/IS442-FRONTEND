<template>
    <div class="px-8 sm:px-12 py-11 font-inter">
        <div class="relative flex justify-between mb-5">
            <PortfolioDropdown @isSelect="handleSelect"/>
            <CustomButton :isDelete="isDelete"/>
        </div>
        <SummarizedValue :isOverview="!isDelete"/>
        <Portfolio/>
    </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { user, isAuthenticated } = useAuth0();
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import PortfolioDropdown from '@/components/PortfolioDropdown.vue';
import SummarizedValue from '@/components/SummarizedValue.vue';
import CustomButton from "@/components/CustomButton.vue";
import Portfolio from "@/views/Portfolio.vue";

const isOpen = ref(false);
const selectedPortfolio = ref("");

const isDelete = computed(() => {
  if (selectedPortfolio.value !== "Overview") {
      return true;
  }
  else {
      return false;
  }
});

const portfolios = [
  {
      portfolioId: "someID",
      portfolioName: "Portfolio 1",
      portfolioValue: 88888888.88,
      unrealisedPnL: 0,
      currency: "SGD"
  },
  {
      portfolioId: "someID2",
      portfolioName: "Portfolio 2",
      portfolioValue: 176.00,
      unrealisedPnL: 0,
      currency: "JPY"
  }
];

function handleSelect(portfolio) {
  selectedPortfolio.value = portfolio;
}

if (isAuthenticated) {
  onMounted(async () => {
    const data = {
      name: user.value.given_name || user.value.family_name ? user.value.name : user.value.nickname,
      email: user.value.email,
      id: user.value.sub.replace('|', '_'),
      picture: user.value.picture,
      updatedAt: user.value['updated_at']
    }
    // console.log(data)
    axios.post(`http://localhost:5000/customer/`, data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      })
  });
}
</script>