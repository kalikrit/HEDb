import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUIStore = defineStore("ui", () => {
  // Состояние
  const isSidebarOpen = ref(true);
  const theme = ref<"light" | "dark">("light");
  const isLoading = ref(false);

  // Геттеры
  const getTheme = computed(() => theme.value);
  const getIsSidebarOpen = computed(() => isSidebarOpen.value);
  const getIsLoading = computed(() => isLoading.value);

  // Действия
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    // Применяем тему к документу
    if (theme.value === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  // Инициализация темы
  const initTheme = () => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    theme.value = savedTheme || (prefersDark ? "dark" : "light");
    
    if (theme.value === "dark") {
      document.documentElement.classList.add("dark");
    }
    
    // Сохраняем тему при изменении
    watch(theme, (newTheme) => {
      localStorage.setItem("theme", newTheme);
    });
  };

  return {
    // Состояние
    isSidebarOpen,
    theme,
    isLoading,
    
    // Геттеры
    getTheme,
    getIsSidebarOpen,
    getIsLoading,
    
    // Действия
    toggleSidebar,
    toggleTheme,
    setLoading,
    initTheme,
  };
});
