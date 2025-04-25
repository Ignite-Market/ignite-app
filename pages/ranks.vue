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
                'flex items-center px-2 py-1 hover:bg-grey-lighter/20 rounded-full text-sm font-medium border-1 border-grey-lighter cursor-pointer',
                timeFilter === period ? ' text-white border-primary' : 'text-white/60',
              ]"
              @click="timeFilter = period"
            >
              {{ period }}
            </button>
          </div>
          <div>
            <div class="w-[150px]">
              <n-select
                class="text-left"
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
                :show-arrow="true"
              >
                <template #arrow>
                  <NuxtIcon name="icon/arrow-down" class="icon-auto !inline-flex flex-cc" />
                </template>
                <template #default="{ option }">
                  <span class="text-white text-sm pl-0">{{ option.label }}</span>
                </template>
              </n-select>
            </div>
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
              <NuxtLink :to="`/profile/${user.id}`" class="flex items-center flex-grow gap-2">
                <div class="w-6 h-6">
                  <jazzicon :address="user.walletAddress" :diameter="24" />
                </div>
                <div class="text-sm font-medium text-white/80 hover:text-primary transition-colors duration-200">
                  {{ user.username }}
                </div>
              </NuxtLink>
              <div class="text-right font-medium text-sm flex items-center gap-1">
                <img
                  v-if="collateralToken"
                  :src="tokensStore.getToken(collateralToken).imgUrl"
                  class="w-4 h-4 rounded-full object-cover"
                  :alt="tokensStore.getToken(collateralToken).symbol"
                />
                {{ formatTokenAmount(user.totalVolume || 0) }}
                {{ collateralToken ? tokensStore.getToken(collateralToken).symbol : '' }}
              </div>
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
              <NuxtLink :to="`/profile/${user.id}`" class="flex items-center flex-grow gap-2">
                <div class="w-6 h-6">
                  <jazzicon :address="user.walletAddress" :diameter="24" />
                </div>
                <div class="text-sm font-medium text-white/80 hover:text-primary transition-colors duration-200">
                  {{ user.username }}
                </div>
              </NuxtLink>
              <div class="text-right font-medium text-sm flex items-center gap-1">
                <img
                  v-if="collateralToken"
                  :src="tokensStore.getToken(collateralToken).imgUrl"
                  class="w-4 h-4 rounded-full object-cover"
                  :alt="tokensStore.getToken(collateralToken).symbol"
                />
                {{ formatTokenAmount(user.totalProfit || 0) }}
                {{ collateralToken ? tokensStore.getToken(collateralToken).symbol : '' }}
              </div>
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

interface LeaderboardEntry {
  id: number;
  username: string;
  walletAddress: string;
  totalVolume?: number;
  totalProfit?: number;
  collateral_token_id: number;
}

const timeFilter = ref('Day');
const volumeLeaders = ref<LeaderboardEntry[]>([]);
const earningLeaders = ref<LeaderboardEntry[]>([]);
const loading = ref(false);
const tokensStore = useTokensStore();

const collateralToken = ref<number | null>(null);
const options = ref<{ label: string; value: number }[]>([]);

const periodMap = {
  Day: 'ONE_DAY',
  Week: 'ONE_WEEK',
  Month: 'ONE_MONTH',
  All: 'ALL',
};

function getAvatarUrl(address: string) {
  return `https://effigy.im/a/${address}.svg`;
}

async function fetchLeaderboardData() {
  if (loading.value) return;

  try {
    loading.value = true;
    /*clear user data when reloading or switching the filters */
    volumeLeaders.value = [];
    earningLeaders.value = [];

    const range = periodMap[timeFilter.value as keyof typeof periodMap];

    const params: Record<string, any> = {
      page: 1,
      limit: 20,
      range,
    };

    if (collateralToken.value) {
      params.collateralTokenId = collateralToken.value;
    }

    const [volumeRes, earningsRes] = await Promise.all([
      $api.get<GeneralItemsResponse<LeaderboardEntry>>(Endpoints.leaderboardVolume, params),
      $api.get<GeneralItemsResponse<LeaderboardEntry>>(Endpoints.leaderboardProfit, params),
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
  options.value = Object.values(tokensStore.items).map(token => ({
    label: token.symbol,
    value: token.id,
  }));
  // first available currency on list
  if (options.value.length > 0) {
    collateralToken.value = options.value[0].value;
  }
  fetchLeaderboardData();
});

watch(timeFilter, () => {
  fetchLeaderboardData();
});

watch(collateralToken, () => {
  fetchLeaderboardData();
});
</script>
