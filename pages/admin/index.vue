<template>
  <Dashboard>
    <div class="flex mb-4">
      <BasicButton to="/admin/add">Add Prediction</BasicButton>
    </div>
    <DataTable
      :key="refreshKey"
      :columns="predictionColumns"
      :endpoint="Endpoints.predictionSetsAdmin"
      :title="'All Predictions'"
      :table-filters="filters"
      :table-sorter="sorter"
      :row-key="rowKey"
      :row-props="rowProps"
      :default-expanded-row-keys="expanded"
    >
      <template #actions>
        <div class="flex md:justify-end gap-4 flex-grow m-auto">
          <Btn btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter" type="link" @click="refresh">
            <NuxtIcon name="icon/refresh" />
          </Btn>
          <div></div>
        </div>
      </template>
    </DataTable>
  </Dashboard>
</template>

<script lang="ts" setup>
import type { DataTableColumns, DataTableSortState } from 'naive-ui';
import { format } from 'date-fns';
import { PredictionSetStatus, type PredictionSetInterface } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';
import type { TableFilters } from '~/lib/types/config';

const router = useRouter();
useLoggedIn(onInit);

const refreshKey = ref(0);

function onInit(loggedIn: boolean, isAdmin: boolean) {
  if (!loggedIn || !isAdmin) {
    router.replace('/');
  }
}

const refresh = () => {
  refreshKey.value++;
};

const rowClick = (row: PredictionSetInterface) => {
  const indexExpanded = expanded.value.findIndex(i => i === row.id);
  if (indexExpanded > -1) {
    expanded.value.splice(indexExpanded, 1);
  } else {
    expanded.value.push(row.id);
  }
};

const expanded = ref<(number | string)[]>([]);
const rowKey = (row: PredictionSetInterface) => row.id;
const rowProps = (row: PredictionSetInterface) => ({
  onClick: () => {
    rowClick(row);
  },
});

const predictionColumns = [
  {
    type: 'expand',
    renderExpand(row: PredictionSetInterface) {
      return h(resolveComponent('PredictionSetAdminDetail'), {
        prediction: row,
      });
    },
  },
  {
    key: 'question',
    title: 'Market',
    sorter: 'default',
    minWidth: 300,
    render(row: PredictionSetInterface) {
      return h('div', { style: { display: 'flex', gap: '12px' } }, [
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
      ]);
    },
  },
  {
    key: 'startTime',
    title: 'Start Time',
    sorter: 'default',
    minWidth: 90,
    render(row: PredictionSetInterface) {
      return format(row.startTime, 'dd/MM/yyyy HH:mm');
    },
  },
  {
    key: 'endTime',
    title: 'End Time',
    sorter: 'default',
    minWidth: 90,
    render(row: PredictionSetInterface) {
      return format(row.endTime, 'dd/MM/yyyy HH:mm');
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
      return h(resolveComponent('PredictionSetAdminAction'), {
        prediction: row,
        refresh,
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
