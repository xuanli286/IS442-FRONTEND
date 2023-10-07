<template>
  <div class="white-card">
    <div class="grid grid-cols-3 mb-5 items-center">
      <div>
        <button class="btn text-xs md:text-sm md:font-medium mx-2 pb-1" @click="selectedTimeRange('dailyprice')" :class="{'border-b-4 border-navy-950' : timeRange == 'dailyprice'}">Daily</button>
        <button class="btn text-xs md:text-sm md:font-medium mx-2 pb-1" @click="selectedTimeRange('weeklyprice')" :class="{'border-b-4 border-navy-950' : timeRange == 'weeklyprice'}">Weekly</button>
        <button class="btn text-xs md:text-sm md:font-medium mx-2 pb-1" @click="selectedTimeRange('monthlyprice')" :class="{'border-b-4 border-navy-950' : timeRange == 'monthlyprice'}">Monthly</button>
      </div>
      <div class="flex justify-center items-center">
        <button class="btn bg-navy-950 text-white text-xs md:text-sm rounded-lg p-1 md:py-2 md:px-3 font-medium" @click="toggleDateRange">{{ defaultPlaceholder }}</button>
        <div class="overlay" v-show="showDateRange" @click="closeOverlay">
          <div class="white-card">
          <input type="date" :min="startDate" :max="endDate" v-model="sDate" class="border-2 rounded-lg border-navy-950 p-1 md:p-2 text-xs md:text-sm md:mr-2">
          -
          <input type="date" :min="sDate" :max="endDate" v-model="eDate" class="border-2 rounded-lg border-navy-950 p-1 md:p-2 text-xs md:text-sm md:ml-2" >
          <button class="btn bg-navy-950 text-white text-xs rounded-lg p-1 md:py-2 md:px-3" @click="updateChart">Apply</button>
          <button class="btn bg-navy-950 text-white text-xs rounded-lg p-1 md:py-2 md:px-3" @click="clearDate">Clear</button>
        </div>
        </div>
        
      </div>
      <div class="flex justify-end">
        <!-- <button class="btn bg-navy-950 text-white text-xs rounded-lg p-1 md:py-2 md:px-3" @click="clearDate">Clear</button> -->
        <button class="btn bg-navy-950 text-white text-xs md:text-sm rounded-lg p-1 md:py-2 md:px-3 font-medium" @click="resetZoomChart">Reset Zoom</button>
      </div>
    </div>
    <div>
      <Bar id="myChart" ref="myChart" :options="chartOptions" :data="chartData" :plugins="plugins" v-if="loaded"/>
    </div>
  </div>
  
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeSeriesScale } from 'chart.js'
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from "axios";
// import DatePicker from "@/components/DatePicker.vue";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeSeriesScale, zoomPlugin);

const customScale = {
  id: "customScale",
  afterDatasetsDraw(chart, args, options) {
    const {ctx, data, tooltip, chartArea: {top, bottom, left, right}, scales: {x, y}} = chart;

    ctx.save()

    for (let i = 0; i < data.datasets[0].data.length; i++) {
      ctx.textAlign = "center";
      ctx.font = "12px sans-serif"
      ctx.fillStyle = "#192e47"
      ctx.fillText(new Date(data.datasets[0].data[i].x).toLocaleDateString("en-GB"), x.getPixelForValue(data.datasets[0].data[i].x), bottom + 25)
    }

  }
}

const candlewick = {
  id: "candlewick",
  beforeDatasetsDraw(chart) {
    const {ctx, data, scales: {x, y}} = chart;

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle= '#373737';

    for (let i = 0; i < data.datasets[0].data.length; i++) {
      ctx.beginPath();
      ctx.moveTo(chart.getDatasetMeta(0).data[i].x, chart.getDatasetMeta(0).data[i].y);
      ctx.lineTo(chart.getDatasetMeta(0).data[i].x, y.getPixelForValue(data.datasets[0].data[i].h));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(chart.getDatasetMeta(0).data[i].x, chart.getDatasetMeta(0).data[i].y);
      ctx.lineTo(chart.getDatasetMeta(0).data[i].x, y.getPixelForValue(data.datasets[0].data[i].l));
      ctx.stroke();
    }
  }
}

