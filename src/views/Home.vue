<template>
  <div v-if="isReroute" class="px-8 sm:px-12 py-11 font-inter">
    <div class=" relative flex justify-between mb-5">
      <PortfolioDropdown @isSelect="handleSelect" :portfolio="selectedPortfolio"/>
      <div v-if="isSelected" class="flex space-x-5">
        <CustomButton type='e' :id="selectedPortfolio.portfolioId"/>
        <CustomButton type='d' @click="isConfirm = true"/>
      </div>
      <CustomButton v-else type='c'/>
    </div>
    <SummarizedValue :isOverview="!isSelected" :portfolio="selectedPortfolio" />
    <Portfolio v-if="isSelected" :portfolio="selectedPortfolio" />
    <Overview v-else />

    <!-- Confirmation modal -->
    <Modal v-model="isConfirm" width="35%" height="fit-content">
      <div class="text-center">
        <h3 class="text-navy-950 font-bold mb-5">Are you sure you want to delete this portfolio?</h3>
        <button class="btn-navy w-1/5 mr-5" @click="deletePortfolio">Yes</button>
        <button class="btn-grey w-1/5" @click="isConfirm = false">No</button>
      </div>
    </Modal>

    <!-- Success modal -->
    <Modal v-model="isStatus" width="35%" height="fit-content">
      <div class="text-center">
        <h3 class="text-navy-950 font-bold mb-5">{{ modalMsg }}</h3>
        <button class="btn-navy w-1/5" @click="isStatus = false">Ok</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import PortfolioDropdown from '@/components/PortfolioDropdown.vue';
import SummarizedValue from '@/components/SummarizedValue.vue';
import CustomButton from "@/components/CustomButton.vue";
import Portfolio from "@/views/Portfolio.vue";
import Modal from '@/components/Modal.vue'
import Overview from "@/views/Overview.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const {user, isAuthenticated} = useAuth0();
const router = useRouter();
const route = useRoute();

const isSelected = ref(false);

const isConfirm = ref(false);
const modalMsg = ref('');

const isStatus = ref(false);

const store = usePortfolioStore();
const {
  selectedPortfolio,
  portfoliosValue,
  isReroute,
  isOpen,
} = storeToRefs(store);

async function retrievePortfolios() {
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

onMounted(async () => {
  if (route.query.reload) {
    router.push('/home');
  }

  if (isAuthenticated) {
    retrievePortfolios();
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

async function deletePortfolio() {
  axios.delete(`http://localhost:5000/portfolio/delete/${selectedPortfolio.value.portfolioId}`)
  .then(async (response) => {
    modalMsg.value = "Portfolio deleted!";
    isConfirm.value = false;
    isStatus.value = true;
    isReroute.value = false;
    router.push('/home?reload=true');
  })
  .catch((error) => {
    console.log(error.message);

    modalMsg.value = "Something went wrong!";
    isConfirm.value = false;
    isStatus.value = true;
  })
}
</script>

<style scoped>
  h3 {
    @apply
    text-2xl
  }
</style>