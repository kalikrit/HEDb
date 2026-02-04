// Константы приложения
export const APP_NAME = "E-commerce Dashboard";
export const APP_VERSION = "1.0.0";

// API конфигурация
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// WebSocket конфигурация
export const WS_CONFIG = {
  URL: import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws",
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 10,
} as const;

// Пагинация
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 50, 100],
} as const;

// Статусы заказов
export const ORDER_STATUSES = [
  { value: "pending", label: "Ожидание", color: "yellow" },
  { value: "processing", label: "В обработке", color: "blue" },
  { value: "shipped", label: "Отправлен", color: "purple" },
  { value: "delivered", label: "Доставлен", color: "green" },
  { value: "cancelled", label: "Отменен", color: "red" },
  { value: "refunded", label: "Возврат", color: "gray" },
] as const;

// Статусы товаров
export const PRODUCT_STATUSES = [
  { value: "active", label: "Активен", color: "green" },
  { value: "draft", label: "Черновик", color: "gray" },
  { value: "archived", label: "Архив", color: "red" },
  { value: "out_of_stock", label: "Нет в наличии", color: "orange" },
] as const;

// Категории по умолчанию
export const DEFAULT_CATEGORIES = [
  { id: "electronics", name: "Электроника", slug: "electronics" },
  { id: "clothing", name: "Одежда", slug: "clothing" },
  { id: "books", name: "Книги", slug: "books" },
  { id: "home", name: "Дом и сад", slug: "home" },
  { id: "sports", name: "Спорт", slug: "sports" },
  { id: "beauty", name: "Красота", slug: "beauty" },
] as const;

// Цветовая палитра для графиков
export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  accent: "#8b5cf6",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  gray: "#6b7280",
} as const;

export const CHART_COLORS_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.info,
  CHART_COLORS.gray,
];

// Настройки уведомлений
export const NOTIFICATION_SETTINGS = {
  AUTO_HIDE_DELAY: 5000,
  MAX_VISIBLE: 5,
  POLL_INTERVAL: 30000, // 30 секунд
} as const;

// Ключи для localStorage
export const STORAGE_KEYS = {
  THEME: "app-theme",
  LANGUAGE: "app-language",
  SIDEBAR_STATE: "sidebar-state",
  AUTH_TOKEN: "auth-token",
  USER_DATA: "user-data",
} as const;

// Настройки экспорта
export const EXPORT_FORMATS = {
  CSV: { label: "CSV", extension: ".csv" },
  JSON: { label: "JSON", extension: ".json" },
  EXCEL: { label: "Excel", extension: ".xlsx" },
} as const;

// Максимальные значения
export const MAX_VALUES = {
  PRODUCT_NAME: 200,
  PRODUCT_DESCRIPTION: 2000,
  PRODUCT_SKU: 50,
  PRODUCT_TAGS: 10,
  ORDER_NOTES: 500,
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const;

// Форматы дат
export const DATE_FORMATS = {
  DISPLAY: "DD.MM.YYYY",
  DISPLAY_WITH_TIME: "DD.MM.YYYY HH:mm",
  API: "YYYY-MM-DD",
  API_WITH_TIME: "YYYY-MM-DDTHH:mm:ss",
  CHART: "MMM DD",
} as const;
