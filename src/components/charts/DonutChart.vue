<template>
    
    <div class="white-card md:doughnut-padding">
        <Doughnut v-if="loaded" :data="chartData" :options="chartOptions"/>
    </div>
    
</template>

<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        isOverview: {
            type: Boolean,
            required: true,
        },
        portfolioId: {
            type: String,
            required: false,
        },
    })
</script>

  
<script>
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
    import { Doughnut } from 'vue-chartjs'
    import axios from "axios";
    import { useUserStore } from "@/stores/useUserStore";
    
    ChartJS.register(ArcElement, Tooltip, Legend)
    
    export default {
        name: 'DonutChart',
        components: {
            Doughnut
        },
        computed: {
            loginUser() {
                const store = useUserStore();
                return store.loginUser;
            },
        },
        data() {
            return {
                loaded: false,
                userId: "",
                chartData: {
                    labels: [],
                    datasets: [
                        {
                        backgroundColor: ["#2d455c", '#7a9cb8', '#314F76', '#3F6392', "#587e9d", "#000000"],
                        data: [],
                        hoverOffset: 4
                        }
                    ]
                },
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                        title: {
                            display: false,
                            text: 'By Sector',
                            font: {
                                size: 30,
                                weight: 'bold',
                            },
                            position: 'top', 
                        },
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 12,
                                    weight: 'medium'
                                }
                            }
                        },
                        tooltip : {
                            backgroundColor : '#192e47',
                            padding : 15,
                            borderColor : '#FFFFFF',
                            borderWidth: 2,
                            titleFont : {
                                size : 13,
                                weight : 'bold'
                            },
                            bodyFont : {
                                size : 20,
                            },
                            boxPadding : 5,
                            callbacks: {
                                label: function(context) {

                                    // console.log(context.dataset.data)
                                    
                                    const totalSum = context.dataset.data.reduce((total, datapoint) => {
                                        return total + datapoint;
                                    });

                                    // console.log(totalSum);

                                    const indiv = (context.parsed / totalSum * 100).toFixed(1);
                                    // console.log(indiv)
                                    return `${indiv}%`;
                                }
                                
                            }
                        }
                    }
                }
            }
        },
        async created() {
            this.userId = this.loginUser.id;

            this.loaded = false;

            let url = `http://localhost:5000/portfolio/getsectorsbyportfolio/${this.portfolioId}`

            if (this.isOverview) {
                url = `http://localhost:5000/portfolio/getsectorsbyuser/${this.userId}`
            }

            // need to change url            
            axios.get(url)
            .then(response => {
                // Handle the response data here
                console.log(response.data);
                const sectorCounts = response.data;

                let i = 0;

                for (const sector in sectorCounts) {
                    this.chartData.labels.push(sector);
                    this.chartData.datasets[0].data[i] = sectorCounts[sector];
                    i++;
                }
                console.log(this.chartData.datasets[0].data);

                this.loaded = true;
                
                
            })
            .catch(error => {
                // Handle any errors that occurred during the request
                console.error(error);
            });
        }

    }
</script>


<style scoped>

.doughnut-padding {
    @apply
    p-5 !important
}

</style>