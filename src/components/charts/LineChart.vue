<template>
  <Line :data="chartData" />
  {{ portfoliosValue }}
</template>


<script setup>
  import { Line } from 'vue-chartjs';
  import { defineProps, ref } from 'vue';
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

  const props = defineProps({ 
    portfoliosValue: {
      type: Object,
      required: true,
    }
  })

  const chartData = ref({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#f87979',
        data: [40, 39, 10, 40, 39, 80, 40],
      },
      { 
        label: 'Data Two',
        backgroundColor: '#f87978',
        data: [40, 39, 10, 40, 39, 80, 40],
      }
    ],
  });

  const chartOptions = {
    responsive: true,
  };
</script>