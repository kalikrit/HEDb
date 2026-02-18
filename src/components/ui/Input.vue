<template>
  <div class="w-full">
    <!-- Лейбл -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Контейнер инпута -->
    <div class="relative">
      <!-- Иконка слева -->
      <div
        v-if="leftIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component :is="leftIcon" class="h-5 w-5 text-gray-400" />
      </div>

      <!-- Инпут -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        v-bind="$attrs"
        @input="onInput"
        @blur="onBlur"
        :class="[
          'block w-full rounded-lg border transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          leftIcon ? 'pl-10' : 'pl-4',
          rightIcon ? 'pr-10' : 'pr-4',
          sizeClasses,
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
          disabled && 'bg-gray-100 cursor-not-allowed',
        ]"
      />

      <!-- Иконка справа -->
      <div
        v-if="rightIcon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component :is="rightIcon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-500">
      {{ error }}
    </p>

    <!-- Хелпер текст -->
    <p v-if="helper" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import * as Icons from "lucide-vue-next";

type InputSize = "sm" | "md" | "lg";
type InputType = "text" | "email" | "password" | "number" | "tel" | "url";

interface Props {
  id?: string;
  modelValue?: string | number;
  label?: string;
  type?: InputType;
  placeholder?: string;
  error?: string;
  helper?: string;
  leftIcon?: keyof typeof Icons;
  rightIcon?: keyof typeof Icons;
  size?: InputSize;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  size: "md",
  disabled: false,
  readonly: false,
  required: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "blur", event: FocusEvent): void;
}>();

const sizeClasses = computed(() => {
  const classes = {
    sm: "py-1.5 text-sm",
    md: "py-2 text-base",
    lg: "py-3 text-lg",
  };
  return classes[props.size];
});

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const onBlur = (event: FocusEvent) => {
  emit("blur", event);
};
</script>