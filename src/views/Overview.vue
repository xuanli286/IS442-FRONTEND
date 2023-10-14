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
                        <PortfolioButton class="ml-auto" @click="isCompare = !isCompare">
                            <p>Compare Portfolio</p>
                        </PortfolioButton>
                    </div>
                    <div class="grid grid-cols-3 gap-4 mt-5">
                        <div class="border-2 border-blue-950 p-3 rounded-lg " v-for="(portfolio, id) of top3Portfolios"
                            :key="id">
                            <p class="font-bold">{{ portfolio.portfolioName }}</p>
                            <p class="text-gray-500 text-xs">Date Created: {{ (new
                                Date(portfolio.dateCreated)).toLocaleString(undefined, {
                                    year: 'numeric', month: 'numeric',
                                    day: 'numeric'
                                }) }}</p>
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
                <div class="col-span-1 white-card flex flex-col items-center">
                    <p class="font-semibold mt-1 mr-auto">
                        Market Exposure
                    </p>
                    <div class="my-auto">
                        <DonutChart :isOverview="true" />
                    </div>
                </div>
                <div class="col-span-2 white-card">
                    <p class="font-semibold mt-1 mb-3">
                        Portfolio Performance for Year 
                        <span class="font-bold text-lg">{{ currentYear }}</span>
                    </p>
                    <label class="mr-4" v-for="option in options" :key="option">
                        <input type="radio" :value="option" v-model="selectedOption" />
                        {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                    </label>
                    <LineChart v-if="isDataLoaded" class="mt-4" :dataset="dataset" :display="selectedOption" :date="earliestDate" />
                </div>
                <div class="col-span-3 white-card">
                    <p class="font-semibold mt-1">Country Exposure</p>
                    <MapChart :countryData="{ 'US': 4, 'CA': 7, 'GB': 8, 'IE': 14, 'ES': 21 }" highColor="#192E47"
                        lowColor="#5CA7FF" countryStrokeColor="#909090" defaultCountryFillColor="#dadada" />
                </div>
            </div>
        </div>
        <div v-else class="white-card">
            <div class="flex items-center">
                <i v-if="isHover" class="fa-solid fa-circle-left mr-2 cursor-pointer text-2xl" @mouseleave="isHover = false"
                    @click="back"></i>
                <i v-else class="fa-regular fa-circle-left mr-2 cursor-pointer text-2xl" @mouseenter="isHover = true"></i>
                <p class="font-semibold">
                    <span class="mr-2">Compare Portfolios</span>
                    <i class="fa-solid fa-minimize"></i>
                </p>
            </div>
            <label class="text-sm" v-for="(portfolio, id) of top3Portfolios" :key="id">
                <input class="ml-8" type="checkbox" v-model="selectedPortfolios" :value="id" :disabled="selectedPortfolios.length >= 2 && !selectedPortfolios.includes(id)" @change="handlePortfolioComparison">
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
                <div v-if="selectedPortfolios.length > 0" class="col-span-2 white-card">
                    <p class="font-semibold mt-1 mb-4">
                        Portfolio Performance Comparison for Year 
                        <span class="font-bold text-lg">{{ currentYear }}</span>
                    </p>
                    <LineChart :dataset="selectedDataset" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import DonutChart from '@/components/charts/DonutChart.vue';
    import PortfolioButton from '@/components/PortfolioButton.vue';
    import { defineProps, ref, computed, watch, onMounted } from 'vue';
    import LineChart from '@/components/charts/LineChart.vue';
    import { useUserStore } from "@/stores/useUserStore";
    import { storeToRefs } from 'pinia';
    // import ChoroplethMap from "@/components/charts/ChoroplethMap.vue";
    import MapChart from 'vue-map-chart'
    import axios from "../axiosConfig";
    import { useAuth0 } from '@auth0/auth0-vue';    
    const { user, isAuthenticated } = useAuth0();

    const store = useUserStore();
    const {
        loginUser
    } = storeToRefs(store);

    const isCompare = ref(false);
    const isHover = ref(false);
    const selectedPortfolios = ref([]);
    const top3Portfolios = ref({});
    const dataset = ref({});
    const qtrDataset = ref({})
    const selectedDataset = ref({});
    const currentYear = ref("");
    const currentMonth = ref("");
    const selectedOption = ref("");
    const earliestDate = ref("");
    const isDataLoaded = ref(false);

    const options = ["monthly", "quarterly", "all"];
    selectedOption.value = options[2];

    currentYear.value = new Date().getFullYear();
    currentMonth.value = new Date().getMonth() + 1;

    onMounted(async () => {
        if (isAuthenticated) {
            try {
                const response = await axios.get(`http://localhost:5000/portfolio/getportfolios/${user.value.sub}`);
                response.data.sort((a, b) => b.portfolioValue - a.portfolioValue);
                const portfolios = response.data;
                const performingPortfolios = portfolios.slice(0, 3);
                for (let portfolio of performingPortfolios) {
                    top3Portfolios.value[portfolio.portfolioName] = {
                        portfolioId: portfolio.portfolioId,
                        portfolioName: portfolio.portfolioName,
                        portfolioValue: portfolio.portfolioValue,
                        unrealisedPnL: portfolio.unrealisedPnL,
                        dateCreated: portfolio.dateCreated,
                        capital: portfolio.capital,
                    };
                }
                selectedPortfolios.value = Object.keys(top3Portfolios.value).slice(0, 2);
                let dates = [];
                for (let portfolio of portfolios) {
                    for (let [key, value] of Object.entries(portfolio.portStock)) {
                        for (let transaction of value) {
                            let [day, month, year] = transaction.dateBought.split('/');
                            let dateBought = new Date(`${year}-${month}-${day}`);
                            dates.push(dateBought);
                        }
                    }
                }
                earliestDate.value = new Date(Math.min(...dates)).toISOString();
                let earliestYear = new Date(earliestDate.value).getFullYear();
                for (let year=earliestYear; year<=currentYear.value; year++) {
                    dataset.value[year] = {};
                    for (let portfolio of portfolios) {
                        if (!dataset.value[year][portfolio.portfolioName]) {
                            dataset.value[year][portfolio.portfolioName] = {
                                monthly: [],
                                quarterly: [],
                                yearly: 0,
                            };
                        }
                        let yearTotal = 0;
                        let totalvalue = [];
                        let qtrValue = [];
                        let totaltooltip = [];
                        let qtrtooltip = [];
                        let stocks = {};
                        totalvalue = new Array(12).fill(null);
                        totaltooltip = new Array(12).fill(null);
                        qtrValue = new Array(4).fill(null);
                        qtrtooltip = new Array(4).fill(null);
                        for (let i = 1; i <= 12; i++) {
                            let result = '';
                            for (let [key, value] of Object.entries(portfolio.portStock)) {
                                try {
                                    const response = await axios.get(
                                        `http://localhost:5000/stockprice/getmonthlypricebydate/${key}?month=${i.toString().padStart(2, '0')}&year=${year}`
                                    );
                                    let lastDayOfMonth = response.data["stockDate"];
                                    let monthStockPrice = response.data["4. close"];
                                    for (let transaction of value) {
                                        let [day, month, year] = transaction.dateBought.split('/');
                                        let dateBought = new Date(`${year}-${month}-${day}`);
                                        dateBought = dateBought.toISOString();
                                        if (dateBought <= lastDayOfMonth) {
                                            yearTotal += (monthStockPrice - transaction.stockBoughtPrice) * transaction.quantity;
                                            totalvalue[i - 1] += (monthStockPrice - transaction.stockBoughtPrice) * transaction.quantity;
                                            stocks[key] = transaction.quantity;
                                        }
                                    }
                                }
                                catch(error) {
                                    console.log(error);
                                }
                            }
                            if (i % 3 == 0) {
                                let qtrIdx = Math.floor(i / 3) - 1;
                                let startIdx = qtrIdx * 3;
                                let endIdx = i - 1;
                                qtrValue[qtrIdx] = totalvalue.slice(startIdx, endIdx + 1).reduce((acc, val) => acc + val, 0);
                            }
                            for (const key in stocks) {
                                result += `${key}: ${stocks[key]}\n`;
                            }
                            totaltooltip[i - 1] = result;
                        }
                        dataset.value[year][portfolio.portfolioName].monthly = {tooltip: totaltooltip, value: [...totalvalue]};
                        dataset.value[year][portfolio.portfolioName].quarterly = [...qtrValue];
                        dataset.value[year][portfolio.portfolioName].yearly = yearTotal;
                    }
                }
                isDataLoaded.value = true;
                handlePortfolioComparison();
                console.log(dataset.value)
            } catch (error) {
                console.error(error.message);
            }
        }
    });

    function handlePortfolioComparison() {
        if (Object.keys(top3Portfolios.value).length > 0 && selectedPortfolios.value.length == 0) {
            selectedPortfolios.value = Object.keys(top3Portfolios.value).slice(0, 2);
        }
        selectedDataset.value = {};
        for (let portfolioName of selectedPortfolios.value) {
            for (let [key, value] of Object.entries(dataset.value)) {
                if (portfolioName == key) {
                    selectedDataset.value[key] = value;
                }
            }
        }
    }

    watch(selectedPortfolios, () => {
        handlePortfolioComparison();
    });

    function back() {
        isCompare.value = false;
        isHover.value = false;
    }
</script>