<script setup>
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { storeToRefs } from "pinia";

const store = usePortfolioStore();
const { 
    isOpen,
    isReroute,
} = storeToRefs(store);

function closeModal() {
  isOpen.value = false;
}
</script>


<template>
  <div v-if="!isReroute && isOpen">
    <div id="modal" class="bg-black bg-opacity-20 fixed inset-0">
      <div class="absolute bg-blue-500 text-white p-4 rounded-lg shadow-md ml-60 my-28">
        <div class="absolute w-4 h-4 bg-blue-500 rotate-45 transform -translate-y-1/2 left-0 top-1/2"></div>
        <p class="font-bold">Welcome!</p>
        <p class="mb-3">Create your first portfolio to begin analysing!</p>
        <button class="rounded-md py-1 px-3 border border-white hover:bg-blue-300" @click="closeModal">Got it</button>
      </div>
    </div>
  </div>
</template>


