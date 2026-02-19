<template>
  <div class="space-y-6">
    <!-- Статус и действия -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Badge :variant="getStatusVariant(order.status)" size="lg">
          {{ statusLabels[order.status] }}
        </Badge>
        <Badge :variant="getPaymentVariant(order.paymentStatus)" size="lg">
          {{ paymentLabels[order.paymentStatus] }}
        </Badge>
      </div>
      
      <select
        v-model="newStatus"
        class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
        @change="updateStatus"
      >
        <option v-for="status in orderStatuses" :key="status" :value="status">
          {{ statusLabels[status] }}
        </option>
      </select>
    </div>

    <!-- Информация о клиенте -->
    <Card title="Клиент">
      <div class="space-y-2">
        <p class="text-gray-900 dark:text-white font-medium">{{ order.customer.name }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ order.customer.email }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ order.customer.phone }}</p>
      </div>
    </Card>

    <!-- Адрес доставки -->
    <Card title="Адрес доставки">
      <p class="text-gray-900 dark:text-white">
        {{ order.shippingAddress.street }}, {{ order.shippingAddress.city }}
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ order.shippingAddress.state }}, {{ order.shippingAddress.country }}
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ order.shippingAddress.postalCode }}
      </p>
    </Card>

    <!-- Товары в заказе -->
    <Card title="Товары">
      <div class="space-y-3">
        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
        >
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-white">{{ item.productName }}</p>
            <p class="text-xs text-gray-500">SKU: {{ item.sku }}</p>
          </div>
          <div class="text-right">
            <p class="text-gray-900 dark:text-white">
              {{ item.quantity }} × {{ formatCurrency(item.unitPrice) }}
            </p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              = {{ formatCurrency(item.totalPrice) }}
            </p>
          </div>
        </div>
      </div>
    </Card>

    <!-- Итого -->
    <Card>
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Товары:</span>
          <span class="text-gray-900 dark:text-white">{{ formatCurrency(order.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Доставка:</span>
          <span class="text-gray-900 dark:text-white">{{ formatCurrency(order.shipping) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Налог:</span>
          <span class="text-gray-900 dark:text-white">{{ formatCurrency(order.tax) }}</span>
        </div>
        <div v-if="order.discount > 0" class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Скидка:</span>
          <span class="text-red-600">-{{ formatCurrency(order.discount) }}</span>
        </div>
        <div class="flex justify-between font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
          <span class="text-gray-900 dark:text-white">Итого:</span>
          <span class="text-lg text-gray-900 dark:text-white">{{ formatCurrency(order.total) }}</span>
        </div>
      </div>
    </Card>

    <!-- Дополнительная информация -->
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-gray-500 dark:text-gray-400">Дата заказа</p>
        <p class="text-gray-900 dark:text-white">{{ formatDateTime(order.createdAt) }}</p>
      </div>
      <div>
        <p class="text-gray-500 dark:text-gray-400">Ожидаемая доставка</p>
        <p class="text-gray-900 dark:text-white">{{ formatDate(order.estimatedDelivery) }}</p>
      </div>
      <div v-if="order.notes">
        <p class="text-gray-500 dark:text-gray-400">Примечание</p>
        <p class="text-gray-900 dark:text-white">{{ order.notes }}</p>
      </div>
    </div>

    <!-- Кнопка закрытия -->
    <div class="flex justify-end">
      <Button variant="primary" @click="$emit('close')">
        Закрыть
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Order, OrderStatus } from "../../types";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatters";
import Card from "../../components/ui/Card.vue";
import Badge from "../../components/ui/Badge.vue";
import Button from "../../components/ui/Button.vue";

interface Props {
  order: Order;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "status-change", orderId: string, newStatus: OrderStatus): void;
  (e: "close"): void;
}>();

const orderStatuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
const newStatus = ref(props.order.status);

const statusLabels: Record<string, string> = {
  pending: "Ожидание",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

const paymentLabels: Record<string, string> = {
  pending: "Ожидает оплаты",
  paid: "Оплачен",
  failed: "Ошибка оплаты",
  refunded: "Возврат",
};

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
  };
  return variants[status] || "gray";
};

const getPaymentVariant = (status: string) => {
  const variants: Record<string, string> = {
    pending: "warning",
    paid: "success",
    failed: "danger",
    refunded: "gray",
  };
  return variants[status] || "gray";
};

const updateStatus = () => {
  if (newStatus.value !== props.order.status) {
    emit("status-change", props.order.id, newStatus.value as OrderStatus);
  }
};
</script>