<template>
    <Doughnut :data="chartData" :options="chartOptions"/>
    <!-- {{ chartData.datasets[0].data}}
    {{ chartData.labels}}
    {{ loaded}} -->
</template>
  
<script>
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
    import { Doughnut } from 'vue-chartjs'
    import axios from "axios";
    
    ChartJS.register(ArcElement, Tooltip, Legend)
    
    export default {
        name: 'DonutChart',
        components: {
        Doughnut
        },
        data() {
            return {
                loaded: false,
                chartData: {
                    labels: ["Technology", "Healthcare"],
                    datasets: [
                        {
                        backgroundColor: ["#2d455c", '#7a9cb8', '#314F76', '#3F6392', "#587e9d", "#000000"],
                        data: [1, 1],
                        hoverOffset: 4
                        }
                    ]
                },
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false,
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        },
                        tooltip : {
                            backgroundColor : '#192e47',
                            padding : 15,
                            borderColor : '#FFFFFF',
                            borderWidth: 2,
                            titleFont : {
                                size : 15,
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
                },
                portfolioId : "gg8rAnVNkysRTKe5Pfn9"
            }
        },
        async mounted() {

            // this.loaded = false;

            // need to change url            
            // axios.get(`http://localhost:5000/portfoliostock/getsectorsbyportfolio/${this.portfolioId}`)
            // .then(response => {
            //     // Handle the response data here
            //     console.log(response.data);
            //     const sectorCounts = response.data;

            //     let i = 0;

            //     for (const sector in sectorCounts) {
            //         this.chartData.labels.push(sector);
            //         this.chartData.datasets[0].data[i] = sectorCounts[sector];
            //         i++;
            //     }
            //     console.log(this.chartData.datasets[0].data);

            //     this.loaded = true;
                
                
            // })
            // .catch(error => {
            //     // Handle any errors that occurred during the request
            //     console.error(error);
            // });
        }

    }
</script>