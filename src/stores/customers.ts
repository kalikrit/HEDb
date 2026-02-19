import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Customer, Order } from "@/types";
import { PAGINATION } from "@/utils/constants";

// Мок данные для демо
const generateMockCustomers = (count: number): Customer[] => {
  const names = [
    "Иван Петров", "Мария Иванова", "Алексей Смирнов", "Елена Козлова", 
    "Дмитрий Новиков", "Анна Соколова", "Сергей Морозов", "Ольга Волкова",
    "Павел Лебедев", "Наталья Павлова", "Михаил Сидоров", "Татьяна Федорова",
    "Андрей Михайлов", "Екатерина Николаева", "Владимир Зайцев"
  ];
  
  const cities = ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск", "Краснодар", "Сочи"];
  const streets = ["Ленина", "Пушкина", "Гагарина", "Советская", "Мира", "Центральная", "Шоссейная"];
  
  return Array.from({ length: count }, (_, i) => {
    const ordersCount = Math.floor(Math.random() * 20);
    const totalSpent = ordersCount * (Math.floor(Math.random() * 5000) + 1000);
    
    return {
      id: `cust-${(i + 1).toString().padStart(3, '0')}`,
      name: names[i % names.length],
      email: `customer${i + 1}@example.com`,
      phone: `+7 (999) ${String(i + 1).padStart(3, "0")}-${String(i + 1).padStart(4, "0")}`,
      address: {
        street: `ул. ${streets[i % streets.length]}, ${Math.floor(Math.random() * 100) + 1}`,
        city: cities[i % cities.length],
        state: "Московская обл.",
        country: "Россия",
        postalCode: `${100000 + i}`,
      },
      ordersCount,
      totalSpent,
      lastOrderDate: ordersCount > 0 
        ? new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString()
        : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000).toISOString(),
    };
  });
};

// Мок заказов для конкретного клиента
const generateMockOrdersForCustomer = (customerId: string, customerName: string, count: number): Order[] => {
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const paymentStatuses = ["pending", "paid", "failed", "refunded"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ord-${customerId}-${i}`,
    orderNumber: `#${(1000 + i).toString()}`,
    customer: {
      id: customerId,
      name: customerName,
      email: `customer@example.com`,
      phone: `+7 (999) 123-45-67`,
      ordersCount: 0,
      totalSpent: 0,
    },
    items: [],
    subtotal: Math.floor(Math.random() * 10000) + 1000,
    shipping: 300,
    tax: Math.floor(Math.random() * 2000) + 200,
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 1000) : 0,
    total: 0,
    currency: "RUB",
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)] as any,
    paymentMethod: "credit_card",
    shippingAddress: {
      street: `ул. Примерная, ${i + 1}`,
      city: "Москва",
      state: "Московская обл.",
      country: "Россия",
      postalCode: "123456",
    },
    billingAddress: {
      street: `ул. Примерная, ${i + 1}`,
      city: "Москва",
      state: "Московская обл.",
      country: "Россия",
      postalCode: "123456",
    },
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  })).map(order => {
    order.total = order.subtotal + order.shipping + order.tax - order.discount;
    return order;
  });
};

const MOCK_CUSTOMERS = generateMockCustomers(50);

