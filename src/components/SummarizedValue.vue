<template>
    <div class="white-card grid grid-rows-2 grid-cols-4 gap-[5%] text-center mb-5">
        <div class="flex justify-between col-span-4 ">
            <p v-if="isOverview" class="font-semibold text-blue-950">Portfolio Overview</p>
            <p><span class="font-semibold">Currency:</span> SGD</p>
        </div>
        <div class="flex justify-between col-span-4">
            <div class="flex items-center">
                <div><i class="fa-solid fa-chart-pie fa-xl mr-5"></i></div>
                <div>
                    <p class="text-graybrown">Portfolio Value</p>
                    <p class="font-bold text-navy-950"> ${{ Math.abs(portfolioData.portfolioValue).toFixed(2) }}</p>
                </div>
            </div>
            <div class="flex items-center ">
                <div><i class="fa-solid fa-scale-unbalanced-flip fa-xl mr-5"></i></div>
                <div>
                    <p class="text-graybrown">Total P&L</p>
                    <p class="font-bold" :class="unrealisedPnL < 0 ? 'text-red-500' : 'text-green-500'">
                        ${{ Math.abs(portfolioData.unrealisedPnL).toFixed(2) }}</p>
                </div>
            </div>
            <div class="flex items-center">
                <div><i class="fa-solid fa-piggy-bank fa-xl mr-5"></i></div>
                <div>
                    <p class="text-graybrown">Buying Power</p>
                    <p class="font-bold">${{ Math.abs(buyingPower).toFixed(2) }}</p>
                </div>
            </div>
            <div class="flex items-center">
                <div><i class="fa-solid fa-calendar-check fa-xl mr-5"></i></div>
                <div>
                    <p class="text-graybrown">Daily P&L</p>
                    <p class="font-bold" :class="dailyPnL < 0 ? 'text-red-500' : 'text-green-500'">
                        ${{ Math.abs(portfolioData.dailyPnL).toFixed(2) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted, reactive } from 'vue';
import { useUserStore } from "@/stores/useUserStore";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-vue';
const { user, isAuthenticated } = useAuth0();

const props = defineProps({
    isOverview: {
        type: Boolean,
        required: true,
    },
})

const portfolioId = ref("someID");
const portfolioName = ref("Portfolio 1");
const buyingPower = ref(0);
const cost = ref(0);
const portfolioData = reactive({
    portfolioValue: 0,
    unrealisedPnL: 0,
    dailyPnL: 0
});

const fetchPortfolioData = async () => {
    if (isAuthenticated) {
        try {
            getPortfolioValue();
            getCapital();
            // portfolioId.value = 10;

        } catch (error) {
            console.error("Error in getting portfolio and capital data", error);
        }
    }
};

const getPnl = async (stockKey, item) => {
    const eodResponse = await axios.get(`http://localhost:5000/stockprice/dailyprice/${stockKey}`);
    const stockPriceList = eodResponse.data.stockPriceList;
    const eodPrice = stockPriceList[0]['4. close'];
    const ytdPrice = stockPriceList[1]['4. close'];
    portfolioData.dailyPnL += (eodPrice - ytdPrice) * item.quantity;
}

const getcapital = async () => {
    const capitalResponse = await axios.get(`http://localhost:5000/customer/getcapital/${user.value.sub}`);
    buyingPower.value = capitalResponse.data - cost.value;
}

const getPortfolioValue = async () => {
    const portfolioResponse = await axios.get(`http://localhost:5000/portfolio/getportfolios/${user.value.sub}`);

    for (const portfolio of portfolioResponse.data) {
        portfolioData.portfolioValue += portfolio.portfolioValue;
        if (portfolio.portStock) {
            const stockKeys = Object.keys(portfolio.portStock);
            stockKeys.forEach(stockKey => {
                const stockItems = portfolio.portStock[stockKey];
                stockItems.forEach(async item => {
                    cost.value += (item.quantity * item.stockBoughtPrice);
                    getPnl(stockKey, item);

                });
            });
        }
    }
    portfolioData.unrealisedPnL = portfolioData.portfolioValue - cost.value;
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
    // async created() {

    //     if (isAuthenticated) {
    //         this.portfolioId = user.sub;

    //         try {
    //             // const response = await axios.get(`http://localhost:5000/portfolio/getportfolios/${user.value.sub}`);
    //             console.log(response.data);
    //             //             // loop through to get portfolio value. if cnot use /gettotalportfoliovalue/{userId}

    //             //             // loop through to get today's eod for all stocks in portfolio + the stock bought price to get total PnL

    //             //             //loop through to get dailyPnL for all stocks in portfolio. check if possible to sum from the display below.
    //             //             // if not we go through the dailyPnL for each stock and sum them up.

    //         } catch {
    //             console.log("Error in getting portfolios");
    //         }

    //         //         // customer/getcapital/{userId}
    //         try {
    //             // const response = await axios.get(`http://localhost:5000/customer/getcapital/${user.value.sub}`);
    //             console.log(response.data);
    //             this.buyingPower = response.data - this.portfolioValue;

    //         } catch {
    //             console.log("Error in getting capital");
    //         }


    //     }

    // }

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