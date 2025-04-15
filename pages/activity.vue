<template>
  <Dashboard>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-semibold text-white">Activity Feed</h1>
      <div class="flex gap-3">
        <n-dropdown trigger="click" :options="filterOptions" @select="handleFilterSelect">
          <n-button secondary class="px-5 py-2 rounded-lg bg-grey-light hover:bg-grey-lighter">
            {{ currentFilter }}
            <n-icon class="ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </n-icon>
          </n-button>
        </n-dropdown>
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <div v-if="loading" class="flex flex-col gap-4">
        <n-skeleton v-for="i in 5" :key="i" height="100px" class="rounded-lg" />
      </div>
      <div v-else-if="activities.length === 0" class="text-center py-12">
        <n-empty description="No activity found" />
      </div>
      <div
        v-for="activity in activities"
        v-else
        :key="activity.id"
        class="bg-grey-dark border border-grey-lighter rounded-lg p-5 transition-all duration-200 hover:border-grey-light"
      >
        <div class="flex items-start gap-5">
          <div class="w-[60px] h-[60px] rounded-md overflow-hidden flex-shrink-0">
            <img
              v-if="activity.imgUrl"
              :src="activity.imgUrl"
              class="w-full h-full object-cover"
              :alt="activity.question"
            />
            <div v-else class="w-full h-full bg-grey-light flex items-center justify-center">
              <n-icon size="24" class="text-grey-lightest">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21 15L16 10L5 21"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </n-icon>
            </div>
          </div>
          <div class="flex flex-col flex-grow space-y-2">
            <NuxtLink
              :to="`/markets/${activity.id}`"
              class="text-lg font-semibold text-white hover:text-primary transition-colors duration-200"
            >
              {{ activity.question }}
            </NuxtLink>
            <div class="flex flex-wrap items-center gap-2">
              <div class="flex items-center flex-wrap">
                <NuxtLink
                  v-if="activity.username"
                  :to="`/profile/${activity.userId}`"
                  class="font-bold text-primary hover:underline"
                >
                  {{ activity.username }}
                </NuxtLink>
                <span v-else class="text-grey-lightest">Unknown user</span>
                <span :style="{ color: getTypeColor(activity.type) }" class="font-medium ml-1.5">
                  {{ getTypeLabel(activity.type) }}
                </span>
                <span v-if="activity.outcomeName" class="px-1.5 py-0.5 rounded bg-grey-light text-white text-sm ml-1.5">
                  {{ activity.outcomeName }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <span v-if="activity.userAmount" class="text-white">
                  {{ formatPrice(activity.userAmount) }}
                </span>
                <span v-if="activity.outcomeTokens" class="text-grey-lightest text-sm">
                  {{ formatTokenAmount(activity.outcomeTokens) }} shares
                </span>
              </div>
            </div>
          </div>
          <div class="text-grey-lightest text-sm whitespace-nowrap">
            {{ formatDistanceToNow(new Date(activity.transactionTime), { addSuffix: true }) }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="canLoadMore && !loading" class="mt-8 flex justify-center">
      <n-button secondary class="px-8 py-2 bg-grey-light hover:bg-grey-lighter" @click="loadMore">Load more</n-button>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns';
import type { DropdownOption } from 'naive-ui';
import { TransactionType, type ActivityInterface } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

const activities = ref<ActivityInterface[]>([]);
const loading = ref(true);
const page = ref(1);
const limit = ref(20);
const total = ref(0);
const minAmount = ref<number | null>(null);

const filterLabels = {
  all: 'All transactions',
  '1': 'Min $1',
  '5': 'Min $5',
  '10': 'Min $10',
  '50': 'Min $50',
  '100': 'Min $100',
};

const filterOptions = [
  { label: filterLabels.all, key: 'all' },
  { label: filterLabels['1'], key: '1' },
  { label: filterLabels['5'], key: '5' },
  { label: filterLabels['10'], key: '10' },
  { label: filterLabels['50'], key: '50' },
  { label: filterLabels['100'], key: '100' },
] as DropdownOption[];

const currentFilter = computed(() => {
  const key = minAmount.value === null ? 'all' : String(minAmount.value);
  return filterLabels[key as keyof typeof filterLabels];
});

const transactionType = {
  [TransactionType.BUY]: { label: 'bought', color: '#5DCE46' },
  [TransactionType.SELL]: { label: 'sold', color: '#DE4941' },
  [TransactionType.FUND]: { label: 'funded', color: '#5272FF' },
  [TransactionType.REMOVE_FUND]: { label: 'removed fund', color: '#5272FF' },
};

const getTypeLabel = (type: TransactionType) => transactionType[type]?.label || '';
const getTypeColor = (type: TransactionType) => transactionType[type]?.color || '';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
};

const canLoadMore = computed(() => {
  return total.value > activities.value.length;
});

async function loadActivities(append = false) {
  try {
    loading.value = true;

    const params: Record<string, any> = {
      page: page.value,
      limit: limit.value,
      orderBy: 'transactionTime',
      desc: 'true',
    };

    if (minAmount.value) {
      params.minAmount = minAmount.value;
    }

    const response = await $api.get<GeneralItemsResponse<ActivityInterface>>(Endpoints.predictionSetActivity, params);

    if (append) {
      activities.value = [...activities.value, ...response.data.items];
    } else {
      activities.value = response.data.items;
    }

    total.value = response.data.total;
    page.value += 1;
  } catch (error) {
    window.$message.error(apiError(error));
  } finally {
    loading.value = false;
  }
}

function loadMore() {
  if (canLoadMore.value && !loading.value) {
    loadActivities(true);
  }
}

function handleFilterSelect(key: string) {
  minAmount.value = key === 'all' ? null : Number(key);
  page.value = 1;
  loadActivities();
}

onMounted(async () => {
  await loadActivities();
});
</script>
