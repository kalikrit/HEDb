import { z } from "zod";

// Базовые схемы
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Схемы для товаров
export const productSchema = z.object({
  name: z.string().min(1, "Название обязательно").max(200),
  description: z.string().min(1, "Описание обязательно").max(2000),
  price: z.number().min(0, "Цена должна быть положительной"),
  comparePrice: z.number().min(0).optional(),
  cost: z.number().min(0, "Себестоимость должна быть положительной"),
  sku: z.string().min(1, "SKU обязательно").max(50),
  quantity: z.number().int().min(0, "Количество не может быть отрицательным"),
  category: z.string().min(1, "Категория обязательна"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["active", "draft", "archived", "out_of_stock"]).default("draft"),
  isFeatured: z.boolean().default(false),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }).optional(),
});

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  status: z.enum(["active", "draft", "archived", "out_of_stock"]).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  search: z.string().optional(),
});

// Схемы для заказов
export const orderSchema = z.object({
  customerId: z.string().min(1, "Клиент обязателен"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Товар обязателен"),
      quantity: z.number().int().min(1, "Количество должно быть не менее 1"),
      unitPrice: z.number().min(0),
    })
  ).min(1, "Заказ должен содержать хотя бы один товар"),
  shippingAddress: z.object({
    street: z.string().min(1, "Улица обязательна"),
    city: z.string().min(1, "Город обязателен"),
    state: z.string().min(1, "Регион обязателен"),
    country: z.string().min(1, "Страна обязательна"),
    postalCode: z.string().min(1, "Почтовый индекс обязателен"),
  }),
  billingAddress: z.object({
    street: z.string().min(1, "Улица обязательна"),
    city: z.string().min(1, "Город обязателен"),
    state: z.string().min(1, "Регион обязателен"),
    country: z.string().min(1, "Страна обязательна"),
    postalCode: z.string().min(1, "Почтовый индекс обязателен"),
  }).optional(),
  notes: z.string().max(500).optional(),
});

export const orderUpdateSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded", "partially_refunded"]).optional(),
  notes: z.string().max(500).optional(),
});

export const orderFiltersSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded", "partially_refunded"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  customer: z.string().optional(),
  minTotal: z.number().min(0).optional(),
  maxTotal: z.number().min(0).optional(),
});

// Схемы для пользователей
export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export const userSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  role: z.enum(["admin", "manager", "viewer"]).default("viewer"),
});

// Утилиты для валидации
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    return { success: true, data: schema.parse(data) } as const;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      } as const;
    }
    throw error;
  }
};

export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown) => validateSchema(schema, data);
};

// Типы для TypeScript
export type ProductFormValues = z.infer<typeof productSchema>;
export type OrderFormValues = z.infer<typeof orderSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type UserFormValues = z.infer<typeof userSchema>;
