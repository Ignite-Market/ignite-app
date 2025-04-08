<template>
  <n-card
    class="max-w-[360px] max-h-[220px] bg-grey-light border-1 !border-grey-light hover:!border-primary"
    :content-class="'!p-3 !pb-2 !rounded-[8px]'"
  >
    <div class="flex border-b border-white/10 pb-3 cursor-pointer" @click="openDetails()">
      <div class="w-[38px] h-[38px] flex-shrink-0">
        <Image :src="predictionSet.imgUrl" class="rounded-[8px] w-full h-full object-cover" />
      </div>
      <div class="ml-4 text-[14px] leading-[20px] font-medium">
        {{ predictionSet.question }}
      </div>
    </div>

    <div class="relative">
      <div class="flex flex-col border-b border-white/10 pb-3 scroll-container h-[100px] overflow-y-scroll">
        <div class="pb-[20px]">
          <div
            v-for="outcome of predictionSet.outcomes"
            :key="outcome.id"
            class="flex flex-row w-full mt-[10px] font-medium cursor-pointer"
          >
            <div>{{ outcome.name }}</div>
            <div class="flex ml-auto justify-center items-center">
              <div class="mr-[6px]">{{ (outcome.chance * 100).toFixed(0) }}%</div>
              <div v-if="tradeEnabled(predictionSet.setStatus, predictionSet.endTime)" class="flex">
                <div
                  class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px] hover:bg-statusGreen"
                  @click="openDetails(outcome.id, TransactionType.BUY, 5)"
                >
                  Buy 5
                </div>
                <div
                  class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px] hover:bg-statusGreen"
                  @click="openDetails(outcome.id, TransactionType.BUY, 10)"
                >
                  Buy 10
                </div>
                <div
                  class="px-1.5 border-1 bg-statusRed/20 border-statusRed rounded-[8px] hover:bg-statusRed"
                  @click="openDetails(outcome.id, TransactionType.SELL)"
                >
                  Sell
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-[1px] left-0 right-0 h-[45px] pointer-events-none font-medium"
        style="background: linear-gradient(0deg, #292929 22.08%, rgba(41, 41, 41, 0) 100.08%)"
      ></div>
    </div>

    <div class="flex flex-row mt-[10px] items-center justify-center text-[12px] leading-[16px]">
      <Status :status="predictionSet.setStatus" :end-time="new Date(predictionSet.endTime)" />
      <div class="ml-[10px] text-[#888888]">
        {{ getDisplayDate(predictionSet.setStatus, predictionSet.endTime, predictionSet.resolutionTime) }}
      </div>
      <div class="ml-auto flex items-center justify-center">
        <div v-if="predictionSet.setStatus === PredictionSetStatus.FUNDING">
          <BasicButton
            :size="'small'"
            :btn-class="['bg-statusBlue hover:bg-statusBlue-hover']"
            @click="openDetails(undefined, TransactionType.FUND)"
          >
            Fund
          </BasicButton>
        </div>
        <!-- TODO: Check for potential return. -->
        <div v-else class="flex items-center justify-center">
          <NuxtIcon name="icon/star2" class="text-primary" />
          <div class="ml-[6px] font-medium">0.35$</div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import Status from './Status.vue';
import { TransactionType, PredictionSetStatus } from '~/lib/types/prediction-set';
import BasicButton from '~/components/general/BasicButton.vue';

const props = defineProps({
  predictionSet: { type: Object, default: null, required: true },
});

const router = useRouter();

function openDetails(outcome?: number, transaction?: TransactionType, value?: number) {
  let query: any = null;
  if (transaction) {
    query =
      transaction === TransactionType.BUY
        ? { transaction: TransactionType.BUY, value, outcome }
        : { transaction: TransactionType.SELL, outcome };
  }

  router.push({
    name: 'markets-id',
    params: { id: props.predictionSet.id },
    query,
  });
}
</script>

<style scoped>
.scroll-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari and Opera */
}

.scroll-container {
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  scrollbar-width: none; /* For Firefox */
}
</style>
