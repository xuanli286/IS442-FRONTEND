<template>
  <div class="relative">
    <Line class="w-100 h-[400px] cursor-crosshair" :data="chartData" :options="chartOptions" />
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

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const startDate = new Date(new Date(props.date).getFullYear(), new Date(props.date).getMonth(), 1);
    const currentDatePointer = new Date(startDate);

    if (props.display == "monthly") {
      while (currentDatePointer <= new Date(currentYear, 11, 31)) {
        let month = currentDatePointer.toLocaleString('default', { month: 'short' });
        let year = currentDatePointer.getFullYear();
        let monthYearString = `${month} ${year}`;
        labels.push(monthYearString);
        currentDatePointer.setMonth(currentDatePointer.getMonth() + 1);
      }
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
    }
    else {
      while (currentDatePointer <= new Date(currentYear, 11, 31)) {
        let quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        let year = currentDatePointer.getFullYear();
        for (let quarter of quarters) {
          labels.push(`${quarter} ${year}`);
        }
        currentDatePointer.setFullYear(currentDatePointer.getFullYear() + 1);
      }
      for (const [year, data] of Object.entries(props.dataset)) {
        for (const [portfolioName, portfolioData] of Object.entries(data)) {
          if (!combinedData[portfolioName]) {
            combinedData[portfolioName] = [];
            tooltip[portfolioName] = [];
          }
          combinedData[portfolioName].push(...portfolioData.quarterly.value);
          tooltip[portfolioName].push(...portfolioData.quarterly.tooltip);
        }
      }
    }

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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
        onHover: function(e) {
          e.native.target.classList.add('cursor-pointer');
        },
        onLeave: function(e) {
          e.native.target.classList.remove('cursor-pointer');
        }
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
        suggestedMin: Math.min(...chartData.value.datasets.map((dataset) => Math.min(...dataset.data))),
        suggestedMax: Math.max(...chartData.value.datasets.map((dataset) => Math.max(...dataset.data))),
        grid: {
          drawBorder: true,
          color: (context) => context.tick.value === 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.1)',
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