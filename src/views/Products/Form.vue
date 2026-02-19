<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Основная информация -->
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
      rows="4"
    />

    <!-- Цены -->
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

    <!-- Себестоимость и количество -->
    <div class="grid grid-cols-2 gap-4">
      <Input
        v-model.number="form.cost"
        label="Себестоимость"
        type="number"
        :error="errors.cost"
        left-icon="DollarSign"
        required
      />
      <Input
        v-model.number="form.quantity"
        label="Количество"
        type="number"
        :error="errors.quantity"
        required
      />
    </div>

    <!-- Категория и статус -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Категория
        </label>
        <select
          v-model="form.category"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          :class="{ 'border-red-500': errors.category }"
        >
          <option value="">Выберите категорию</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <p v-if="errors.category" class="mt-1 text-sm text-red-600">
          {{ errors.category }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Статус
        </label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="active">Активен</option>
          <option value="draft">Черновик</option>
          <option value="archived">Архив</option>
          <option value="out_of_stock">Нет в наличии</option>
        </select>
      </div>
    </div>

    <!-- Дополнительные параметры -->
    <div class="grid grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Вес (кг)
        </label>
        <Input
          v-model.number="form.weight"
          type="number"
          step="0.1"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Штрих-код
        </label>
        <Input
          v-model="form.barcode"
        />
      </div>
      <div class="flex items-center">
        <label class="flex items-center cursor-pointer">
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
    </div>

    <!-- Размеры (опционально) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Размеры (Д × Ш × В, см)
      </label>
      <div class="grid grid-cols-3 gap-2">
        <Input
          v-model.number="form.dimensions.length"
          placeholder="Длина"
          type="number"
        />
        <Input
          v-model.number="form.dimensions.width"
          placeholder="Ширина"
          type="number"
        />
        <Input
          v-model.number="form.dimensions.height"
          placeholder="Высота"
          type="number"
        />
      </div>
    </div>

    <!-- Теги -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Теги (через запятую)
      </label>
      <Input
        v-model="tagsInput"
        placeholder="например: новый, популярный, хит"
        @update:model-value="updateTags"
      />
    </div>

    <!-- Кнопки -->
    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" variant="secondary" @click="$emit('cancel')">
        Отмена
      </Button>
      <Button type="submit" variant="primary" :loading="saving">
        Сохранить
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { DollarSign } from "lucide-vue-next";
import { productSchema } from "@/utils/validators";
import type { Product, ProductCategory } from "@/types";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";

interface Props {
  product?: Product | null;
  categories: ProductCategory[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "save", data: any): void;
  (e: "cancel"): void;
}>();

// Состояние формы
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
  weight: undefined as number | undefined,
  barcode: undefined as string | undefined,
  dimensions: {
    length: undefined as number | undefined,
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  },
  tags: [] as string[],
  images: [] as string[],
});

const tagsInput = ref("");
const errors = ref<Record<string, string>>({});
const saving = ref(false);

// Заполняем форму при редактировании
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    Object.assign(form, {
      name: newProduct.name,
      sku: newProduct.sku,
      description: newProduct.description,
      price: newProduct.price,
      comparePrice: newProduct.comparePrice,
      cost: newProduct.cost,
      quantity: newProduct.quantity,
      category: newProduct.category,
      status: newProduct.status,
      isFeatured: newProduct.isFeatured,
      weight: newProduct.weight,
      barcode: newProduct.barcode,
      dimensions: newProduct.dimensions || { length: undefined, width: undefined, height: undefined },
      tags: newProduct.tags || [],
      images: newProduct.images || [],
    });
    
    tagsInput.value = (newProduct.tags || []).join(", ");
  }
}, { immediate: true });

// Обновление тегов
const updateTags = (value: string) => {
  form.tags = value.split(",")
    .map(t => t.trim())
    .filter(t => t.length > 0);
};

// Валидация и отправка
const handleSubmit = async () => {
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
    emit("save", { ...form });
  } finally {
    saving.value = false;
  }
};
</script>