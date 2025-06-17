<template>
  <div>
    <DataTable :columns="columns" :endpoint="endpoint" :table-filters="filters" :title="tab" :table-sorter="sorter" />
  </div>
</template>

<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns';
import { type DataTableColumns, type DataTableSortState } from 'naive-ui';
import { ProfileTabs } from '~/lib/types';
import type { TableFilters } from '~/lib/types/config';
import {
  TransactionType,
  PredictionSetStatus,
  type ActivityInterface,
  type UserFundingPositionInterface,
  type UserPredictionInterface,
} from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';
import { useTokensStore } from '~/stores/collateral-tokens';
import { colors } from '~/tailwind.config';

const props = defineProps({
  tab: { type: String as PropType<ProfileTabs>, required: true },
  userId: { type: Number, required: true },
});

const tokensStore = useTokensStore();

const transactionType = {
  [TransactionType.BUY]: { label: 'Buy', color: '#5DCE46' },
  [TransactionType.SELL]: { label: 'Sell', color: '#DE4941' },
  [TransactionType.FUND]: { label: 'Fund', color: '#5272FF' },
  [TransactionType.REMOVE_FUND]: { label: 'Remove fund', color: '#5272FF' },
  [TransactionType.CLAIM]: { label: 'Claim winnings', color: '#D88ADC' },
  [TransactionType.FUND_EXCESS]: { label: 'Fund excess', color: '#5272FF' },
};

