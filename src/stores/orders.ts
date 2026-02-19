import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Order, OrderStatus, OrderFilters, Customer } from "@/types";
import { PAGINATION } from "@/utils/constants";

// Мок данные для демо (без изменений)
const generateMockCustomers = (count: number): Customer[] => {
  const names = ["Иван Петров", "Мария Иванова", "Алексей Смирнов", "Елена Козлова", "Дмитрий Новиков"];
  const cities = ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `cust-${i + 1}`,
    name: names[i % names.length] + ` ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `+7 (999) ${String(i + 1).padStart(3, "0")}-${String(i + 1).padStart(4, "0")}`,
    address: {
      street: `ул. Примерная, ${i + 1}`,
      city: cities[i % cities.length],
      state: "Московская обл.",
      country: "Россия",
      postalCode: `${100000 + i}`,
    },
    ordersCount: Math.floor(Math.random() * 10),
    totalSpent: Math.floor(Math.random() * 100000) + 1000,
    lastOrderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
  }));
};

const generateMockOrders = (count: number): Order[] => {
  const customers = generateMockCustomers(10);
  const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const paymentMethods = ["credit_card", "paypal", "bank_transfer", "cash"];
  
  return Array.from({ length: count }, (_, i) => {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const itemsCount = Math.floor(Math.random() * 5) + 1;
    const items = Array.from({ length: itemsCount }, (_, j) => ({
      id: `item-${i}-${j}`,
      orderId: `ord-${i + 1}`,
      productId: `prod-${Math.floor(Math.random() * 50) + 1}`,
      productName: `Товар ${Math.floor(Math.random() * 50) + 1}`,
      sku: `SKU-${String(Math.floor(Math.random() * 1000)).padStart(4, "0")}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      unitPrice: Math.floor(Math.random() * 5000) + 500,
      totalPrice: 0, // посчитаем ниже
    }));
    
    // Считаем total для каждого item
    items.forEach(item => {
      item.totalPrice = item.quantity * item.unitPrice;
    });
    
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = Math.floor(Math.random() * 500) + 200;
    const tax = Math.floor(subtotal * 0.2); // 20% НДС
    const discount = Math.random() > 0.7 ? Math.floor(subtotal * 0.1) : 0;
    const total = subtotal + shipping + tax - discount;
    
    return {
      id: `ord-${i + 1}`,
      orderNumber: `#${(1000 + i).toString()}`,
      customer,
      items,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      currency: "RUB",
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: Math.random() > 0.8 ? "pending" : "paid",
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingAddress: customer.address!,
      billingAddress: customer.address!,
      notes: Math.random() > 0.8 ? "Позвонить перед доставкой" : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + Math.floor(Math.random() * 7) * 86400000).toISOString(),
    };
  });
};

const MOCK_ORDERS = generateMockOrders(50);

