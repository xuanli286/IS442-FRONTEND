<template>
    <div>
        <canvas id="choroplethCanvas">test</canvas>
    </div>
</template>

<style scoped>
#choroplethCanvas {
    width: 100%;
    height: 100%;
}
</style>
<script src='Chart.min.js'></script>

<script>
import * as ChartGeo from 'chartjs-chart-geo'
export default {
    mounted() {
        fetch('https://unpkg.com/world-atlas/countries-50m.json')
            .then((response) => response.json())
            .then((data) => {
                const countries = ChartGeo.topojson.feature(data, data.objects.countries).features;

                const chart = new Chart(
                    document.getElementById("choroplethCanvas").getContext("2d"),
                    {
                        type: 'choropleth',
                        data: {
                            labels: countries.map((d) => d.properties.name),
                            datasets: [{
                                label: 'Countries',
                                data: countries.map((d) => ({ feature: d, value: Math.random() })),
                            }],
                        },
                        options: {
                            showOutline: true,
                            showGraticule: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                projection: {
                                    axis: 'x',
                                    projection: 'equalEarth',
                                },
                            },
                        },
                    }
                );
            });
    },
};
</script>

  