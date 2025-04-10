<template>
  <Dashboard :loading="loading">
    <div class="px-4 max-w-[1241px] m-auto">
      <!-- HEADER -->
      <div class="flex mb-10 justify-between flex-wrap gap-4">
        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="w-[80px] h-[80px] flex-shrink-0">
            <Image src="https://images.ignitemarket.xyz/points.png" class="rounded-[8px] w-full h-full object-cover" />
          </div>
          <div class="flex flex-col">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">Earn points</div>
            <div class="flex mt-4 items-center">
              <div class="text-white/80 text-[14px] leading-[20px]">
                Earn points now to qualify for our upcoming token airdrop
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="flex flex-col-reverse md:flex-row justify-center">
        <!-- LEFT -->
        <div class="flex flex-col min-w-[250px] max-w-[736px]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            <n-card
              v-for="reward in rewards"
              :key="reward.id"
              class="bg-none border-1 border-grey-lighter hover:border-primary h-full"
              :content-class="'p-4 rounded-[8px] flex flex-col h-full'"
            >
              <div class="flex flex-col h-full">
                <div class="flex items-center justify-between">
                  <div class="text-[16px] font-bold text-white">{{ reward.name }}</div>
                  <div class="flex items-center">
                    <div class="text-[14px] font-bold text-white/80 mr-1">{{ reward.value }}</div>
                    <NuxtIcon name="icon/points" class="text-primary" />
                  </div>
                </div>
                <div class="text-[14px] text-white/60 mt-2">
                  {{ reward.description.replace('#POINTS', reward.value) }}
                </div>
                <div class="text-[12px] text-white/40 mt-2">{{ reward.reason }}</div>
                <div class="mt-auto pt-4">
                  <BasicButton
                    v-if="reward.type === RewardType.DAILY_LOGIN"
                    :loading="claimLoading"
                    :disabled="!canClaimDaily || !isConnected || !userStore.loggedIn"
                    :btn-class="['w-full', canClaimDaily ? 'bg-primary hover:bg-primary-hover' : 'bg-grey-lighter']"
                    @click="claimDailyReward"
                  >
                    Claim Daily Reward
                  </BasicButton>

                  <BasicButton
                    v-else-if="reward.type === RewardType.MARKET_FUNDING"
                    class="w-full bg-primary hover:bg-primary-hover"
                    @click="router.push('/')"
                  >
                    Fund Markets
                  </BasicButton>

                  <BasicButton
                    v-else-if="reward.type === RewardType.BUYING_SHARES || reward.type === RewardType.SELLING_SHARES"
                    class="w-full bg-primary hover:bg-primary-hover"
                    @click="router.push('/')"
                  >
                    Trade Now
                  </BasicButton>

                  <BasicButton
                    v-else-if="reward.type === RewardType.MARKET_WINNER"
                    class="w-full bg-primary hover:bg-primary-hover"
                    @click="router.push('/')"
                  >
                    Explore Markets
                  </BasicButton>

                  <BasicButton
                    v-else-if="reward.type === RewardType.PROPOSAL_WINNER || reward.type === RewardType.PROPOSAL_VOTE"
                    class="w-full bg-primary hover:bg-primary-hover"
                    @click="router.push('/proposals')"
                  >
                    View Proposals
                  </BasicButton>

                  <BasicButton
                    v-else-if="reward.type === RewardType.USER_REFERRAL"
                    class="w-full bg-primary hover:bg-primary-hover"
                    :disabled="!isConnected || !userStore.loggedIn"
                    @click="showReferralModal = true"
                  >
                    Invite Friends
                  </BasicButton>
                </div>
              </div>
            </n-card>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px] mb-6">
          <n-card class="border-1 border-grey-lighter" :content-class="'p-6 rounded-[8px]'">
            <div class="flex flex-col">
              <div class="text-[18px] font-bold text-white mb-4">How to earn points</div>
              <div class="text-[14px] text-white/80">
                Points are earned by participating in various activities on Ignite Market. The more you participate, the
                more points you can earn!
              </div>
              <div v-if="userStore.loggedIn && isConnected" class="mt-4 pt-4 border-t border-grey-lighter">
                <div class="flex items-center justify-between">
                  <div class="text-[14px] font-bold text-white">Your Points</div>
                  <div class="flex items-center">
                    <div class="text-[20px] font-bold text-white mr-2">{{ userPoints }}</div>
                    <NuxtIcon name="icon/points" class="text-primary text-[20px]" />
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';
import Endpoints from '~/lib/values/endpoints';
import BasicButton from '~/components/general/BasicButton.vue';
import { RewardType } from '~/lib/types/reward';

const { isConnected } = useAccount();
const message = useMessage();
const userStore = useUserStore();
const router = useRouter();

const userPoints = ref<number>(0);
const rewards = ref<any[]>([]);

const canClaimDaily = ref(false);
const showReferralModal = ref(false);

const loading = ref(false);
const userPointsLoading = ref(true);
const claimLoading = ref(true);

onMounted(async () => {
  await getRewardPoints();
  await getUserPoints();
  await getCanClaimDaily();
});

watch(
  () => userStore.loggedIn,
  async _ => {
    await getCanClaimDaily();
    await getUserPoints();
  }
);

async function getCanClaimDaily() {
  if (!isConnected.value || !userStore.loggedIn) {
    claimLoading.value = false;
    return;
  }

  claimLoading.value = true;
  try {
    const res = await $api.get<GeneralResponse<any>>(Endpoints.dailyReward);
    canClaimDaily.value = res.data.canClaim;
  } catch (error) {
    canClaimDaily.value = false;
  } finally {
    claimLoading.value = false;
  }
}

async function claimDailyReward() {
  if (!canClaimDaily.value) return;

  claimLoading.value = true;
  try {
    await $api.patch(Endpoints.dailyReward);

    await getUserPoints();
    canClaimDaily.value = false;
  } catch (error) {
    message.error('Failed to claim daily reward. Please try again later.');
  } finally {
    claimLoading.value = false;
  }
}

async function getRewardPoints() {
  loading.value = true;
  try {
    const res = await $api.get<GeneralItemsResponse<any>>(Endpoints.rewards);
    rewards.value = res.data.items;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function getUserPoints() {
  if (!isConnected.value || !userStore.loggedIn) {
    userPointsLoading.value = false;
    return;
  }

  userPointsLoading.value = true;
  try {
    const res = await $api.get<GeneralResponse<any>>(Endpoints.rewardsMe);
    userPoints.value = res.data.points;
  } catch (error) {
    message.error(apiError(error));
  } finally {
    userPointsLoading.value = false;
  }
}
</script>
