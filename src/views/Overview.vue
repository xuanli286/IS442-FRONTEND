<template>
    <div class="text-blue-950">
        <div>
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
                        <p class="font-semibold mr-2">Top 3 Performers</p>
                        <i class="fa fa-line-chart" aria-hidden="true"></i>
                    </div>
                    <div class="grid grid-cols-3 gap-4 mt-5">
                        <div class="border-2 border-blue-950 p-3 rounded-lg cursor-pointer hover:bg-slate-200"
                            v-for="(portfolio, index) of top3PortfolioIdx" :key="index" @click="handleSelect(top3Portfolios[portfolio])">
                            <div class="flex items-center justify-between">
                                <p class="font-bold">{{ portfolio }}</p>
                                <img class="h-6 w-auto" :src="require(`@/assets/${index}.png`)" alt="">
                            </div>
                            <p class="text-gray-500 text-xs">Date Created: {{ (new
                                Date(top3Portfolios[portfolio].dateCreated)).toLocaleString(undefined, {
                                    year: 'numeric', month: 'numeric',
                                    day: 'numeric'
                                }) }}</p>
                            <p class="text-sm font-medium mt-10">Portfolio Value</p>
                            <p class="font-bold flex items-center">
                                <span class="bg-blue-600 text-white rounded-full p-1 text-xs mr-1">USD</span>
                                {{ top3Portfolios[portfolio].portfolioValue.toLocaleString('en-US', {
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
    </div>
</template>

<script setup>
    import DonutChart from '@/components/charts/DonutChart.vue';
    import PortfolioButton from '@/components/PortfolioButton.vue';
    import { defineProps, ref, computed, watch, onMounted } from 'vue';
    import LineChart from '@/components/charts/LineChart.vue';
    import { useUserStore } from "@/stores/useUserStore";
    import { usePortfolioStore } from "@/stores/usePortfolioStore";
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

    const portStore = usePortfolioStore();
    const {
        selectedPortfolio,
        portfoliosValue,
    } = storeToRefs(portStore);

    const top3PortfolioIdx = ref([]);
    const top3Portfolios = ref({});
    const dataset = ref({});
    const qtrDataset = ref({})
    const currentYear = ref("");
    const currentMonth = ref("");
    const selectedOption = ref("");
    const earliestDate = ref("");
    const isDataLoaded = ref(false);

    const options = ["monthly", "quarterly"];
    selectedOption.value = options[0];

    currentYear.value = new Date().getFullYear();
    currentMonth.value = new Date().getMonth() + 1;

    function handleSelect(portfolio) {
        selectedPortfolio.value = portfolio;
    }

    onMounted(async () => {
        if (isAuthenticated) {
            portfoliosValue.value.sort((a, b) => b.portfolioValue - a.portfolioValue);
            const portfolios = portfoliosValue.value;
            const performingPortfolios = portfolios.slice(0, 3);
            for (let portfolio of performingPortfolios) {
                top3Portfolios.value[portfolio.portfolioName] = {
                    portfolioId: portfolio.portfolioId,
                    portfolioName: portfolio.portfolioName,
                    portfolioValue: portfolio.portfolioValue,
                    portfolioDescription: portfolio.portfolioDescription,
                    unrealisedPnL: portfolio.unrealisedPnL,
                    dateCreated: portfolio.dateCreated,
                    capital: portfolio.capital,
                };
            }
            top3PortfolioIdx.value = Object.keys(top3Portfolios.value);
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
                        let isBought = false;
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
                                        isBought = true;
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
                        if (i % 3 == 0 && isBought) {
                            let qtrIdx = Math.floor(i / 3) - 1;
                            let startIdx = qtrIdx * 3;
                            let endIdx = i - 1;
                            let qtrResult = '';
                            qtrValue[qtrIdx] = totalvalue.slice(startIdx, endIdx + 1).reduce((acc, val) => acc + val, 0);
                            for (let stock in stocks) {
                                qtrResult += `${stock}: ${stocks[stock]}\n`;
                            }
                            qtrtooltip[qtrIdx] = qtrResult;
                        }
                        for (let stock in stocks) {
                            result += `${stock}: ${stocks[stock]}\n`;
                        }
                        totaltooltip[i - 1] = result;
                    }
                    dataset.value[year][portfolio.portfolioName].monthly = {tooltip: totaltooltip, value: [...totalvalue]};
                    dataset.value[year][portfolio.portfolioName].quarterly = {tooltip: qtrtooltip, value: [...qtrValue]};
                    dataset.value[year][portfolio.portfolioName].yearly = yearTotal;
                }
            }
            isDataLoaded.value = true;
        }
    });
</script>