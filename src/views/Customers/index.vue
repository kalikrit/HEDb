<template>
  <div class="space-y-6">
    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Клиенты</h1>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Users class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Всего клиентов</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.total }}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <ShoppingBag class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Совершали покупки</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.withOrders }}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <DollarSign class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Средний чек</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(stats.averageOrderValue) }}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <TrendingUp class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Общая выручка</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(stats.totalRevenue) }}
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Фильтры -->
    <Card>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          v-model="filters.search"
          placeholder="Поиск по имени, email, телефону..."
          left-icon="Search"
          @update:model-value="debouncedSearch"
        />

        <Input
          v-model.number="filters.minOrders"
          type="number"
          placeholder="Мин. количество заказов"
          @update:model-value="applyFilters"
        />

        <Input
          v-model.number="filters.minSpent"
          type="number"
          placeholder="Мин. сумма покупок"
          left-icon="DollarSign"
          @update:model-value="applyFilters"
        />

        <select
          v-model="filterType"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          @change="applyTypeFilter"
        >
          <option value="all">Все клиенты</option>
          <option value="withEmail">С email</option>
          <option value="withoutEmail">Без email</option>
          <option value="withPhone">С телефоном</option>
          <option value="withoutPhone">Без телефона</option>
          <option value="withOrders">С заказами</option>
          <option value="withoutOrders">Без заказов</option>
        </select>
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

    <!-- Таблица клиентов -->
    <Card>
      <Table
        :columns="columns"
        :data="paginatedCustomers"
        :loading="isLoading"
        :pagination="true"
        :total="total"
        :page="page"
        :per-page="limit"
        @sort="handleSort"
        @page-change="handlePageChange"
      >
        <template #name="{ row }">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
              <span class="text-primary-700 dark:text-primary-300 text-sm font-medium">
                {{ row.name.charAt(0) }}
              </span>
            </div>
            <div>
              <router-link 
                :to="`/customers/${row.id}`"
                class="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                {{ row.name }}
              </router-link>
              <p class="text-xs text-gray-500">{{ row.email }}</p>
            </div>
          </div>
        </template>

        <template #phone="{ row }">
          <span class="text-gray-600 dark:text-gray-400">{{ row.phone || '—' }}</span>
        </template>

        <template #ordersCount="{ row }">
          <Badge :variant="row.ordersCount > 0 ? 'success' : 'gray'">
            {{ row.ordersCount }}
          </Badge>
        </template>

        <template #totalSpent="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(row.totalSpent) }}
          </span>
        </template>

        <template #lastOrderDate="{ row }">
          <span v-if="row.lastOrderDate" class="text-gray-600 dark:text-gray-400">
            {{ formatDate(row.lastOrderDate) }}
          </span>
          <span v-else class="text-gray-400">—</span>
        </template>

        <template #createdAt="{ row }">
          <span class="text-gray-600 dark:text-gray-400">{{ formatDate(row.createdAt) }}</span>
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              @click="viewCustomerDetails(row)"
              title="Просмотр"
            >
              <Eye class="w-4 h-4" />
            </Button>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-12">
            <Users class="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Клиенты не найдены
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              {{ hasActiveFilters ? 'Попробуйте изменить фильтры' : 'Нет клиентов' }}
            </p>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Модальное окно деталей клиента -->
    <Modal
      v-model="showDetailsModal"
      :title="selectedCustomer?.name || 'Детали клиента'"
      size="lg"
      @close="closeDetailsModal"
    >
      <CustomerDetails
        v-if="selectedCustomer"
        :customer="selectedCustomer"
        :orders="customerOrders"
        :loading="ordersLoading"
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
  Users, ShoppingBag, DollarSign, TrendingUp, Search, X, Eye 
} from "lucide-vue-next";
import { useCustomersStore } from "@/stores/customers";
import { useUIStore } from "@/stores/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { Customer } from "../../types";
import Button from "../../components/ui/Button.vue";
import Input from "../../components/ui/Input.vue";
import Card from "../../components/ui/Card.vue";
import Table from "../../components/ui/Table.vue";
import Badge from "../../components/ui/Badge.vue";
import Modal from "../../components/ui/Modal.vue";
import CustomerDetails from "./CustomerDetails.vue";

const router = useRouter();
const customersStore = useCustomersStore();
const uiStore = useUIStore();

const { 
  getFilters,
  getSortConfig,
  getPagination,
  getIsLoading: isLoading,
  getStats,
  getSelectedCustomer,
  getCustomerOrders,
  getOrdersLoading,
} = storeToRefs(customersStore);

// Состояние
const filters = reactive({ ...getFilters.value });
const filterType = ref("all");
const showDetailsModal = ref(false);

