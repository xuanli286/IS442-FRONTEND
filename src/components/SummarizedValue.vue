<template>
    <div class="white-card grid grid-rows-2 grid-cols-5 gap-[5%] text-center mb-5">
        <div class="col-span-5 flex">
            <p v-if="isOverview" class="font-semibold text-blue-950">Portfolio Overview</p>
            <p class="ml-auto"><span class="font-semibold">Currency:</span> SGD</p>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-chart-pie fa-xl"></i></div>
            <div>
                <p class="text-graybrown">Portfolio Value</p>
                <p class="font-bold text-navy-950">{{Math.abs(portfolioValue).toFixed(2)}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center ">
            <div><i class="fa-solid fa-scale-unbalanced-flip fa-xl"></i></div>
            <div>
                <p class="text-graybrown">Unrealised P&L</p>
                <p class="font-bold" :class="unrealisedPnL < 0 ? 'text-red-500' : 'text-green-500'">{{Math.abs(unrealisedPnL).toFixed(2)}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-receipt fa-xl"></i></div>
            <div>
                <p class="text-graybrown">Realised P&L</p>
                <p class="font-bold" :class="realisedPnL < 0 ? 'text-red-500' : 'text-green-500'">{{Math.abs(realisedPnL).toFixed(2)}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-piggy-bank fa-xl"></i></div>
            <div>
                <p class="text-graybrown">Buying Power</p>
                <p class="font-bold">{{Math.abs(buyingpower).toFixed(2)}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-calendar-check fa-xl"></i></div>
            <div>
                <p class="text-graybrown">Daily P&L</p>
                <p class="font-bold" :class="dailyPnL < 0 ? 'text-red-500' : 'text-green-500'">{{Math.abs(dailyPnL).toFixed(2)}}</p>
            </div>
        </div>
    </div>

</template>

<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        isOverview: {
            type: Boolean,
            required: true,
        },
    })
</script>

<script>

export default {
    data(){
        return {
            portfolioId: "someID",
            portfolioName: "Portfolio 1",
            portfolioValue: 8888.88,
            unrealisedPnL: 10.00,
            realisedPnL: 10.00,
            buyingpower: 1000.00,
            dailyPnL: -1.23,
        }
    },
    computed: {

    },
    methods: {

    },
    created() {

    }

}
</script>

<style scoped>
  h3 {
    @apply
    text-4xl
  }
  h4 {
    @apply
    text-2xl
  }
  i {
    @apply
    text-navy-950
  }
</style>