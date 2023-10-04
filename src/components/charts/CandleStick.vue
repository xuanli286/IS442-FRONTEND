<template>
  <div class="white-card">
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      class="h-screen"
      :plugins="plugins"
    />
  </div>
  
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeSeriesScale } from 'chart.js'
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

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
      
      console.log(tooltip.dataPoints[0].label)

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
      chartData: {
        datasets: [ 
          { 
            data: [
              {
                x: new Date("2022-06-01").setHours(0,0,0,0),
                o: 1.25,
                h: 1.35,
                l: 1.00,
                c: 1.10,
                s: [1.25, 1.10]
              },
              {
                x: new Date("2022-06-02").setHours(0,0,0,0),
                o: 1.10,
                h: 1.35,
                l: 1.00,
                c: 1.20,
                s: [1.10, 1.20]
              },
              {
                x: new Date("2022-06-03").setHours(0,0,0,0),
                o: 1.20,
                h: 1.50,
                l: 1.20,
                c: 1.50,
                s: [1.20, 1.50]
              },
              {
                x: new Date("2022-06-04").setHours(0,0,0,0),
                o: 1.50,
                h: 1.80,
                l: 1.20,
                c: 1.40,
                s: [1.50, 1.40]
              },
              {
                x: new Date("2022-06-05").setHours(0,0,0,0),
                o: 1.40,
                h: 2.00,
                l: 1.30,
                c: 1.75,
                s: [1.40, 1.75]
              },
              {
                x: new Date("2022-06-08").setHours(0,0,0,0),
                o: 1.75,
                h: 3.00,
                l: 1.20,
                c: 2.40,
                s: [1.75, 2.40]
              }
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
            beginAtZero: true,
            grace: 1,
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
        },
      },
      plugins: [candlewick, crosshair, customScale],
    }
  }
}
</script>