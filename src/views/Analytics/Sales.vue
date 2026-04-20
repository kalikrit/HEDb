<template>
  <div class="space-y-6">
    <!-- Заголовок и фильтр -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Аналитика продаж</h1>
      <DateRangePicker @update="onDateRangeChange" />
    </div>

    <!-- KPI карточки -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <DollarSign class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Выручка</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(filteredRevenue) }}
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <ShoppingBag class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Заказы</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ filteredOrdersCount }}</p>
          </div>
        </div>
      </Card>
      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <TrendingUp class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Средний чек</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(filteredAverageOrderValue) }}
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Графики (только круговая диаграмма, линейный отключён) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <Card title="Динамика продаж">
          <div class="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
            <p class="text-gray-500">Линейный график временно отключен</p>
          </div>
        </Card>
      </div>
      <div>
        <Card title="Заказы по статусам">
          <StatusPieChart :data="statusCounts" />
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-vue-next";
import { useOrdersStore } from "@/stores/orders";
import { formatCurrency } from "@/utils/formatters";
import dayjs from "dayjs";
import Card from "@/components/ui/Card.vue";
import DateRangePicker from "@/components/ui/DateRangePicker.vue";
import StatusPieChart from "@/components/analytics/StatusPieChart.vue";

const ordersStore = useOrdersStore();
const { getOrders } = storeToRefs(ordersStore);

const startDate = ref("");
const endDate = ref("");

// Отфильтрованные заказы по датам
const filteredOrders = computed(() => {
  if (!startDate.value || !endDate.value) return getOrders.value;
  return getOrders.value.filter(order => {
    const orderDate = dayjs(order.createdAt).format("YYYY-MM-DD");
    return orderDate >= startDate.value && orderDate <= endDate.value;
  });
});

// KPI на основе отфильтрованных заказов
const filteredRevenue = computed(() => filteredOrders.value.reduce((sum, o) => sum + o.total, 0));
const filteredOrdersCount = computed(() => filteredOrders.value.length);
const filteredAverageOrderValue = computed(() => 
  filteredOrdersCount.value ? filteredRevenue.value / filteredOrdersCount.value : 0
);

// Статусы заказов для круговой диаграммы
const statusCounts = computed(() => {
  const counts: Record<string, number> = {};
  for (const order of filteredOrders.value) {
    counts[order.status] = (counts[order.status] || 0) + 1;
  }
  return counts;
});

// Обработчик изменения дат
const onDateRangeChange = (start: string, end: string) => {
  startDate.value = start;
  endDate.value = end;
};

onMounted(() => {
  if (!getOrders.value.length) {
    ordersStore.fetchOrders();
  }
});
</script>