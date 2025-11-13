<template>
  <Dashboard>
    <div class="flex flex-col gap-6 max-w-[1200px] mx-auto">
      <div class="text-center">
        <h1 class="text-[24px] leading-[34px] font-bold text-white mb-6">Leaderboard</h1>
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
            <div class="w-[160px]">
              <CollateralSelect
                placeholder="Currency"
                :default-value="collateralToken || undefined"
                @update:value="collateralToken = $event || null"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-grey rounded-lg p-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <NuxtIcon name="icon/bar-chart-fill" class="text-primary text-2xl" />
              <h2 class="text-xl font-bold">Volume</h2>
            </div>
            <button class="text-grey-lightest hover:text-white" @click="() => fetchLeaderboardData(['volume'])">
              <NuxtIcon name="icon/refresh" />
            </button>
          </div>

          <div v-if="!loading.includes('volume') && !volumeLeaders.length" class="text-center py-12">
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
              <div class="text-right font-medium text-sm">
                <img
                  v-if="collateralToken"
                  :src="tokensStore.getToken(collateralToken).imgUrl"
                  class="w-4 h-4 rounded-full object-cover inline-block align-middle mr-0.5"
                  :alt="tokensStore.getToken(collateralToken).symbol"
                />
                {{
                  formatCollateralAmount(
                    user.totalVolume || 0,
                    tokensStore.getToken(collateralToken || 0).decimals || 0
                  )
                }}
                {{ collateralToken ? tokensStore.getToken(collateralToken).symbol : '' }}
              </div>
            </div>
          </div>
          <div v-if="loading.includes('volume') && !volumeLeaders.length" class="flex flex-col gap-3">
            <n-skeleton v-for="i in 10" :key="i" height="32px" class="rounded-[8px]" />
          </div>
        </div>

        <div class="bg-grey rounded-lg p-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <NuxtIcon name="icon/cash-line" class="text-primary text-2xl" />
              <h2 class="text-xl font-bold">Profit</h2>
            </div>
            <button class="text-grey-lightest hover:text-white" @click="() => fetchLeaderboardData(['profit'])">
              <NuxtIcon name="icon/refresh" />
            </button>
          </div>

          <div v-if="!loading.includes('profit') && !earningLeaders.length" class="text-center py-12">
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
                {{
                  formatCollateralAmount(
                    user.totalProfit || 0,
                    tokensStore.getToken(collateralToken || 0).decimals || 0
                  )
                }}
                {{ collateralToken ? tokensStore.getToken(collateralToken).symbol : '' }}
              </div>
            </div>
          </div>
          <div v-if="loading.includes('profit') && !earningLeaders.length" class="flex flex-col gap-3">
            <n-skeleton v-for="i in 10" :key="i" height="32px" class="rounded-[8px]" />
          </div>
        </div>

        <div class="bg-grey rounded-lg p-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <NuxtIcon name="icon/points" class="text-primary text-2xl" />
              <h2 class="text-xl font-bold">Points</h2>
            </div>
            <button class="text-grey-lightest hover:text-white" @click="() => fetchLeaderboardData(['points'])">
              <NuxtIcon name="icon/refresh" />
            </button>
          </div>

          <div v-if="!loading.includes('points') && !pointsLeaders.length" class="text-center py-12">
            <n-empty description="No points data found" />
          </div>
          <div v-else-if="pointsLeaders.length" class="flex flex-col gap-3">
            <div v-for="(user, index) in pointsLeaders" :key="user.id" class="flex items-center gap-2">
              <div class="w-4 text-grey-lightest text-sm">{{ index + 1 }}</div>
              <NuxtLink :to="`/profile/${user.id}`" class="flex items-center flex-grow gap-2">
                <div class="w-6 h-6">
                  <jazzicon :address="user.walletAddress" :diameter="24" />
                </div>
                <div class="text-sm font-medium text-white/80 hover:text-primary transition-colors duration-200">
                  {{ user.username }}
                </div>
              </NuxtLink>
              <div class="text-right font-medium text-sm">
                {{ formatNumber(user.totalRewardPoints || 0) }}
              </div>
            </div>
          </div>
          <div v-if="loading.includes('points') && !pointsLeaders.length" class="flex flex-col gap-3">
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
  totalRewardPoints?: number;
  collateral_token_id: number;
}

const timeFilter = ref('Day');
const volumeLeaders = ref<LeaderboardEntry[]>([]);
const earningLeaders = ref<LeaderboardEntry[]>([]);
const pointsLeaders = ref<LeaderboardEntry[]>([]);
const loading = ref<string[]>([]);
const tokensStore = useTokensStore();

const collateralToken = ref<number | null>(null);

const periodMap = {
  Day: '1D',
  Week: '1W',
  Month: '1M',
  All: 'ALL',
};

async function fetchLeaderboardData(update = ['volume', 'profit', 'points']) {
  if (loading.value.length > 0) return;

  try {
    loading.value = update;

    const range = periodMap[timeFilter.value as keyof typeof periodMap];

    const params: Record<string, any> = {
      page: 1,
      limit: 20,
      range,
    };

    if (collateralToken.value) {
      params.collateralTokenId = collateralToken.value;
    }

    const requests = [] as Promise<GeneralItemsResponse<LeaderboardEntry>>[];
    let result = {} as any;
    if (update.includes('volume')) {
      volumeLeaders.value = [];
      requests.push(
        $api.get<GeneralItemsResponse<LeaderboardEntry>>(Endpoints.leaderboardVolume, params).then(res => {
          result.volume = res.data.items;
          return res;
        })
      );
    }
    if (update.includes('profit')) {
      earningLeaders.value = [];
      requests.push(
        $api.get<GeneralItemsResponse<LeaderboardEntry>>(Endpoints.leaderboardProfit, params).then(res => {
          result.profit = res.data.items;
          return res;
        })
      );
    }
    if (update.includes('points')) {
      pointsLeaders.value = [];
      requests.push(
        $api.get<GeneralItemsResponse<LeaderboardEntry>>(Endpoints.leaderboardPoints, params).then(res => {
          result.points = res.data.items;
          return res;
        })
      );
    }

    await Promise.all(requests);
    volumeLeaders.value = result.volume || volumeLeaders.value;
    earningLeaders.value = result.profit || earningLeaders.value;
    pointsLeaders.value = result.points || pointsLeaders.value;
  } catch (error) {
    window.$message.error(apiError(error));
  } finally {
    loading.value = [];
  }
}

onMounted(async () => {
  await tokensStore.ensureLoaded();
  // First available currency on list.
  if (Object.values(tokensStore.items)?.length > 0) {
    collateralToken.value = Object.values(tokensStore.items)[0].id;
  }
  fetchLeaderboardData();
});

watch(timeFilter, () => {
  fetchLeaderboardData();
});

watch(collateralToken, () => {
  fetchLeaderboardData(['volume', 'profit']);
});
</script>
