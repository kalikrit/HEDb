import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

// Импортируем stores
import { useUIStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Инициализация stores после создания приложения
app.mount("#app");

const uiStore = useUIStore();
const authStore = useAuthStore();

uiStore.init();
authStore.init();

// Экспортируем stores для использования в devtools
if (import.meta.env.DEV) {
  window.__PINIA_STORES__ = { uiStore, authStore };
}
