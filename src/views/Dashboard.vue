<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Дашборд
    </h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Карточки с метриками -->
      <Card v-for="metric in metrics" :key="metric.title" class="hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="metric.bgColor">
            <component :is="metric.icon" class="w-6 h-6" :class="metric.iconColor" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ metric.title }}</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ metric.value }}</p>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span :class="metric.trendColor">{{ metric.trend }}</span>
          <span class="text-gray-600 dark:text-gray-400 ml-2">с прошлым месяцем</span>
        </div>
      </Card>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- График (заглушка) -->
      <Card title="Продажи">
        <div class="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
          <p class="text-gray-500 dark:text-gray-400">График продаж</p>
        </div>
      </Card>
      
      <!-- Последние заказы -->
      <Card title="Последние заказы">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Заказ #{{ 1000 + i }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Товаров: {{ i + 2 }}</p>
            </div>
            <Badge :variant="i % 3 === 0 ? 'success' : i % 3 === 1 ? 'warning' : 'info'">
              {{ i % 3 === 0 ? 'Доставлен' : i % 3 === 1 ? 'В обработке' : 'Отправлен' }}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-vue-next";
import Card from "@/components/ui/Card.vue";
import Badge from "@/components/ui/Badge.vue";

const metrics = ref([
  {
    title: "Выручка",
    value: "1,234,567 ₽",
    icon: DollarSign,
    bgColor: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-400",
    trend: "+12.5%",
    trendColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Заказы",
    value: "156",
    icon: ShoppingBag,
    bgColor: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    trend: "+8.2%",
    trendColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Клиенты",
    value: "89",
    icon: Users,
    bgColor: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
    trend: "+5.7%",
    trendColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Конверсия",
    value: "3.45%",
    icon: TrendingUp,
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    trend: "-0.8%",
    trendColor: "text-red-600 dark:text-red-400",
  },
]);
</script>