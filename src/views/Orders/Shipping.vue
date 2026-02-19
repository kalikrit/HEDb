<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Доставка</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Управление доставкой заказов
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <div class="text-center">
          <Truck class="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
          <p class="text-2xl font-bold text-gray-900 dark:text-white">24</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Ожидают отправки</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <Package class="w-8 h-8 mx-auto text-yellow-600 dark:text-yellow-400 mb-2" />
          <p class="text-2xl font-bold text-gray-900 dark:text-white">18</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">В пути</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <CheckCircle class="w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
          <p class="text-2xl font-bold text-gray-900 dark:text-white">156</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Доставлено</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <AlertCircle class="w-8 h-8 mx-auto text-red-600 dark:text-red-400 mb-2" />
          <p class="text-2xl font-bold text-gray-900 dark:text-white">3</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Проблемные</p>
        </div>
      </Card>
    </div>

    <Card>
      <div class="p-8 text-center text-gray-500 dark:text-gray-400">
        <Truck class="w-12 h-12 mx-auto mb-3" />
        <h3 class="text-lg font-medium mb-2">Страница доставки в разработке</h3>
        <p>Здесь будет информация о доставке заказов</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Truck, Package, CheckCircle, AlertCircle } from "lucide-vue-next";
import Card from "../../components/ui/Card.vue";
</script>