<template>
  <div>
    <strong>EDIT: </strong>
    <n-switch v-model:value="edit" />
  </div>
  <n-data-table :bordered="false" :columns="columns" :data="offers" :pagination="createPagination(false)" />
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';
import { NInput } from 'naive-ui';
import type { OfferClaimData } from '~/lib/types/offer';

const props = defineProps({
  offers: { type: Array<OfferClaimData>, default: [] },
});

const { t } = useI18n();
const edit = ref<boolean>(false);

const createColumns = (): DataTableColumns<OfferClaimData> => {
  if (!props.offers?.length) return [];

  return Object.keys(props.offers[0]).map(key => {
    return {
      key: key,
      title: key,
      minWidth: 140,
      render(row) {
        if (edit.value) {
          return h(NInput, {
            value: row[key],
            onUpdateValue(v) {
              row[key] = v;
            },
          });
        }
        return row[key];
      },
    };
  });
};
const columns = createColumns();
</script>
