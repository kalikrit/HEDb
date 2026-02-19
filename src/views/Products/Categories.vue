<template>
  <div class="space-y-6">
    <!-- Заголовок и кнопка добавления -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Категории товаров</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Управление категориями и подкатегориями
        </p>
      </div>
      <Button variant="primary" @click="openCreateModal">
        <Plus class="w-4 h-4 mr-2" />
        Добавить категорию
      </Button>
    </div>

    <!-- Статистика категорий -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <FolderTree class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Всего категорий</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ categories.length }}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Package class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Товаров в категориях</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalProductsInCategories }}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <Layers class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Подкатегорий</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ subcategoriesCount }}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Tag class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Без категории</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ uncategorizedCount }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Поиск -->
    <Card>
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <Input
            v-model="searchQuery"
            placeholder="Поиск категорий..."
            left-icon="Search"
            @update:model-value="debouncedSearch"
          />
        </div>
        <Button variant="outline" @click="toggleView">
          <component :is="viewIcon" class="w-4 h-4 mr-2" />
          {{ viewMode === 'grid' ? 'Список' : 'Сетка' }}
        </Button>
      </div>
    </Card>

    <!-- Сетка категорий -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CategoryCard
        v-for="category in filteredCategories"
        :key="category.id"
        :category="category"
        :products-count="category.productCount"
        @edit="editCategory"
        @delete="confirmDelete"
      />
    </div>

    <!-- Таблица категорий -->
    <Card v-else>
      <Table
        :columns="columns"
        :data="filteredCategories"
        :loading="isLoading"
        @sort="handleSort"
      >
        <template #name="{ row }">
          <div class="flex items-center">
            <div 
              class="w-8 h-8 rounded flex items-center justify-center mr-3"
              :style="{ backgroundColor: getColorForCategory(row.name) }"
            >
              <span class="text-white text-sm font-medium">{{ row.name.charAt(0) }}</span>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ row.name }}</p>
              <p v-if="row.slug" class="text-xs text-gray-500">/{{ row.slug }}</p>
            </div>
          </div>
        </template>

        <template #productCount="{ row }">
          <Badge :variant="row.productCount > 0 ? 'primary' : 'gray'">
            {{ row.productCount }} товаров
          </Badge>
        </template>

        <template #parentId="{ row }">
          <span v-if="row.parentId" class="text-gray-600 dark:text-gray-400">
            {{ getCategoryName(row.parentId) }}
          </span>
          <span v-else class="text-gray-400">—</span>
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              @click="editCategory(row)"
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
              :disabled="row.productCount > 0"
            >
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-12">
            <FolderTree class="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Категории не найдены
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              {{ searchQuery ? 'Попробуйте изменить поиск' : 'Создайте первую категорию' }}
            </p>
            <Button variant="primary" @click="openCreateModal">
              Добавить категорию
            </Button>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Модальное окно для создания/редактирования категории -->
    <Modal
      v-model="showModal"
      :title="modalTitle"
      @close="closeModal"
    >
      <form @submit.prevent="saveCategory" class="space-y-4">
        <Input
          v-model="form.name"
          label="Название категории"
          placeholder="например: Электроника"
          :error="errors.name"
          required
        />

        <Input
          v-model="form.slug"
          label="URL-адрес (slug)"
          placeholder="например: electronics"
          :error="errors.slug"
          required
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Родительская категория
          </label>
          <select
            v-model="form.parentId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">— Корневая категория —</option>
            <option
              v-for="cat in rootCategories"
              :key="cat.id"
              :value="cat.id"
              :disabled="cat.id === editingId"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <Input
          v-model="form.description"
          label="Описание"
          type="textarea"
          placeholder="Описание категории (необязательно)"
          rows="3"
        />

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
      title="Удаление категории"
      size="sm"
    >
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Вы уверены, что хотите удалить категорию "{{ deletingCategory?.name }}"?
        {{ deletingCategory?.productCount ? `В ней ${deletingCategory.productCount} товаров. ` : '' }}
        Это действие нельзя отменить.
      </p>
      <div class="flex justify-end gap-2">
        <Button variant="secondary" @click="showDeleteModal = false">
          Отмена
        </Button>
        <Button variant="danger" @click="deleteCategory" :loading="deleting">
          Удалить
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { 
  Plus, Search, Edit2, Trash2, FolderTree, Package, 
  Layers, Tag, Grid3x3, List 
} from "lucide-vue-next";
import { useProductsStore } from "../../stores/products";
import { useUIStore } from "../../stores/ui";
import type { ProductCategory } from "../../types";
import Button from "../../components/ui/Button.vue";
import Input from "../../components/ui/Input.vue";
import Card from "../../components/ui/Card.vue";
import Table from "../../components/ui/Table.vue";
import Badge from "../../components/ui/Badge.vue";
import Modal from "../../components/ui/Modal.vue";
import CategoryCard from "./CategoryCard.vue";

const productsStore = useProductsStore();
const uiStore = useUIStore();

const { getCategories: categories, getIsLoading: isLoading } = storeToRefs(productsStore);

