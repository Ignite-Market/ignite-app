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
import { colors } from '~/tailwind.config';

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
        h('div', { style: { display: 'flex', gap: '12px' } }, [
          row.imgUrl
            ? h('div', { style: { width: '60px', height: '60px', flexShrink: 0 } }, [
                h('img', {
                  src: row.imgUrl,
                  style: { width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' },
                }),
              ])
            : null,
          h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } }, [
            h('span', { style: { fontSize: '16px', fontWeight: '500', marginBottom: '4px' } }, row.question),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              h(
                'span',
                { style: { fontSize: '15px', fontWeight: '600', color: colors.primary.DEFAULT } },
                row.outcomeName
              ),
              h(
                'span',
                { style: { fontSize: '14px', color: '#777', fontWeight: '400' } },
                `${formatTokenAmount(row.outcomeTokens)} shares`
              ),
            ]),
          ]),
        ]),
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
        h('div', { style: { display: 'flex', gap: '12px' } }, [
          row.imgUrl
            ? h('div', { style: { width: '60px', height: '60px', flexShrink: 0 } }, [
                h('img', {
                  src: row.imgUrl,
                  style: { width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' },
                }),
              ])
            : null,
          h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } }, [
            h('span', { style: { fontSize: '16px', fontWeight: '500', marginBottom: '4px' } }, row.question),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              h('span', { style: { fontSize: '15px', fontWeight: '600', color: '#F96B6B' } }, row.outcomeName),
              h(
                'span',
                { style: { fontSize: '14px', color: '#777', fontWeight: '400' } },
                `${formatTokenAmount(row.outcomeTokens)} shares`
              ),
            ]),
          ]),
        ]),
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

  ...(props.tab === ProfileTabs.ACTIVITY
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
