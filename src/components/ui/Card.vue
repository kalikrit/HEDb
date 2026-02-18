<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden',
      paddingClasses,
      hoverable && 'transition-shadow duration-200 hover:shadow-md cursor-pointer',
      className,
    ]"
  >
    <!-- Шапка карточки (опционально) -->
    <div v-if="hasHeader || title" class="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <slot name="header" />
      </div>
    </div>

    <!-- Основной контент -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- Футер карточки (опционально) -->
    <div v-if="hasFooter" class="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

interface Props {
  title?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  noPadding?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  padding: "md",
  hoverable: false,
  noPadding: false,
  class: "",
});

const slots = useSlots();

// Проверяем наличие слотов
const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);

const paddingClasses = computed(() => {
  if (props.noPadding) return "";
  
  const classes = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return classes[props.padding];
});

const contentClasses = computed(() => {
  // Если есть шапка, то внутренний padding уже в ней
  // Если нет, то применяем padding к контенту
  if (hasHeader.value || props.title) {
    return "p-6";
  }
  return paddingClasses.value;
});

const className = computed(() => props.class);
</script>