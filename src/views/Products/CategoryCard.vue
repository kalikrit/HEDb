<template>
  <Card class="hover:shadow-lg transition-shadow group">
    <div class="relative">
      <!-- Цветной заголовок -->
      <div 
        class="h-20 rounded-t-lg flex items-end justify-start p-4"
        :style="{ backgroundColor: categoryColor }"
      >
        <h3 class="text-xl font-bold text-white">{{ category.name }}</h3>
      </div>

      <!-- Контент -->
      <div class="p-4">
        <!-- Slug и описание -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
          /{{ category.slug }}
        </p>
        
        <p v-if="category.description" class="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {{ truncateText(category.description, 60) }}
        </p>

        <!-- Статистика -->
        <div class="flex items-center justify-between text-sm mb-4">
          <div class="flex items-center text-gray-600 dark:text-gray-400">
            <Package class="w-4 h-4 mr-1" />
            <span>{{ category.productCount }} товаров</span>
          </div>
          
          <div v-if="parentCategory" class="flex items-center text-gray-600 dark:text-gray-400">
            <Layers class="w-4 h-4 mr-1" />
            <span>{{ parentCategory.name }}</span>
          </div>
        </div>

        <!-- Подкатегории (если есть) -->
        <div v-if="subcategories.length > 0" class="mb-4">
          <p class="text-xs font-medium text-gray-500 uppercase mb-2">Подкатегории:</p>
          <div class="flex flex-wrap gap-1">
            <router-link
              v-for="sub in subcategories"
              :key="sub.id"
              :to="`/products?category=${sub.id}`"
              class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {{ sub.name }}
            </router-link>
          </div>
        </div>

        <!-- Действия -->
        <div class="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            size="sm"
            variant="ghost"
            @click="$emit('edit', category)"
          >
            <Edit2 class="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            class="text-red-600 hover:text-red-700"
            @click="$emit('delete', category)"
            :disabled="category.productCount > 0 || subcategories.length > 0"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <!-- Счетчик товаров в углу -->
      <div 
        class="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md"
        :class="{
          'text-green-600': category.productCount > 10,
          'text-yellow-600': category.productCount > 0 && category.productCount <= 10,
          'text-gray-400': category.productCount === 0
        }"
      >
        <span class="text-xs font-bold">{{ category.productCount }}</span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { Edit2, Trash2, Package, Layers } from "lucide-vue-next";
import { useProductsStore } from "@/stores/products";
import type { ProductCategory } from "../../types";
import Card from "../../components/ui/Card.vue";
import Button from "../../components/ui/Button.vue";

interface Props {
  category: ProductCategory;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "edit", category: ProductCategory): void;
  (e: "delete", category: ProductCategory): void;
}>();

const productsStore = useProductsStore();
const { getCategories: categories } = storeToRefs(productsStore);

// Родительская категория
const parentCategory = computed(() => {
  if (!props.category.parentId) return null;
  return categories.value.find(c => c.id === props.category.parentId);
});

// Подкатегории
const subcategories = computed(() => {
  return categories.value.filter(c => c.parentId === props.category.id);
});

// Цвет для категории (на основе названия)
const categoryColor = computed(() => {
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
    "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
    "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#FF5722",
  ];
  const index = props.category.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
});

// Обрезка текста
const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};
</script>