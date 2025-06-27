<template>
  <Dashboard @load-more="loadMore">
    <div class="flex justify-center items-center mb-3">
      <h1 class="text-[24px] leading-[34px] font-bold text-white mb-3">Activity</h1>
    </div>

    <div class="flex flex-col max-w-[700px] mx-auto gap-5">
      <div v-if="loading && activities.length === 0" class="flex flex-col gap-4">
        <n-skeleton v-for="i in 10" :key="i" height="80px" class="rounded-lg" />
      </div>
      <div v-else-if="activities.length === 0" class="text-center py-12">
        <n-empty description="No activity found" />
      </div>
      <template v-else>
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="bg-grey-dark border border-grey-lighter rounded-lg p-4 transition-all duration-200 hover:border-grey-light"
        >
          <div class="flex items-start gap-4">
            <div class="size-[40px] sm:size-[68px] rounded-md overflow-hidden flex-shrink-0">
              <Image :src="activity.imgUrl" class="w-full h-full object-cover" :alt="activity.question" />
            </div>

            <div>
              <div class="text-grey-lightest text-xs whitespace-nowrap mb-1">
                {{ formatDistanceToNow(new Date(activity.transactionTime), { addSuffix: true }) }}
              </div>

              <p class="mb-1">
                <NuxtLink
                  :to="`/markets/${activity.id}`"
                  class="text-base font-semibold text-white/80 hover:text-primary transition-colors duration-200"
                >
                  {{ activity.question }}
                </NuxtLink>
              </p>

              <div class="flex flex-wrap items-center gap-2">
                <NuxtLink :to="`/profile/${activity.userId}`" class="text-primary hover:underline text-sm">
                  {{ activity.username }}
                </NuxtLink>

                <span :style="{ color: getTypeColor(activity.type) }" class="font-medium text-sm uppercase">
                  {{ getTypeLabel(activity.type) }}
                </span>

                <span v-if="activity.outcomeName" class="px-1.5 py-0.5 rounded bg-grey-light text-white/80 text-xs">
                  {{ activity.outcomeName }}
                </span>

                <div
                  v-if="activity.type === TransactionType.REMOVE_FUND"
                  class="flex gap-1 items-center justify-center text-white/80 text-sm"
                >
                  and received
                  <Image
                    :src="tokensStore.getToken(activity.collateral_token_id).imgUrl"
                    :title="tokensStore.getToken(activity.collateral_token_id).name"
                    class="rounded-full w-[15px] h-[15px] object-cover"
                  />
                  {{
                    formatCollateralAmount(
                      activity.userAmount,
                      tokensStore.getToken(activity.collateral_token_id).decimals
                    )
                  }}
                  {{ tokensStore.getToken(activity.collateral_token_id).symbol }}
                </div>
                <div v-else class="flex gap-1 items-center justify-center text-white/80 text-sm">
                  <span class="mr-1">for</span>
                  <Image
                    :src="tokensStore.getToken(activity.collateral_token_id).imgUrl"
                    :title="tokensStore.getToken(activity.collateral_token_id).name"
                    class="rounded-full w-[15px] h-[15px] object-cover"
                  />
                  {{
                    formatCollateralAmount(
                      activity.userAmount,
                      tokensStore.getToken(activity.collateral_token_id).decimals
                    )
                  }}
                  {{ tokensStore.getToken(activity.collateral_token_id).symbol }}

                  <span v-if="activity.outcomeTokens" class="text-grey-lightest text-xs leading-none pt-0.5">
                    ({{
                      formatCollateralAmount(
                        activity.outcomeTokens,
                        tokensStore.getToken(activity.collateral_token_id).decimals
                      )
                    }}
                    shares)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="py-4 flex justify-center">
          <n-spin size="small" />
        </div>
      </template>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns';
import { TransactionType, type ActivityInterface } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

const tokensStore = useTokensStore();

const activities = ref<ActivityInterface[]>([]);
const loading = ref(true);
const page = ref(1);
const limit = ref(20);
const total = ref(0);

const transactionType = {
  [TransactionType.BUY]: { label: 'bought', color: '#5DCE46' },
  [TransactionType.SELL]: { label: 'sold', color: '#DE4941' },
  [TransactionType.FUND]: { label: 'funded', color: '#5272FF' },
  [TransactionType.REMOVE_FUND]: { label: 'removed funding', color: '#5272FF' },
  [TransactionType.CLAIM]: { label: 'claimed winnings with', color: '#D88ADC' },
  [TransactionType.FUND_EXCESS]: { label: 'received fund excess', color: '#5272FF' },
};

const getTypeLabel = (type: TransactionType) => transactionType[type]?.label || '';
const getTypeColor = (type: TransactionType) => transactionType[type]?.color || '';

const canLoadMore = computed(() => {
  return activities.value.length > 0 && total.value > activities.value.length;
});

async function loadActivities(append = false) {
  if (loading.value && append) return;

  try {
    loading.value = true;

    const params: Record<string, any> = {
      page: page.value,
      limit: limit.value,
      orderBy: 'transactionTime',
      desc: 'true',
    };

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
  if (canLoadMore.value) {
    loadActivities(true);
  }
}

onMounted(async () => {
  await loadActivities();
});
</script>
