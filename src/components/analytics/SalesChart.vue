<template>
  <div class="w-full h-80 relative">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps<{ data: { date: string; revenue: number; orders: number }[] }>();
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = async () => {
  if (!chartCanvas.value) return;
  await nextTick();
  if (!props.data.length) return;

  const labels = props.data.map(item => item.date);
  const revenueData = props.data.map(item => item.revenue);
  const ordersData = props.data.map(item => item.orders);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Выручка (₽)",
        data: revenueData,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        yAxisID: "y",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Количество заказов",
        data: ordersData,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        yAxisID: "y1",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      y: { title: { display: true, text: "Выручка (₽)" }, beginAtZero: true },
      y1: { position: "right", title: { display: true, text: "Заказы" }, beginAtZero: true, grid: { drawOnChartArea: false } },
    },
  };

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(chartCanvas.value, { type: "line", data: chartData, options });
};

let timeoutId: ReturnType<typeof setTimeout> | null = null;
watch(() => props.data, (newData) => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (newData && newData.length) {
      createChart();
    }
    timeoutId = null;
  }, 100);
}, { deep: true });

onMounted(() => {
  if (props.data.length) createChart();
});
</script>