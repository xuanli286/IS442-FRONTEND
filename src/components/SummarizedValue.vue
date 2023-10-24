<template>
    <div class="white-card grid grid-rows-2 grid-cols-4 gap-[5%] text-center mb-5">
        <div class="flex justify-between col-span-4 ">
            <p v-if="isOverview" class="font-semibold text-blue-950">Portfolio Overview</p>
            <p><span class="font-semibold">Currency:</span> USD</p>
        </div>
        <div class="flex justify-between col-span-4">

            <div class="md:inline-flex items-center justify-center">
                <div>
                    <i class="fa-solid fa-chart-pie fa-xl mb-5 md:mr-5 md:mb-0"></i>
                </div>
                <div>
                    <p class="text-graybrown">Portfolio Value</p>
                    <p class="font-bold text-navy-950"> ${{ Math.abs(portfolioData.totalEOD).toFixed(2) }}</p>
                </div>
            </div>

            <div class="md:inline-flex items-center justify-center">
                <div>
                    <i class="fa-solid fa-scale-unbalanced-flip fa-xl mb-5 md:mr-5 md:mb-0"></i>
                </div>
                <div>
                    <p class="text-graybrown">Total P&L</p>
                    <p class="font-bold" :class="portfolioData.unrealisedPnL < 0 ? 'text-red-500' : 'text-green-500'"> ${{
                        Math.abs(portfolioData.unrealisedPnL).toFixed(2) }}</p>
                </div>
            </div>

            <div class="md:inline-flex items-center justify-center">
                <div>
                    <i class="fa-solid fa-piggy-bank fa-xl mb-5 md:mr-5 md:mb-0"></i>
                </div>
                <div>
                    <p class="text-graybrown">Buying Power</p>
                    <p class="font-bold">${{ Math.abs(buyingPower).toFixed(2) }}</p>
                </div>
            </div>

            <div class="md:inline-flex items-center justify-center">
                <div>
                    <i class="fa-solid fa-calendar-check fa-xl mb-5 md:mr-5 md:mb-0"></i>
                </div>
                <div>
                    <p class="text-graybrown">Daily P&L</p>
                    <p class="font-bold" :class="portfolioData.dailyPnL < 0 ? 'text-red-500' : 'text-green-500'"> ${{
                        Math.abs(portfolioData.dailyPnL).toFixed(2) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted, reactive, watch } from 'vue';
import { useUserStore } from "@/stores/useUserStore";
import axios from "../axiosConfig";
import { useAuth0 } from '@auth0/auth0-vue';
const { user, isAuthenticated } = useAuth0();

const props = defineProps({
    isOverview: {
        type: Boolean,
    },
    portfolio: {
        type: Object,
    }
})

const portfolioId = ref("someID");
const portfolioName = ref("Portfolio 1");
const buyingPower = ref(0);
const cost = ref(0);

const portfolioData = reactive({
    unrealisedPnL: 0,
    dailyPnL: 0,
    totalEOD: 0,
});

const fetchPortfolioData = async () => {
    if (isAuthenticated) {
        try {
            getPortfolioValue();
        } catch (error) {
            console.error("Error in getting portfolio and capital data", error);
        }
    }
};

const getCapital = async () => {
    const capitalResponse = await axios.get(`http://localhost:5000/customer/getcapital/${user.value.sub}`);
    buyingPower.value = capitalResponse.data - cost.value;
}

let isFetchingData = false;
let shouldFetchData = false;

//Overview
const getPortfolioValue = async () => {

    let portfolioResponse;
    if (isFetchingData) {
        shouldFetchData = true;
        return;
    }

    try {
        isFetchingData = true;
        portfolioResponse = await axios.get(`http://localhost:5000/portfolio/getportfolios/${user.value.sub}`);
        shouldFetchData = true;
    } finally {
        isFetchingData = false;
        if (shouldFetchData) {
            shouldFetchData = false;
            await getPortfolioValueOfAllPort(portfolioResponse.data);
        }
    }
    getCapital();
}

const getPortfolioValueOfAllPort = async (data) => {
    cost.value = 0;
    portfolioData.totalEOD = 0;

    for (const portfolio of data) {

        if (portfolio.portStock) {
            const stockKeys = Object.keys(portfolio.portStock);
            for (const stockKey of stockKeys) {
                const stockItems = portfolio.portStock[stockKey];
                const lastStock = stockItems[stockItems.length - 1];

                const currentEod = await axios.get(`http://localhost:5000/stockprice/dailyprice/${stockKey}`);
                const currentPrice = currentEod.data.stockPriceList[0]['4. close'];

                portfolioData.totalEOD += currentPrice * lastStock.quantity;
                const ytdPrice = currentEod.data.stockPriceList[1]['4. close'];

                cost.value += lastStock.quantity * lastStock.stockBoughtPrice;
                portfolioData.dailyPnL += (currentPrice - ytdPrice) * lastStock.quantity;
            }
        }
    }

    portfolioData.unrealisedPnL = portfolioData.totalEOD - cost.value;
}

watch(
    () => props.portfolio, async (newPortfolio, oldPortfolio) => {

        portfolioData.dailyPnL = 0;
        if (newPortfolio?.portfolioId) {
            await getEachPortfolioValue(newPortfolio.portfolioId);
        } else if (props.isOverview) {
            await getPortfolioValue();
        }
    });

const getEachPortfolioValue = async () => {

    const portfolioResponse = await axios.get(`http://localhost:5000/portfolio/${props.portfolio.portfolioId}`);
    const stockKeys = Object.keys(portfolioResponse.data.portStock);

    let costOfPortfolio = 0;
    portfolioData.dailyPnL = 0;
    portfolioData.totalEOD = 0;

    for (const stockKey of stockKeys) {
        const stockItems = portfolioResponse.data.portStock[stockKey];
        const lastStock = stockItems[stockItems.length - 1];
        const currentEod = await axios.get(`http://localhost:5000/stockprice/dailyprice/${stockKey}`);
        const currentPrice = currentEod.data.stockPriceList[0]['4. close'];
        portfolioData.totalEOD += currentPrice * lastStock.quantity;
        const ytdPrice = currentEod.data.stockPriceList[1]['4. close'];
        costOfPortfolio += lastStock.quantity * lastStock.stockBoughtPrice;
        portfolioData.dailyPnL += (currentPrice - ytdPrice) * lastStock.quantity;
    }

    portfolioData.unrealisedPnL = portfolioData.totalEOD - costOfPortfolio;
}


onMounted(() => {
    fetchPortfolioData();
});

</script>

<script>

export default {
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {

    },

}
</script>

<style scoped>
h3 {
    @apply text-4xl
}

h4 {
    @apply text-2xl
}

i {
    @apply text-navy-950
}
</style>