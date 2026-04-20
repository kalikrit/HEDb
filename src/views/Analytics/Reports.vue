<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Отчёты</h1>
    </div>

    <Card>
      <div class="p-8 text-center text-gray-500 dark:text-gray-400">
        <FileText class="w-12 h-12 mx-auto mb-3" />
        <h3 class="text-lg font-medium mb-2">Страница в разработке</h3>
        <p>Здесь будут готовые отчёты и экспорт данных</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { FileText } from "lucide-vue-next";
import Card from "@/components/ui/Card.vue";
</script>