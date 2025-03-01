<template>
  <div>
    <DataTable :columns="columns" :endpoint="endpoint" :table-filters="filters" :title="tab" />
  </div>
</template>

<script setup lang="ts">
import { type DataTableColumns } from 'naive-ui';
import { ProfileTabs } from '~/lib/types';
import Endpoints from '../../../lib/values/endpoints';
import { TransactionType } from '../../../lib/types/prediction-set';
import type { TableFilters } from '../../../lib/types/config';

const props = defineProps({
  tab: { type: String as PropType<ProfileTabs>, required: true },
  userId: { type: Number, required: true },
});

onMounted(() => {
  console.log('mounted');
});

const transactionType = {
  [TransactionType.BUY]: 'Buy',
  [TransactionType.SELL]: 'Sell',
};

const predictionColumns = [
  {
    key: 'question',
    title: 'Prediction',
    sorter: 'default',
    minWidth: 150,
    render(row: UserPredictionInterface) {
      return h(resolveComponent('NuxtLink'), { to: { path: `/markets/${row.id}` } }, [
        // h(resolveComponent('AssetDetails'), {
        //   asset: row
        // }),
        h('div', {}, row.question),
        h('div', {}, row.outcomeName),
      ]);
    },
  },
  {
    key: 'outcomeTokens',
    title: 'Shares',
    sorter: 'default',
    render(row: UserPredictionInterface) {
      return +(row.outcomeTokens / 1e6).toFixed(4);
    },
  },
  {
    key: 'boughtAmount',
    title: 'Bought Amount',
    sorter: 'default',
    render(row: UserPredictionInterface) {
      return +(row.boughtAmount / 1e6).toFixed(4);
    },
  },
  {
    key: 'soldAmount',
    title: 'Sold Amount',
    sorter: 'default',
    render(row: UserPredictionInterface) {
      return +(row.soldAmount / 1e6).toFixed(4);
    },
  },
  {
    key: 'status',
    title: 'Status',
    sorter: 'default',
    minWidth: 90,
    render(row: UserPredictionInterface) {
      return h(resolveComponent('PredictionSetStatus'), {
        status: row.setStatus,
        endTime: row.endTime,
      });
    },
  },
] as DataTableColumns<UserPredictionInterface>;

const activitiesColumns = [
  {
    key: 'question',
    title: 'Prediction',
    sorter: 'default',
    minWidth: 150,
    render(row: UserActivityInterface) {
      return h(resolveComponent('NuxtLink'), { to: { path: `/markets/${row.id}` } }, [
        // h(resolveComponent('AssetDetails'), {
        //   asset: row
        // }),
        h('div', {}, row.question),
        h('div', {}, row.outcomeName),
      ]);
    },
  },
  {
    key: 'type',
    title: 'Type',
    sorter: 'default',
    render(row: UserActivityInterface) {
      return transactionType[row.type];
    },
  },
  {
    key: 'userAmount',
    title: 'Amount',
    sorter: 'default',
    render(row: UserActivityInterface) {
      return +(row.userAmount / 1e6).toFixed(4);
    },
  },
  {
    key: 'outcomeTokens',
    title: 'Shares',
    sorter: 'default',
    render(row: UserActivityInterface) {
      return +(row.outcomeTokens / 1e6).toFixed(4);
    },
  },
  {
    key: 'txHash',
    title: 'Transaction',
    sorter: 'default',
    render(row: UserActivityInterface) {
      return h(
        'a',
        { class: 'underline', href: `https://sepolia.basescan.org/tx/${row.txHash}`, target: '_blank' },
        shortenAddress(row.txHash)
      );
    },
  },
] as DataTableColumns<UserActivityInterface>;

const columns = props.tab === ProfileTabs.PREDICTIONS ? predictionColumns : activitiesColumns;

const endpoint =
  props.tab === ProfileTabs.PREDICTIONS
    ? Endpoints.userPredictions(props.userId)
    : Endpoints.userActivity(props.userId);

const filters = {
  search: {
    show: true,
    value: null,
  },

  ...(props.tab === ProfileTabs.ACTIVITIES
    ? {
        type: {
          show: true,
          value: null,
          options: [
            { label: 'All', value: null },
            { label: 'Buy', value: TransactionType.BUY },
            { label: 'Sell', value: TransactionType.SELL },
          ],
        },
      }
    : {}),
} as TableFilters;
</script>
