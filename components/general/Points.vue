<script lang="ts" setup>
defineProps<{
  compact?: boolean;
}>();

const { isLg } = useScreen();
const userStore = useUserStore();

const items = computed(() => [
  {
    label: 'Total Points',
    value: userStore.points.totalPoints,
  },
  {
    label: 'Buying Shares',
    value: userStore.points.buyingSharesPoints,
  },
  {
    label: 'Selling Shares',
    value: userStore.points.sellingSharesPoints,
  },
  {
    label: 'Market Winnings',
    value: userStore.points.marketWinnerPoints,
  },
  {
    label: 'Proposal Winnings',
    value: userStore.points.proposalWinnerPoints,
  },
  {
    label: 'Proposal Votes',
    value: userStore.points.proposalVotePoints,
  },
  {
    label: 'Daily Logins',
    value: userStore.points.dailyLoginPoints,
  },
  {
    label: 'Referrals',
    value: userStore.points.referralPoints,
  },
]);
</script>

<template>
  <n-popover v-if="compact" :trigger="isLg ? 'hover' : 'click'" :show-arrow="false" placement="bottom">
    <template #trigger>
      <div class="flex items-center gap-1.5 border border-grey-lighter rounded-lg px-3 py-2">
        <span class="xs:block hidden text-sm font-semibold">
          {{ shortenLargeNumber(userStore.points.totalPoints) }}
        </span>

        <NuxtIcon name="icon/points" class="text-primary text-[20px]" />
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <div v-for="item in items" :key="item.label" class="flex items-center justify-between gap-4">
        <span class="whitespace-nowrap">{{ item.label }}</span>

        <span class="text-sm font-semibold max-w-1/2 truncate min-w-0" :title="`${item.value}`">
          {{ item.value }}
        </span>
      </div>
    </div>
  </n-popover>

  <div v-else>
    <div class="flex items-center justify-between mb-2">
      <div class="text-[14px] font-bold text-white">Your Points</div>
      <div class="flex items-center">
        <div class="text-[20px] font-bold text-white mr-2">
          {{ shortenLargeNumber(userStore.points.totalPoints) }}
        </div>
        <NuxtIcon name="icon/points" class="text-primary text-[20px]" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div v-for="item in items" :key="item.label" class="flex items-center justify-between gap-4">
        <span class="whitespace-nowrap">{{ item.label }}</span>

        <span class="text-sm font-semibold max-w-1/2 truncate min-w-0" :title="`${item.value}`">
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>
