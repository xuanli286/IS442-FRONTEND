<template>
    <div>
        <div class="white-card mb-5">
            <h4 class="font-semibold">My Porftolio</h4>
        </div>

        <div class="h-1/3 w-1/3 white-card">
            <DonutChart />
        </div>
    </div>
</template>

<script>
import DonutChart from '../components/charts/DonutChart.vue';

export default {
    name: 'IndividualStock',
    components: {
        DonutChart,
    },
    data(){
        return {
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
</style>