<template>
  <div class="space-y-6">
    <!-- Основная информация -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="Контактная информация">
        <div class="space-y-3">
          <div class="flex items-start">
            <User class="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ customer.name }}</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <Mail class="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
            <div>
              <p class="text-gray-600 dark:text-gray-400">{{ customer.email || '—' }}</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <Phone class="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
            <div>
              <p class="text-gray-600 dark:text-gray-400">{{ customer.phone || '—' }}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Адрес">
        <div v-if="customer.address" class="space-y-1">
          <p class="text-gray-600 dark:text-gray-400">{{ customer.address.street }}</p>
          <p class="text-gray-600 dark:text-gray-400">
            {{ customer.address.city }}, {{ customer.address.state }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ customer.address.country }}</p>
          <p class="text-gray-600 dark:text-gray-400">{{ customer.address.postalCode }}</p>
        </div>
        <p v-else class="text-gray-400">Адрес не указан</p>
      </Card>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div class="text-center">
          <ShoppingBag class="w-6 h-6 mx-auto text-primary-600 dark:text-primary-400 mb-2" />
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ customer.ordersCount }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Всего заказов</p>
        </div>
      </Card>

      <Card>
        <div class="text-center">
          <DollarSign class="w-6 h-6 mx-auto text-green-600 dark:text-green-400 mb-2" />
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(customer.totalSpent) }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Потрачено всего</p>
        </div>
      </Card>

      <Card>
        <div class="text-center">
          <Calendar class="w-6 h-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Последний заказ
          </p>
          <p v-if="customer.lastOrderDate" class="text-gray-900 dark:text-white">
            {{ formatDate(customer.lastOrderDate) }}
          </p>
          <p v-else class="text-gray-400">—</p>
        </div>
      </Card>
    </div>

    <!-- История заказов -->
    <Card title="История заказов">
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <Table
        v-else
        :columns="orderColumns"
        :data="orders"
        :loading="false"
      >
        <template #orderNumber="{ row }">
          <router-link 
            :to="`/orders/${row.id}`"
            class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            @click="$emit('close')"
          >
            {{ row.orderNumber }}
          </router-link>
        </template>

        <template #total="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(row.total) }}
          </span>
        </template>

        <template #status="{ row }">
          <Badge :variant="getOrderStatusVariant(row.status)">
            {{ statusLabels[row.status] }}
          </Badge>
        </template>

        <template #date="{ row }">
          <span class="text-gray-600 dark:text-gray-400">{{ formatDate(row.createdAt) }}</span>
        </template>

        <template #empty>
          <div class="text-center py-8">
            <ShoppingBag class="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p class="text-gray-500 dark:text-gray-400">
              У клиента пока нет заказов
            </p>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Кнопка закрытия -->
    <div class="flex justify-end">
      <Button variant="primary" @click="$emit('close')">
        Закрыть
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { User, Mail, Phone, ShoppingBag, DollarSign, Calendar } from "lucide-vue-next";
import type { Customer, Order } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import Card from "@/components/ui/Card.vue";
import Table from "@/components/ui/Table.vue";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";

interface Props {
  customer: Customer;
  orders: Order[];
  loading: boolean;
}

defineProps<Props>();
defineEmits<{
  (e: "close"): void;
}>();

const orderColumns = [
  { key: "orderNumber", label: "№ заказа", sortable: true },
  { key: "total", label: "Сумма", sortable: true, align: "right" as const },
  { key: "status", label: "Статус", sortable: true },
  { key: "date", label: "Дата", sortable: true },
];

const statusLabels: Record<string, string> = {
  pending: "Ожидание",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

const getOrderStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
  };
  return variants[status] || "gray";
};
</script>