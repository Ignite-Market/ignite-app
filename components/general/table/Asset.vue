<template>
  <n-data-table
    :bordered="false"
    :data="assetStore.nfts"
    :loading="assetStore.loading"
    :pagination="assetStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="(page: number) => handlePageChange(page, assetStore.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(assetStore.pagination.page, pageSize)"
    remote
  />
  <!--
  <modal v-model:show="modalTransferOwnershipVisible" :title="$t('computing.contract.transfer')">
    <FormAsset
      :contract-uuid="currentRow.contract_uuid"
      @submit-success="onContractTransferred"
    />
  </modal>
  -->
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';
import type { AssetInterface } from '~/lib/types/asset';
import { PAGINATION_LIMIT } from '~/lib/values/general.values';

const props = defineProps({
  contractUuid: { type: String, required: true },
});

const { t } = useI18n();
const assetStore = useAssetStore();

const createColumns = (): DataTableColumns<AssetInterface> => {
  return [
    {
      key: 'transactionHash',
      title: t('computing.transaction.hash'),
    },
    {
      key: 'transactionType',
      title: t('computing.transaction.transactionType'),
    },
    {
      key: 'transactionStatus',
      title: t('general.status'),
    },
  ];
};
const columns = createColumns();
const rowKey = (row: AssetInterface) => row.id;
const currentRow = ref<AssetInterface>({} as AssetInterface);

function rowProps(row: AssetInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/** On page change, load data */
async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  if (!assetStore.loading) {
    await assetStore.fetchTransactions(props.contractUuid, { page, limit });
  }
}
</script>
