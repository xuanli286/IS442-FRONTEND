<template>
    <div class="white-card mb-5">
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
                <p class="text-xs font-medium mb-4"><b>Date Created:</b> {{ portfolio.dateCreated }}</p>
                <p class="text-sm font-medium mb-6"><b>Description:</b> {{ portfolio.portfolioDescription }}</p>
            </div>
            <div class="overflow-y-auto max-h-80">
                <table class="w-full text-center text-xs lg:text-base">
                    <thead class="border-b-2 border-navy-950">
                        <tr>
                            <th class="text-left">Stock Ticker <br class="lg:hidden"><span class="text-xs lg:text-sm font-medium">(Symbol | Sector)</span></th>
                            <th>Date Bought</th>
                            <th>Position</th>
                            <th>Current Price <br class="lg:hidden"><span class="text-xs lg:text-base">($)</span></th>
                            <th>Bought Price <br class="lg:hidden"><span class="text-xs lg:text-base">($)</span></th>
                            <th>P&L <br class="lg:hidden"><span class="text-xs lg:text-base">($)</span></th>
                        </tr>
                    </thead>
                    <tbody v-for="(transactions, stockTicker) in portfolioStocks" :key="stockTicker">
                        <tr class="border-b border-navy-950" v-if="stockInfo[stockTicker]">
                            <td colspan="6" class="font-semibold text-left">
                                <RouterLink :to="{name: 'Stock', params:{stockTicker}}">
                                    {{stockTicker}}
                                    <span class="inline-flex items-center justify-center px-2 h-6 mx-2 bg-navy-150 rounded-lg text-xs lg:text-sm font-medium">
                                        {{ stockInfo[stockTicker].symbol }}
                                    </span>
                                    <span class="text-xs lg:text-sm">{{ stockInfo[stockTicker].sector }}</span>
                                </RouterLink>
                            </td>
                        </tr>
                        <tr v-for="info in transactions" v-if="stockInfo[stockTicker]">
                            <td></td>
                            <td>{{info.dateBought}}</td>
                            <td>{{info.quantity}}</td>
                            <td>{{(stockInfo[stockTicker].eod).toFixed(2)}}</td>
                            <td>{{info.stockBoughtPrice.toFixed(2)}}</td>
                            <td :class="getPnL(info.quantity, stockInfo[stockTicker].eod, info.stockBoughtPrice) < 0 ? 'text-red-500' : 'text-green-500'">{{Math.abs(getPnL(info.quantity, stockInfo[stockTicker].eod, info.stockBoughtPrice))}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    </div>
</template>
  

<script>
import axios from "../axiosConfig";

    export default {
        name : "PortfolioBreakdown",
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
                stockInfo : {},
                percentChange : 0.0, 
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
                    this.portfolioStocks = portStock;

                    console.log(portStock)

                    let stocks = Object.keys(response.data.portStock);
                    let eodSum = 0;
                    let ytdSum = 0;

                    for (let stock of stocks) {
                        this.stockInfo[stock] = { symbol: "", sector: "", eod: 0, ytd: 0 };

                        const stockOverviewResponse = await axios.get(`http://localhost:5000/stock/${stock}/companyOverview`);
                        this.stockInfo[stock].symbol = stockOverviewResponse.data.country;
                        this.stockInfo[stock].sector = stockOverviewResponse.data.sector;

                        const stockPriceResponse = await axios.get(`http://localhost:5000/stockprice/dailyprice/${stock}`);
                        const stockPriceList = stockPriceResponse.data.stockPriceList;

                        let eodPrice = stockPriceList[0]["4. close"];
                        let ytdPrice = stockPriceList[1]["4. close"];

                        this.stockInfo[stock].eod = eodPrice;
                        this.stockInfo[stock].ytd = ytdPrice;

                        for (let i = 0; i < portStock[stock].length; i++) {

                            eodSum += portStock[stock][i].quantity * eodPrice;
                            ytdSum += portStock[stock][i].quantity * ytdPrice;
                        }
                    }

                    this.percentChange = (((eodSum - ytdSum) / ytdSum) * 100).toFixed(2);

                } catch (error) {
                    console.error("An error occurred:", error);
                }
            },
            getPnL(qty, eod, boughtPrice) {
                return ((eod - boughtPrice) * qty).toFixed(2);
            },
        },
        watch: {
            portfolio: "getPortfolioData",

        }
            
    }
</script>

<style scoped>
  h4 {
    @apply
    text-2xl
    text-navy-950
    font-semibold
  }
  td {
    @apply
    py-1
  }
  th {
    @apply
    pb-2
  }
</style>