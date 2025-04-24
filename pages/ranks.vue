<template>
  <Dashboard>
    <div class="flex flex-col gap-6 max-w-[900px] mx-auto">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-6">Leaderboard</h1>
        <div class="flex justify-center gap-4">
          <div class="bg-grey-dark rounded-full p-1 flex gap-1">
            <button
              v-for="period in ['Day', 'Week', 'Month', 'All']"
              :key="period"
              :class="[
                'px-4 py-1 rounded-full text-sm transition-colors duration-200',
                timeFilter === period
                  ? 'bg-primary text-white'
                  : 'text-grey-lightest hover:text-white hover:bg-primary border border-grey-light/30',
              ]"
              @click="timeFilter = period"
            >
              {{ period }}
            </button>
          </div>
          <div class="w-[150px]">
            <n-select
              v-model:value="collateralToken"
              :theme-overrides="{
                peers: {
                  InternalSelection: {
                    color: '#292929',
                    clearColor: '#C56AC6',
                  },
                },
              }"
              placeholder="Currency"
              :options="options"
              clearable
            >
              <template #arrow>
                <NuxtIcon name="icon/arrow-down" class="icon-auto !inline-flex flex-cc" />
              </template>
            </n-select>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-grey rounded-lg p-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <NuxtIcon name="icon/bar-chart-fill" class="text-primary text-2xl" />
              <h2 class="text-xl font-bold">Volume</h2>
            </div>
            <button class="text-grey-lightest hover:text-white" @click="fetchLeaderboardData">
              <NuxtIcon name="icon/refresh" />
            </button>
          </div>

          <div v-if="!loading && !volumeLeaders.length" class="text-center py-12">
            <n-empty description="No volume data found" />
          </div>
          <div v-else-if="volumeLeaders.length" class="flex flex-col gap-3">
            <div v-for="(user, index) in volumeLeaders" :key="user.id" class="flex items-center gap-2">
              <div class="w-4 text-grey-lightest text-sm">{{ index + 1 }}</div>
              <div class="w-6 h-6">
                <img :src="user.avatarUrl" class="rounded-full w-full h-full object-cover" :alt="user.username" />
              </div>
              <div class="flex-grow">
                <div class="text-sm">{{ user.username }}</div>
              </div>
              <div class="text-right font-medium text-sm">${{ formatNumber(user.amount) }}</div>
            </div>
          </div>
          <div v-if="loading" class="flex flex-col gap-3">
            <n-skeleton v-for="i in 10" :key="i" height="32px" class="rounded-[8px]" />
          </div>
        </div>

        <div class="bg-grey rounded-lg p-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <NuxtIcon name="icon/cash-line" class="text-primary text-2xl" />
              <h2 class="text-xl font-bold">Profit</h2>
            </div>
            <button class="text-grey-lightest hover:text-white" @click="fetchLeaderboardData">
              <NuxtIcon name="icon/refresh" />
            </button>
          </div>

          <div v-if="!loading && !earningLeaders.length" class="text-center py-12">
            <n-empty description="No profit data found" />
          </div>
          <div v-else-if="earningLeaders.length" class="flex flex-col gap-3">
            <div v-for="(user, index) in earningLeaders" :key="user.id" class="flex items-center gap-2">
              <div class="w-4 text-grey-lightest text-sm">{{ index + 1 }}</div>
              <div class="w-6 h-6">
                <img :src="user.avatarUrl" class="rounded-full w-full h-full object-cover" :alt="user.username" />
              </div>
              <div class="flex-grow">
                <div class="text-sm">{{ user.username }}</div>
              </div>
              <div class="text-right font-medium text-sm">${{ formatNumber(user.amount) }}</div>
            </div>
          </div>
          <div v-if="loading" class="flex flex-col gap-3">
            <n-skeleton v-for="i in 10" :key="i" height="32px" class="rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import Endpoints from '~/lib/values/endpoints';
import { useTokensStore } from '~/stores/collateral-tokens';
import { usePredictionStore } from '~/stores/prediction';

interface LeaderboardEntry {
  id: number;
  username: string;
  avatarUrl: string;
  amount: number;
}

const timeFilter = ref('Day');
const volumeLeaders = ref<LeaderboardEntry[]>([]);
const earningLeaders = ref<LeaderboardEntry[]>([]);
const loading = ref(false);
const tokensStore = useTokensStore();
const predictionStore = usePredictionStore();

const collateralToken = ref(null);
const options = ref<{ label: string; value: number }[]>([]);

const periodMap = {
  Day: 'ONE_DAY',
  Week: 'ONE_WEEK',
  Month: 'ONE_MONTH',
  All: 'ALL',
};

async function fetchLeaderboardData() {
  if (loading.value) return;

  try {
    loading.value = true;
    const range = periodMap[timeFilter.value as keyof typeof periodMap];

    const volumeParams: Record<string, any> = {
      page: 1,
      limit: 20,
      range,
    };

    const profitParams: Record<string, any> = {
      page: 1,
      limit: 20,
      range,
    };

    if (collateralToken.value) {
      volumeParams.collateralTokenId = collateralToken.value;
      profitParams.collateralTokenId = collateralToken.value;
    }

    const [volumeRes, earningsRes] = await Promise.all([
      $api.get<GeneralItemsResponse<LeaderboardEntry>>(Endpoints.leaderboardVolume, volumeParams),
      $api.get<GeneralItemsResponse<LeaderboardEntry>>(Endpoints.leaderboardProfit, profitParams),
    ]);

    volumeLeaders.value = volumeRes.data.items;
    earningLeaders.value = earningsRes.data.items;
  } catch (error) {
    window.$message.error(apiError(error));
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await tokensStore.ensureLoaded();
  predictionStore.filters.collateralTokenId.value = null;
  options.value = Object.values(tokensStore.items).map(token => ({
    label: token.symbol,
    value: token.id,
  }));
  fetchLeaderboardData();
});

onUnmounted(() => {
  predictionStore.filters.collateralTokenId.value = null;
});

watch(
  () => collateralToken.value,
  async value => {
    predictionStore.filters.collateralTokenId.value = value;
    fetchLeaderboardData();
  }
);

watch(timeFilter, () => {
  fetchLeaderboardData();
});
</script>

<style scoped></style>
