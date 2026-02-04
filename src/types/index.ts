// ==================== Базовые типы ====================
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ==================== Товары ====================
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  cost: number;
  sku: string;
  barcode?: string;
  quantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  category: string;
  tags: string[];
  images: string[];
  status: "active" | "draft" | "archived" | "out_of_stock";
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  productCount: number;
  image?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  quantity: number;
  reserved: number;
  available: number;
  location?: string;
  lastRestocked: string;
  lowStockThreshold: number;
}

// ==================== Заказы ====================
export type OrderStatus = 
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type PaymentMethod =
  | "credit_card"
  | "paypal"
  | "bank_transfer"
  | "cash"
  | "other";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  variant?: Record<string, any>;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
}

// ==================== Аналитика ====================
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  productsSold: number;
}

export interface RevenueMetric {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: "up" | "down" | "stable";
}

export interface DashboardMetrics {
  totalRevenue: RevenueMetric;
  totalOrders: RevenueMetric;
  averageOrderValue: RevenueMetric;
  conversionRate: RevenueMetric;
  topProducts: {
    productId: string;
    productName: string;
    revenue: number;
    unitsSold: number;
    growth: number;
  }[];
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export interface ChartDataPoint {
  x: string | number;
  y: number;
}

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  borderColor?: string;
  backgroundColor?: string;
}

// ==================== Уведомления ====================
export type NotificationType =
  | "new_order"
  | "low_stock"
  | "payment_received"
  | "order_shipped"
  | "system_alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

// ==================== Фильтры и поиск ====================
export interface ProductFilters {
  category?: string;
  status?: Product["status"];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  customer?: string;
  minTotal?: number;
  maxTotal?: number;
}

// ==================== Формы ====================
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  cost: number;
  sku: string;
  quantity: number;
  category: string;
  tags: string[];
  images: File[];
  status: Product["status"];
  isFeatured: boolean;
}

export interface OrderUpdateData {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  shippingAddress?: Partial<Address>;
}
