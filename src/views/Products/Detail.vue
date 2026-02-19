<template>
  <div class="space-y-6">
    <!-- Хлебные крошки и действия -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center space-x-2 text-sm">
        <router-link to="/products" class="text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Товары
        </router-link>
        <ChevronRight class="w-4 h-4 text-gray-400" />
        <span class="text-gray-600 dark:text-gray-400">{{ product?.name || 'Загрузка...' }}</span>
      </div>
      
      <div class="flex gap-2">
        <Button variant="outline" @click="goBack">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button variant="primary" @click="openEditModal">
          <Edit2 class="w-4 h-4 mr-2" />
          Редактировать
        </Button>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Контент товара -->
    <template v-else-if="product">
      <!-- Основная информация -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Левая колонка: изображения -->
        <div class="lg:col-span-1">
          <Card>
            <div class="space-y-4">
              <!-- Главное изображение -->
              <div class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div v-if="product.images && product.images.length > 0">
                  <img 
                    :src="product.images[0]" 
                    :alt="product.name"
                    class="w-full h-full object-cover rounded-lg"
                    @error="handleImageError"
                  />
                </div>
                <div v-else class="text-center">
                  <Package class="w-16 h-16 mx-auto text-gray-400 mb-2" />
                  <p class="text-sm text-gray-500 dark:text-gray-400">Нет изображения</p>
                </div>
              </div>

              <!-- Миниатюры (если есть) -->
              <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-2">
                <div
                  v-for="(img, idx) in product.images.slice(0, 4)"
                  :key="idx"
                  class="aspect-square bg-gray-100 dark:bg-gray-800 rounded cursor-pointer hover:opacity-75 transition-opacity"
                  @click="selectImage(idx)"
                >
                  <img 
                    :src="img" 
                    :alt="`${product.name} ${idx + 1}`"
                    class="w-full h-full object-cover rounded"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Правая колонка: информация -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Заголовок и статус -->
          <Card>
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ product.name }}
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  SKU: {{ product.sku }} | ID: {{ product.id }}
                </p>
              </div>
              <Badge :variant="getStatusVariant(product.status)" size="lg">
                {{ getStatusLabel(product.status) }}
              </Badge>
            </div>
          </Card>

          <!-- Цены и наличие -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Цены">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Цена продажи:</span>
                  <span class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ formatCurrency(product.price) }}
                  </span>
                </div>
                <div v-if="product.comparePrice" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Старая цена:</span>
                  <span class="text-gray-500 line-through">
                    {{ formatCurrency(product.comparePrice) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Себестоимость:</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ formatCurrency(product.cost) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Маржа:</span>
                  <span :class="profitMarginClass">
                    {{ formatCurrency(product.price - product.cost) }}
                    ({{ profitMarginPercent }}%)
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Наличие">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">На складе:</span>
                  <span class="text-xl font-bold" :class="stockClass">
                    {{ product.quantity }} шт.
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Зарезервировано:</span>
                  <span class="text-gray-900 dark:text-white">0 шт.</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Доступно:</span>
                  <span class="text-gray-900 dark:text-white">{{ product.quantity }} шт.</span>
                </div>
                <div v-if="product.quantity <= 5" class="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <p class="text-xs text-yellow-700 dark:text-yellow-400">
                    ⚠️ Мало на складе. Рекомендуется пополнить запас.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <!-- Описание -->
          <Card title="Описание">
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {{ product.description || 'Нет описания' }}
            </p>
          </Card>

          <!-- Характеристики -->
          <Card title="Характеристики">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Категория</p>
                <p class="text-gray-900 dark:text-white">{{ categoryName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Бренд</p>
                <p class="text-gray-900 dark:text-white">—</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Артикул (SKU)</p>
                <p class="text-gray-900 dark:text-white">{{ product.sku }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Штрих-код</p>
                <p class="text-gray-900 dark:text-white">{{ product.barcode || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Вес (кг)</p>
                <p class="text-gray-900 dark:text-white">{{ product.weight || '—' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Размеры (Д×Ш×В)</p>
                <p class="text-gray-900 dark:text-white">
                  {{ product.dimensions ? `${product.dimensions.length}×${product.dimensions.width}×${product.dimensions.height}` : '—' }}
                </p>
              </div>
            </div>
          </Card>

          <!-- Теги -->
          <Card v-if="product.tags && product.tags.length > 0" title="Теги">
            <div class="flex flex-wrap gap-2">
              <Badge v-for="tag in product.tags" :key="tag" variant="secondary">
                {{ tag }}
              </Badge>
            </div>
          </Card>

          <!-- Дополнительная информация -->
          <Card title="Дополнительно">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Дата создания</p>
                <p class="text-gray-900 dark:text-white">{{ formatDate(product.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Последнее обновление</p>
                <p class="text-gray-900 dark:text-white">{{ formatDate(product.updatedAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Рекомендуемый</p>
                <Badge :variant="product.isFeatured ? 'success' : 'gray'">
                  {{ product.isFeatured ? 'Да' : 'Нет' }}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- История заказов с этим товаром -->
      <Card title="История заказов">
        <Table
          :columns="orderColumns"
          :data="orderHistory"
          :loading="ordersLoading"
        >
          <template #status="{ row }">
            <Badge :variant="getOrderStatusVariant(row.status)">
              {{ getOrderStatusLabel(row.status) }}
            </Badge>
          </template>
          
          <template #total="{ row }">
            {{ formatCurrency(row.total) }}
          </template>
          
          <template #date="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
          
          <template #empty>
            <div class="text-center py-8">
              <ShoppingCart class="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p class="text-gray-500 dark:text-gray-400">
                Нет заказов с этим товаром
              </p>
            </div>
          </template>
        </Table>
      </Card>
    </template>

    <!-- Товар не найден -->
    <div v-else class="text-center py-12">
      <Package class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Товар не найден
      </h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Запрошенный товар не существует или был удален
      </p>
      <Button variant="primary" @click="goBack">
        Вернуться к списку
      </Button>
    </div>

    <!-- Модальное окно редактирования (переиспользуем форму из списка) -->
    <Modal
      v-model="showEditModal"
      title="Редактировать товар"
      size="lg"
      @close="closeEditModal"
    >
      <ProductForm
        :product="product"
        :categories="categories"
        @save="handleUpdate"
        @cancel="closeEditModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { 
  ChevronRight, ArrowLeft, Edit2, Package, 
  ShoppingCart 
} from "lucide-vue-next";
import { useProductsStore } from "@/stores/products";
import { useUIStore } from "@/stores/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import Button from "@/components/ui/Button.vue";
import Card from "@/components/ui/Card.vue";
import Badge from "@/components/ui/Badge.vue";
import Table from "@/components/ui/Table.vue";
import Modal from "@/components/ui/Modal.vue";
import ProductForm from "./Form.vue"; // Создадим позже

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const uiStore = useUIStore();

const { getSelectedProduct: product, getIsLoading: isLoading, getCategories } = storeToRefs(productsStore);
const categories = computed(() => getCategories.value);

// Состояние для модалки редактирования
const showEditModal = ref(false);

// За注рузка данных
onMounted(async () => {
  const productId = route.params.id as string;
  await productsStore.fetchProductById(productId);
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

// Название категории
const categoryName = computed(() => {
  if (!product.value?.category) return "—";
  const cat = categories.value.find(c => c.id === product.value?.category);
  return cat?.name || product.value.category;
});

// Расчет маржи
const profitMargin = computed(() => {
  if (!product.value) return 0;
  return product.value.price - product.value.cost;
});

const profitMarginPercent = computed(() => {
  if (!product.value || product.value.cost === 0) return 0;
  return ((profitMargin.value / product.value.cost) * 100).toFixed(1);
});

const profitMarginClass = computed(() => {
  const margin = profitMarginPercent.value;
  if (margin >= 50) return "text-green-600 dark:text-green-400 font-medium";
  if (margin >= 20) return "text-blue-600 dark:text-blue-400";
  if (margin >= 0) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
});

// Класс для наличия
const stockClass = computed(() => {
  if (!product.value) return "";
  if (product.value.quantity === 0) return "text-red-600 dark:text-red-400";
  if (product.value.quantity <= 5) return "text-yellow-600 dark:text-yellow-400";
  return "text-green-600 dark:text-green-400";
});

// Обработка ошибок изображений
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
};

// Выбор изображения (для галереи)
const selectImage = (index: number) => {
  // Здесь можно реализовать просмотрщик изображений
  console.log('Selected image:', index);
};

// Навигация
const goBack = () => {
  router.push('/products');
};

// Редактирование
const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const handleUpdate = async (formData: any) => {
  if (!product.value) return;
  
  await productsStore.updateProduct(product.value.id, formData);
  await productsStore.fetchProductById(product.value.id);
  showEditModal.value = false;
  uiStore.addNotification("Товар обновлен", "success");
};

// История заказов (мок)
const ordersLoading = ref(false);
const orderHistory = ref([]); // Здесь будут реальные заказы из Order Store

const orderColumns = [
  { key: "id", label: "№ заказа" },
  { key: "customer", label: "Клиент" },
  { key: "quantity", label: "Кол-во", align: "right" as const },
  { key: "total", label: "Сумма", align: "right" as const },
  { key: "status", label: "Статус" },
  { key: "date", label: "Дата" },
];

const getOrderStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    delivered: "success",
    processing: "warning",
    shipped: "info",
    cancelled: "danger",
  };
  return variants[status] || "gray";
};

const getOrderStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    delivered: "Доставлен",
    processing: "В обработке",
    shipped: "Отправлен",
    cancelled: "Отменен",
  };
  return labels[status] || status;
};
</script>