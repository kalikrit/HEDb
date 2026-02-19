<template>
  <div class="space-y-6">
    <!-- Хлебные крошки -->
    <div class="flex items-center space-x-2 text-sm">
      <router-link to="/products" class="text-primary-600 hover:text-primary-700 dark:text-primary-400">
        Товары
      </router-link>
      <ChevronRight class="w-4 h-4 text-gray-400" />
      <span class="text-gray-600 dark:text-gray-400">Новый товар</span>
    </div>

    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Новый товар</h1>
      <Button variant="outline" @click="goBack">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Назад
      </Button>
    </div>

    <!-- Форма товара -->
    <Card>
      <ProductForm
        :categories="categories"
        @save="handleSave"
        @cancel="goBack"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ChevronRight, ArrowLeft } from "lucide-vue-next";
import { useProductsStore } from "@/stores/products";
import { useUIStore } from "@/stores/ui";
import ProductForm from "./Form.vue";
import Card from "../../components/ui/Card.vue";
import Button from "../../components/ui/Button.vue";

const router = useRouter();
const productsStore = useProductsStore();
const uiStore = useUIStore();

const { getCategories } = storeToRefs(productsStore);
const categories = getCategories;

const goBack = () => {
  router.push('/products');
};

const handleSave = async (formData: any) => {
  try {
    await productsStore.createProduct(formData);
    uiStore.addNotification("Товар успешно создан", "success");
    router.push('/products');
  } catch (error) {
    uiStore.addNotification("Ошибка при создании товара", "error");
  }
};
</script>