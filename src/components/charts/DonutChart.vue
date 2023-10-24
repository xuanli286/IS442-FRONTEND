<template>
    
    <div class="relative">
        <Doughnut v-if="loaded" :data="chartData" :options="chartOptions" :plugins="plugins"/>
    </div>

</template>
  
<script>
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
    import { Doughnut } from 'vue-chartjs'
    import axios from "../../axiosConfig";
    import { useUserStore } from '@/stores/useUserStore';
    
    ChartJS.register(ArcElement, Tooltip, Legend)

    const donutLabel = {
        id: "donutLabel",

        beforeDatasetsDraw(chart, args, options) {

            const { ctx, chartArea } = chart;
            const text = "By Sector";

            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;


            const fontSize = Math.min(chart.width, chart.height) * 0.10;

            ctx.font = fontSize + "px " + "px bold inter, sans-serif"
            ctx.fillStyle = "#192e47";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const textX = centerX;
            const textY = centerY;

            ctx.fillText(text, textX, textY);
        },

        resize(chart) {
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
                        backgroundColor: [
                            '#2d455c',
                            '#a8bed1',
                            '#436584',
                            '#d0dce7',
                            '#37526c',
                            '#2d455c',
                            '#192e47', 
                            '#7a9cb8', 
                            '#1d2a3a',
                            "#587e9d",
                            '#314F76', 
                            '#3F6392', 
                        ],
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
                                    const totalSum = context.dataset.data.reduce((total, datapoint) => {
                                        return total + datapoint;
                                    });
                                    const indiv = (context.parsed / totalSum * 100).toFixed(2);
                                    return `${indiv}%`;
                                }
                                
                            }
                        },
                    }
                },
                plugins: [donutLabel]
            }
        },
        created() {

            this.getSectorCounts();

        },
        methods: {
            getSectorCounts() {

                this.loaded = false;

                let url = `http://localhost:5000/portfolio/getsectorsbyportfolio/${this.portfolioId}`

                if (this.isOverview) {
                    url = `http://localhost:5000/portfolio/getsectorsbyuser/${this.userID}`
                }

                this.chartData.labels = []
                this.chartData.datasets[0].data = []
       
                axios.get(url)
                .then(response => {
                    const sectorCounts = response.data;

                    let i = 0;

                    for (const sector in sectorCounts) {
                        this.chartData.labels.push(sector);
                        this.chartData.datasets[0].data[i] = sectorCounts[sector];
                        i++;
                    }

                    this.loaded = true;
                    
                })
                .catch(error => {
                    // Handle any errors that occurred during the request
                    console.error(error);
                });

            }

        },
        watch: {
            portfolioId: "getSectorCounts",
            userID: "getSectorCounts"
        }
    }
</script>


<style scoped>


</style>