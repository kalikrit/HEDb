<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Возвраты</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Управление возвратами и Refunds
        </p>
      </div>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <RotateCcw class="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Активные возвраты</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Завершено</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">45</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Clock class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">На рассмотрении</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">8</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Таблица возвратов -->
    <Card>
      <Table
        :columns="columns"
        :data="mockRefunds"
        :loading="false"
      >
        <template #orderNumber="{ row }">
          <router-link 
            :to="`/orders/${row.orderId}`"
            class="font-medium text-primary-600 hover:text-primary-700"
          >
            {{ row.orderNumber }}
          </router-link>
        </template>

        <template #customer="{ row }">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ row.customer }}</p>
            <p class="text-xs text-gray-500">{{ row.email }}</p>
          </div>
        </template>

        <template #amount="{ row }">
          <p class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(row.amount) }}</p>
        </template>

        <template #status="{ row }">
          <Badge :variant="getStatusVariant(row.status)">
            {{ row.status }}
          </Badge>
        </template>

        <template #reason="{ row }">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ row.reason }}</p>
        </template>

        <template #date="{ row }">
          <div>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(row.date) }}</p>
            <p class="text-xs text-gray-500">{{ formatTime(row.date) }}</p>
          </div>
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              @click="viewDetails(row)"
              title="Просмотр"
            >
              <Eye class="w-4 h-4" />
            </Button>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Модальное окно деталей возврата -->
    <Modal
      v-model="showDetailsModal"
      :title="`Возврат по заказу ${selectedRefund?.orderNumber}`"
      @close="closeDetailsModal"
    >
      <div v-if="selectedRefund" class="space-y-4">
        <div class="flex items-center justify-between">
          <Badge :variant="getStatusVariant(selectedRefund.status)" size="lg">
            {{ selectedRefund.status }}
          </Badge>
          <span class="text-sm text-gray-500">{{ formatDate(selectedRefund.date) }}</span>
        </div>

        <Card title="Информация о клиенте">
          <p class="text-gray-900 dark:text-white font-medium">{{ selectedRefund.customer }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedRefund.email }}</p>
        </Card>

        <Card title="Детали возврата">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Сумма возврата:</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(selectedRefund.amount) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Причина:</span>
              <span class="text-gray-900 dark:text-white">{{ selectedRefund.reason }}</span>
            </div>
          </div>
        </Card>

        <div class="flex justify-end gap-2 pt-4">
          <Button variant="secondary" @click="closeDetailsModal">
            Закрыть
          </Button>
          <Button variant="primary" @click="processRefund">
            Обработать возврат
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RotateCcw, CheckCircle, Clock, Eye } from "lucide-vue-next";
import { formatCurrency, formatDate, formatTime } from "@/utils/formatters";
import Card from "../../components/ui/Card.vue";
import Table from "../../components/ui/Table.vue";
import Badge from "../../components/ui/Badge.vue";
import Button from "../../components/ui/Button.vue";
import Modal from "../../components/ui/Modal.vue";

// Мок данные для возвратов
const mockRefunds = ref([
  {
    id: "ref-1",
    orderId: "ord-1",
    orderNumber: "#1001",
    customer: "Иван Петров",
    email: "ivan@example.com",
    amount: 12500,
    status: "На рассмотрении",
    reason: "Не подошел размер",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "ref-2",
    orderId: "ord-2",
    orderNumber: "#1002",
    customer: "Мария Иванова",
    email: "maria@example.com",
    amount: 8900,
    status: "Одобрен",
    reason: "Брак товара",
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "ref-3",
    orderId: "ord-3",
    orderNumber: "#1003",
    customer: "Алексей Смирнов",
    email: "alex@example.com",
    amount: 3500,
    status: "Отказ",
    reason: "Передумал",
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]);

const columns = [
  { key: "orderNumber", label: "Заказ", sortable: true },
  { key: "customer", label: "Клиент", sortable: true },
  { key: "amount", label: "Сумма", sortable: true, align: "right" as const },
  { key: "status", label: "Статус", sortable: true },
  { key: "reason", label: "Причина", sortable: true },
  { key: "date", label: "Дата", sortable: true },
  { key: "actions", label: "", sortable: false, align: "right" as const },
];

const showDetailsModal = ref(false);
const selectedRefund = ref<any>(null);

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    "На рассмотрении": "warning",
    "Одобрен": "success",
    "Отказ": "danger",
    "Завершен": "success",
  };
  return variants[status] || "gray";
};

const viewDetails = (refund: any) => {
  selectedRefund.value = refund;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedRefund.value = null;
};

const processRefund = () => {
  // Здесь будет логика обработки возврата
  closeDetailsModal();
};
</script>