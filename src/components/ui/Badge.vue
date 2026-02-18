<template>
  <span
    :class="[
      'inline-flex items-center rounded-full font-medium',
      sizeClasses,
      variantClasses,
      className,
    ]"
  >
    <!-- Точка для статуса -->
    <span
      v-if="dot"
      class="w-1.5 h-1.5 rounded-full mr-1.5"
      :class="dotColorClasses"
    />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "secondary"
  | "gray";
type BadgeSize = "sm" | "md";

interface Props {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "gray",
  size: "md",
  dot: false,
  class: "",
});

const variantClasses = computed(() => {
  const classes = {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };
  return classes[props.variant];
});

const sizeClasses = computed(() => {
  const classes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };
  return classes[props.size];
});

const dotColorClasses = computed(() => {
  const classes = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    primary: "bg-primary-500",
    secondary: "bg-gray-500",
    gray: "bg-gray-500",
  };
  return classes[props.variant];
});

const className = computed(() => props.class);
</script>