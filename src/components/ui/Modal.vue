<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Затемнение фона -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
          @click="closeOnClickOutside && close()"
        />

        <!-- Контейнер с центрированием -->
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full"
              :class="sizeClasses"
            >
              <!-- Кнопка закрытия -->
              <button
                v-if="showClose"
                @click="close"
                class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <X class="h-5 w-5" />
              </button>

              <!-- Заголовок -->
              <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <slot name="header">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ title }}
                  </h3>
                </slot>
              </div>

              <!-- Контент -->
              <div class="px-6 py-4">
                <slot />
              </div>

              <!-- Футер с кнопками -->
              <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface Props {
  modelValue: boolean;
  title?: string;
  size?: ModalSize;
  showClose?: boolean;
  closeOnClickOutside?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  showClose: true,
  closeOnClickOutside: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const sizeClasses = computed(() => {
  const classes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };
  return classes[props.size];
});

const close = () => {
  emit("update:modelValue", false);
};
</script>