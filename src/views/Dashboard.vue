<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Добро пожаловать, {{ user?.name || 'Гость' }}! 👋
      </h1>
      <div class="flex items-center space-x-2">
        <Badge variant="success" dot>Система работает</Badge>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ formatDate(new Date()) }}
        </span>
      </div>
    </div>

    <!-- Карточки с метриками (реальные данные из заказов) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card v-for="metric in metrics" :key="metric.title" class="hover:shadow-lg transition-shadow">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ metric.title }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ metric.value }}
            </p>
            <p class="text-sm mt-2" :class="metric.trendColor">
              {{ metric.trend }}
              <span class="text-gray-500 dark:text-gray-400 ml-1">с прошлым месяцем</span>
            </p>
          </div>
          <div class="p-3 rounded-full" :class="metric.bgColor">
            <component :is="metric.icon" class="w-6 h-6" :class="metric.iconColor" />
          </div>
        </div>
      </Card>
    </div>

    <!-- График продаж и популярные товары -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- График продаж за последние 7 дней (линейный график) -->
      <Card title="Продажи за последние 7 дней">
        <SalesChart :data="last7DaysSales" v-if="last7DaysSales.length" />
        <div v-else class="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p class="text-gray-500">Нет данных за последние 7 дней</p>
        </div>
      </Card>

      <!-- Популярные товары (топ-5 по выручке из оплаченных заказов) -->
      <Card title="Популярные товары">
        <div class="space-y-4">
          <div v-for="(product, idx) in topProducts" :key="product.id" class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <Package class="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ product.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Продано: {{ product.quantity }} шт.
                </p>
              </div>
            </div>
            <Badge :variant="idx === 0 ? 'success' : idx === 1 ? 'primary' : 'gray'">
              {{ idx === 0 ? 'Лидер' : idx === 1 ? 'Хит' : 'Обычный' }}
            </Badge>
          </div>
          <div v-if="topProducts.length === 0" class="text-center py-4 text-gray-500">
            Нет данных по товарам
          </div>
        </div>
      </Card>
    </div>

    <!-- Последние заказы (5 последних) -->
    <Card title="Последние заказы">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">№</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Клиент</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Сумма</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ order.orderNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ order.customer.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getStatusVariant(order.status)" :dot="order.status === 'delivered'">
                  {{ getStatusLabel(order.status) }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(order.createdAt) }}
              </td>
            </tr>
            <tr v-if="recentOrders.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">Нет заказов</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { DollarSign, ShoppingBag, Users, TrendingUp, Package } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useOrdersStore } from "@/stores/orders";
import { formatCurrency, formatDate } from "@/utils/formatters";
import dayjs from "dayjs";
import Card from "@/components/ui/Card.vue";
import Badge from "@/components/ui/Badge.vue";
import SalesChart from "@/components/analytics/SalesChart.vue";

const authStore = useAuthStore();
const ordersStore = useOrdersStore();

const { getUser: user } = storeToRefs(authStore);
const { getOrders } = storeToRefs(ordersStore);

// Оплаченные заказы (для выручки и среднего чека)
const paidOrders = computed(() => getOrders.value.filter(order => order.paymentStatus === 'paid'));

// Метрики
const paidRevenue = computed(() => paidOrders.value.reduce((sum, order) => sum + order.total, 0));
const totalOrdersCount = computed(() => getOrders.value.length);
const uniqueCustomers = computed(() => new Set(getOrders.value.map(order => order.customer.id)).size);
const avgOrderValue = computed(() => paidOrders.value.length ? paidRevenue.value / paidOrders.value.length : 0);

// Можно добавить тренды (заглушки, можно реализовать позже)
const metrics = computed(() => [
  {
    title: 'Выручка (оплаченные)',
    value: formatCurrency(paidRevenue.value),
    icon: DollarSign,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    trend: '+12.5%',
    trendColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Всего заказов',
    value: totalOrdersCount.value,
    icon: ShoppingBag,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    trend: '+8.2%',
    trendColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Клиенты',
    value: uniqueCustomers.value,
    icon: Users,
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    trend: '+5.7%',
    trendColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Средний чек (оплаченные)',
    value: formatCurrency(avgOrderValue.value),
    icon: TrendingUp,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    trend: '-0.8%',
    trendColor: 'text-red-600 dark:text-red-400',
  },
]);

// Данные для графика (последние 7 дней, по оплаченным заказам)
const last7DaysSales = computed(() => {
  const end = dayjs();
  const start = end.subtract(7, 'day');
  const days = [];
  for (let d = start; d.isBefore(end) || d.isSame(end, 'day'); d = d.add(1, 'day')) {
    days.push(d.format('YYYY-MM-DD'));
  }
  const revenueByDay: Record<string, number> = {};
  const ordersByDay: Record<string, number> = {};
  for (const order of paidOrders.value) {
    const date = dayjs(order.createdAt).format('YYYY-MM-DD');
    revenueByDay[date] = (revenueByDay[date] || 0) + order.total;
    ordersByDay[date] = (ordersByDay[date] || 0) + 1;
  }
  return days.map(date => ({
    date,
    revenue: revenueByDay[date] || 0,
    orders: ordersByDay[date] || 0,
  }));
});

// Топ-5 товаров по выручке из оплаченных заказов
const topProducts = computed(() => {
  const productMap = new Map<string, { id: string; name: string; quantity: number; revenue: number }>();
  for (const order of paidOrders.value) {
    for (const item of order.items) {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.totalPrice;
      } else {
        productMap.set(item.productId, {
          id: item.productId,
          name: item.productName,
          quantity: item.quantity,
          revenue: item.totalPrice,
        });
      }
    }
  }
  return Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
});

// Последние 5 заказов (по дате создания)
const recentOrders = computed(() => [...getOrders.value]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5)
);

// Хелперы для статусов
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Ожидание',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  };
  return map[status] || status;
};

const getStatusVariant = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };
  return map[status] || 'gray';
};

// Загрузка данных при монтировании
onMounted(() => {
  if (!getOrders.value.length) {
    ordersStore.fetchOrders();
  }
});
</script>