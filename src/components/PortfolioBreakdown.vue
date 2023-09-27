<template>
    <div class="white-card mb-5">
        <div class="flex items-center mb-8">
            <h4 class="font-semibold">My Portfolio</h4>
            <span class="inline-flex items-center justify-center w-8 h-8 ml-2 bg-gray-300 rounded-full font-semibold">
            {{ portfolioStocks.length }}
            </span>
        </div>
        <div class="border-2 border-black rounded-md p-4">
            <div class="mb-4">
                <h5 class="text-xl font-semibold">{{ portfolioName }}</h5>
                <p class="text-sm font-medium">Date Created: {{ dateCreated }}</p>
            </div>
            <table class="w-full">
                <thead>
                    <tr class="text-left">
                        <th>Stock Ticker | Symbol</th>
                        <th>Position</th>
                        <th>Current Price</th>
                        <th>Cost</th>
                        <th>P&L</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="stock in portfolioStocks" :key="stock">
                        <td>
                            <div class="flex items-center">
                                {{stock.stockTicker}} 
                                <span class="inline-flex items-center justify-center px-2 h-6 ml-2 bg-navy-100 rounded-lg text-sm font-semibold">
                                {{ stock.symbol }}
                            </span>
                            </div>
                        </td>
                        <td>{{ stock.position }}</td>
                        <td>{{ stock.currentPrice }}</td>
                        <td>{{ stock.stockBoughtPrice }}</td>
                        <td>{{ stock.PnL }}</td>
                    </tr>
                </tbody>
                </table>
        </div>
        
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        portfolioId: {
            type: String,
            required: true,
        },
        portfolioName: {
            type: String,
            required: true
        }
    })
</script>
  

<script>


    export default {
        name : "PortfolioBreakdown",
        components: {
        
        },
        data() {
            return {
                dateCreated: "10/10/23",
                
                portfolioStocks: [
                    {
                        stockTicker: "BABA",
                        symbol: "US",
                        position: 10,
                        currentPrice: 95.20,
                        stockBoughtPrice: 100.00,
                        PnL: 10
                    },
                    {
                        stockTicker: "AAPL",
                        symbol: "US",
                        position: 10,
                        currentPrice: 395.20,
                        stockBoughtPrice: 100.00,
                        PnL: 10
                    },
                    {
                        stockTicker: "MSFT",
                        symbol: "US",
                        position: 10,
                        currentPrice: 95.20,
                        stockBoughtPrice: 100.00,
                        PnL: 10
                    },
                    {
                        stockTicker: "BABA",
                        symbol: "US",
                        position: 10,
                        currentPrice: 95.20,
                        stockBoughtPrice: 100.00,
                        PnL: 10
                    },
                ]

            };
        },
        // async mounted() {
        //     axios.get(`http://localhost:5000/portfolio/${portfolioId}`)
        //     .then(response => {
        //         // Handle the response data here
        //         console.log(response.data);
                
                
                
        //     })
        //     .catch(error => {
        //         // Handle any errors that occurred during the request
        //         console.error(error);
        //     });
        // }
            
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