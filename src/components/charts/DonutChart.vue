<template>
    <Doughnut :data="chartData" :options="chartOptions"/>
  </template>
  
<script>
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
    import { Doughnut } from 'vue-chartjs'
    
    ChartJS.register(ArcElement, Tooltip, Legend)
    
    export default {
        name: 'DonutChart',
        components: {
        Doughnut
        },
        data() {
            return {
                chartData: {
                    labels: ['Healthcare', 'Energy', 'Financials', 'Information Technology', 'Industrials'],
                    datasets: [
                        {
                        backgroundColor: ["#2d455c", '#7a9cb8', '#314F76', '#3F6392', "#587e9d"],
                        data: [40, 20, 80, 10, 30]
                        }
                    ]
                },
                chartOptions: {
                    responsive: true,
                    maintainaspectratio: true,
                }
            }
        }
    }
</script>