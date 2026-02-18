<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-extrabold text-primary-600 dark:text-primary-400">404</h1>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-4">
        Страница не найдена
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2 mb-8">
        Извините, запрашиваемая страница не существует
      </p>
      <Button variant="primary" @click="router.push('/')">
        Вернуться на главную
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
</script>