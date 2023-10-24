<template>
    <div class="white-card">
        <div class="flex items-center mb-4">
            <h4>My Portfolio</h4>
            <span class="inline-flex items-center justify-center w-8 h-8 ml-2 bg-gray-300 rounded-full font-semibold">
                {{ Object.keys(portfolioStocks).length }}
            </span>
        </div>
        <div class="border-2 border-navy-950 rounded-md p-4 text-navy-950">
            <div>
                <div class="flex justify-between items-center">
                    <h5 class="text-xl font-semibold">{{ portfolio.portfolioName }}</h5>
                    <h5 class="text-xl font-medium" :class="percentChange < 0 ? 'text-red-500' : 'text-green-500'">
                        <i class="bi bi-arrow-up" :hidden="percentChange < 0"></i>
                        <i class="bi bi-arrow-down" :hidden="percentChange >= 0"></i>{{ percentChange }}%
                    </h5>
                </div>
                <p class="text-xs font-medium mb-4"><b>Date Created:</b> 
                    {{ new Date(portfolio.dateCreated).toLocaleString(undefined, {
                        year: 'numeric', month: 'long'
                    }) }}
                </p>
                <p class="text-sm font-medium mb-6"><b>Description:</b> {{ portfolio.portfolioDescription }}</p>
            </div>
            <div class="overflow-y-auto max-h-96">
                <table class="w-full text-center text-xs lg:text-base">
                    <thead class="sticky top-0 bg-white" style="box-shadow: 0 2px 0 0 #192e47">
                        <tr>
                            <th class="text-left">Stock Ticker <br class="lg:hidden"><span
                                    class="text-xs lg:text-sm font-medium">(Symbol | Sector)</span></th>
                            <th>Date Bought</th>
                            <th>Quantity</th>
                            <th>Bought Price <br class="lg:hidden"><span class="text-xs lg:text-base">($)</span></th>
                            <th>Quantity Change<br class="lg:hidden"><span class="text-xs lg:text-base">(%)</span></th>
                            <th>P&L <br class="lg:hidden"><span class="text-xs lg:text-base">($)</span></th>
                        </tr>
                    </thead>
                    <div class="mb-[2px]"></div>
                    <tbody v-for="(transactions, stockTicker) in portfolioStocks" :key="stockTicker" class="border-b border-navy-950">
                        <template v-if="stockInfo[stockTicker]">
                            <tr v-for="(t, idx) in transactions" :key="idx">
                                <td class="text-left font-semibold stockname" v-if="idx==0">
                                    {{ stockTicker }}
                                    <span
                                        class="inline-flex items-center justify-center px-2 h-6 mx-2 bg-navy-150 rounded-lg text-xs lg:text-sm font-medium">
                                        {{ stockInfo[stockTicker].symbol }}
                                    </span>
                                    <span class="text-xs lg:text-sm">{{ stockInfo[stockTicker].sector }}</span>
                                </td>
                                <td class="text-left font-semibold" v-else-if="idx == 1">
                                    Current Price: ${{ (stockInfo[stockTicker].eod).toFixed(2) }}
                                </td>
                                <td class="text-left font-semibold" v-else-if="idx == 2">
                                    Allocation: {{ (t.allocation * 100).toFixed(1) }}%
                                </td>
                                <td v-else></td>
                                <td>{{ new Date(t.dateBought).toLocaleString(undefined, {
                                        year: 'numeric', month: 'long'
                                    }) }}</td>
                                <td>{{ t.quantity }}</td>
                                <td>{{ t.stockBoughtPrice.toFixed(2) }}</td>
                                <td>{{ getQtyChange(transactions, idx) }}</td>
                                <td
                                    :class="getPnL(t.quantity, stockInfo[stockTicker].stockPrices[t.dateBought], t.stockBoughtPrice) < 0 ? 'text-red-500' : 'text-green-500'"
                                >
                                    {{ Math.abs(getPnL(t.quantity, stockInfo[stockTicker].stockPrices[t.dateBought], t.stockBoughtPrice)) }}
                                </td>
                            </tr>
                            <tr v-if="transactions.length == 1">
                                <td class="text-left font-semibold">
                                    Current Price: ${{ (stockInfo[stockTicker].eod).toFixed(2) }}
                                </td>
                            </tr>
                            <tr v-if="transactions.length == 1">
                                <td class="text-left font-semibold">
                                    Allocation: {{ (transactions[0].allocation * 100).toFixed(2) }}%
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>
  

<script>
import axios from "../axiosConfig";

export default {
    name: "PortfolioBreakdown",
    components: {

    },
    props: {
        portfolio: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            portfolioStocks: {},
            stockInfo: {},
            percentChange: 0.0,
        };
    },
    created() {

        this.getPortfolioData();

    },
    methods: {

        async getPortfolioData() {
            try {
                const response = await axios.get(`http://localhost:5000/portfolio/${this.portfolio.portfolioId}`);
                const portStock = response.data.portStock;

                const sorted = Object.keys(portStock)
                    .sort()
                    .reduce((accumulator, key) => {
                        accumulator[key] = portStock[key];

                        return accumulator;
                    }, {});

                this.portfolioStocks = {}

                for (const stock in sorted) {
                    this.portfolioStocks[stock] = sorted[stock].reverse()
                }

                console.log(portStock)

                let stocks = Object.keys(portStock);
                let eodSum = 0;
                let ytdSum = 0;

                for (let stock of stocks) {
                    this.stockInfo[stock] = { symbol: "", sector: "", eod: 0, ytd: 0, stockPrices: {} };

                    const stockOverviewResponse = await axios.get(`http://localhost:5000/stock/${stock}/companyOverview`);
                    this.stockInfo[stock].symbol = stockOverviewResponse.data.country;
                    this.stockInfo[stock].sector = stockOverviewResponse.data.sector;

                    const stockPriceResponse = await axios.get(`http://localhost:5000/stockprice/monthlyprice/${stock}`);
                    const stockPriceList = stockPriceResponse.data.stockPriceList;

                    let stockPrices = {}

                    for (const stockValue of stockPriceList) {
                        stockPrices[stockValue.stockDate.slice(0,7)] = stockValue["4. close"]
                    }

                    this.stockInfo[stock].stockPrices = stockPrices;

                    let eodPrice = stockPriceList[0]["4. close"];

                    let ytdPrice = stockPriceList[1]["4. close"];

                    this.stockInfo[stock].eod = eodPrice;
                    this.stockInfo[stock].ytd = ytdPrice;

                    eodSum += portStock[stock][0].quantity * eodPrice;
                    ytdSum += portStock[stock][0].quantity * ytdPrice;
                }

                this.percentChange = (((eodSum - ytdSum) / ytdSum) * 100).toFixed(2);

                // console.log(this.stockInfo)

            } catch (error) {
                console.error("An error occurred:", error);
            }
        },
        getPnL(qty, eod, boughtPrice) {

            return ((eod - boughtPrice) * qty).toFixed(2);
        },
        getQtyChange(trans, idx) {

            if (idx <= trans.length - 2) {
                return ( (( trans[idx].quantity - trans[idx+1].quantity )/trans[idx+1].quantity) * 100 ).toFixed(2);
            }
            return '-'
        },
    },
    watch: {
        portfolio: "getPortfolioData",
    },

}


</script>

<style scoped>
h4 {
    @apply text-2xl text-navy-950 font-semibold
}

.stockname {
    @apply md:text-base
}

td {
    @apply py-1 text-xs md:text-sm
}

th {
    @apply pb-2
}
</style>