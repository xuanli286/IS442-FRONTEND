<template>
    <div class="text-blue-950">
        <div v-if="!isCompare">
            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-1 white-card">
                    <p class="font-semibold mt-1">Overall Performance</p>
                    <p class="mt-8 font-medium">Compound Annual Return</p>
                    <p class="mt-4 font-medium">Dividends Received</p>
                    <p class="mt-4 font-medium">Beta</p>
                    <p class="mt-4 font-medium">Sharpe Ratio</p>
                </div>
                <div class="col-span-2 white-card">
                    <div class="flex items-center">
                        <p class="font-semibold mr-2">Top Performers</p>
                        <i class="fa fa-line-chart" aria-hidden="true"></i>
                        <PortfolioButton class="ml-auto" @click="isCompare=!isCompare">
                            <p>Compare Portfolio</p>
                        </PortfolioButton>
                    </div>
                    <div class="grid grid-cols-3 gap-4 mt-5">
                        <div class="border-2 border-blue-950 p-3 rounded-lg " v-for="(portfolio, id) of top3Portfolios" :key="id">
                            <p class="font-bold">{{ portfolio.portfolioName }}</p>
                            <p class="text-gray-500 text-xs">Date Created: {{ (new Date(portfolio.dateCreated)).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' }) }}</p>
                            <p class="text-sm font-medium mt-10">Portfolio Value</p>
                            <p class="font-bold flex items-center">
                                <span class="bg-blue-600 text-white rounded-full p-1 text-xs mr-1">SGD</span>
                                {{ portfolio.portfolioValue.toLocaleString('en-US', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })
                                }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-span-1 white-card">
                    <DonutChart :isOverview="true"/>
                </div>
                <div class="col-span-2 white-card">
                    <p class="font-semibold mt-1">Portfolio Performance</p>
                    <LineChart :portfoliosValue="portfoliosValue"/>
                </div>
            </div>
        </div>
        <div v-else class="white-card">
            <div class="flex items-center">
                <i v-if="isHover" class="fa-solid fa-circle-left mr-2 cursor-pointer text-2xl" @mouseleave="isHover=false" @click="back"></i>
                <i v-else class="fa-regular fa-circle-left mr-2 cursor-pointer text-2xl" @mouseenter="isHover=true"></i>
                <p class="font-semibold">
                    <span class="mr-2">Compare Portfolios</span>
                    <i class="fa-solid fa-minimize"></i>
                </p>
            </div>
            <label class="text-sm" v-for="(portfolio, id) of top3Portfolios" :key="id">
                <input class="ml-8" type="checkbox" v-model="selectedPortfolios" :value="id" :disabled="selectedPortfolios.length >= 2 && !selectedPortfolios.includes(id)">
                {{ id }}
            </label>
            <div class="grid grid-cols-2 gap-4 mt-3 mx-8">
                <div class="border-2 border-blue-950 p-3 rounded-lg text-sm" v-for="id of selectedPortfolios" :key="id">
                    <div class="flex items-center">
                        <div>
                            <p class="font-semibold">{{ id }}</p>
                            <p class="text-xs">Date Created: {{ top3Portfolios[id].dateCreated }}</p>
                        </div>
                        <span class="bg-blue-600 text-white rounded-full p-1 text-xs ml-auto">SGD</span>
                    </div>
                    <div class="mt-5 flex items-center">
                        <p class="font-semibold">Portfolio Value</p>
                        <p class="ml-auto">{{ top3Portfolios[id].portfolioValue.toLocaleString('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }) }}
                        </p>
                    </div>
                    <div class="mt-5 flex items-center">
                        <p class="font-semibold">Unrealised P&L</p>
                        <p class="ml-auto">{{ top3Portfolios[id].unrealisedPnL.toLocaleString('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }) }}
                        </p>
                    </div>
                    <div class="mt-5 flex items-center">
                        <p class="font-semibold">Capital Amount</p>
                        <p class="ml-auto">{{ top3Portfolios[id].capital.toLocaleString('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import DonutChart from '@/components/charts/DonutChart.vue';
    import PortfolioButton from '@/components/PortfolioButton.vue';
    import { defineProps, ref, onMounted, computed } from 'vue';
    import LineChart from '@/components/charts/LineChart.vue';
    import { useUserStore } from "@/stores/useUserStore";
    import { storeToRefs } from 'pinia';

    const store = useUserStore();
    const {
        loginUser
    } = storeToRefs(store);

    const props = defineProps({
        top3Portfolios: {
            type: Object,
            required: true,
        },
        portfoliosValue: {
            type: Object,
            required: true,
        }
    });

    const isCompare = ref(false);
    const isHover = ref(false);
    const selectedPortfolios = ref([]);

    const defaultPortfolios = computed(() => {
        return Object.keys(props.top3Portfolios).slice(0, 2);
    });

    onMounted(() => {
        selectedPortfolios.value = defaultPortfolios.value;
        // console.log(selectedPortfolios.value)
    })

    function back() {
        isCompare.value = false;
        isHover.value = false;
    }
</script>
