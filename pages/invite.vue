<template>
  <Dashboard :loading="loading">
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
                new user you will get 50 points per referral<s> + 10% of referred user's first month points</s>.
              </p>
            </div>

            <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Your referral link</h3>
            <BasicButton @click="getReferralLink"> Copy to clipboard </BasicButton>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
const userStore = useUserStore();

const loading = ref(false);

function getReferralLink() {
  const app = useRuntimeConfig().public.url;
  const url = `${app}?referral=${userStore.user?.referralId || '0'}`;
  copyLink(url);
}

function copyLink(url: string) {
  copyToClipboard(url);
}
</script>
