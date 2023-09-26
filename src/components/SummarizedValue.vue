<template>
    <div class="white-card grid grid-rows-2 grid-cols-5 gap-[5%] text-center mb-5">
        <div class="col-span-5 flex">
            <p v-if="isOverview" class="font-semibold text-blue-950">Portfolio Overview</p>
            <p class="ml-auto"><span class="font-semibold">Currency:</span> {{currency}}</p>
        </div>
        
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-chart-pie fa-xl text-blue-950"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-scale-unbalanced-flip fa-xl text-blue-950"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-receipt fa-xl text-blue-950"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-piggy-bank fa-xl text-blue-950"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="fa-solid fa-calendar-check fa-xl text-blue-950"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
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
            portfolioValue: 88888888.88,
            unrealisedPnL: 0,
            realisedPnL: 0,
            currency: "SGD",
            dailyPnL: 0,
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