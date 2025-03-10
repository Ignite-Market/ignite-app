<template>
  <div>
    <DataTable :columns="columns" :endpoint="endpoint" :table-filters="filters" :title="tab" :table-sorter="sorter" />
  </div>
</template>

<script setup lang="ts">
import { type DataTableColumns, type DataTableSortState } from 'naive-ui';
import { formatDistanceToNow } from 'date-fns';
import { ProfileTabs } from '~/lib/types';
import Endpoints from '~/lib/values/endpoints';
import { TransactionType, type ActivityInterface, type UserPredictionInterface } from '~/lib/types/prediction-set';
import type { TableFilters } from '~/lib/types/config';

const props = defineProps({
  tab: { type: String as PropType<ProfileTabs>, required: true },
  userId: { type: Number, required: true },
});

const transactionType = {
  [TransactionType.BUY]: { label: 'Buy', color: '#5DCE46' },
  [TransactionType.SELL]: { label: 'Sell', color: '#DE4941' },
  [TransactionType.FUND]: { label: 'Fund', color: '#5272FF' },
  [TransactionType.REMOVE_FUND]: { label: 'Remove fund', color: '#5272FF' },
};

const predictionColumns = [
  {
    key: 'question',
    title: 'Prediction',
    sorter: 'default',
    minWidth: 150,
    render(row: UserPredictionInterface) {
      return h(resolveComponent('NuxtLink'), { to: { path: `/markets/${row.id}` } }, () => [
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
      return formatTokenAmount(row.outcomeTokens);
    },
  },
  {
    key: 'boughtAmount',
    title: 'Bought Amount',
    sorter: 'default',
    render(row: UserPredictionInterface) {
      return formatTokenAmount(row.boughtAmount);
    },
  },
  {
    key: 'soldAmount',
    title: 'Sold Amount',
    sorter: 'default',
    render(row: UserPredictionInterface) {
      return formatTokenAmount(row.soldAmount);
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
    render(row: ActivityInterface) {
      return h(resolveComponent('NuxtLink'), { to: { path: `/markets/${row.id}` } }, () => [
        h('div', {}, row.question),
        h('div', {}, row.outcomeName),
      ]);
    },
  },
  {
    key: 'type',
    title: 'Type',
    sorter: 'default',
    render(row: ActivityInterface) {
      return h('div', { style: { color: transactionType[row.type].color } }, transactionType[row.type].label);
    },
  },
  {
    key: 'userAmount',
    title: 'Amount',
    sorter: 'default',
    render(row: ActivityInterface) {
      return formatTokenAmount(row.userAmount);
    },
  },
  {
    key: 'outcomeTokens',
    title: 'Shares',
    sorter: 'default',
    render(row: ActivityInterface) {
      return formatTokenAmount(row.outcomeTokens);
    },
  },
  {
    key: 'txHash',
    title: 'Transaction',
    sorter: 'default',
    render(row: ActivityInterface) {
      return h(
        'a',
        { class: 'underline', href: `${getExplorer()}/tx/${row.txHash}`, target: '_blank' },
        shortenAddress(row.txHash)
      );
    },
  },
  {
    key: 'transactionTime',
    title: 'Date',
    sorter: 'default',
    align: 'right',
    render(row: ActivityInterface) {
      return formatDistanceToNow(new Date(row.transactionTime), { addSuffix: true });
    },
  },
] as DataTableColumns<ActivityInterface>;

const columns = props.tab === ProfileTabs.PREDICTIONS ? predictionColumns : activitiesColumns;

const endpoint =
  props.tab === ProfileTabs.PREDICTIONS ? Endpoints.userPredictions(props.userId) : Endpoints.predictionSetActivity;

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
            { label: 'Fund', value: TransactionType.FUND },
            { label: 'Remove fund', value: TransactionType.REMOVE_FUND },
          ],
        },
        userId: {
          show: false,
          value: props.userId,
        },
      }
    : {}),
} as TableFilters;

const sorter = {
  columnKey: props.tab === ProfileTabs.PREDICTIONS ? 'id' : 'transactionTime',
  order: 'descend',
  sorter: 'default',
} as DataTableSortState;
</script>
