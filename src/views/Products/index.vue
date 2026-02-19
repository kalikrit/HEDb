<template>
  <div class="space-y-6">
    <!-- Заголовок и кнопка добавления -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Товары</h1>
      <Button variant="primary" @click="openCreateModal">
        <Plus class="w-4 h-4 mr-2" />
        Добавить товар
      </Button>
    </div>

    <!-- Фильтры и поиск -->
    <Card>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          v-model="filters.search"
          placeholder="Поиск по названию или SKU..."
          left-icon="Search"
          @update:model-value="debouncedSearch"
        />
        
        <select
          v-model="filters.category"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          @change="applyFilters"
        >
          <option value="">Все категории</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          @change="applyFilters"
        >
          <option value="">Все статусы</option>
          <option value="active">Активен</option>
          <option value="draft">Черновик</option>
          <option value="archived">Архив</option>
          <option value="out_of_stock">Нет в наличии</option>
        </select>

        <div class="flex gap-2">
          <Input
            v-model.number="filters.minPrice"
            type="number"
            placeholder="Цена от"
            @update:model-value="applyFilters"
          />
          <Input
            v-model.number="filters.maxPrice"
            type="number"
            placeholder="Цена до"
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

    <!-- Таблица товаров -->
    <Card>
      <Table
        :columns="columns"
        :data="products"
        :loading="isLoading"
        :pagination="true"
        :total="total"
        :page="page"
        :per-page="limit"
        @sort="handleSort"
        @page-change="handlePageChange"
      >
        <!-- Изображение -->
        <template #image="{ row }">
            <div class="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-medium">
                {{ row.name.charAt(0).toUpperCase() }}
            </div>
        </template>

        <!-- Название -->
        <template #name="{ row }">
        <router-link 
            :to="`/products/${row.id}`"
            class="hover:text-primary-600 dark:hover:text-primary-400"
        >
            <p class="font-medium text-gray-900 dark:text-white">{{ row.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">SKU: {{ row.sku }}</p>
        </router-link>
        </template>

        <!-- Цена -->
        <template #price="{ row }">
          <div class="text-right">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ formatCurrency(row.price) }}
            </p>
            <p v-if="row.comparePrice" class="text-xs text-gray-500 line-through">
              {{ formatCurrency(row.comparePrice) }}
            </p>
          </div>
        </template>

        <!-- Количество -->
        <template #quantity="{ row }">
          <Badge
            :variant="row.quantity > 10 ? 'success' : row.quantity > 0 ? 'warning' : 'danger'"
          >
            {{ row.quantity }} шт.
          </Badge>
        </template>

        <!-- Статус -->
        <template #status="{ row }">
          <Badge :variant="getStatusVariant(row.status)">
            {{ getStatusLabel(row.status) }}
          </Badge>
        </template>

        <!-- Действия -->
        <template #actions="{ row }">
          <div class="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              @click="editProduct(row)"
              title="Редактировать"
            >
              <Edit2 class="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              class="text-red-600 hover:text-red-700"
              @click="confirmDelete(row)"
              title="Удалить"
            >
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </template>

        <!-- Пустое состояние -->
        <template #empty>
          <div class="text-center py-12">
            <Package class="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Товары не найдены
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              {{ hasActiveFilters ? 'Попробуйте изменить фильтры' : 'Добавьте первый товар' }}
            </p>
            <Button variant="primary" @click="openCreateModal">
              Добавить товар
            </Button>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Модальное окно для создания/редактирования -->
    <Modal
      v-model="showModal"
      :title="modalTitle"
      size="lg"
      @close="closeModal"
    >
      <form @submit.prevent="saveProduct" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model="form.name"
            label="Название"
            :error="errors.name"
            required
          />
          <Input
            v-model="form.sku"
            label="SKU"
            :error="errors.sku"
            required
          />
        </div>

        <Input
          v-model="form.description"
          label="Описание"
          type="textarea"
          :error="errors.description"
          rows="3"
        />

        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model.number="form.price"
            label="Цена"
            type="number"
            :error="errors.price"
            left-icon="DollarSign"
            required
          />
          <Input
            v-model.number="form.comparePrice"
            label="Цена со скидкой"
            type="number"
            left-icon="DollarSign"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model.number="form.quantity"
            label="Количество"
            type="number"
            :error="errors.quantity"
            required
          />
          <Input
            v-model.number="form.cost"
            label="Себестоимость"
            type="number"
            :error="errors.cost"
            left-icon="DollarSign"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <select
            v-model="form.category"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            :class="{ 'border-red-500': errors.category }"
          >
            <option value="">Выберите категорию</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <select
            v-model="form.status"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="active">Активен</option>
            <option value="draft">Черновик</option>
            <option value="archived">Архив</option>
            <option value="out_of_stock">Нет в наличии</option>
          </select>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center">
            <input
              v-model="form.isFeatured"
              type="checkbox"
              class="w-4 h-4 text-primary-600 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Рекомендуемый
            </span>
          </label>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <Button variant="secondary" @click="closeModal">
            Отмена
          </Button>
          <Button type="submit" variant="primary" :loading="saving">
            {{ editingId ? 'Сохранить' : 'Создать' }}
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Модальное окно подтверждения удаления -->
    <Modal
      v-model="showDeleteModal"
      title="Удаление товара"
      size="sm"
    >
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Вы уверены, что хотите удалить товар "{{ deletingProduct?.name }}"?
        Это действие нельзя отменить.
      </p>
      <div class="flex justify-end gap-2">
        <Button variant="secondary" @click="showDeleteModal = false">
          Отмена
        </Button>
        <Button variant="danger" @click="deleteProduct" :loading="deleting">
          Удалить
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { 
  Plus, Search, Edit2, Trash2, Package, DollarSign,
  X 
} from "lucide-vue-next";
import { useProductsStore } from "../../stores/products";
import { useUIStore } from "../../stores/ui";
import { formatCurrency } from "../../utils/formatters";
import { productSchema } from "../../utils/validators";
import type { Product, ProductFilters } from "../../types";
import Button from "../../components/ui/Button.vue";
import Input from "../../components/ui/Input.vue";
import Card from "../../components/ui/Card.vue";
import Table from "../../components/ui/Table.vue";
import Badge from "../../components/ui/Badge.vue";
import Modal from "../../components/ui/Modal.vue";