// Колонки таблицы
const columns = [
  { key: "name", label: "Клиент", sortable: true },
  { key: "phone", label: "Телефон", sortable: true },
  { key: "ordersCount", label: "Заказы", sortable: true, align: "center" as const },
  { key: "totalSpent", label: "Потрачено", sortable: true, align: "right" as const },
  { key: "lastOrderDate", label: "Последний заказ", sortable: true },
  { key: "createdAt", label: "Зарегистрирован", sortable: true },
  { key: "actions", label: "", sortable: false, align: "right" as const },
];

// Вычисляемые свойства
const paginatedCustomers = computed(() => getPagination.value.data);
const page = computed(() => getPagination.value.page);
const limit = computed(() => getPagination.value.limit);
const total = computed(() => getPagination.value.total);
const stats = computed(() => getStats.value);
const selectedCustomer = computed(() => getSelectedCustomer.value);
const customerOrders = computed(() => getCustomerOrders.value);
const ordersLoading = computed(() => getOrdersLoading.value);

// Активные фильтры
const hasActiveFilters = computed(() => {
  return filters.search || 
         filters.minOrders || 
         filters.minSpent || 
         filters.hasEmail !== undefined || 
         filters.hasPhone !== undefined ||
         filters.dateFrom ||
         filters.dateTo;
});

const activeFilters = computed(() => {
  const active: Record<string, { label: string; value: string }> = {};
  
  if (filters.search) {
    active.search = { label: "Поиск", value: filters.search };
  }
  if (filters.minOrders) {
    active.minOrders = { label: "Мин. заказов", value: `${filters.minOrders}` };
  }
  if (filters.maxOrders !== undefined) { // 👈 Добавляем проверку для maxOrders
    active.maxOrders = { label: "Макс. заказов", value: `${filters.maxOrders}` };
  }
  if (filters.minSpent) {
    active.minSpent = { label: "Мин. сумма", value: `${filters.minSpent} ₽` };
  }
  if (filters.hasEmail !== undefined) {
    active.hasEmail = { 
      label: "Email", 
      value: filters.hasEmail ? "Есть" : "Нет" 
    };
  }
  if (filters.hasPhone !== undefined) {
    active.hasPhone = { 
      label: "Телефон", 
      value: filters.hasPhone ? "Есть" : "Нет" 
    };
  }
  
  return active;
});

// Методы
const applyFilters = () => {
  customersStore.setFilters(filters);
};

const debouncedSearch = (value: string) => {
  applyFilters();
};

const applyTypeFilter = () => {

  // Сбрасываем предыдущие фильтры
  filters.minOrders = undefined;
  filters.maxOrders = undefined;
  filters.hasEmail = undefined;
  filters.hasPhone = undefined;

  switch (filterType.value) {
    case "withEmail":
      filters.hasEmail = true;
      break;
    case "withoutEmail":
      filters.hasEmail = false;
      break;
    case "withPhone":
      filters.hasPhone = true;
      break;
    case "withoutPhone":
      filters.hasPhone = false;
      break;
    case "withOrders":
      filters.minOrders = 1;
      break;
    case "withoutOrders":
      filters.maxOrders = 0;
      break;
    // case "all" ничего не делаем
  }
  applyFilters();
};

const removeFilter = (key: string) => {
  if (key === "search") filters.search = "";
  if (key === "minOrders") filters.minOrders = undefined;
  if (key === "maxOrders") filters.maxOrders = undefined; 
  if (key === "minSpent") filters.minSpent = undefined;
  if (key === "hasEmail") filters.hasEmail = undefined;
  if (key === "hasPhone") filters.hasPhone = undefined;
  if (key === "dateFrom") filters.dateFrom = undefined;
  if (key === "dateTo") filters.dateTo = undefined;
  
  filterType.value = "all";
  applyFilters();
};

const clearAllFilters = () => {
  filters.search = "";
  filters.minOrders = undefined;
  filters.maxOrders = undefined;
  filters.minSpent = undefined;
  filters.hasEmail = undefined;
  filters.hasPhone = undefined;
  filters.dateFrom = undefined;
  filters.dateTo = undefined;
  filterType.value = "all";
  applyFilters();
};

const handleSort = (key: string, order: 'asc' | 'desc') => {
  customersStore.setSort(key, order);
};

const handlePageChange = (newPage: number) => {
  customersStore.setPage(newPage);
};

const viewCustomerDetails = async (customer: Customer) => {
  await customersStore.fetchCustomerById(customer.id);
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
};

onMounted(() => {
  customersStore.fetchCustomers();
});
</script>