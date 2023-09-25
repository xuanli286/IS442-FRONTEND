<template>
    <div class="white-card grid grid-rows-2 grid-cols-5 gap-[5%] text-center mb-5">
        <div class="col-span-5">
            <p class="text-right"><span class="font-semibold">Currency:</span> {{currency}}</p>
        </div>
        
        <div class="flex justify-around items-center">
            <div><i class="bi bi-pie-chart-fill text-2xl"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="bi bi-pie-chart-fill text-2xl"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="bi bi-pie-chart-fill text-2xl"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="bi bi-pie-chart-fill text-2xl"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
        <div class="flex justify-around items-center">
            <div><i class="bi bi-pie-chart-fill text-2xl"></i></div>
            <div>
                <p>Portfolio Value</p>
                <p>{{portfolioValue}}</p>
            </div>
        </div>
    </div>

</template>


<script>

export default {
    data(){
        return {
            portfolioId: "someID",
            portfolioName: "Portfolio 1",
            portfolioValue: 88888888.88,
            unrealisedPnL: 0,
            currency: "SGD"
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