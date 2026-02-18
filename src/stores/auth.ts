import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/types";
import { STORAGE_KEYS } from "@/utils/constants";

// Mock данные для демо
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Администратор",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Менеджер",
    email: "manager@example.com",
    role: "manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=manager",
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = defineStore("auth", () => {
  // ==================== State ====================
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);

  // ==================== Getters ====================
  const getUser = computed(() => user.value);
  const getToken = computed(() => token.value);
  const getIsAuthenticated = computed(() => isAuthenticated.value);
  const getIsLoading = computed(() => isLoading.value);
  const getUserRole = computed(() => user.value?.role || "viewer");
  const getIsAdmin = computed(() => user.value?.role === "admin");
  const getIsManager = computed(() => user.value?.role === "manager" || user.value?.role === "admin");

  // ==================== Actions ====================

  // Вход в систему
  const login = async (email: string, password: string) => {
    isLoading.value = true;
    
    try {
      // Mock аутентификация
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Пользователь не найден");
      }
      
      // В реальном приложении здесь был бы запрос к API
      user.value = foundUser;
      token.value = "mock-jwt-token-" + Date.now();
      isAuthenticated.value = true;
      
      // Сохраняем в localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token.value);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user.value));
      
      return { success: true, user: user.value };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Ошибка аутентификации" 
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Выход из системы
  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    
    // Очищаем localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  };

  // Проверка токена
  const checkAuth = () => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken;
        user.value = JSON.parse(savedUser);
        isAuthenticated.value = true;
        return true;
      } catch {
        logout();
        return false;
      }
    }
    return false;
  };

  // Обновление профиля
  const updateProfile = async (data: Partial<User>) => {
    if (!user.value) return { success: false, error: "Пользователь не авторизован" };
    
    try {
      // Mock обновление
      await new Promise(resolve => setTimeout(resolve, 500));
      
      user.value = { ...user.value, ...data };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user.value));
      
      return { success: true, user: user.value };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Ошибка обновления" 
      };
    }
  };

  // Изменение пароля
  const changePassword = async (oldPassword: string, newPassword: string) => {
    // Mock изменение пароля
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (oldPassword === "password" && newPassword.length >= 6) {
      return { success: true };
    }
    
    return { success: false, error: "Неверный текущий пароль" };
  };

  // ==================== Инициализация ====================
  const init = () => {
    checkAuth();
  };

  // ==================== Экспорт ====================
  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    login,

    // Getters
    getUser,
    getToken,
    getIsAuthenticated,
    getIsLoading,
    getUserRole,
    getIsAdmin,
    getIsManager,

    // Actions
    login,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    init,
  };
});
