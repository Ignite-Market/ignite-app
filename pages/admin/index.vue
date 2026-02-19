<template>
  <Dashboard>
    <n-tabs v-model:value="activeTab" type="line" animated>
      <!-- Predictions Tab -->
      <n-tab-pane name="predictions" tab="Prediction Sets">
        <div class="flex mb-4">
          <BasicButton to="/admin/add">Add Prediction</BasicButton>
        </div>
        <DataTable
          :key="refreshKey"
          :columns="predictionColumns"
          :endpoint="Endpoints.predictionSetsAdmin"
          :title="'All Predictions'"
          :table-filters="predictionFilters"
          :table-sorter="predictionSorter"
          :row-key="predictionRowKey"
          :row-props="predictionRowProps"
          :default-expanded-row-keys="predictionExpanded"
        >
          <template #actions>
            <div class="flex md:justify-end gap-4 flex-grow m-auto">
              <Btn
                btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
                type="link"
                @click="refreshPredictions"
              >
                <NuxtIcon name="icon/refresh" />
              </Btn>
              <div></div>
            </div>
          </template>
        </DataTable>
      </n-tab-pane>

      <!-- Banners Tab -->
      <n-tab-pane name="banners" tab="Banners">
        <div class="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div class="flex items-center gap-2 text-primary">
            <NuxtIcon name="icon/info" class="text-[16px]" />
            <span class="text-[14px] font-medium"> Only the latest 3 active banners are shown on the home page. </span>
          </div>
        </div>
        <div class="flex mb-4">
          <BasicButton @click="openBannerModal()">Add Banner</BasicButton>
        </div>
        <DataTable
          :key="bannerRefreshKey"
          :columns="bannerColumns"
          :endpoint="Endpoints.bannersAdmin"
          :title="'All Banners'"
          :table-filters="bannerFilters"
          :table-sorter="bannerSorter"
          :row-key="bannerRowKey"
          :row-props="bannerRowProps"
          :default-expanded-row-keys="bannerExpanded"
        >
          <template #actions>
            <div class="flex md:justify-end gap-4 flex-grow m-auto">
              <Btn
                btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
                type="link"
                @click="refreshBanners"
              >
                <NuxtIcon name="icon/refresh" />
              </Btn>
              <div></div>
            </div>
          </template>
        </DataTable>
      </n-tab-pane>
    </n-tabs>

    <!-- Banner Modal -->
    <BannerAdminModal ref="bannerModalRef" @refresh="refreshBanners" @close="closeBannerModal" />
    <!-- Share Modal -->
    <PredictionSetAdminShareModal ref="shareModalRef" />
  </Dashboard>
</template>

<script lang="ts" setup>
import type { DataTableColumns, DataTableSortState } from 'naive-ui';
import { PredictionSetStatus, type PredictionSetInterface } from '~/lib/types/prediction-set';
import type { BannerInterface } from '~/lib/types/banner';
import Endpoints from '~/lib/values/endpoints';
import type { TableFilters } from '~/lib/types/config';
import { formatDateToUTC } from '~/lib/utils/dates';

const router = useRouter();
useLoggedIn(onInit);

const route = useRoute();
const activeTab = ref((route.query.tab as string) || 'predictions');
const refreshKey = ref(0);
const bannerRefreshKey = ref(0);

function onInit(loggedIn: boolean, isAdmin: boolean) {
  if (!loggedIn || !isAdmin) {
    router.replace('/');
  }
}

// Prediction related functions
const refreshPredictions = () => {
  refreshKey.value++;
};

const predictionRowClick = (row: PredictionSetInterface) => {
  const indexExpanded = predictionExpanded.value.findIndex(i => i === row.id);
  if (indexExpanded > -1) {
    predictionExpanded.value.splice(indexExpanded, 1);
  } else {
    predictionExpanded.value.push(row.id);
  }
};

