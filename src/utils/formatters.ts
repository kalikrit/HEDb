import dayjs from "dayjs";

// Форматирование дат
export const formatDate = (date: string | Date, format = "DD.MM.YYYY") => {
  return dayjs(date).format(format);
};

// Форматирование валют
export const formatCurrency = (amount: number, currency = "RUB") => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
  }).format(amount);
};

// Сокращение чисел (1K, 1M и т.д.)
export const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
