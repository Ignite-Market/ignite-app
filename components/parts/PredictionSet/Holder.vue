<template>
  <div class="flex flex-row w-full max-w-[99%] flex-grow">
    <jazzicon
      class="cursor-pointer rounded-[50%] w-[32px] h-[32px] flex-shrink-0"
      :address="item.userWallet!"
      :diameter="32"
      @click="openUserProfile(item.userId!)"
    />

    <div class="flex relative ml-4 items-center justify-between flex-grow">
      <div class="text-[14px] leading-[16px]">
        <div
          class="text-white/80 cursor-pointer hover:text-primary-bright font-bold"
          @click="openUserProfile(item.userId!)"
        >
          {{ item.username }}
        </div>
      </div>
      <div>
        {{ formatTokenAmount(item.outcomeTokens) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type UserPredictionInterface } from '~/lib/types/prediction-set';

defineProps({
  item: { type: Object as PropType<UserPredictionInterface>, default: {}, required: true },
});

const router = useRouter();
const userStore = useUserStore();

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
