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
          <span class="text-primary">
            {{ formatCollateralAmount(item.outcomeTokens, tokensStore.getToken(item.collateral_token_id).decimals) }}
            <span class="font-bold">{{ item.outcomeName }}</span>
          </span>
          for
          <span class="font-bold">
            {{ formatCollateralAmount(item.userAmount, tokensStore.getToken(item.collateral_token_id).decimals) }}
            {{ tokensStore.getToken(item.collateral_token_id).symbol }}
          </span>
          <a
            :href="`${getExplorer()}/tx/${item.txHash}`"
            target="_blank"
            class="underline inline-block align-middle ml-1 pb-0.5"
          >
            <NuxtIcon name="icon/link" />
          </a>
        </span>
        <span v-else-if="item.type === TransactionType.FUND_EXCESS">
          received
          <span class="text-primary">
            {{ formatCollateralAmount(item.outcomeTokens, tokensStore.getToken(item.collateral_token_id).decimals) }}
            <span class="font-bold">{{ item.outcomeName }}</span>
          </span>
          from funding
        </span>
        <span v-else>
          {{ item.type === TransactionType.FUND ? ' funded ' : ' removed funding ' }}
          <span v-if="item.type === TransactionType.FUND">
            for
            <span class="font-bold">
              {{ formatCollateralAmount(item.userAmount, tokensStore.getToken(item.collateral_token_id).decimals) }}
              {{ tokensStore.getToken(item.collateral_token_id).symbol }}
            </span>
          </span>
          <a
            :href="`${getExplorer()}/tx/${item.txHash}`"
            target="_blank"
            class="underline inline-block align-middle ml-1 pb-0.5"
          >
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
import { formatDistanceToNow } from 'date-fns';
import { TransactionType, type ActivityInterface } from '~/lib/types/prediction-set';

defineProps({
  item: { type: Object as PropType<ActivityInterface>, default: () => {}, required: true },
});

const router = useRouter();
const userStore = useUserStore();
const tokensStore = useTokensStore();

function openUserProfile(userId: number) {
  if (userId === userStore.user.id) {
    router.push('/profile');
    return;
  }

  router.push({
    name: 'profile-id',
    params: { id: userId },
  });
}
</script>

<style scoped></style>
