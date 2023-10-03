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
  });

  const chartData = computed(() => {
    const datapoints = [];
    let count = 0;
    const colors = [
      '#A1D2FF',
      '#5EB1FF',
      '#4775AE',
      '#2470FF',
      '#0059FF',
      '#0041BA',
      '#003291',
      '#2d455c',
      '#255E93',
      '#192e47',
      '#1d2a3a',
    ];

    for (const [key, value] of Object.entries(props.dataset)) {
      datapoints.push({
        label: key,
        borderColor: colors[count],
        backgroundColor: colors[count],
        data: value,
      });
      count++;
    }

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: datapoints,
    };
  });

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
  };
</script>