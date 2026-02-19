import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Product, ProductCategory, ProductFilters } from "@/types";
import { PAGINATION } from "@/utils/constants";

// Mock данные для демо
const generateMockProducts = (count: number): Product[] => {
  const categories = ["electronics", "clothing", "books", "home"];
  const statuses: Product["status"][] = ["active", "draft", "archived", "out_of_stock"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Товар ${i + 1}`,
    description: `Описание товара ${i + 1}. Это демо описание продукта для тестирования интерфейса.`,
    price: Math.floor(Math.random() * 1000) + 100,
    comparePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 1200) + 150 : undefined,
    cost: Math.floor(Math.random() * 500) + 50,
    sku: `SKU-${String(i + 1).padStart(4, "0")}`,
    barcode: `590123412345${i}`,
    quantity: Math.floor(Math.random() * 100),
    weight: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined,
    dimensions: Math.random() > 0.5 ? {
      length: Math.floor(Math.random() * 50) + 10,
      width: Math.floor(Math.random() * 30) + 5,
      height: Math.floor(Math.random() * 20) + 3,
    } : undefined,
    category: categories[Math.floor(Math.random() * categories.length)],
    tags: ["new", "popular", "featured"].slice(0, Math.floor(Math.random() * 3)),
    images: [
      `https://picsum.photos/seed/product-${i + 1}-1/400/300`,
      `https://picsum.photos/seed/product-${i + 1}-2/400/300`,
    ],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    isFeatured: Math.random() > 0.7,
    isAvailable: Math.random() > 0.2,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const MOCK_PRODUCTS = generateMockProducts(50);

const MOCK_CATEGORIES: ProductCategory[] = [
  { id: "electronics", name: "Электроника", slug: "electronics", productCount: 15 },
  { id: "clothing", name: "Одежда", slug: "clothing", productCount: 12 },
  { id: "books", name: "Книги", slug: "books", productCount: 8 },
  { id: "home", name: "Дом и сад", slug: "home", productCount: 10 },
  { id: "sports", name: "Спорт", slug: "sports", productCount: 5 },
];

export const useProductsStore = defineStore("products", () => {
  // ==================== State ====================
  const products = ref<Product[]>(MOCK_PRODUCTS);
  const categories = ref<ProductCategory[]>(MOCK_CATEGORIES);
  const selectedProduct = ref<Product | null>(null);
  const filters = ref<ProductFilters>({});
  const page = ref(1); // 👈 ЭТО ВАЖНО - страница пагинации
  const limit = ref(PAGINATION.DEFAULT_LIMIT);
  const isLoading = ref(false);
  const pagination = ref({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: MOCK_PRODUCTS.length,
  });

  // ==================== Getters ====================
  const getProducts = computed(() => products.value);
  const getCategories = computed(() => categories.value);
  const getSelectedProduct = computed(() => selectedProduct.value);
  const getFilters = computed(() => filters.value);
  const getPage = computed(() => page.value);
  const getLimit = computed(() => limit.value);
  const getIsLoading = computed(() => isLoading.value);
  const getPagination = computed(() => pagination.value);

  // ==================== Actions ====================
  
  // Установка фильтров
  const setFilters = (newFilters: ProductFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    page.value = 1;
    pagination.value.page = 1;
  };

  // Сброс фильтров
  const resetFilters = () => {
    filters.value = {};
    page.value = 1;
    pagination.value.page = 1;
  };

  // Установка страницы
  const setPage = (newPage: number) => {
    page.value = newPage;
    pagination.value.page = newPage;
  };

  // Установка лимита
  const setLimit = (newLimit: number) => {
    limit.value = newLimit;
    pagination.value.limit = newLimit;
    page.value = 1;
    pagination.value.page = 1;
  };

  // Получение отфильтрованных товаров
  const getFilteredProducts = computed(() => {
    let filtered = [...products.value];

    if (filters.value.category) {
      filtered = filtered.filter(p => p.category === filters.value.category);
    }

    if (filters.value.status) {
      filtered = filtered.filter(p => p.status === filters.value.status);
    }

    if (filters.value.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.value.minPrice!);
    }

    if (filters.value.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.value.maxPrice!);
    }

    if (filters.value.inStock !== undefined) {
      filtered = filtered.filter(p => 
        filters.value.inStock ? p.quantity > 0 : p.quantity === 0
      );
    }

    if (filters.value.isFeatured !== undefined) {
      filtered = filtered.filter(p => p.isFeatured === filters.value.isFeatured);
    }

    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      );
    }

    // Обновляем общее количество для пагинации
    pagination.value.total = filtered.length;

    // Применяем пагинацию
    const start = (pagination.value.page - 1) * pagination.value.limit;
    const end = start + pagination.value.limit;
    
    return filtered.slice(start, end);
  });

  // Получение статистики
  const getProductStats = computed(() => {
    const totalProducts = products.value.length;
    const activeProducts = products.value.filter(p => p.status === "active").length;
    const outOfStock = products.value.filter(p => p.status === "out_of_stock").length;
    const totalValue = products.value.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    return {
      totalProducts,
      activeProducts,
      outOfStock,
      totalValue,
    };
  });

  // Загрузка товаров
  const fetchProducts = async () => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: getFilteredProducts.value };
    } catch (error) {
      return { success: false, error: "Ошибка загрузки товаров" };
    } finally {
      isLoading.value = false;
    }
  };

  // Получение товара по ID
  const fetchProductById = async (id: string) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = products.value.find(p => p.id === id);
      if (!product) {
        throw new Error("Товар не найден");
      }
      
      selectedProduct.value = product;
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Ошибка загрузки товара" };
    } finally {
      isLoading.value = false;
    }
  };

  // Создание товара
  const createProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      products.value.unshift(newProduct);
      return { success: true, data: newProduct };
    } catch (error) {
      return { success: false, error: "Ошибка создания товара" };
    } finally {
      isLoading.value = false;
    }
  };

  // Обновление товара
  const updateProduct = async (id: string, productData: Partial<Product>) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = products.value.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error("Товар не найден");
      }
      
      const updatedProduct = {
        ...products.value[index],
        ...productData,
        updatedAt: new Date().toISOString(),
      };
      
      products.value[index] = updatedProduct;
      
      if (selectedProduct.value?.id === id) {
        selectedProduct.value = updatedProduct;
      }
      
      return { success: true, data: updatedProduct };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Ошибка обновления товара" };
    } finally {
      isLoading.value = false;
    }
  };

  // Удаление товара
  const deleteProduct = async (id: string) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = products.value.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error("Товар не найден");
      }
      
      products.value.splice(index, 1);
      
      if (selectedProduct.value?.id === id) {
        selectedProduct.value = null;
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Ошибка удаления товара" };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    products,
    categories,
    selectedProduct,
    filters,
    page,
    limit,
    isLoading,
    pagination,

    // Getters
    getProducts,
    getCategories,
    getSelectedProduct,
    getFilters,
    getPage,
    getLimit,
    getIsLoading,
    getPagination,
    getFilteredProducts,
    getProductStats,

    // Actions
    setFilters,
    resetFilters,
    setPage,
    setLimit,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});