export const useCustomersStore = defineStore("customers", () => {
  // ==================== State ====================
  const customers = ref<Customer[]>(MOCK_CUSTOMERS);
  const selectedCustomer = ref<Customer | null>(null);
  const customerOrders = ref<Order[]>([]);
  const filters = ref({
    search: "",
    minOrders: undefined as number | undefined,
    maxOrders: undefined as number | undefined,
    minSpent: undefined as number | undefined,
    hasEmail: undefined as boolean | undefined,
    hasPhone: undefined as boolean | undefined,
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
  });
  const sortConfig = ref({
    key: 'createdAt',
    order: 'desc' as 'asc' | 'desc'
  });
  const page = ref(1);
  const limit = ref(PAGINATION.DEFAULT_LIMIT);
  const isLoading = ref(false);
  const ordersLoading = ref(false);

  // ==================== Getters ====================
  const getCustomers = computed(() => customers.value);
  const getSelectedCustomer = computed(() => selectedCustomer.value);
  const getCustomerOrders = computed(() => customerOrders.value);
  const getFilters = computed(() => filters.value);
  const getSortConfig = computed(() => sortConfig.value);
  const getPage = computed(() => page.value);
  const getLimit = computed(() => limit.value);
  const getIsLoading = computed(() => isLoading.value);
  const getOrdersLoading = computed(() => ordersLoading.value);

  // Отфильтрованные и отсортированные клиенты
  const getFilteredCustomers = computed(() => {
    let filtered = [...customers.value];

    // Применяем фильтры
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        (c.phone && c.phone.includes(searchLower))
      );
    }

    if (filters.value.minOrders !== undefined) {
      filtered = filtered.filter(c => c.ordersCount >= filters.value.minOrders!);
    }

    if (filters.value.maxOrders !== undefined) {
        filtered = filtered.filter(c => c.ordersCount <= filters.value.maxOrders!);
    }

    if (filters.value.minSpent !== undefined) {
      filtered = filtered.filter(c => c.totalSpent >= filters.value.minSpent!);
    }

    if (filters.value.hasEmail !== undefined) {
      filtered = filtered.filter(c => filters.value.hasEmail ? !!c.email : !c.email);
    }

    if (filters.value.hasPhone !== undefined) {
      filtered = filtered.filter(c => filters.value.hasPhone ? !!c.phone : !c.phone);
    }

    if (filters.value.dateFrom) {
      filtered = filtered.filter(c => c.createdAt >= filters.value.dateFrom!);
    }

    if (filters.value.dateTo) {
      filtered = filtered.filter(c => c.createdAt <= filters.value.dateTo!);
    }

    // Применяем сортировку
    if (sortConfig.value.key) {
      filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch (sortConfig.value.key) {
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'email':
            aVal = a.email.toLowerCase();
            bVal = b.email.toLowerCase();
            break;
          case 'ordersCount':
            aVal = a.ordersCount;
            bVal = b.ordersCount;
            break;
          case 'totalSpent':
            aVal = a.totalSpent;
            bVal = b.totalSpent;
            break;
          case 'lastOrderDate':
            aVal = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
            bVal = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
            break;
          case 'createdAt':
            aVal = new Date(a.createdAt).getTime();
            bVal = new Date(b.createdAt).getTime();
            break;
          default:
            aVal = a[sortConfig.value.key as keyof Customer];
            bVal = b[sortConfig.value.key as keyof Customer];
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.value.order === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        
        return sortConfig.value.order === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  });

  // Пагинация
  const getPagination = computed(() => {
    const filtered = getFilteredCustomers.value;
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

  // Статистика
  const getStats = computed(() => {
    const total = customers.value.length;
    const withOrders = customers.value.filter(c => c.ordersCount > 0).length;
    const totalRevenue = customers.value.reduce((sum, c) => sum + c.totalSpent, 0);
    const averageOrderValue = withOrders > 0 ? totalRevenue / withOrders : 0;
    
    return {
      total,
      withOrders,
      withoutOrders: total - withOrders,
      totalRevenue,
      averageOrderValue,
    };
  });

  // ==================== Actions ====================
  
  const setFilters = (newFilters: typeof filters.value) => {
    filters.value = { ...filters.value, ...newFilters };
    page.value = 1;
  };

  const resetFilters = () => {
    filters.value = {
      search: "",
      minOrders: undefined,
      maxOrders: undefined,
      minSpent: undefined,
      hasEmail: undefined,
      hasPhone: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    };
    page.value = 1;
  };

  const setSort = (key: string, order: 'asc' | 'desc') => {
    sortConfig.value = { key, order };
    page.value = 1;
  };

  const setPage = (newPage: number) => {
    page.value = newPage;
  };

  const setLimit = (newLimit: number) => {
    limit.value = newLimit;
    page.value = 1;
  };

  const fetchCustomers = async () => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: getPagination.value.data };
    } catch (error) {
      return { success: false, error: "Ошибка загрузки клиентов" };
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCustomerById = async (id: string) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const customer = customers.value.find(c => c.id === id);
      if (!customer) {
        throw new Error("Клиент не найден");
      }
      
      selectedCustomer.value = customer;
      
      // Загружаем заказы клиента
      ordersLoading.value = true;
      try {
        customerOrders.value = generateMockOrdersForCustomer(
          customer.id, 
          customer.name, 
          Math.min(customer.ordersCount, 10)
        );
      } finally {
        ordersLoading.value = false;
      }
      
      return { success: true, data: customer };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Ошибка загрузки клиента" };
    } finally {
      isLoading.value = false;
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = customers.value.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error("Клиент не найден");
      }
      
      customers.value[index] = {
        ...customers.value[index],
        ...data,
      };
      
      if (selectedCustomer.value?.id === id) {
        selectedCustomer.value = customers.value[index];
      }
      
      return { success: true, data: customers.value[index] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Ошибка обновления клиента" };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    customers,
    selectedCustomer,
    customerOrders,
    filters,
    sortConfig,
    page,
    limit,
    isLoading,
    ordersLoading,

    // Getters
    getCustomers,
    getSelectedCustomer,
    getCustomerOrders,
    getFilters,
    getSortConfig,
    getPage,
    getLimit,
    getIsLoading,
    getOrdersLoading,
    getFilteredCustomers,
    getPagination,
    getStats,

    // Actions
    setFilters,
    resetFilters,
    setSort,
    setPage,
    setLimit,
    fetchCustomers,
    fetchCustomerById,
    updateCustomer,
  };
});