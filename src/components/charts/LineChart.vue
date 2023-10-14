<template>
  <div>
    <button class="bg-blue-400 text-white rounded-lg p-2 hover:bg-blue-600 hover:font-bold" @click="resetZoom">Zoom Out</button>
    <Line ref="myChartRef" class="cursor-crosshair" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
  import { Line } from 'vue-chartjs';
  import 'chartjs-plugin-zoom';
  import { defineProps, computed, ref, onMounted } from 'vue';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
  );

  const props = defineProps({
    dataset: {
      type: Object,
      required: true,
    },
    display: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    }
  });

  const myChartRef = ref(null);

  const resetZoom = () => {
    myChartRef.value.chart.resetZoom();
  };

  const chartData = computed(() => {
    let currentMonth = new Date().getMonth();
    const labels = [];
    const datapoints = [];
    let count = 0;
    const colors = [
      '#0077c8',
      '#98c4ff',
      '#4e8ef5',
      '#2a65dd',
      '#219ebc',
      '#8ecae6',
      '#b4c5e4',
      '#090c9b',
      '#3c3744',
      '#c8e4ff',
    ];

    const combinedData = {};
    const tooltip = {};
    for (const [year, data] of Object.entries(props.dataset)) {
      for (const [portfolioName, portfolioData] of Object.entries(data)) {
        if (!combinedData[portfolioName]) {
          combinedData[portfolioName] = [];
          tooltip[portfolioName] = [];
        }
        if (year == new Date(props.date).getFullYear()) {
          combinedData[portfolioName].push(...portfolioData.monthly.value.slice(new Date(props.date).getMonth(),));
          tooltip[portfolioName].push(...portfolioData.monthly.tooltip.slice(new Date(props.date).getMonth(),));
        }
        else{
          combinedData[portfolioName].push(...portfolioData.monthly.value);
          tooltip[portfolioName].push(...portfolioData.monthly.tooltip);
        }
      }
    }

    console.log(tooltip)
    console.log(combinedData)

    for (const [key, value] of Object.entries(combinedData)) {
      datapoints.push({
        label: key,
        borderColor: colors[count],
        backgroundColor: colors[count],
        borderWidth: 1,
        radius: 0,
        data: value,
      });
      count++;
    }

    if (props.display == "monthly") {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0,currentMonth);
      for (let month of months) {
        labels.push(month);
      }
    }
    else if (props.display == "quarterly") {
      let quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      for (let quarter of quarters) {
        labels.push(quarter);
      }
    }
    else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      let startDate = new Date(props.date);
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      let currentDatePointer = new Date(startDate);
      while (currentDatePointer <= new Date(currentYear, 11, 31)) {
        const month = currentDatePointer.toLocaleString('default', { month: 'short' });
        const year = currentDatePointer.getFullYear();
        const monthYearString = `${month} ${year}`;
        labels.push(monthYearString);
        currentDatePointer.setMonth(currentDatePointer.getMonth() + 1);
      }
      console.log(datapoints)
    }
    return {
      labels: labels,
      datasets: datapoints,
      tooltip: tooltip,
    };
  });

  const calculatePreviousY = (ctx) => {
    if (ctx.index === 0) {
      return 0;
    }
    const datasetIndex = ctx.datasetIndex;
    const previousDataset = ctx.chart.data.datasets[datasetIndex];
    const previousDataPoint = previousDataset.data[ctx.index - 1];
    return previousDataPoint ? previousDataPoint.y : 0;
  };

  const delayBetweenPoints = 100;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
      },
      tooltip : {
        backgroundColor: '#192e47',
        padding: 15,
        borderColor: '#FFFFFF',
        borderWidth: 2,
        bodyFont: {
          size: 12,
          weight: 'bold',
        },
        position: 'nearest',
        mode: 'index',
        intersect: false,
        external: function(context) {
          const hitRadius = 0.5;
          return {
            x: context.x,
            y: context.y,
            r: hitRadius,
          };
        },
        boxPadding : 5,
        callbacks: {
          label(context) {
            const datasetIndex = context.datasetIndex;
            const datasetLabel = chartData.value.datasets[datasetIndex].label;
            const dataPointValue = `$${context.parsed.y.toFixed(2)}`;
            const tooltipData = chartData.value.tooltip[datasetLabel];
            const dataPoint = tooltipData[context.dataIndex];
            const lines = dataPoint.split('\n');
            if (lines[lines.length - 1] === '') {
              lines.pop();
            }
            return [`${datasetLabel}: ${dataPointValue}`, ...lines];
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          drag: {
            enabled:true,
            backgroundColor: "rgba(71, 117, 174, 0.25)",
            borderColor: "#192e47",
            borderWidth: 2,
          },
          mode: 'x',
        },
      },
      onZoom: function ({ chart }) {
        // Define the zoom threshold for switching to quarterly data
        const quarterlyZoomThreshold = 0.5; // Adjust as needed
        const currentZoomLevel = chart.scales.x._mScale.options._table.zoom;
        
        // Check if zoom level is below the threshold
        if (currentZoomLevel < quarterlyZoomThreshold) {
          // Zoomed out, show yearly or monthly data
          // Implement logic to switch back to yearly or monthly data
        } else {
          // Zoomed in, switch to quarterly data
          // Implement logic to load and display quarterly data
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          font: {
            weight: 'bold',
          }
        },
      },
      y: {
        title: {
          display: true,
          text: 'Unrealised Profit & Loss (in SGD)',
          font: {
            weight: 'bold',
          }
        },
      },
    },
    animations: {
      x: {
        type: 'number',
        easing: 'linear',
        duration: 1500,
        from: NaN,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: 1500,
        from: calculatePreviousY,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
    }
  };
</script>