const productsStore = useProductsStore();
const uiStore = useUIStore();

const { 
  getFilteredProducts: products, 
  getCategories: categories,
  getIsLoading: isLoading,
  getFilters: storeFilters,
  getPagination: pagination
} = storeToRefs(productsStore);

// Локальные фильтры
const filters = reactive<ProductFilters>({
  search: storeFilters.value.search || "",
  category: storeFilters.value.category || "",
  status: storeFilters.value.status || "",
  minPrice: storeFilters.value.minPrice,
  maxPrice: storeFilters.value.maxPrice,
});

// 👇 СИНХРОНИЗИРУЕМ ИЗМЕНЕНИЯ С STORE
watch(filters, (newFilters) => {
  productsStore.setFilters(newFilters);
}, { deep: true });

// 👇 СЛЕДИМ ЗА ИЗМЕНЕНИЯМИ В STORE (на случай если фильтры меняются из другого места)
watch(storeFilters, (newStoreFilters) => {
  // Обновляем локальные фильтры без триггера watch
  filters.search = newStoreFilters.search || "";
  filters.category = newStoreFilters.category || "";
  filters.status = newStoreFilters.status || "";
  filters.minPrice = newStoreFilters.minPrice;
  filters.maxPrice = newStoreFilters.maxPrice;
}, { deep: true });

// Пагинация
const page = computed(() => pagination.value.page);
const limit = computed(() => pagination.value.limit);
const total = computed(() => pagination.value.total);

// Колонки таблицы
const columns = [
  { key: "image", label: "", sortable: false },
  { key: "name", label: "Товар", sortable: true },
  { key: "price", label: "Цена", sortable: true, align: "right" as const },
  { key: "quantity", label: "Наличие", sortable: true },
  { key: "status", label: "Статус", sortable: true },
  { key: "actions", label: "", sortable: false, align: "right" as const },
];

// Модальное окно товара
const showModal = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const form = reactive({
  name: "",
  sku: "",
  description: "",
  price: 0,
  comparePrice: undefined as number | undefined,
  cost: 0,
  quantity: 0,
  category: "",
  status: "draft" as Product["status"],
  isFeatured: false,
  images: [] as string[],
  tags: [] as string[],
});

const errors = ref<Record<string, string>>({});

const modalTitle = computed(() => 
  editingId.value ? "Редактировать товар" : "Новый товар"
);

// Модальное окно удаления
const showDeleteModal = ref(false);
const deletingProduct = ref<Product | null>(null);
const deleting = ref(false);

