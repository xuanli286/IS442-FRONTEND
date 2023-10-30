<template>
    <div class="min-h-screen place-content-center px-8 sm:px-12 py-11 font-inter text-blue-950">
        <div class="text-center p-5 rounded-md w-full bg-gray-100">
            <div class="flex ml-auto items-center relative">
                <img class="rounded-full w-20" :src="loginUser.picture" alt="">
                <div class="ml-5 text-left text-graybrown">
                    <p class="font-bold text-xl">{{ loginUser.name }}</p>
                    <div class="flex mt-1">
                        <p class="text-sm">
                            <i class="fa-solid fa-user-tie"></i>
                            Created On: {{ formattedDate }}
                        </p>
                        <p class="text-sm ml-10">
                            <i class="fa-regular fa-envelope-open"></i>
                            Email: {{ loginUser.email }}
                        </p>
                    </div>
                </div>
                <p class="ml-auto text-white bg-blue-600 rounded-full px-2 py-1 text-xs">Investment Advisor</p>
            </div>
            <div class="bg-white mt-5 rounded-md p-5">
                <p>
                    <span class="font-medium text-sm">Total Assets</span> 
                    <span class="text-gray-500 text-xs ml-1">Unit: USD</span>
                </p>
                <p class="font-bold text-2xl mt-3 text-black-50">{{ formattedCapital }}</p>
            </div>
            <div class="bg-white mt-2 rounded-md py-5 px-10 text-left cursor-pointer">
                <div class="flex items-center" @click="isActive=!isActive">
                    <i class="fa fa-credit-card text-blue-600" aria-hidden="true"></i>
                    <p class="ml-2 font-medium text-sm">Deposit</p>
                    <i class="bi bi-chevron-down transition ml-auto" :class="{ 'chevDown': isActive }"></i>
                </div>
                <div v-if="isActive" class="text-sm">
                    <input v-model="depositAmount" class="mt-3 border border-gray-200 w-full px-5 py-2" type="number" placeholder="Enter an amount">
                    <button class="bg-green-500 text-white rounded-lg mt-2 p-2" @click="updateCapitalAmount">Save</button>
                </div>
            </div>
            <div class="bg-white mt-2 rounded-md py-5 px-10 text-left flex items-center">
                <i class="fa-regular fa-newspaper text-blue-600"></i>
                <p class="ml-2 font-medium text-sm">Statements</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useUserStore } from "@/stores/useUserStore";
    import { storeToRefs } from "pinia";
    import { computed, ref } from "vue";
    import axios from "../axiosConfig";

    const store = useUserStore();
    const {
        loginUser,
    } = storeToRefs(store);

    const date = new Date(loginUser.value.updatedAt);
    const formattedDate = date.toLocaleString();
    const formattedCapital = computed (() => {
        return loginUser.value.totalCapitalAvailable.toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    })

    const isActive = ref(false);
    const depositAmount = ref("");

    function updateCapitalAmount() {
        const body = {
            email: loginUser.value.email,
            id: loginUser.value.id,
            name: loginUser.value.name,
            picture: loginUser.value.picture,
            updatedAt: loginUser.value.updatedAt,
            totalCapitalAvailable: loginUser.value.totalCapitalAvailable + depositAmount.value
        };
        axios.put(`http://localhost:5000/customer/updatecapital`, body)
        .then((response) => {
            loginUser.value.totalCapitalAvailable += depositAmount.value;
            depositAmount.value = "";
            isActive.value = false;
        })
        .catch((error) => {
            console.log(error.message);
        })
    }
</script>

<style scoped>
    .chevDown {
        @apply
        rotate-180
    }
</style>