<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
            <KeyRound class="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Восстановление пароля
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Введите email для сброса пароля
        </p>
      </div>

      <Card>
        <div class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Страница восстановления пароля в разработке
          </p>
          <Button variant="primary" @click="router.push('/login')">
            Вернуться ко входу
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { KeyRound } from "lucide-vue-next";
import Card from "@/components/ui/Card.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
</script>