<template>
    <div class="white-card mb-5">
        <div class="flex items-center mb-8">
            <h4 class="font-semibold">My Portfolio</h4>
            <span class="inline-flex items-center justify-center w-8 h-8 ml-2 bg-gray-300 rounded-full font-semibold">
            {{ Object.keys(portfolioStocks).length }}
            </span>
        </div>
        <div class="border-2 border-black rounded-md p-4">
            <div class="mb-4">
                <h5 class="text-xl font-semibold">{{ portfolio.portfolioName }}</h5>
                <p class="text-sm font-medium">Date Created: {{ formattedDate }}</p>
            </div>
            <table class="table-auto w-full text-center">
                <thead>
                    <tr>
                        <th class="text-left lg:w-1/5">Stock Ticker | Symbol</th>
                        <th>Date Bought</th>
                        <th>Position</th>
                        <th>Current Price</th>
                        <th>Bought Price</th>
                        <th>P&L</th>
                    </tr>
                </thead>
                <tbody v-for="(transactions, stockTicker) in portfolioStocks" :key="stockTicker">
                    <tr>
                        <td class="col-span-6 flex items-center font-semibold">
                            {{stockTicker}} 
                            <span class="inline-flex items-center justify-center px-2 h-6 ml-2 bg-navy-150 rounded-lg text-sm font-medium">
                                {{ stockInfo[stockTicker].symbol }}
                            </span>
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

                    this.stockInfo[stock] = {symbol : "", eod : 0}

                    axios.get(`http://localhost:5000/stock/${stock}/companyOverview`)
                    .then(response => {
                        // console.log(response.data.country)

                        this.stockInfo[stock].symbol = response.data.country

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
  }
  td {
    @apply
    py-2
  }
</style>