// Состояние
const searchQuery = ref("");
const viewMode = ref<"grid" | "table">("grid");
const showModal = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const showDeleteModal = ref(false);
const deletingCategory = ref<ProductCategory | null>(null);
const deleting = ref(false);

// Форма
const form = reactive({
  name: "",
  slug: "",
  description: "",
  parentId: "",
});

const errors = ref<Record<string, string>>({});

// Колонки таблицы
const columns = [
  { key: "name", label: "Категория", sortable: true },
  { key: "productCount", label: "Товаров", sortable: true, align: "center" as const },
  { key: "parentId", label: "Родитель", sortable: true },
  { key: "actions", label: "", sortable: false, align: "right" as const },
];

// Вычисляемые свойства
const modalTitle = computed(() => 
  editingId.value ? "Редактировать категорию" : "Новая категория"
);

const viewIcon = computed(() => viewMode.value === "grid" ? List : Grid3x3);

// Фильтрация категорий
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  
  const query = searchQuery.value.toLowerCase();
  return categories.value.filter(cat => 
    cat.name.toLowerCase().includes(query) ||
    cat.slug.toLowerCase().includes(query) ||
    (cat.description && cat.description.toLowerCase().includes(query))
  );
});

// Корневые категории (для выбора родителя)
const rootCategories = computed(() => 
  categories.value.filter(cat => !cat.parentId)
);

// Статистика
const totalProductsInCategories = computed(() => 
  categories.value.reduce((sum, cat) => sum + cat.productCount, 0)
);

const subcategoriesCount = computed(() => 
  categories.value.filter(cat => cat.parentId).length
);

const uncategorizedCount = computed(() => {
  // Здесь должна быть логика подсчета товаров без категории
  // Из продуктов, у которых category === "" или null
  return 0;
});

// Вспомогательные функции
const getCategoryName = (id: string) => {
  const cat = categories.value.find(c => c.id === id);
  return cat?.name || id;
};

const getColorForCategory = (name: string) => {
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
    "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
    "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#FF5722",
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

// Методы
const openCreateModal = () => {
  editingId.value = null;
  Object.assign(form, {
    name: "",
    slug: "",
    description: "",
    parentId: "",
  });
  errors.value = {};
  showModal.value = true;
};

const editCategory = (category: ProductCategory) => {
  editingId.value = category.id;
  Object.assign(form, {
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    parentId: category.parentId || "",
  });
  errors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingId.value = null;
};

const saveCategory = async () => {
  errors.value = {};
  
  // Простая валидация
  if (!form.name) {
    errors.value.name = "Название обязательно";
    return;
  }
  
  if (!form.slug) {
    errors.value.slug = "URL-адрес обязателен";
    return;
  }
  
  // Проверка уникальности slug
  const existing = categories.value.find(c => 
    c.slug === form.slug && c.id !== editingId.value
  );
  
  if (existing) {
    errors.value.slug = "Такой URL уже существует";
    return;
  }
  
  saving.value = true;
  
  try {
    if (editingId.value) {
      // Обновление существующей категории
      const index = categories.value.findIndex(c => c.id === editingId.value);
      if (index !== -1) {
        categories.value[index] = {
          ...categories.value[index],
          name: form.name,
          slug: form.slug,
          description: form.description || undefined,
          parentId: form.parentId || undefined,
        };
      }
      uiStore.addNotification("Категория обновлена", "success");
    } else {
      // Создание новой категории
      const newCategory: ProductCategory = {
        id: `cat-${Date.now()}`,
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        parentId: form.parentId || undefined,
        productCount: 0,
      };
      categories.value.push(newCategory);
      uiStore.addNotification("Категория создана", "success");
    }
    
    closeModal();
  } catch (error) {
    uiStore.addNotification("Ошибка при сохранении", "error");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (category: ProductCategory) => {
  if (category.productCount > 0) {
    uiStore.addNotification(
      "Нельзя удалить категорию с товарами. Сначала переместите товары",
      "error"
    );
    return;
  }
  
  // Проверка на подкатегории
  const hasSubcategories = categories.value.some(c => c.parentId === category.id);
  if (hasSubcategories) {
    uiStore.addNotification(
      "Нельзя удалить категорию с подкатегориями",
      "error"
    );
    return;
  }
  
  deletingCategory.value = category;
  showDeleteModal.value = true;
};

const deleteCategory = async () => {
  if (!deletingCategory.value) return;
  
  deleting.value = true;
  
  try {
    const index = categories.value.findIndex(c => c.id === deletingCategory.value?.id);
    if (index !== -1) {
      categories.value.splice(index, 1);
      uiStore.addNotification("Категория удалена", "success");
    }
    showDeleteModal.value = false;
  } catch (error) {
    uiStore.addNotification("Ошибка при удалении", "error");
  } finally {
    deleting.value = false;
    deletingCategory.value = null;
  }
};

const toggleView = () => {
  viewMode.value = viewMode.value === "grid" ? "table" : "grid";
};

const debouncedSearch = (value: string) => {
  searchQuery.value = value;
};

const handleSort = (key: string, order: string) => {
  console.log("Sort categories:", key, order);
};

onMounted(() => {
  // Загрузка категорий
});
</script>