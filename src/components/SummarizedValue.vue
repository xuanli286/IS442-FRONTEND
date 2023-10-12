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
                    <p class="font-bold" :class="portfolioData.unrealisedPnL < 0 ? 'text-red-500' : 'text-green-500'">
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
                    <p class="font-bold" :class="portfolioData.dailyPnL < 0 ? 'text-red-500' : 'text-green-500'">
                        ${{ Math.abs(portfolioData.dailyPnL).toFixed(2) }}</p>
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
    portfolioValue: 0,
    unrealisedPnL: 0,
    dailyPnL: 0
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

const getPnl = async (stockKey, item) => {
    const eodResponse = await axios.get(`http://localhost:5000/stockprice/dailyprice/${stockKey}`);
    const stockPriceList = eodResponse.data.stockPriceList;
    const eodPrice = stockPriceList[0]['4. close'];
    const ytdPrice = stockPriceList[1]['4. close'];
    // console.log(`x ${item.quantity} ${stockKey} is =  ${eodPrice} - ${ytdPrice}`)
    portfolioData.dailyPnL += (eodPrice - ytdPrice) * item.quantity;
}

const getCapital = async () => {
    const capitalResponse = await axios.get(`http://localhost:5000/customer/getcapital/${user.value.sub}`);
    buyingPower.value = capitalResponse.data - cost.value;
}

//overview
const getPortfolioValue = async () => {
    const portfolioResponse = await axios.get(`http://localhost:5000/portfolio/getportfolios/${user.value.sub}`);

    portfolioData.portfolioValue = 0;
    for (const portfolio of portfolioResponse.data) {
        portfolioData.portfolioValue += portfolio.portfolioValue;
        if (portfolio.portStock) {
            const stockKeys = Object.keys(portfolio.portStock);
            cost.value = 0;
            stockKeys.forEach(stockKey => {
                const stockItems = portfolio.portStock[stockKey];
                stockItems.forEach(async item => {
                    cost.value += (item.quantity * item.stockBoughtPrice);
                    // console.log(`I bought x ${item.quantity} ${stockKey} at ${item.stockBoughtPrice}`)
                    getPnl(stockKey, item);

                });
            });
        }
    }
    // console.log(`total cost is : ${cost.value}`)
    portfolioData.unrealisedPnL = portfolioData.portfolioValue - cost.value;
    getCapital();
}

watch(
    () => props.portfolio, async (newPortfolio, oldPortfolio) => {
        portfolioData.dailyPnL = 0;
        // portfolioData.cost = 0;
        if (newPortfolio?.portfolioId) {
            // console.log(newPortfolio)
            await getEachPortfolioValue(newPortfolio.portfolioId);
        } else if (props.isOverview) {
            await getPortfolioValue();
        }
    });


//each portfolio value TO DO
const getEachPortfolioValue = async () => {
    const portfolioResponse = await axios.get(`http://localhost:5000/portfolio/${props.portfolio.portfolioId}`);
    portfolioData.portfolioValue = 0;
    portfolioData.portfolioValue = portfolioResponse.data.portfolioValue;

    // depends where we doing the cal of port value!
    // portfolioData.unrealisedPnL = portfolioResponse.data.unrealisedPnL;

    const stockKeys = Object.keys(portfolioResponse.data.portStock);
    // console.log(stockKeys)
    cost.value = 0;
    stockKeys.forEach(stockKey => {
        const stockItems = portfolioResponse.data.portStock[stockKey];
        stockItems.forEach(async item => {
            cost.value += (item.quantity * item.stockBoughtPrice);
            getPnl(stockKey, item);
        });
    });
    // console.log(`total cost is : ${cost.value}`)
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