const predictionColumns = [
  {
    key: 'question',
    title: 'Market',
    sorter: 'default',
    minWidth: 300,
    render(row: UserPredictionInterface) {
      const collateralToken = tokensStore.getToken(row.collateral_token_id);

      return h(resolveComponent('NuxtLink'), { to: { path: `/markets/${row.id}` } }, () => [
        h('div', { style: { display: 'flex', gap: '12px' } }, [
          row.imgUrl
            ? h('div', { style: { width: '44px', height: '44px', flexShrink: 0 } }, [
                h('img', {
                  src: row.imgUrl,
                  style: { width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' },
                }),
              ])
            : null,
          h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } }, [
            h('span', { style: { fontSize: '15px', fontWeight: '500' } }, row.question),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              h(
                'span',
                { style: { fontSize: '14px', fontWeight: '600', color: colors.primary.DEFAULT } },
                row.outcomeName
              ),
              h(
                'span',
                { style: { fontSize: '14px', color: '#777', fontWeight: '400' } },
                `${formatCollateralAmount(row.outcomeTokens, collateralToken?.decimals || 0)} shares`
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
      const collateralToken = tokensStore.getToken(row.collateral_token_id);

      return formatCollateralAmount(row.outcomeTokens, collateralToken?.decimals || 0);
    },
  },
  {
    key: 'boughtAmount',
    title: 'Bought Amount',
    sorter: 'default',
    minWidth: 160,
    render(row: UserPredictionInterface) {
      const collateralToken = tokensStore.getToken(row.collateral_token_id);

      return h('div', [
        collateralToken?.imgUrl
          ? h('img', {
              src: collateralToken.imgUrl,
              title: collateralToken.name,
              style: {
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: '4px',
              },
            })
          : null,
        h(
          'span',
          {},
          `${formatCollateralAmount(row.boughtAmount, collateralToken?.decimals || 0)} ${collateralToken?.symbol || ''}`
        ),
      ]);
    },
  },
  {
    key: 'soldAmount',
    title: 'Sold Amount',
    sorter: 'default',
    minWidth: 160,
    render(row: UserPredictionInterface) {
      const collateralToken = tokensStore.getToken(row.collateral_token_id);

      return h('div', [
        collateralToken?.imgUrl
          ? h('img', {
              src: collateralToken.imgUrl,
              title: collateralToken.name,
              style: {
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: '4px',
              },
            })
          : null,
        h(
          'span',
          {},
          `${formatCollateralAmount(row.soldAmount, collateralToken?.decimals || 0)} ${collateralToken?.symbol || ''}`
        ),
      ]);
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
  {
    key: 'action',
    title: '',
    align: 'right',
    render(row: UserPredictionInterface) {
      return row.setStatus === PredictionSetStatus.FINALIZED &&
        row.outcomeTokens &&
        row.winner_outcome_id === row.outcomeId &&
        +row.claimedAmount <= 0
        ? h(resolveComponent('BasicButton'), {
            text: 'Claim',
            to: { path: `/markets/${row.id}` },
          })
        : null;
    },
  },
] as DataTableColumns<UserPredictionInterface>;

const activitiesColumns = [
  {
    key: 'question',
    title: 'Market',
    sorter: 'default',
    minWidth: 300,
    render(row: ActivityInterface) {
      const collateralToken = tokensStore.getToken(row.collateral_token_id);

      return h(resolveComponent('NuxtLink'), { to: { path: `/markets/${row.id}` } }, () => [
        h('div', { style: { display: 'flex', gap: '12px' } }, [
          row.imgUrl
            ? h('div', { style: { width: '44px', height: '44px', flexShrink: 0 } }, [
                h('img', {
                  src: row.imgUrl,
                  style: { width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' },
                }),
              ])
            : null,
          h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } }, [
            h('span', { style: { fontSize: '15px', fontWeight: '500' } }, row.question),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              h('span', { style: { fontSize: '14px', fontWeight: '600', color: '#F96B6B' } }, row.outcomeName),
              h(
                'span',
                { style: { fontSize: '14px', color: '#777', fontWeight: '400' } },
                `${formatCollateralAmount(row.outcomeTokens, collateralToken?.decimals || 0)} shares`
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
    minWidth: 160,
    render(row: ActivityInterface) {
      const collateralToken = tokensStore.getToken(row.collateral_token_id);

      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        collateralToken?.imgUrl
          ? h('img', {
              src: collateralToken.imgUrl,
              title: collateralToken.name,
              style: {
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: '4px',
              },
            })
          : null,
        h(
          'span',
          {},
          `${formatCollateralAmount(row.userAmount, collateralToken?.decimals || 0)} ${collateralToken?.symbol || ''}`
        ),
      ]);
    },
  },
  {
    key: 'outcomeTokens',
    title: 'Shares',
    sorter: 'default',
    render(row: ActivityInterface) {
      const collateralToken = tokensStore.getToken(row.collateral_token_id);

      return formatCollateralAmount(row.outcomeTokens, collateralToken?.decimals || 0);
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

const fundingPositionsColumns = [
  {
    key: 'question',
    title: 'Market',
    sorter: 'default',
    minWidth: 300,
    render(row: UserFundingPositionInterface) {
      return h(resolveComponent('NuxtLink'), { to: { path: `/markets/${row.id}` } }, () => [
        h('div', { style: { display: 'flex', gap: '12px' } }, [
          row.imgUrl
            ? h('div', { style: { width: '44px', height: '44px', flexShrink: 0 } }, [
                h('img', {
                  src: row.imgUrl,
                  style: { width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' },
                }),
              ])
            : null,
          h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } }, [
            h('span', { style: { fontSize: '15px', fontWeight: '500', marginBottom: '4px' } }, row.question),
          ]),
        ]),
      ]);
    },
  },
  {
    key: 'fundedAmount',
    title: 'Funded Amount',
    sorter: 'default',
    render(row: UserFundingPositionInterface) {
      const collateralToken = tokensStore.getToken(row.collateral_token_id);

      return h('div', [
        collateralToken?.imgUrl
          ? h('img', {
              src: collateralToken.imgUrl,
              title: collateralToken.name,
              style: {
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: '4px',
              },
            })
          : null,
        h(
          'span',
          {},
          `${formatCollateralAmount(row.fundedAmount, collateralToken?.decimals || 0)} ${collateralToken?.symbol || ''}`
        ),
      ]);
    },
  },
  {
    key: 'status',
    title: 'Status',
    sorter: 'default',
    minWidth: 90,
    render(row: UserFundingPositionInterface) {
      return h(resolveComponent('PredictionSetStatus'), {
        status: row.setStatus,
        endTime: row.endTime,
      });
    },
  },
  {
    key: 'action',
    title: '',
    align: 'right',
    render(row: UserFundingPositionInterface) {
      return row.setStatus === PredictionSetStatus.FINALIZED && row.removedAmount < row.fundedAmount
        ? h(resolveComponent('BasicButton'), {
            text: 'Remove funding',
            to: { path: `/markets/${row.id}` },
          })
        : null;
    },
  },
] as DataTableColumns<UserFundingPositionInterface>;

const columns = getColumns();
const endpoint = getEndpoint();
const sorter = getSorter();

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

function getSorter() {
  switch (props.tab) {
    case ProfileTabs.PREDICTIONS:
      return { columnKey: 'id', order: 'descend', sorter: 'default' } as DataTableSortState;

    case ProfileTabs.ACTIVITY:
      return { columnKey: 'transactionTime', order: 'descend', sorter: 'default' } as DataTableSortState;

    case ProfileTabs.FUNDING_POSITIONS:
      return { columnKey: 'id', order: 'descend', sorter: 'default' } as DataTableSortState;
  }
}

function getColumns() {
  switch (props.tab) {
    case ProfileTabs.PREDICTIONS:
      return predictionColumns;

    case ProfileTabs.ACTIVITY:
      return activitiesColumns;

    case ProfileTabs.FUNDING_POSITIONS:
      return fundingPositionsColumns;
  }
}

function getEndpoint() {
  switch (props.tab) {
    case ProfileTabs.PREDICTIONS:
      return Endpoints.userPredictions(props.userId);

    case ProfileTabs.ACTIVITY:
      return Endpoints.predictionSetActivity;

    case ProfileTabs.FUNDING_POSITIONS:
      return Endpoints.userFundingPositions(props.userId);
  }
}
</script>
