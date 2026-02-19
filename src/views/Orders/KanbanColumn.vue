<template>
  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 min-w-[280px]">
    <!-- Заголовок колонки -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <h3 class="font-medium text-gray-700 dark:text-gray-300">{{ title }}</h3>
        <Badge :variant="badgeVariant" size="sm">{{ orders.length }}</Badge>
      </div>
    </div>

    <!-- Список заказов -->
    <div class="space-y-2 min-h-[200px]">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4"
        :class="[borderColorClass]"
        draggable="true"
        @dragstart="onDragStart($event, order)"
        @dragover.prevent
        @drop="onDrop($event, order)"
        @click="$emit('order-click', order)"
      >
        <!-- Номер заказа и сумма -->
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium text-gray-900 dark:text-white">{{ order.orderNumber }}</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(order.total) }}
          </span>
        </div>

        <!-- Клиент -->
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ order.customer.name }}</p>

        <!-- Товары -->
        <div class="flex items-center text-xs text-gray-500 dark:text-gray-500 mb-2">
          <Package class="w-3 h-3 mr-1" />
          <span>{{ order.items.length }} товаров</span>
        </div>

        <!-- Дата -->
        <div class="flex items-center text-xs text-gray-500 dark:text-gray-500">
          <Calendar class="w-3 h-3 mr-1" />
          <span>{{ formatDate(order.createdAt) }}</span>
        </div>

        <!-- Статус оплаты -->
        <div class="mt-2 flex items-center justify-between">
          <Badge :variant="getPaymentVariant(order.paymentStatus)" size="sm">
            {{ paymentLabels[order.paymentStatus] }}
          </Badge>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div
        v-if="orders.length === 0"
        class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700"
      >
        Нет заказов
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Package, Calendar } from "lucide-vue-next";
import type { Order, OrderStatus } from "../../types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import Badge from "../../components/ui/Badge.vue";

interface Props {
  title: string;
  status: OrderStatus;
  orders: Order[];
  color?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "status-change", orderId: string, newStatus: OrderStatus): void;
  (e: "order-click", order: Order): void;
}>();

const paymentLabels: Record<string, string> = {
  pending: "Ожидает",
  paid: "Оплачен",
  failed: "Ошибка",
  refunded: "Возврат",
};

const badgeVariant = computed(() => {
  const variants: Record<string, string> = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
  };
  return variants[props.status] || "gray";
});

const borderColorClass = computed(() => {
  const colors: Record<string, string> = {
    pending: "border-yellow-500",
    processing: "border-blue-500",
    shipped: "border-purple-500",
    delivered: "border-green-500",
    cancelled: "border-red-500",
  };
  return colors[props.status] || "border-gray-500";
});

const getPaymentVariant = (status: string) => {
  const variants: Record<string, string> = {
    pending: "warning",
    paid: "success",
    failed: "danger",
    refunded: "gray",
  };
  return variants[status] || "gray";
};

const onDragStart = (event: DragEvent, order: Order) => {
  event.dataTransfer?.setData("text/plain", JSON.stringify({
    id: order.id,
    currentStatus: props.status,
  }));
};

const onDrop = (event: DragEvent, targetOrder: Order) => {
  event.preventDefault();
  
  const data = event.dataTransfer?.getData("text/plain");
  if (!data) return;
  
  try {
    const { id, currentStatus } = JSON.parse(data);
    
    // Если перетащили на другой статус
    if (currentStatus !== props.status) {
      emit("status-change", id, props.status);
    }
  } catch (error) {
    console.error("Drag & drop error:", error);
  }
};
</script>