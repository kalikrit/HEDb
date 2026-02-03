<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
      Tailwind CSS v3 работает! 🎉
    </h1>
    
    <div class="space-y-4">
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p class="text-gray-700 dark:text-gray-300">
          Если вы видите этот текст со стилями, Tailwind работает правильно.
        </p>
      </div>
      
      <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
        Primary Button
      </button>
      
      <div class="flex space-x-4">
        <div class="w-8 h-8 bg-primary-50 rounded"></div>
        <div class="w-8 h-8 bg-primary-100 rounded"></div>
        <div class="w-8 h-8 bg-primary-500 rounded"></div>
        <div class="w-8 h-8 bg-primary-600 rounded"></div>
        <div class="w-8 h-8 bg-primary-700 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Test App
</script>
