<template>
  <Dashboard>
    <div class="flex justify-end">
      <BasicButton to="/admin/add">Add Prediction</BasicButton>
    </div>
    <DataTable
      :columns="predictionColumns"
      :endpoint="Endpoints.predictionSets"
      :title="'T'"
      :table-filters="filters"
      :table-sorter="sorter"
    />
  </Dashboard>
</template>

<script lang="ts" setup>
import type { DataTableColumns, DataTableSortState } from 'naive-ui';
import { PredictionSetStatus, type PredictionSetInterface } from '../../lib/types/prediction-set';
import Endpoints from '../../lib/values/endpoints';
import type { TableFilters } from '../../lib/types/config';

const router = useRouter();
useLoggedIn(onInit);

function onInit(loggedIn: boolean, isAdmin: boolean) {
  if (!loggedIn || !isAdmin) {
    router.replace('/');
  }
}

const predictionColumns = [
  {
    key: 'question',
    title: 'Market',
    sorter: 'default',
    minWidth: 300,
    render(row: PredictionSetInterface) {
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
          ]),
        ]),
      ]);
    },
  },
  {
    key: 'status',
    title: 'Status',
    sorter: 'default',
    minWidth: 90,
    render(row: PredictionSetInterface) {
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
    render(row: PredictionSetInterface) {
      return h(resolveComponent('BasicButton'), {
        text: 'Claim',
        to: { path: `/markets/${row.id}` },
      });
    },
  },
] as DataTableColumns<PredictionSetInterface>;

const filters = {
  Search: {
    show: true,
    value: null,
  },
  Status: {
    show: true,
    isArray: true,
    options: [
      { label: 'Initialized', value: PredictionSetStatus.INITIALIZED },
      { label: 'Pending', value: PredictionSetStatus.PENDING },
      { label: 'Funding', value: PredictionSetStatus.FUNDING },
      { label: 'Active', value: PredictionSetStatus.ACTIVE },
      { label: 'Resolved', value: PredictionSetStatus.VOTING },
      { label: 'Finalized', value: PredictionSetStatus.FINALIZED },
      { label: 'Error', value: PredictionSetStatus.ERROR },
    ],
    value: null,
  },
} as TableFilters;

const sorter = { columnKey: 'id', order: 'descend', sorter: 'default' } as DataTableSortState;
</script>
