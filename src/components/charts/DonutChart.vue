<template>
    
    <div class="white-card md:doughnut-padding">
        <div class="chart-container">
            <Doughnut v-if="loaded" :data="chartData" :options="chartOptions" :plugins="plugins"/>
            <!-- <div v-if="haveSector" class="center-text text-xs sm:text-sm md:text-lg lg:text-2xl">
                By Sector
            </div> -->
           
        </div>
    </div>
    
</template>
  
<script>
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
    import { Doughnut } from 'vue-chartjs'
    import axios from "axios";
    import { useUserStore } from '@/stores/useUserStore';
    
    ChartJS.register(ArcElement, Tooltip, Legend)

    const donutLabel = {
        id: "donutLabel",

        beforeDatasetsDraw(chart, args, options) {

            const { ctx, chartArea, font } = chart;
            const text = "By Sector";

            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;


            const fontSize = Math.min(chart.width, chart.height) * 0.10;

            ctx.font = fontSize + "px " + "px bold sans-serif"
            ctx.fillStyle = "#192e47";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const textX = centerX;
            const textY = centerY;

            ctx.fillText(text, textX, textY);
        },

        resize(chart, newChartSize, options) {
            chart.update();
        },
    }


    
    export default {
        name: 'DonutChart',
        components: {
            Doughnut
        },
        props: {
            isOverview: {
                type: Boolean,
                required: true,
            },
            portfolioId: {
                type: String,
                required: false,
            },
        },
        setup() {
            const userID = useUserStore().loginUser.id;

            return { userID }
        },
        data() {
            return {
                loaded: false,
                haveSector: true,
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
                        legend: {
                            display: true,
                            position: 'bottom',
                            // labels: {
                            //     font: {
                            //         size: 10,
                            //         weight: 'medium'
                            //     }
                            // }
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
                                size : 15,
                            },
                            boxPadding : 2,
                            callbacks: {
                                label: function(context) {

                                    // console.log(context.dataset.data)
                                    
                                    const totalSum = context.dataset.data.reduce((total, datapoint) => {
                                        return total + datapoint;
                                    });

                                    // console.log(totalSum);

                                    const indiv = (context.parsed / totalSum * 100).toFixed(2);
                                    // console.log(indiv)
                                    return `${indiv}%`;
                                }
                                
                            }
                        },
                        donutLabel: {
                            font: {
                                size: 20,
                            }
                        },
                    }
                },
                plugins: [donutLabel]
            }
        },
        created() {

            // console.log(this.userID)

            this.loaded = false;

            let url = `http://localhost:5000/portfolio/getsectorsbyportfolio/${this.portfolioId}`

            if (this.isOverview) {
                url = `http://localhost:5000/portfolio/getsectorsbyuser/${this.userID}`
            }

            // need to change url            
            axios.get(url)
            .then(response => {
                // console.log(response.data);
                const sectorCounts = response.data;

                let i = 0;

                for (const sector in sectorCounts) {
                    this.chartData.labels.push(sector);
                    this.chartData.datasets[0].data[i] = sectorCounts[sector];
                    i++;
                }
                // console.log(this.chartData.datasets[0].data);

                if (this.chartData.datasets[0].data.length == 0) {
                    this.haveSector = false;
                }

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

.chart-container {
  position: relative;
}

.center-text {
  position: absolute;
  top: 41%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  text-align: center;
}
</style>