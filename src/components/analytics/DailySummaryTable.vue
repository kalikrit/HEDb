<template>
  <Table
    :columns="columns"
    :data="data"
    :pagination="true"
    :total="data.length"
    :per-page="10"
    :loading="loading"
  >
    <template #date="{ row }">
      {{ formatDate(row.date) }}
    </template>
    <template #revenue="{ row }">
      {{ formatCurrency(row.revenue) }}
    </template>
    <template #orders="{ row }">
      {{ row.orders }}
    </template>
    <template #avgOrder="{ row }">
      {{ formatCurrency(row.revenue / (row.orders || 1)) }}
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/ui/Table.vue";
import { formatDate, formatCurrency } from "@/utils/formatters";

interface DailyData {
  date: string;
  revenue: number;
  orders: number;
}

defineProps<{ data: DailyData[]; loading?: boolean }>();

const columns = [
  { key: "date", label: "Дата", sortable: true },
  { key: "revenue", label: "Выручка", sortable: true, align: "right" as const },
  { key: "orders", label: "Заказы", sortable: true, align: "center" as const },
  { key: "avgOrder", label: "Средний чек", sortable: true, align: "right" as const },
];
</script>