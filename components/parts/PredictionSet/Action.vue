<template>
  <n-card
    class="bg-grey max-w-[410px] border-1 !border-grey-lighter"
    :content-class="'!py-5 !pb-5 !pt-4 !rounded-[8px]'"
    :header-class="'!py-5 !px-6 bg-grey-dark !rounded-t-[8px]'"
  >
    <template #header>
      <div v-if="selectedTab === TransactionType.FUND" class="flex items-center justify-center">
        <div class="text-[12px] leading-[16px] pt-[19px] pb-[19px]">Fund this market</div>
      </div>
      <div v-else class="bg-grey-lighter rounded-[8px] p-3 flex flex-row items-center justify-center">
        <div class="w-[30px] h-[30px] flex-shrink-0">
          <img
            class="rounded-[48px] w-full h-full object-cover"
            src="https://s3-alpha-sig.figma.com/img/99a4/f1e2/82e026f7f9103144567086cf6cd6a662?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=X~LM1-8x2K~GS-WxTXco4sGom-IufMECvaatFC8NWpNF36plKwoS2GWG-ONIx4DYF0FaaiLk0avNaWu593gzQWGan2SISOHnwzD1OFljZForFAebXzMFFkLPw7zRXOAj6C5F38rvn7hCASSLNtnaupzkJlwyocPQzzHBx35iULp9DGfuV2jChQvZIhCeqRbqdheJu~r16qKI9TslaML0SAuaZOsPe-GxfdNTl81pghUkpVxyktSzkaaoqLEoJ0pOtVDu-HaUIw9rvcWDsb0JGP~Ed6AJyWjneQteo3W4tu0G4APnxed3bNpX55mp4tM~AdnH0vVNVTNCxjeWL4vBTg__"
          />
        </div>
        <div class="ml-2 text-[12px] leading-[16px] font-bold">NO</div>
        <div class="text-[12px] leading-[16px] font-bold ml-auto">75%</div>
        <NuxtIcon class="ml-3 opacity-[24%] text-white" name="icon/refresh" />
        <NuxtIcon class="ml-3 text-white" name="icon/settings" />
      </div>
    </template>
    <div class="tabs-wrapper">
      <n-tabs
        type="line"
        animated
        v-model:value="selectedTab"
        :theme-overrides="{
          tabTextColorActiveLine: '#F5F5F5',
        }"
      >
        <n-tab-pane :disabled="!isEnabled" :name="TransactionType.BUY" tab="Buy">Wonderwall</n-tab-pane>
        <n-tab-pane :disabled="!isEnabled" :name="TransactionType.SELL" tab="Sell">Hey Jude</n-tab-pane>
        <n-tab-pane :name="TransactionType.FUND" class="!pt-[33px]" tab="Fund">
          <div class="mb-3">
            <div class="flex flex-row text-[12px] leading-[16px] mb-2">
              <div class="font-bold">Amount</div>
              <div class="ml-auto flex font-medium">
                <div class="text-grey-lightest">Balance:</div>
                <div class="text-white/80 ml-1">234,78 USDC</div>
              </div>
            </div>

            <n-input-number
              placeholder="0"
              min="0"
              v-model:value="value"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              button-placement="both"
            >
              <template #minus-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
                </div>
              </template>

              <template #add-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/plus" />
                </div>
              </template>
            </n-input-number>
          </div>

          <BasicButton
            class="w-full"
            :btnClass="['bg-statusBlue hover:bg-statusBlue-hover !font-bold']"
            :size="'large'"
          >
            Fund
          </BasicButton>
        </n-tab-pane>
      </n-tabs>
    </div>
  </n-card>
</template>

<script setup>
import { TransactionType } from '~/lib/types/prediction-set';

const selectedTab = ref(TransactionType.FUND);
const isEnabled = ref(false);

const value = ref(null);

onMounted(() => {
  // Short delay to ensure initial render is complete
  setTimeout(() => {
    isEnabled.value = true;
  }, 100);
});
</script>

<style scoped>
.tabs-wrapper :deep(.n-tabs-nav) {
  position: relative;
}

.tabs-wrapper :deep(.n-tabs-nav::before) {
  content: '';
  position: absolute;
  bottom: 0;
  left: -24px;
  right: -24px;
  height: 1px;
  background-color: var(--n-tab-border-color);
}

.tabs-wrapper :deep(.n-tabs-bar) {
  bottom: 0 !important;
}

.tabs-wrapper :deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type.n-tabs-nav--top .n-tabs-nav-scroll-content) {
  border-bottom: none;
}
</style>
