<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <!-- Заголовок -->
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            :class="column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'"
          >
            <div class="flex items-center gap-1" :class="column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'">
              {{ column.label }}
              
              <!-- Сортировка -->
              <button
                v-if="column.sortable"
                @click="sort(column.key)"
                class="ml-1 focus:outline-none"
              >
                <ArrowUp
                  v-if="sortKey === column.key && sortOrder === 'asc'"
                  class="w-4 h-4 text-primary-600"
                />
                <ArrowDown
                  v-else-if="sortKey === column.key && sortOrder === 'desc'"
                  class="w-4 h-4 text-primary-600"
                />
                <ArrowUpDown v-else class="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </th>
        </tr>
      </thead>
      
      <!-- Тело таблицы -->
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          :class="[
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            rowClass?.(row),
          ]"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
            :class="column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'"
          >
            <slot :name="column.key" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
        
        <!-- Пустое состояние -->
        <tr v-if="data.length === 0">
          <td
            :colspan="columns.length"
            class="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            <slot name="empty">
              <div class="flex flex-col items-center">
                <PackageOpen class="w-12 h-12 mb-3 text-gray-400" />
                <p>Нет данных для отображения</p>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <!-- Пагинация -->
  <div v-if="pagination" class="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Показано с {{ (page - 1) * perPage + 1 }} по {{ Math.min(page * perPage, total) }} из {{ total }}
      </div>
      
      <div class="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          :disabled="page === 1"
          @click="$emit('page-change', page - 1)"
        >
          Назад
        </Button>
        <Button
          size="sm"
          variant="outline"
          :disabled="page >= Math.ceil(total / perPage)"
          @click="$emit('page-change', page + 1)"
        >
          Вперед
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ArrowUp, ArrowDown, ArrowUpDown, PackageOpen } from "lucide-vue-next";
import Button from "./Button.vue";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface Props {
  columns: TableColumn[];
  data: Record<string, any>[];
  pagination?: boolean;
  total?: number;
  page?: number;
  perPage?: number;
  rowClass?: (row: Record<string, any>) => string;
}

const props = withDefaults(defineProps<Props>(), {
  pagination: false,
  total: 0,
  page: 1,
  perPage: 20,
});

const emit = defineEmits<{
  (e: "sort", key: string, order: "asc" | "desc"): void;
  (e: "page-change", page: number): void;
}>();

const sortKey = ref<string>("");
const sortOrder = ref<"asc" | "desc">("asc");

const sort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
  
  emit("sort", sortKey.value, sortOrder.value);
};
</script>