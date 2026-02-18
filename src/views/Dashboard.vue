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

    <!-- Карточки с метриками -->
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

    <!-- Графики и таблицы -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- График продаж -->
      <Card title="Продажи за последние 7 дней">
        <div class="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div class="text-center">
            <BarChart3 class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">График продаж</p>
            <p class="text-xs text-gray-400 mt-1">(будет добавлен в следующем обновлении)</p>
          </div>
        </div>
      </Card>

      <!-- Популярные товары -->
      <Card title="Популярные товары">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <Package class="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Товар {{ i }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Продано: {{ 50 + i * 10 }} шт.
                </p>
              </div>
            </div>
            <Badge :variant="i === 1 ? 'success' : i === 2 ? 'primary' : 'gray'">
              {{ i === 1 ? 'Лидер' : i === 2 ? 'Хит' : 'Обычный' }}
            </Badge>
          </div>
        </div>
      </Card>
    </div>

    <!-- Последние заказы -->
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
            <tr v-for="i in 5" :key="i" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                #{{ 1000 + i }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                Клиент {{ i }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatCurrency(1000 + i * 500) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge 
                  :variant="i % 3 === 0 ? 'success' : i % 3 === 1 ? 'warning' : 'info'"
                  :dot="i % 3 === 0"
                >
                  {{ i % 3 === 0 ? 'Доставлен' : i % 3 === 1 ? 'В обработке' : 'Отправлен' }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(new Date(Date.now() - i * 86400000)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, BarChart3 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

const authStore = useAuthStore()
const { getUser: user } = storeToRefs(authStore)

const metrics = [
  {
    title: 'Выручка',
    value: formatCurrency(1234567),
    icon: DollarSign,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    trend: '+12.5%',
    trendColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Заказы',
    value: '156',
    icon: ShoppingBag,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    trend: '+8.2%',
    trendColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Клиенты',
    value: '89',
    icon: Users,
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    trend: '+5.7%',
    trendColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Конверсия',
    value: '3.45%',
    icon: TrendingUp,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    trend: '-0.8%',
    trendColor: 'text-red-600 dark:text-red-400',
  },
]
</script>