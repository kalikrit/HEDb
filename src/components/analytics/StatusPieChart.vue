<template>
  <div class="w-full h-80 relative">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps<{ data: Record<string, number> }>();
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const statusLabels: Record<string, string> = {
  pending: "Ожидание",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

const statusColors: Record<string, string> = {
  pending: "#eab308",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const createChart = async () => {
  if (!chartCanvas.value) return;
  await nextTick();
  const labels = Object.keys(props.data).map(key => statusLabels[key] || key);
  const values = Object.values(props.data);
  const backgroundColors = Object.keys(props.data).map(key => statusColors[key] || "#6b7280");
  if (values.every(v => v === 0)) return;

  const chartData = { labels, datasets: [{ data: values, backgroundColor: backgroundColors }] };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } };

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(chartCanvas.value, { type: "pie", data: chartData, options });
};

let timeoutId: ReturnType<typeof setTimeout> | null = null;
watch(() => props.data, (newData) => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (newData && Object.keys(newData).length) {
      createChart();
    }
    timeoutId = null;
  }, 100);
}, { deep: true });

onMounted(() => {
  if (Object.keys(props.data).length) createChart();
});
</script>