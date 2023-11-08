<template>
    <div class="text-blue-950">
        <div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-3 mb-5">
                <div class="col-span-1 white-card">
                    <div class="flex items-center">
                        <p class="font-semibold mr-2">Portfolio Ranking</p>
                        <i class="fa fa-line-chart" aria-hidden="true"></i>
                    </div>
                    <div v-if="isDataLoaded" class="mt-5">
                        <div class="grid grid-cols-8 gap-1 text-graybrown text-xxs font-medium mb-1">
                            <div class="col-span-1">Rank</div>
                            <div class="col-span-2">Name</div>
                            <div class="col-span-2">Date Created</div>
                            <div class="col-span-2">Value</div>
                            <div class="col-span-1">Rebalance</div>
                        </div>
                        <div class="grid grid-cols-8 break-all items-center border-b border-grey-500 gap-1 text-xs py-3 cursor-help hover:bg-slate-200 hover:border hover:border-slate-300 hover:rounded-md"
                            v-for="(portfolio, index) of Object.keys(portfoliosValue)" :key="index"
                            @click="handleSelect(portfoliosValue[portfolio])">
                            <div class="col-span-1">
                                <i v-if="index == 0 || index == 1 || index == 2" class="fa-solid fa-crown"
                                    :class="index == 0 ? 'text-gold' : index == 1 ? 'text-silver' : 'text-bronze'"></i>
                                {{ index + 1 }}
                            </div>
                            <div class="col-span-2">{{ portfoliosValue[portfolio].portfolioName }}</div>
                            <div class="col-span-2 text-xxs">{{ (new
                                Date(portfoliosValue[portfolio].dateCreated + '-01')).toLocaleString(undefined, {
                                    year: 'numeric', month: 'long'
                                }) }}
                            </div>
                            <div class="col-span-2" v-if="portfoliosValue[portfolio].portfolioValue">
                                <p class="font-semibold flex items-center">
                                    ${{ portfoliosValue[portfolio].portfolioValue.toFixed(2) }}
                                </p>
                            </div>
                            <div class="col-span-1">
                                <p v-if="portfoliosValue[portfolio].rebalancing">Yes</p>
                                <p v-else>No</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-2 white-card">
                    <p class="font-semibold mt-1 mb-3">
                        Portfolio Performance
                    </p>
                    <button v-for="option in options" :key="option" @click="selectedOption = option"
                        class="btn mx-2 pb-1 text-sm font-medium"
                        :class="selectedOption == option ? 'border-b-4 border-navy-950' : ''">
                        {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                    </button>
                    <LineChart v-if="isDataLoaded" class="mt-6" :dataset="dataset" :display="selectedOption"
                        :date="earliestDate" />
                </div>
                <div class="white-card grid grid-cols-1">
                    <p class="font-semibold text-navy-950">
                        Market Exposure
                    </p>
                    <DonutChart :isOverview="true" />
                </div>
                <div class="col-span-2 white-card">
                    <p class="font-semibold mt-1">Country Exposure</p>
                    <MapChart class="cursor-pointer" :countryData=countryCounter highColor="#192E47" lowColor="#4b87cc"
                        countryStrokeColor="#192e47" defaultCountryFillColor="#FFFFFF" />
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
import MapChart from 'vue-map-chart'
import axios from "../axiosConfig";
import { useAuth0 } from '@auth0/auth0-vue';
import getCountryISO2 from 'country-iso-3-to-2';
import { current } from 'tailwindcss/colors';

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

const dataset = ref({});
const currentYear = ref("");
const currentMonth = ref("");
const selectedOption = ref("");
const earliestDate = ref("");
const isDataLoaded = ref(false);
const countryCounter = ref({ 'US': 0 });

const options = ["monthly", "quarterly"];
selectedOption.value = options[0];

currentYear.value = new Date().getFullYear();
currentMonth.value = new Date().getMonth() + 1;

function handleSelect(portfolio) {
    selectedPortfolio.value = portfolio;
}

watch(portfoliosValue, (newPortfoliosValue) => {
    window.location.reload();
});

onMounted(async () => {
    if (isAuthenticated) {
        portfoliosValue.value.sort((a, b) => b.portfolioValue - a.portfolioValue);
        const portfolios = portfoliosValue.value;
        let dates = [];
        let idx = {};
        for (let portfolio of portfolios) {
            idx[portfolio.portfolioName] = {};

            for (let key of Object.keys(portfolio.portStock)) {
                idx[portfolio.portfolioName][key] = [0, 0];
            }
            for (let [key, value] of Object.entries(portfolio.portStock)) {
                const stockName = key;
                const stockOverviewResponse = await axios.get(`http://localhost:5000/stock/${key}/companyOverview`);
                const country = stockOverviewResponse.data.country;
                const country_2digits = getCountryISO2(country);
                const qty = value.slice(-1)[0].quantity;

                if (country_2digits in countryCounter.value) {
                    countryCounter.value[country_2digits] += (qty)
                } else {
                    countryCounter.value[country_2digits] = qty
                }

                for (let transaction of value) {
                    let [day, month, year] = transaction.dateBought.split('/');
                    let dateBought = new Date(`${year}-${month}-${day}`);
                    dates.push(dateBought);
                }
            }
        }
        earliestDate.value = new Date(Math.min(...dates)).toISOString();
        let earliestYear = new Date(earliestDate.value).getFullYear();
        for (let year = earliestYear; year <= currentYear.value; year++) {
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
                            let [boughtYear, month] = value[0].dateBought.split('-');
                            let dateBought = new Date(`${boughtYear}-${month}`);
                            dateBought = dateBought.toISOString();
                            if (portfolio.rebalancing) {
                                if (dateBought <= lastDayOfMonth) {
                                    isBought = true;
                                    if (idx[portfolio.portfolioName][key][1] % 3 == 0 && (!(i == parseInt(month, 10) && year == parseInt(boughtYear)))) {
                                        idx[portfolio.portfolioName][key][0]++;
                                    }
                                    if (idx[portfolio.portfolioName][key][0] >= value.length) {
                                        idx[portfolio.portfolioName][key][0] = 0;
                                    }
                                    let rebalance = value[idx[portfolio.portfolioName][key][0]];
                                    totalvalue[i - 1] += ((monthStockPrice - rebalance.stockBoughtPrice) * rebalance.quantity);
                                    stocks[key] = rebalance.quantity;
                                    idx[portfolio.portfolioName][key][1]++;
                                }
                            }
                            else {
                                if (dateBought <= lastDayOfMonth) {
                                    isBought = true;
                                    totalvalue[i - 1] += (monthStockPrice - value[0].stockBoughtPrice) * value[0].quantity;
                                    stocks[key] = value[0].quantity;
                                }
                            }
                        }
                        catch (error) {
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
                dataset.value[year][portfolio.portfolioName].monthly = { tooltip: totaltooltip, value: [...totalvalue] };
                dataset.value[year][portfolio.portfolioName].quarterly = { tooltip: qtrtooltip, value: [...qtrValue] };
                dataset.value[year][portfolio.portfolioName].yearly = yearTotal;
            }
        }
        isDataLoaded.value = true;
    }
});
</script>