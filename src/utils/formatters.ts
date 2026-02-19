import dayjs from "dayjs";
import "dayjs/locale/ru";

// Форматирование дат
export const formatDate = (
  date: string | Date,
  format = "DD.MM.YYYY"
): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (
  date: string | Date,
  format = "DD.MM.YYYY HH:mm"
): string => {
  return dayjs(date).format(format);
};

export const formatTime = (
  date: string | Date,
  format = "HH:mm"
): string => {
  return dayjs(date).format(format);
};

export const formatTimeAgo = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);
  const diffInMinutes = now.diff(target, "minute");
  const diffInHours = now.diff(target, "hour");
  const diffInDays = now.diff(target, "day");

  if (diffInMinutes < 1) return "Только что";
  if (diffInMinutes < 60) return `${diffInMinutes} мин. назад`;
  if (diffInHours < 24) return `${diffInHours} ч. назад`;
  if (diffInDays < 7) return `${diffInDays} дн. назад`;
  return formatDate(date);
};

// Форматирование валют
export const formatCurrency = (
  amount: number,
  currency = "RUB",
  locale = "ru-RU"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrencyCompact = (
  amount: number,
  currency = "RUB"
): string => {
  if (Math.abs(amount) >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${currency}`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${(amount / 1000).toFixed(1)}K ${currency}`;
  }
  return formatCurrency(amount, currency);
};

// Форматирование чисел
export const formatNumber = (
  num: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat("ru-RU", options).format(num);
};

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
};

// Форматирование статусов
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Ожидание",
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменен",
    refunded: "Возврат",
  };
  return statusMap[status] || status;
};

export const formatProductStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "Активен",
    draft: "Черновик",
    archived: "Архив",
    out_of_stock: "Нет в наличии",
  };
  return statusMap[status] || status;
};

// Форматирование текста
export const truncateText = (
  text: string,
  maxLength: number,
  suffix = "..."
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Генерация цветов для статусов
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    archived: "bg-red-100 text-red-800",
    out_of_stock: "bg-orange-100 text-orange-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

// Форматирование для таблиц
export const formatForTable = {
  date: (date: string) => formatDate(date),
  datetime: (date: string) => formatDateTime(date),
  currency: (amount: number) => formatCurrency(amount),
  status: (status: string, type: "order" | "product" = "order") => {
    return type === "order" 
      ? formatOrderStatus(status)
      : formatProductStatus(status);
  },
  boolean: (value: boolean) => (value ? "Да" : "Нет"),
};

// Утилиты для работы с массивами
export const groupBy = <T>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
};
