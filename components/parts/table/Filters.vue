<template>
  <div v-for="(filter, key) in filters" :key="key">
    <SelectOptions
      v-if="filter.show && filter.options"
      v-model:value="filter.value"
      class="min-w-32 w-[12vw] max-w-xs"
      :options="filter.options"
      :placeholder="key"
      :loading="loading && editedFilter === key"
      clearable
      :multiple="filter.isArray"
      @update:value="value => (editedFilter = key)"
    />
    <n-input
      v-else-if="filter.show"
      v-model:value="filter.value as string"
      class="min-w-32 w-[12vw] max-w-xs"
      :placeholder="key"
      :loading="loading && editedFilter === key"
      clearable
      @update:value="value => (editedFilter = key)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TableFilters } from '~/lib/types/config';

defineProps({
  filters: { type: Object as PropType<TableFilters>, default: () => ({}) },
  loading: { type: Boolean, default: false },
});

const editedFilter = ref('');
</script>
