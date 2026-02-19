<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Заказы</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="toggleView">
          <component :is="viewIcon" class="w-4 h-4 mr-2" />
          {{ kanbanView ? 'Таблица' : 'Канбан' }}
        </Button>
      </div>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card 
        v-for="(count, status) in ordersByStatus" 
        :key="status"
        class="cursor-pointer hover:shadow-md transition-shadow"
        :class="{ 'ring-2 ring-primary-500': filters.status === status }"
        @click="filterByStatus(status)"
      >
        <div class="text-center">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ statusLabels[status] }}</p>
          <p class="text-2xl font-semibold" :class="statusColors[status]">{{ count }}</p>
        </div>
      </Card>
    </div>

    <!-- Фильтры -->
    <Card>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          v-model="filters.search"
          placeholder="Поиск по номеру или клиенту..."
          left-icon="Search"
          @update:model-value="debouncedSearch"
        />

        <select
          v-model="filters.paymentStatus"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          @change="applyFilters"
        >
          <option value="">Все платежи</option>
          <option value="pending">Ожидает оплаты</option>
          <option value="paid">Оплачен</option>
          <option value="failed">Ошибка оплаты</option>
          <option value="refunded">Возврат</option>
        </select>

        <Input
          v-model="dateRange"
          placeholder="Период"
          left-icon="Calendar"
          @update:model-value="applyDateRange"
        />

        <div class="flex gap-2">
          <Input
            v-model.number="filters.minTotal"
            type="number"
            placeholder="Сумма от"
            @update:model-value="applyFilters"
          />
          <Input
            v-model.number="filters.maxTotal"
            type="number"
            placeholder="Сумма до"
            @update:model-value="applyFilters"
          />
        </div>
      </div>

      <!-- Активные фильтры -->
      <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
        <Badge
          v-for="(filter, key) in activeFilters"
          :key="key"
          variant="primary"
          class="flex items-center gap-1"
        >
          {{ filter.label }}: {{ filter.value }}
          <X class="w-3 h-3 cursor-pointer" @click="removeFilter(key)" />
        </Badge>
        <Button size="sm" variant="ghost" @click="clearAllFilters">
          Очистить все
        </Button>
      </div>
    </Card>

    <!-- Канбан доска -->
    <div v-if="kanbanView" class="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
      <KanbanColumn
        v-for="status in orderStatuses"
        :key="status"
        :title="statusLabels[status]"
        :status="status"
        :orders="ordersGroupedByStatus[status]"
        :color="statusColors[status]"
        @status-change="handleStatusChange"
        @order-click="viewOrderDetails"
      />
    </div>

    <!-- Таблица заказов -->
    <Card v-else>
      <Table
        :columns="columns"
        :data="paginatedOrders"
        :loading="isLoading"
        :pagination="true"
        :total="total"
        :page="page"
        :per-page="limit"
        @sort="handleSort"
        @page-change="handlePageChange"
      >
        <template #orderNumber="{ row }">
          <router-link 
            :to="`/orders/${row.id}`"
            class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {{ row.orderNumber }}
          </router-link>
        </template>

        <template #customer="{ row }">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ row.customer.name }}</p>
            <p class="text-xs text-gray-500">{{ row.customer.email }}</p>
          </div>
        </template>

        <template #total="{ row }">
          <p class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(row.total) }}</p>
        </template>

        <template #status="{ row }">
          <Badge :variant="getStatusVariant(row.status)">
            {{ statusLabels[row.status] }}
          </Badge>
        </template>

        <template #paymentStatus="{ row }">
          <Badge :variant="getPaymentVariant(row.paymentStatus)">
            {{ paymentLabels[row.paymentStatus] }}
          </Badge>
        </template>

        <template #createdAt="{ row }">
          <div>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(row.createdAt) }}</p>
            <p class="text-xs text-gray-500">{{ formatTime(row.createdAt) }}</p>
          </div>
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              @click="viewOrderDetails(row)"
              title="Просмотр"
            >
              <Eye class="w-4 h-4" />
            </Button>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Модальное окно деталей заказа -->
    <Modal
      v-model="showDetailsModal"
      :title="`Заказ ${selectedOrder?.orderNumber}`"
      size="lg"
      @close="closeDetailsModal"
    >
      <OrderDetails
        v-if="selectedOrder"
        :order="selectedOrder"
        @status-change="handleStatusChange"
        @close="closeDetailsModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { 
  Search, X, Eye, LayoutGrid, Table as TableIcon,
  Calendar 
} from "lucide-vue-next";
import { useOrdersStore } from "@/stores/orders";
import { useUIStore } from "@/stores/ui";
import { formatCurrency, formatDate, formatTime } from "../../utils/formatters";
import type { Order, OrderStatus } from "../../types";
import Button from "../../components/ui/Button.vue";
import Input from "../../components/ui/Input.vue";
import Card from "../../components/ui/Card.vue";
import Table from "../../components/ui/Table.vue";
import Badge from "../../components/ui/Badge.vue";
import Modal from "../../components/ui/Modal.vue";
import KanbanColumn from "./KanbanColumn.vue";
import OrderDetails from "./OrderDetails.vue";

const router = useRouter();
const ordersStore = useOrdersStore();
const uiStore = useUIStore();

