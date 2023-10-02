<template>
    <div class="white-card mb-5">
        <div class="flex items-center mb-8">
            <h4>My Portfolio</h4>
            <span class="inline-flex items-center justify-center w-8 h-8 ml-2 bg-gray-300 rounded-full font-semibold">
            {{ Object.keys(portfolioStocks).length }}
            </span>
        </div>
        <div class="border-2 border-black rounded-md p-4 text-navy-950">
            <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                    <h5 class="text-xl font-semibold">{{ portfolio.portfolioName }}</h5>
                    <p class="text-sm font-medium"><b>Date Created:</b> {{ formattedDate }}</p>
                </div>
                <p class="text-sm font-medium"><b>Description:</b> {{portfolio.portfolioDescription}}</p>
            </div>
            <div class="overflow-y-auto max-h-80">
                <table class="w-full text-center text-xs lg:text-base">
                    <thead class="border-b-2 border-navy-950">
                        <tr>
                            <th class="text-left">Stock Ticker <br class="lg:hidden"><span class="text-xs lg:text-sm font-medium">(Symbol | Sector)</span></th>
                            <th>Date Bought</th>
                            <th>Position</th>
                            <th>Current Price</th>
                            <th>Bought Price</th>
                            <th>P&L</th>
                        </tr>
                    </thead>
                    <tbody v-for="(transactions, stockTicker) in portfolioStocks" :key="stockTicker">
                        <tr class="border-b border-navy-950">
                            <td colspan="6" class="font-semibold text-left">
                                {{stockTicker}}
                                <span class="inline-flex items-center justify-center px-2 h-6 mx-2 bg-navy-150 rounded-lg text-xs lg:text-sm font-medium">
                                    {{ stockInfo[stockTicker].symbol }}
                                </span>
                                <span class="text-xs lg:text-sm">{{ stockInfo[stockTicker].sector }}</span>
                            </td>
                        </tr>
                        <tr v-for="info in transactions">
                            <td></td>
                            <td>{{info.dateBought}}</td>
                            <td>{{info.quantity}}</td>
                            <td>{{(stockInfo[stockTicker].eod).toFixed(2)}}</td>
                            <td>{{info.stockBoughtPrice.toFixed(2)}}</td>
                            <td :class="(stockInfo[stockTicker].eod - info.stockBoughtPrice) < 0 ? 'text-red-500' : 'text-green-500'">{{Math.abs(stockInfo[stockTicker].eod - info.stockBoughtPrice).toFixed(2)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';
    import axios from "axios";

    const props = defineProps({
        portfolio: {
            type: Object,
            required: true,
        }
    })

    function formatDate(inputDate) {
        const date = new Date(inputDate); // Parse the input date string
        const day = date.getDate().toString().padStart(2, '0'); // Get the day and pad with leading zeros if necessary
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month (months are zero-based) and pad with leading zeros if necessary
        const year = date.getFullYear(); // Get the full year

        return `${day}/${month}/${year}`;
    }

    // Format the date and store it in the formattedDate variable
    const formattedDate = formatDate(props.portfolio.dateCreated);


</script>
  

<script>

    export default {
        name : "PortfolioBreakdown",
        components: {
        
        },
        data() {
            return {
                portfolioStocks: {},
                stockInfo : {}
            };
        },
        async mounted() {
            axios.get(`http://localhost:5000/portfolio/${this.portfolio.portfolioId}`)
            .then(response => {
                // Handle the response data here
                // console.log(response.data.portStock);
                this.portfolioStocks = response.data.portStock

                let stocks = Object.keys(response.data.portStock)

                for (let stock of stocks) {

                    this.stockInfo[stock] = {symbol : "", sector: "", eod : 0}

                    axios.get(`http://localhost:5000/stock/${stock}/companyOverview`)
                    .then(response => {
                        // console.log(response.data.country)

                        this.stockInfo[stock].symbol = response.data.country
                        this.stockInfo[stock].sector = response.data.sector

                        axios.get(`http://localhost:5000/stockprice/eodprice/${stock}`)
                        .then(response => {
                            // console.log(response.data["4. close"])

                            this.stockInfo[stock].eod = response.data["4. close"]

                        }) 
                    })
                    
                }
                
            })
            .catch(error => {
                // Handle any errors that occurred during the request
                console.error(error);
            });

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