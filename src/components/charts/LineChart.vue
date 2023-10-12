<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
  import { Line } from 'vue-chartjs';
  import { defineProps, computed } from 'vue';
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
    for (const [year, data] of Object.entries(props.dataset)) {
      for (const [portfolioName, portfolioData] of Object.entries(data)) {
        if (!combinedData[portfolioName]) {
          combinedData[portfolioName] = [];
        }
        if (year == new Date(props.date).getFullYear()) {
          combinedData[portfolioName].push(...portfolioData.monthly.slice(new Date(props.date).getMonth(),));
        }
        else{
          combinedData[portfolioName].push(...portfolioData.monthly);
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
      let currentDatePointer = new Date(props.date);
      while (currentDatePointer <= new Date()) {
        const month = currentDatePointer.toLocaleString('default', { month: 'short' });
        const year = currentDatePointer.getFullYear();
        const monthYearString = `${month} ${year}`;
        labels.push(monthYearString);
        currentDatePointer.setMonth(currentDatePointer.getMonth() + 1);
      }
    }
    return {
      labels: labels,
      datasets: datapoints,
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
          weight: 'bold'
        },
        boxPadding : 5,
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