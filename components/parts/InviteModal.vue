<template>
  <modal v-model:show="isOpen" @update:show="closeModal">
    <div class="px-4 max-w-[1241px] m-auto mb-16">
      <!-- HEADER -->
      <div class="flex mb-10 justify-between flex-wrap gap-4">
        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="w-[80px] h-[80px] flex-shrink-0">
            <Image src="https://images.ignitemarket.xyz/logo.png" class="rounded-[8px] w-full h-full object-cover" />
          </div>
          <div class="flex flex-col">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">Invite friends</div>
            <div class="flex mt-4 items-center">
              <div class="text-white/80 text-[14px] leading-[20px]">Boosts user base and long-term engagement.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="flex flex-col-reverse md:flex-row justify-start">
        <div class="flex flex-col min-w-[250px] max-w-[736px]">
          <div class="border-1 border-grey-lighter rounded-lg p-6">
            <div class="font-bold text-[18px] leading-[24px] mb-4 text-white">How User Invites Work</div>
            <div class="font-medium leading-[20px] mb-6 text-white/80">
              <p class="mb-4 text-white/80 text-[14px]">
                Ignite Market allows user to request for a referral link which can be shared amongst friends. For each
                new user you will get 50 points per referral.
              </p>
              <p class="mb-4 text-white/80 text-[14px]">
                To get an invite link you have to have your email address linked to your Ignite Market account.
              </p>
            </div>

            <div v-if="userStore.user.emailStatus === 1">
              <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Your referral link</h3>
              <BasicButton @click="getReferralLink"> Copy to clipboard </BasicButton>
            </div>
            <div v-else>
              <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Link your email account</h3>
              <BasicButton :to="'/profile/edit'"> Go to your profile </BasicButton>
            </div>
          </div>

          <div class="border-1 border-grey-lighter rounded-lg p-6 mt-6">
            <div class="font-bold text-[18px] leading-[24px] mb-4 text-white">Referrals claimed</div>

            <div class="flex flex-wrap gap-2">
              <div
                class="flex flex-col justify-center items-center gap-1 border border-grey-lighter rounded-lg p-1 min-w-[100px]"
              >
                <span class="text-white text-2xl font-bold">{{ userStore.points.referralCount }}</span>
                <span class="text-white/80 text-xs">CLAIMED</span>
              </div>

              <div
                class="flex flex-col justify-center items-center gap-1 border border-grey-lighter rounded-lg px-3 py-2 min-w-[100px]"
              >
                <span class="text-white text-2xl font-bold flex items-center gap-1.5">
                  {{ userStore.points.referralPoints }}
                  <NuxtIcon name="icon/points" class="text-primary text-[20px]" />
                </span>

                <span class="text-white/80 text-xs">POINTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts" setup>
const props = defineProps({
  openModal: { type: Boolean, default: false },
});
const emit = defineEmits(['close']);

const userStore = useUserStore();

const isOpen = ref(false);

watch(
  () => props.openModal,
  newVal => {
    isOpen.value = newVal;
  }
);

function closeModal() {
  isOpen.value = false;
  emit('close');
}

function getReferralLink() {
  const app = useRuntimeConfig().public.url;
  const url = `${app}?referral=${userStore.user?.referralId || '0'}`;
  copyLink(url);
}

function copyLink(url: string) {
  copyToClipboard(url);
}
</script>
