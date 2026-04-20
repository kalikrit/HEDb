<template>
  <div class="flex flex-wrap gap-2 items-center">
    <!-- Быстрые периоды -->
    <div class="flex gap-1">
      <Button
        v-for="preset in presets"
        :key="preset.value"
        :variant="selectedPreset === preset.value ? 'primary' : 'outline'"
        size="sm"
        @click="selectPreset(preset.value)"
      >
        {{ preset.label }}
      </Button>
    </div>

    <!-- Произвольный диапазон -->
    <div class="flex items-center gap-2">
      <input
        type="date"
        :value="startDate"
        @input="onStartChange"
        class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
      />
      <span class="text-gray-500">—</span>
      <input
        type="date"
        :value="endDate"
        @input="onEndChange"
        class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import Button from "./Button.vue";

const presets = [
  { label: "Сегодня", value: "today" },
  { label: "Неделя", value: "week" },
  { label: "Месяц", value: "month" },
  { label: "Квартал", value: "quarter" },
  { label: "Год", value: "year" },
  { label: "Всё время", value: "all" },
];

const emit = defineEmits<{
  (e: "update", start: string, end: string): void;
}>();

const selectedPreset = ref("month");
const startDate = ref("");
const endDate = ref("");

// Функция установки дат по пресету
const setDatesFromPreset = (preset: string) => {
  const now = dayjs();
  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs = now;

  switch (preset) {
    case "today":
      start = now.startOf("day");
      end = now.endOf("day");
      break;
    case "week":
      start = now.subtract(7, "day");
      break;
    case "month":
      start = now.subtract(30, "day");
      break;
    case "quarter":
      start = now.subtract(90, "day");
      break;
    case "year":
      start = now.subtract(365, "day");
      break;
    default: // all
      start = dayjs("2020-01-01"); // Достаточно ранняя дата
      break;
  }

  startDate.value = start.format("YYYY-MM-DD");
  endDate.value = end.format("YYYY-MM-DD");
  emit("update", startDate.value, endDate.value);
};

const selectPreset = (preset: string) => {
  selectedPreset.value = preset;
  setDatesFromPreset(preset);
};

const onStartChange = (e: Event) => {
  selectedPreset.value = "";
  startDate.value = (e.target as HTMLInputElement).value;
  if (startDate.value && endDate.value) {
    emit("update", startDate.value, endDate.value);
  }
};

const onEndChange = (e: Event) => {
  selectedPreset.value = "";
  endDate.value = (e.target as HTMLInputElement).value;
  if (startDate.value && endDate.value) {
    emit("update", startDate.value, endDate.value);
  }
};

// Инициализация (по умолчанию месяц)
setDatesFromPreset("month");
</script>