const { 
  getFilters,
  getKanbanView,
  ordersByStatus,
  ordersGroupedByStatus,
  getPagination,
  getIsLoading: isLoading,
  getSortConfig,
} = storeToRefs(ordersStore);

// Состояние
const filters = reactive({ ...getFilters.value });
const showDetailsModal = ref(false);
const selectedOrder = ref<Order | null>(null);
const dateRange = ref("");

// Константы
const orderStatuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusLabels: Record<string, string> = {
  pending: "Ожидание",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

const statusColors: Record<string, string> = {
  pending: "text-yellow-600 dark:text-yellow-400",
  processing: "text-blue-600 dark:text-blue-400",
  shipped: "text-purple-600 dark:text-purple-400",
  delivered: "text-green-600 dark:text-green-400",
  cancelled: "text-red-600 dark:text-red-400",
};

const paymentLabels: Record<string, string> = {
  pending: "Ожидает",
  paid: "Оплачен",
  failed: "Ошибка",
  refunded: "Возврат",
};

// Колонки таблицы
const columns = [
  { key: "orderNumber", label: "№ заказа", sortable: true },
  { key: "customer", label: "Клиент", sortable: true },
  { key: "total", label: "Сумма", sortable: true, align: "right" as const },
  { key: "status", label: "Статус", sortable: true },
  { key: "paymentStatus", label: "Оплата", sortable: true },
  { key: "createdAt", label: "Дата", sortable: true },
  { key: "actions", label: "", sortable: false, align: "right" as const },
];

// Вычисляемые свойства
const kanbanView = computed(() => getKanbanView.value);
const viewIcon = computed(() => kanbanView.value ? TableIcon : LayoutGrid);
const paginatedOrders = computed(() => getPagination.value.data);
const page = computed(() => getPagination.value.page);
const limit = computed(() => getPagination.value.limit);
const total = computed(() => getPagination.value.total);

// Активные фильтры
const hasActiveFilters = computed(() => {
  return Object.values(filters).some(v => v !== "" && v !== undefined);
});

const activeFilters = computed(() => {
  const active: Record<string, { label: string; value: string }> = {};
  
  if (filters.search) {
    active.search = { label: "Поиск", value: filters.search };
  }
  if (filters.status) {
    active.status = { label: "Статус", value: statusLabels[filters.status] };
  }
  if (filters.paymentStatus) {
    active.paymentStatus = { label: "Оплата", value: paymentLabels[filters.paymentStatus] };
  }
  if (filters.minTotal) {
    active.minTotal = { label: "Сумма от", value: `${filters.minTotal} ₽` };
  }
  if (filters.maxTotal) {
    active.maxTotal = { label: "Сумма до", value: `${filters.maxTotal} ₽` };
  }
  if (filters.dateFrom || filters.dateTo) {
    active.date = { 
      label: "Период", 
      value: `${filters.dateFrom || '...'} - ${filters.dateTo || '...'}` 
    };
  }
  
  return active;
});

// Методы
const toggleView = () => {
  ordersStore.toggleView();
};

const filterByStatus = (status: string) => {
  if (filters.status === status) {
    filters.status = "";
  } else {
    filters.status = status as OrderStatus;
  }
  applyFilters();
};

const applyFilters = () => {
  ordersStore.setFilters(filters);
};

const debouncedSearch = (value: string) => {
  applyFilters();
};

const applyDateRange = (value: string) => {
  // Простая реализация - можно добавить DatePicker позже
  console.log("Date range:", value);
};

const removeFilter = (key: string) => {
  if (key === "search") filters.search = "";
  if (key === "status") filters.status = "";
  if (key === "paymentStatus") filters.paymentStatus = "";
  if (key === "minTotal") filters.minTotal = undefined;
  if (key === "maxTotal") filters.maxTotal = undefined;
  if (key === "date") {
    filters.dateFrom = undefined;
    filters.dateTo = undefined;
  }
  applyFilters();
};

const clearAllFilters = () => {
  filters.search = "";
  filters.status = "";
  filters.paymentStatus = "";
  filters.minTotal = undefined;
  filters.maxTotal = undefined;
  filters.dateFrom = undefined;
  filters.dateTo = undefined;
  applyFilters();
};

const handleSort = (key: string, order: 'asc' | 'desc') => {
  console.log("========== СОРТИРОВКА ==========");
  console.log("1. Колонка:", key);
  console.log("2. Порядок:", order);
  console.log("3. Текущий sortConfig в store:", getSortConfig.value);
  
  ordersStore.setSort(key, order);
  
  // Проверим результат через секунду
  setTimeout(() => {
    console.log("4. После сортировки, первые 3 заказа:", 
      getPagination.value.data.slice(0, 3).map(o => ({
        номер: o.orderNumber,
        клиент: o.customer.name,
        сумма: o.total
      }))
    );
  }, 100);
};

const handlePageChange = (newPage: number) => {
  ordersStore.setPage(newPage);
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

const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
  await ordersStore.updateOrderStatus(orderId, newStatus);
  uiStore.addNotification(`Статус заказа изменен на ${statusLabels[newStatus]}`, "success");
};

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedOrder.value = null;
};

onMounted(() => {
  ordersStore.fetchOrders();
});
</script>