const predictionExpanded = ref<(number | string)[]>([]);
const predictionRowKey = (row: PredictionSetInterface) => row.id;
const predictionRowProps = (row: PredictionSetInterface) => ({
  onClick: () => {
    predictionRowClick(row);
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
    key: 'id',
    title: 'ID',
    sorter: 'default',
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
    title: 'Start Time (UTC)',
    sorter: 'default',
    minWidth: 120,
    render(row: PredictionSetInterface) {
      return h('div', { title: localDate(row.startTime) }, [formatDateToUTC(row.startTime)]);
    },
  },
  {
    key: 'endTime',
    title: 'End Time (UTC)',
    sorter: 'default',
    minWidth: 120,
    render(row: PredictionSetInterface) {
      return h('div', { title: localDate(row.endTime) }, [formatDateToUTC(row.endTime)]);
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
        onRefresh: refreshPredictions,
        onShare: () => openShareModal(row),
      });
    },
  },
] as DataTableColumns<PredictionSetInterface>;

const predictionFilters = {
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

const predictionSorter = { columnKey: 'id', order: 'descend', sorter: 'default' } as DataTableSortState;

// Banner related functions
const refreshBanners = () => {
  bannerRefreshKey.value++;
};

const bannerRowClick = (row: BannerInterface) => {
  const indexExpanded = bannerExpanded.value.findIndex(i => i === row.id);
  if (indexExpanded > -1) {
    bannerExpanded.value.splice(indexExpanded, 1);
  } else {
    bannerExpanded.value.push(row.id);
  }
};

const bannerExpanded = ref<(number | string)[]>([]);
const bannerRowKey = (row: BannerInterface) => row.id;
const bannerRowProps = (row: BannerInterface) => ({
  onClick: () => {
    bannerRowClick(row);
  },
});

const bannerColumns = [
  {
    type: 'expand',
    renderExpand(row: BannerInterface) {
      return h(resolveComponent('BannerAdminDetail'), {
        banner: row,
      });
    },
  },
  {
    key: 'title',
    title: 'Banner',
    sorter: 'default',
    minWidth: 300,
    render(row: BannerInterface) {
      return h('div', { style: { display: 'flex', gap: '12px' } }, [
        h('div', { style: { width: '44px', height: '44px', flexShrink: 0 } }, [
          h('img', {
            src: row.imageUrl,
            style: { width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' },
          }),
        ]),
        h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } }, [
          h('span', { style: { fontSize: '15px', fontWeight: '500' } }, row.title),
          h('span', { style: { fontSize: '12px', color: '#9CA3AF' } }, row.description),
        ]),
      ]);
    },
  },
  {
    key: 'prediction_set_id',
    title: 'Prediction Set ID',
    sorter: 'default',
    minWidth: 120,
    render(row: BannerInterface) {
      return row.prediction_set_id;
    },
  },
  {
    key: 'isActive',
    title: 'Active',
    sorter: 'default',
    minWidth: 90,
    render(row: BannerInterface) {
      return h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '8px', color: row.isActive ? '#10B981' : '#EF4444' } },
        [h('span', { style: { fontSize: '14px', fontWeight: '500' } }, row.isActive ? 'Active' : 'Inactive')]
      );
    },
  },
  {
    key: 'action',
    title: '',
    align: 'right',
    render(row: BannerInterface) {
      return h(resolveComponent('BannerAdminAction'), {
        banner: row,
        onRefresh: refreshBanners,
        onEdit: (banner: BannerInterface) => openBannerModal(banner),
      });
    },
  },
] as DataTableColumns<BannerInterface>;

const bannerFilters = {
  Search: {
    show: true,
    value: null,
  },
} as TableFilters;

const bannerSorter = { columnKey: 'id', order: 'descend', sorter: 'default' } as DataTableSortState;

// Banner modal functionality
const bannerModalRef = ref();
const selectedBanner = ref<BannerInterface | null>(null);
const shareModalRef = ref();

function openBannerModal(banner?: BannerInterface | null) {
  selectedBanner.value = banner || null;
  bannerModalRef.value?.openModal(banner || null);
}

function closeBannerModal() {
  selectedBanner.value = null;
}

function openShareModal(prediction: PredictionSetInterface) {
  shareModalRef.value?.openModal(prediction);
}

function localDate(date: string | Date) {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return 'Local: ' + d.toLocaleString();
}
</script>