const crosshair = {
  id: "crosshair",
  afterDatasetsDraw(chart) {

    const {ctx, data, tooltip, chartArea: {top, bottom, left, right, width, height}, scales: {x, y}} = chart;

    if (tooltip._active && tooltip._active.length) {

      const activePoint = tooltip._active[0];

      ctx.setLineDash([3,3]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#192e47";

      function lines(startX, startY, endX, endY) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();
      }

      lines(activePoint.element.x, top, activePoint.element.x, bottom)
      lines(left, y.getPixelForValue(tooltip.dataPoints[0].raw.c), right, y.getPixelForValue(tooltip.dataPoints[0].raw.c))

      ctx.setLineDash([])

      // crosshair label y-axis
      ctx.beginPath();
      ctx.fillRect(0, y.getPixelForValue(tooltip.dataPoints[0].raw.c) - 12, left, 24)

      // crosshair label x-axis
      ctx.beginPath();
      const textWidth = ctx.measureText(tooltip.dataPoints[0].raw.x).width + 10
      ctx.fillRect(x.getPixelForValue(tooltip.dataPoints[0].raw.x) - (textWidth/2), top + height + 5, textWidth, 24)

      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tooltip.dataPoints[0].raw.c, left/2, y.getPixelForValue(tooltip.dataPoints[0].raw.c))
      
      // console.log(tooltip.dataPoints[0].label)

      ctx.fillText(tooltip.dataPoints[0].label, x.getPixelForValue(tooltip.dataPoints[0].raw.x), top + height + 15)


      chart.canvas.style.cursor = 'crosshair'
    } else {
      chart.canvas.style.cursor = 'default'
    }
  }
}

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    stockTicker: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loaded: false,
      startDate: "",
      endDate: "",
      sDate: "",
      eDate: "",
      defaultPlaceholder: "Select Date Range",
      showDateRange: false,
      timeRange: "dailyprice",
      chartData: {
        datasets: [ 
          { 
            data: [
              // {
              //   x: new Date("2022-06-01").setHours(0,0,0,0),
              //   o: 312.3,
              //   h: 314.299,
              //   l: 309.69,
              //   c: 312.79,
              //   s: [312.3, 312.79]
              // },
              // {
              //   x: new Date("2022-06-02").setHours(0,0,0,0),
              //   o: 1.10,
              //   h: 1.35,
              //   l: 1.00,
              //   c: 1.20,
              //   s: [1.10, 1.20]
              // },
              // {
              //   x: new Date("2022-06-03").setHours(0,0,0,0),
              //   o: 1.20,
              //   h: 1.50,
              //   l: 1.20,
              //   c: 1.50,
              //   s: [1.20, 1.50]
              // },
              // {
              //   x: new Date("2022-06-04").setHours(0,0,0,0),
              //   o: 1.50,
              //   h: 1.80,
              //   l: 1.20,
              //   c: 1.40,
              //   s: [1.50, 1.40]
              // },
              // {
              //   x: new Date("2022-06-05").setHours(0,0,0,0),
              //   o: 1.40,
              //   h: 2.00,
              //   l: 1.30,
              //   c: 1.75,
              //   s: [1.40, 1.75]
              // },
              // {
              //   x: new Date("2022-06-08").setHours(0,0,0,0),
              //   o: 1.75,
              //   h: 3.00,
              //   l: 1.20,
              //   c: 2.40,
              //   s: [1.75, 2.40]
              // }
            ],   
            backgroundColor: (ctx) => {

              const {raw: {o, c}} = ctx

              let color;

              if (c >= o) {
                color = "#16a34a";
              } else {
                color = "#ef4444";
              }
              return color;

            },
            borderColor: "#192e47",
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        parsing: {
          xAxisKey: "x",
          yAxisKey: "s"
        },
        layout: {
          padding: {
            bottom: 25
          }
        },
        scales: {
          x: {
            type: "timeseries",
            time: {
              unit: "day",
              tooltipFormat: 'dd MMM, yyyy'
            },
            grid: {
              display: false
            },
            ticks: {
              display: false
            },
          },
          y: {
            beginAtZero: false,
          },
        },
        borderWidth: 1,
        borderSkipped: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            padding : 15,
            borderColor : '#FFFFFF',
            borderWidth: 2,
            titleFont : {
                size : 13,
                weight : 'bold',
                family: "'Helvetica Neue', 'Helvetica', 'Arial', 'FontAwesome', sans-serif",
            },
            bodyFont : {
                size : 15,
            },
            boxPadding : 5,
            callbacks: {
              afterTitle: (ctx) => {
                if (ctx[0].raw.o <= ctx[0].raw.c) {
                  return `\uf062 ${this.stockTicker}`
                }
                return `\uf063 ${this.stockTicker}`
              },
              beforeBody: (ctx) => {
                const bodyArray = [
                  `Open: ${ctx[0].raw.o.toFixed(2)}`,
                  `High: ${ctx[0].raw.h.toFixed(2)}`,
                  `Low: ${ctx[0].raw.l.toFixed(2)}`,
                  `Close: ${ctx[0].raw.c.toFixed(2)}`
                ];
                return bodyArray
              },
              label: (ctx) => {
                return "";
              }
            }
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "x"// only move left & right
            },
            zoom: {
              mode: "x",
              wheel: {
                enabled: true,
              },
              drag: {
                enabled:true,
                backgroundColor: "rgba(71, 117, 174, 0.25)",
                borderColor: "#192e47",
                borderWidth: 2,
                modifierKey: "shift"
              }
            },
          },
        },
      },
      plugins: [candlewick, crosshair, customScale],
    }
  },
  created() {

    console.log(this.timeRange)

    axios.get(`http://localhost:5000/stockprice/${this.timeRange}/${this.stockTicker}`)
    .then(response => {

      this.loaded = false;

      const stockPriceList = response.data.stockPriceList;

      const stDate = new Date(stockPriceList[stockPriceList.length - 1].stockDate)
      const eDate = new Date(stockPriceList[0].stockDate)
      const twoWeeksBeforeEDate = new Date(eDate.getTime() - 14 * 24 * 60 * 60 * 1000);

      const standardSDate = `${stDate.getFullYear()}-${String(stDate.getMonth() + 1).padStart(2,'0')}-${String(stDate.getDate()).padStart(2,'0')}`

      const standardEDate = `${eDate.getFullYear()}-${String(eDate.getMonth() + 1).padStart(2,'0')}-${String(eDate.getDate()).padStart(2,'0')}`

      this.startDate = standardSDate
      this.endDate = standardEDate

      if (twoWeeksBeforeEDate < stDate) {
        this.chartOptions.scales.x.min = standardSDate
      } else {
        this.chartOptions.scales.x.min = `${twoWeeksBeforeEDate.getFullYear()}-${String(twoWeeksBeforeEDate.getMonth() + 1).padStart(2,'0')}-${String(twoWeeksBeforeEDate.getDate()).padStart(2,'0')}`
      }

      this.chartOptions.scales.x.max = standardEDate

      // need to reconstruct chartData

      for(let i= 0; i < stockPriceList.length; i++) {

        let stockPriceObj = {}

        stockPriceObj.x = new Date(stockPriceList[i].stockDate).setHours(0,0,0,0)
        stockPriceObj.o = stockPriceList[i]["1. open"]
        stockPriceObj.h = stockPriceList[i]["2. high"]
        stockPriceObj.l = stockPriceList[i]["3. low"]
        stockPriceObj.c = stockPriceList[i]["4. close"]
        stockPriceObj.s = [stockPriceList[i]["1. open"], stockPriceList[i]["4. close"]]

        this.chartData.datasets[0].data[i] = stockPriceObj

      }

      this.loaded = true     
        
    })
    .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error);
    });
  },
  methods: {
    resetZoomChart() {
      this.$refs.myChart.chart.resetZoom()
    },
    selectedTimeRange(selectedTimeRange) {

      if (this.timeRange === selectedTimeRange) {
        this.timeRange = null
      } else {
        this.timeRange = selectedTimeRange
      }
      // this.fetchStockData()
    },
    clearDate() {
      this.sDate = "",
      this.eDate = ""
      this.$refs.myChart.chart.options.scales.x.min = this.startDate;
      this.$refs.myChart.chart.options.scales.x.max = this.endDate;
      this.$refs.myChart.chart.update(); // Update the chart
      this.showDateRange = false;
      this.defaultPlaceholder = "Select Date Range"

    },
    updateChart() {
      this.$refs.myChart.chart.options.scales.x.min = this.sDate;
      this.$refs.myChart.chart.options.scales.x.max = this.eDate;
      this.$refs.myChart.chart.update(); // Update the chart
      this.showDateRange = false;
      this.defaultPlaceholder = `${this.sDate} - ${this.eDate}`
    },
    toggleDateRange() {
      this.showDateRange = !this.showDateRange;
    },
    closeOverlay(event) {
      if (event.target === event.currentTarget) {
        this.showDateRange = false;
      }
    },
    // fetchStockData() {

    //   console.log(this.timeRange)
    //   console.log(`http://localhost:5000/stockprice/${this.timeRange}/${this.stockTicker}`)

    //   axios.get(`http://localhost:5000/stockprice/${this.timeRange}/${this.stockTicker}`)
    //   .then(response => {

    //     this.loaded = false;

    //     // need to reconstruct chartData

    //     const stockPriceList = response.data.stockPriceList;

    //     for(let i= 0; i < stockPriceList.length; i++) {

    //       let stockPriceObj = {}

    //       stockPriceObj.x = new Date(stockPriceList[i].stockDate).setHours(0,0,0,0)
    //       stockPriceObj.o = stockPriceList[i]["1. open"]
    //       stockPriceObj.h = stockPriceList[i]["2. high"]
    //       stockPriceObj.l = stockPriceList[i]["3. low"]
    //       stockPriceObj.c = stockPriceList[i]["4. close"]
    //       stockPriceObj.s = [stockPriceList[i]["1. open"], stockPriceList[i]["4. close"]]

    //       this.chartData.datasets[0].data[i] = stockPriceObj

    //     }

    //     // console.log(this.chartData.datasets[0].data)

    //     this.loaded = true
        
          
    //   })
    //   .catch(error => {
    //       // Handle any errors that occurred during the request
    //       console.error(error);
    //   });

    // }
  },
}
</script>


<style scoped>

#myChart {
  height: 500px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's on top of other content */
}

</style>