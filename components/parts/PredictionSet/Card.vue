<template>
  <n-card
    v-if="predictionSet?.id"
    class="max-w-[360px] max-h-[220px] bg-grey-light border-1 !border-grey-light hover:!border-primary"
    :class="{ '!bg-grey-lightDark': !actionsEnabled(predictionSet.setStatus, predictionSet.endTime) }"
    :content-class="'!p-3 !pb-2 !rounded-[8px]'"
  >
    <div class="flex border-b border-white/10 pb-3 cursor-pointer" @click="openDetails()">
      <div class="w-[38px] h-[38px] flex-shrink-0">
        <Image :src="predictionSet.imgUrl" class="rounded-[8px] w-full h-full object-cover" />
      </div>
      <div
        class="ml-4 text-[14px] leading-[20px] font-medium line-clamp-2 text-white/80"
        :title="predictionSet.question"
      >
        {{ predictionSet.question }}
      </div>
    </div>

    <div class="relative">
      <div class="flex flex-col border-b border-white/10 pb-2 scroll-container h-[110px] overflow-y-scroll">
        <div v-if="!predictionSet.winner_outcome_id" class="h-full">
          <div
            v-if="isBinaryPrediction(predictionSet) && tradeEnabled(predictionSet.setStatus, predictionSet.endTime)"
            class="flex w-full items-center h-full justify-center gap-6"
          >
            <div v-for="outcome of predictionSet.outcomes" :key="outcome.id" class="min-w-[100px] text-center mt-4">
              <div
                class="mb-1 flex items-center justify-center font-medium cursor-pointer w-full border-1 rounded-[8px] h-[36px] gap-6"
                :class="
                  outcome.name === 'Yes'
                    ? 'bg-statusGreen/20 hover:bg-statusGreen border-statusGreen'
                    : 'bg-statusRed/20 hover:bg-statusRed border-statusRed'
                "
                @click="openDetails(outcome.id, TransactionType.BUY)"
              >
                {{ outcome.name }}
              </div>
              <div class="text-[12px]">{{ (outcome.latestChance * 100).toFixed(0) }}%</div>
            </div>
          </div>
          <div v-else class="pb-[20px]">
            <div
              v-for="outcome of predictionSet.outcomes"
              :key="outcome.id"
              class="flex flex-row w-full mt-[10px] font-medium cursor-pointer"
            >
              <div>{{ outcome.name }}</div>

              <div class="flex ml-auto justify-center items-center">
                <div class="mr-[6px] text-xs">{{ (outcome.latestChance * 100).toFixed(0) }}%</div>
                <div
                  v-if="tradeEnabled(predictionSet.setStatus, predictionSet.endTime)"
                  class="mr-[6px] px-2.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px] hover:bg-statusGreen"
                  @click="openDetails(outcome.id, TransactionType.BUY)"
                >
                  Buy
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="mt-4">
          <div class="text-[12px] leading-[16px] mb-2">Outcome</div>
          <div
            v-if="winnerOutcome"
            class="flex items-center gap-3 border-1 rounded-[8px] bg-grey-light border-grey-lighter p-3 justify-center h-[54px]"
          >
            <div class="w-[30px] h-[30px] flex-shrink-0">
              <Image :src="winnerOutcome.imgUrl" class="rounded-full w-full h-full object-cover" />
            </div>
            <div class="flex items-center justify-between font-medium" :class="{ 'flex-1': canClaim }">
              <span class="text-[14px] leading-[20px]">{{ winnerOutcome.name }}</span>
              <BasicButton
                v-if="canClaim"
                :loading="claimLoading"
                :size="'small'"
                :btn-class="['bg-primary hover:bg-primary-hover']"
                class="px-3 py-1"
                @click.stop="openDetails(winnerOutcome.id)"
              >
                Claim
              </BasicButton>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!isBinaryPrediction(predictionSet) && actionsEnabled(predictionSet.setStatus, predictionSet.endTime)"
        class="absolute bottom-[1px] left-0 right-0 h-[45px] pointer-events-none font-medium"
        style="background: linear-gradient(0deg, #292929 22.08%, rgba(41, 41, 41, 0) 100.08%)"
      ></div>
      <div
        v-else-if="
          !isBinaryPrediction(predictionSet) &&
          (predictionSet.setStatus === PredictionSetStatus.VOTING ||
            predictionSet.setStatus === PredictionSetStatus.ACTIVE)
        "
        class="absolute bottom-[1px] left-0 right-0 h-[45px] pointer-events-none font-medium"
        style="background: linear-gradient(0deg, #1b1b1b 22.08%, rgba(27, 27, 27, 0) 100.08%)"
      ></div>
    </div>

    <div
      class="flex flex-row mt-[10px] items-center lg:justify-center text-[12px] leading-[16px] lg:flex-nowrap flex-wrap gap-y-1 gap-x-2.5"
    >
      <div class="w-full flex items-center justify-between gap-1">
        <div class="flex items-center gap-x-2">
          <Status :status="predictionSet.setStatus" :end-time="new Date(predictionSet.endTime)" class="shrink-0" />
          <div class="text-[#888888]">
            {{
              getDisplayDate(predictionSet.setStatus, predictionSet.endTime.toString(), predictionSet.resolutionTime)
            }}
          </div>
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
          <div v-else class="flex items-center justify-center -mt-1 lg:mt-0">
            <div v-if="collateralToken?.imgUrl">
              <Image
                :src="collateralToken.imgUrl"
                :title="collateralToken.name"
                class="rounded-full w-[16px] h-[16px] object-cover mr-1"
              />
            </div>
            <div class="font-medium">
              {{ formatCollateralAmount(predictionSet.volume || 0, collateralToken?.decimals || 0) }}
              {{ collateralToken?.symbol || '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import Status from './Status.vue';
import { TransactionType, PredictionSetStatus, type PredictionSetInterface } from '~/lib/types/prediction-set';
import BasicButton from '~/components/general/BasicButton.vue';
import { formatCollateralAmount } from '~/lib/utils/numbers';
import { getDisplayDate } from '~/lib/utils/prediction-set';
import useLoggedIn from '~/composables/useLoggedIn';

const props = defineProps({
  predictionSet: { type: Object as PropType<PredictionSetInterface>, default: () => {}, required: true },
});

const router = useRouter();
const tokensStore = useTokensStore();
const collateralToken = ref();
const { getConditionalBalance } = useConditionalToken();
const { loggedIn } = useLoggedIn();

const claimBalance = ref(BigInt(0));
const claimLoading = ref(false);

const winnerOutcome = computed(() => {
  return props.predictionSet.outcomes.find(outcome => outcome.id === props.predictionSet.winner_outcome_id);
});

const canClaim = computed(() => {
  return claimBalance.value > BigInt(0);
});

function openDetails(outcome?: number, transaction?: TransactionType, value?: number) {
  let query: any = null;
  if (transaction) {
    if (outcome) {
      query =
        transaction === TransactionType.BUY
          ? { transaction: TransactionType.BUY, value, outcome }
          : { transaction: TransactionType.SELL, outcome };
    } else {
      query = { transaction: TransactionType.FUND };
    }
  }

  router.push({
    name: 'markets-id',
    params: { id: props.predictionSet.id },
    query,
  });
}

async function updateClaimBalance() {
  if (!loggedIn.value || !winnerOutcome.value?.positionId) {
    claimBalance.value = BigInt(0);
    return;
  }
  claimBalance.value = await getConditionalBalance(winnerOutcome.value.positionId);
}

onMounted(async () => {
  await tokensStore.ensureLoaded();
  collateralToken.value = tokensStore.getToken(props.predictionSet.collateral_token_id);
});

watch(
  () => loggedIn.value,
  async () => {
    await updateClaimBalance();
  },
  { immediate: true }
);

function isBinaryPrediction(predictionSet: PredictionSetInterface) {
  return (
    predictionSet.outcomes.length === 2 &&
    predictionSet.outcomes.every(outcome => outcome.name === 'Yes' || outcome.name === 'No')
  );
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