// Активные фильтры
const hasActiveFilters = computed(() => {
  return Object.values(filters).some(v => v !== "" && v !== undefined);
});

const activeFilters = computed(() => {
  const active: Record<string, { label: string; value: string }> = {};
  
  if (filters.category) {
    const cat = categories.value.find(c => c.id === filters.category);
    active.category = { label: "Категория", value: cat?.name || filters.category };
  }
  if (filters.status) {
    const statusMap: Record<string, string> = {
      active: "Активен",
      draft: "Черновик",
      archived: "Архив",
      out_of_stock: "Нет в наличии",
    };
    active.status = { label: "Статус", value: statusMap[filters.status] };
  }
  if (filters.minPrice !== undefined) {
    active.minPrice = { label: "Цена от", value: `${filters.minPrice} ₽` };
  }
  if (filters.maxPrice !== undefined) {
    active.maxPrice = { label: "Цена до", value: `${filters.maxPrice} ₽` };
  }
  if (filters.search) {
    active.search = { label: "Поиск", value: filters.search };
  }
  
  return active;
});

// Хелперы для статусов
const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    active: "success",
    draft: "gray",
    archived: "danger",
    out_of_stock: "warning",
  };
  return variants[status] || "gray";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Активен",
    draft: "Черновик",
    archived: "Архив",
    out_of_stock: "Нет в наличии",
  };
  return labels[status] || status;
};

// Загрузка данных
onMounted(() => {
  productsStore.fetchProducts();
});

// Фильтры
const applyFilters = () => {
  //productsStore.setFilters(filters);
};

const debouncedSearch = (value: string) => {
  // Простая реализация без debounce для начала
  applyFilters();
};

const removeFilter = (key: string) => {
  if (key === "category") filters.category = "";
  if (key === "status") filters.status = "";
  if (key === "minPrice") filters.minPrice = undefined;
  if (key === "maxPrice") filters.maxPrice = undefined;
  if (key === "search") filters.search = "";
  applyFilters();
};

const clearAllFilters = () => {
  filters.search = "";
  filters.category = "";
  filters.status = "";
  filters.minPrice = undefined;
  filters.maxPrice = undefined;
};

// Сортировка
const handleSort = (key: string, order: string) => {
  // Временно просто логируем
  console.log("Sort:", key, order);
};

// Пагинация
const handlePageChange = (newPage: number) => {
  productsStore.setPage(newPage);
};

// CRUD операции
const openCreateModal = () => {
  editingId.value = null;
  Object.assign(form, {
    name: "",
    sku: "",
    description: "",
    price: 0,
    comparePrice: undefined,
    cost: 0,
    quantity: 0,
    category: "",
    status: "draft",
    isFeatured: false,
    images: [],
    tags: [],
  });
  errors.value = {};
  showModal.value = true;
};

const editProduct = (product: Product) => {
  editingId.value = product.id;
  Object.assign(form, {
    name: product.name,
    sku: product.sku,
    description: product.description,
    price: product.price,
    comparePrice: product.comparePrice,
    cost: product.cost,
    quantity: product.quantity,
    category: product.category,
    status: product.status,
    isFeatured: product.isFeatured,
    images: product.images,
    tags: product.tags,
  });
  errors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingId.value = null;
};

const saveProduct = async () => {
  // Валидация
  errors.value = {};
  
  const validation = productSchema.safeParse(form);
  if (!validation.success) {
    validation.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      errors.value[field] = err.message;
    });
    return;
  }
  
  saving.value = true;
  
  try {
    if (editingId.value) {
      await productsStore.updateProduct(editingId.value, form);
      uiStore.addNotification("Товар обновлен", "success");
    } else {
      await productsStore.createProduct(form as any);
      uiStore.addNotification("Товар создан", "success");
    }
    closeModal();
  } catch (error) {
    uiStore.addNotification("Ошибка при сохранении", "error");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (product: Product) => {
  deletingProduct.value = product;
  showDeleteModal.value = true;
};

const deleteProduct = async () => {
  if (!deletingProduct.value) return;
  
  deleting.value = true;
  
  try {
    await productsStore.deleteProduct(deletingProduct.value.id);
    uiStore.addNotification("Товар удален", "success");
    showDeleteModal.value = false;
  } catch (error) {
    uiStore.addNotification("Ошибка при удалении", "error");
  } finally {
    deleting.value = false;
    deletingProduct.value = null;
  }
};
</script>