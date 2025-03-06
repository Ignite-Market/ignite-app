<template>
  <div class="flex flex-row w-full max-w-[99%] flex-grow items-center">
    <jazzicon
      class="cursor-pointer rounded-[50%] w-[32px] h-[32px] flex-shrink-0"
      :address="item.userWallet!"
      :diameter="32"
      @click="openUserProfile(item.userId!)"
    />

    <div class="flex relative ml-4 items-center justify-between flex-grow">
      <div class="text-[12px] sm:text-[14px] leading-[16px]">
        <span
          class="text-white/80 cursor-pointer hover:text-primary-bright font-bold"
          @click="openUserProfile(item.userId!)"
        >
          {{ item.username }}
        </span>
        <span v-if="item.type < TransactionType.FUND">
          {{ item.type === TransactionType.BUY ? ' bought ' : ' sold ' }}
          <span class="text-primary"
            >{{ formatTokenAmount(item.outcomeTokens) }} <span class="font-bold">{{ item.outcomeName }}</span></span
          >
          for <span class="font-bold">{{ formatTokenAmount(item.userAmount) }} USDC</span>
        </span>
        <span v-else>
          {{ item.type === TransactionType.FUND ? ' funded ' : ' removed funding ' }}
          <span v-if="item.type === TransactionType.FUND">
            for
            <span class="font-bold">{{ formatTokenAmount(item.userAmount) }} USDC </span>
          </span>
          <a
            :href="`https://sepolia.basescan.org/tx/${item.txHash}`"
            target="_blank"
            class="underline inline-block align-middle ml-1"
          >
            <!-- TODO: add open icon -->
            <NuxtIcon name="icon/link" />
          </a>
        </span>
      </div>

      <div class="ml-[10px] sm:text-[12px] leading-[16px] text-grey-lightest font-medium text-[10px] text-right">
        {{ formatDistanceToNow(new Date(item.transactionTime), { addSuffix: true }) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TransactionType, type ActivityInterface } from '~/lib/types/prediction-set';
import { formatDistanceToNow } from 'date-fns';

defineProps({
  item: { type: Object as PropType<ActivityInterface>, default: {}, required: true },
});

const router = useRouter();
const userStore = useUserStore();

function openUserProfile(userId: number) {
  if (userId === userStore.user.id) {
    router.push('profile');
    return;
  }

  router.push({
    name: 'profile-id',
    params: { id: userId },
  });
}
</script>

<style scoped></style>
