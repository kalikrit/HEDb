<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
    <template v-if="!isAuthPage">
      <Sidebar />
      
      <!-- Простейшая проверка - без computed, без классов -->
      <div 
        class="min-h-screen flex flex-col"
        :style="{
          marginLeft: isSidebarOpen ? '256px' : '0',
          width: isSidebarOpen ? 'calc(100% - 256px)' : '100%'
        }"
      >
        <Header />
        
        <main class="flex-1 w-full">
          <div class="h-full p-4 sm:p-6 lg:p-8">
            <router-view />
          </div>
        </main>
      </div>
    </template>

    <template v-else>
      <router-view />
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, watch, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Sidebar from "../src/layouts/Sidebar.vue";
import Header from "../src/layouts/Header.vue";
import { useUIStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";

const uiStore = useUIStore();
const authStore = useAuthStore();
const route = useRoute();

const { isLoading, isSidebarOpen } = storeToRefs(uiStore);

// Просто вычисляем класс
const contentStyle = computed(() => {
  if (isSidebarOpen.value) {
    return {
      marginLeft: '256px',
      width: 'calc(100% - 256px)'
    };
  } else {
    return {
      marginLeft: '0',
      width: '100%'
    };
  }
});

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path === '/forgot-password';
});

onMounted(() => {
  authStore.init();
});
</script>
<style scoped>
/* МАКСИМАЛЬНЫЙ ПРИОРИТЕТ */
.force-sidebar-open {
  margin-left: 256px !important;
  width: calc(100% - 256px) !important;
  max-width: none !important;
  flex: 1 1 auto !important;
  transition: all 0.3s ease !important;
}

.force-sidebar-closed {
  margin-left: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  flex: 1 1 auto !important;
  transition: all 0.3s ease !important;
}

/* Убираем возможные ограничения */
.min-h-screen.flex.flex-col {
  min-height: 100vh;
  display: flex !important;
  flex-direction: column !important;
  position: relative;
  box-sizing: border-box;
}

/* Принудительно для всех дочерних */
.min-h-screen.flex.flex-col > * {
  max-width: none !important;
}
</style>