export const useOrdersStore = defineStore("orders", () => {
  // ==================== State ====================
  const orders = ref<Order[]>(MOCK_ORDERS);
  const selectedOrder = ref<Order | null>(null);
  const filters = ref<OrderFilters>({});
  const page = ref(1);
  const limit = ref(PAGINATION.DEFAULT_LIMIT);
  const isLoading = ref(false);
  const kanbanView = ref(true); // true - канбан, false - таблица
  
  // 👇 НОВОЕ: состояние сортировки
  const sortConfig = ref({
    key: 'createdAt',
    order: 'desc' as 'asc' | 'desc'
  });

  // ==================== Getters ====================
  const getOrders = computed(() => orders.value);
  const getSelectedOrder = computed(() => selectedOrder.value);
  const getFilters = computed(() => filters.value);
  const getPage = computed(() => page.value);
  const getLimit = computed(() => limit.value);
  const getIsLoading = computed(() => isLoading.value);
  const getKanbanView = computed(() => kanbanView.value);
  // 👇 НОВЫЙ: геттер для сортировки
  const getSortConfig = computed(() => sortConfig.value);

  // Статистика по статусам
  const ordersByStatus = computed(() => {
    const stats: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    
    orders.value.forEach(order => {
      stats[order.status]++;
    });
    
    return stats;
  });

  // Группировка заказов по статусу для канбан-доски
  const ordersGroupedByStatus = computed(() => {
    const grouped: Record<string, Order[]> = {
      pending: [],
      processing: [],
      shipped: [],
      delivered: [],
      cancelled: [],
    };
    
    // Применяем фильтры
    let filtered = [...orders.value];
    
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.customer.name.toLowerCase().includes(searchLower) ||
        o.customer.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.value.status) {
      filtered = filtered.filter(o => o.status === filters.value.status);
    }
    
    if (filters.value.paymentStatus) {
      filtered = filtered.filter(o => o.paymentStatus === filters.value.paymentStatus);
    }
    
    if (filters.value.dateFrom) {
      filtered = filtered.filter(o => o.createdAt >= filters.value.dateFrom!);
    }
    
    if (filters.value.dateTo) {
      filtered = filtered.filter(o => o.createdAt <= filters.value.dateTo!);
    }
    
    if (filters.value.minTotal) {
      filtered = filtered.filter(o => o.total >= filters.value.minTotal!);
    }
    
    if (filters.value.maxTotal) {
      filtered = filtered.filter(o => o.total <= filters.value.maxTotal!);
    }
    
    // Группируем
    filtered.forEach(order => {
      grouped[order.status].push(order);
    });
    
    return grouped;
  });

  // 👇 ОБНОВЛЕННЫЙ: Отфильтрованные и отсортированные заказы
  const getFilteredOrders = computed(() => {
    let filtered = [...orders.value];

    // Применяем фильтры
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.customer.name.toLowerCase().includes(searchLower) ||
        o.customer.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.value.status) {
      filtered = filtered.filter(o => o.status === filters.value.status);
    }

    if (filters.value.paymentStatus) {
      filtered = filtered.filter(o => o.paymentStatus === filters.value.paymentStatus);
    }

    if (filters.value.dateFrom) {
      filtered = filtered.filter(o => o.createdAt >= filters.value.dateFrom!);
    }

    if (filters.value.dateTo) {
      filtered = filtered.filter(o => o.createdAt <= filters.value.dateTo!);
    }

    if (filters.value.minTotal) {
      filtered = filtered.filter(o => o.total >= filters.value.minTotal!);
    }

    if (filters.value.maxTotal) {
      filtered = filtered.filter(o => o.total <= filters.value.maxTotal!);
    }

    // 👇 ПРИМЕНЯЕМ СОРТИРОВКУ
    if (sortConfig.value.key) {
      filtered.sort((a, b) => {
        let aVal, bVal;
        
        // Обработка специальных полей
        switch (sortConfig.value.key) {
          case 'customer':
            aVal = a.customer.name.toLowerCase();
            bVal = b.customer.name.toLowerCase();
            break;
            
          case 'orderNumber':
            aVal = a.orderNumber;
            bVal = b.orderNumber;
            break;
            
          case 'total':
            aVal = a.total;
            bVal = b.total;
            break;
            
          case 'status':
            aVal = a.status;
            bVal = b.status;
            break;
            
          case 'paymentStatus':
            aVal = a.paymentStatus;
            bVal = b.paymentStatus;
            break;
            
          case 'createdAt':
            aVal = new Date(a.createdAt).getTime();
            bVal = new Date(b.createdAt).getTime();
            break;
            
          default:
            aVal = a[sortConfig.value.key];
            bVal = b[sortConfig.value.key];
        }

        // Числовая сортировка
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.value.order === 'asc' ? aVal - bVal : bVal - aVal;
        }

        // Строковая сортировка
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        return sortConfig.value.order === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  });

  // 👇 ОБНОВЛЕННЫЙ: Пагинация с учетом сортировки
  const getPagination = computed(() => {
    const filtered = getFilteredOrders.value;
    const total = filtered.length;
    const start = (page.value - 1) * limit.value;
    const end = start + limit.value;
    
    return {
      page: page.value,
      limit: limit.value,
      total,
      data: filtered.slice(start, end),
    };
  });

  // ==================== Actions ====================
  
  const setFilters = (newFilters: OrderFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    page.value = 1;
  };

  const resetFilters = () => {
    filters.value = {};
    page.value = 1;
  };

  const setPage = (newPage: number) => {
    page.value = newPage;
  };

  const setLimit = (newLimit: number) => {
    limit.value = newLimit;
    page.value = 1;
  };

  const toggleView = () => {
    kanbanView.value = !kanbanView.value;
  };

  // 👇 НОВЫЙ: метод для установки сортировки
  const setSort = (key: string, order: 'asc' | 'desc') => {
    console.log('📊 Store sort:', key, order);
    sortConfig.value = { key, order };
    page.value = 1; // Сбрасываем на первую страницу при сортировке
  };

  const fetchOrders = async () => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: getPagination.value.data };
    } catch (error) {
      return { success: false, error: "Ошибка загрузки заказов" };
    } finally {
      isLoading.value = false;
    }
  };

  const fetchOrderById = async (id: string) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const order = orders.value.find(o => o.id === id);
      if (!order) {
        throw new Error("Заказ не найден");
      }
      
      selectedOrder.value = order;
      return { success: true, data: order };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Ошибка загрузки заказа" };
    } finally {
      isLoading.value = false;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = orders.value.findIndex(o => o.id === orderId);
      if (index === -1) {
        throw new Error("Заказ не найден");
      }
      
      orders.value[index] = {
        ...orders.value[index],
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      
      if (selectedOrder.value?.id === orderId) {
        selectedOrder.value = orders.value[index];
      }
      
      return { success: true, data: orders.value[index] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Ошибка обновления статуса" };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    orders,
    selectedOrder,
    filters,
    page,
    limit,
    isLoading,
    kanbanView,
    sortConfig,

    // Getters
    getOrders,
    getSelectedOrder,
    getFilters,
    getPage,
    getLimit,
    getIsLoading,
    getKanbanView,
    getSortConfig,
    ordersByStatus,
    ordersGroupedByStatus,
    getFilteredOrders,
    getPagination,

    // Actions
    setFilters,
    resetFilters,
    setPage,
    setLimit,
    toggleView,
    setSort,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
  };
});