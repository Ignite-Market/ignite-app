<template>
  <Dashboard :loading="loading">
    <div v-if="predictionSet" class="px-4 max-w-[1241px] m-auto">
      <!-- HEADER -->
      <div class="flex mb-10 justify-between flex-wrap gap-4">
        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="w-[80px] h-[80px] flex-shrink-0">
            <img class="rounded-[8px] w-full h-full object-cover" src="https://app-dev.ignitemarket.xyz/favicon.png" />
          </div>
          <div class="flex flex-col">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">
              {{ predictionSet.question }}
            </div>

            <div class="flex mt-4 items-center">
              <Status :status="predictionSet.setStatus" :endTime="predictionSet.endTime.toString()"></Status>

              <div class="mx-4 border-r-1 border-r-white/25 h-[14px]"></div>

              <div class="text-white/80 text-[14px] leading-[20px]">
                Ends on {{ toMonthAndYear(predictionSet.endTime) }}
              </div>

              <div class="mx-4 border-r-1 border-r-white/25 h-[14px]"></div>

              <div class="text-white/80 text-[14px] leading-[20px]">
                {{ formatTokenAmount(predictionSet.volume || 0, 2) }} USDC
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-1.5 mt-2">
          <Btn
            v-if="loggedIn"
            class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
            type="link"
            @click="toggleWatchlist"
          >
            <NuxtIcon
              :name="predictionSet.isWatched ? 'icon/star' : 'icon/star-outline'"
              :class="predictionSet.isWatched && 'text-primary'"
              class="text-[20px]"
            ></NuxtIcon>
          </Btn>
          <Btn class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter" type="link" @click="copyLink">
            <NuxtIcon name="icon/link" class="text-[20px]"></NuxtIcon>
          </Btn>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="flex flex-col-reverse md:flex-row justify-center">
        <!-- LEFT -->
        <div class="flex flex-col min-w-[250px] max-w-[736px]">
          <!-- GRAPH -->
          <div v-if="predictionSet.setStatus !== PredictionSetStatus.FUNDING">
            <PredictionSetGraph
              v-if="params?.id"
              :prediction-id="+params.id"
              :outcomes="graphOutcomes"
              :start-time="predictionSet.startTime"
              :end-time="predictionSet.endTime"
            />
          </div>

          <!-- OUTCOMES -->
          <div class="flex flex-col gap-y-[6px] mt-10">
            <div
              v-for="(outcome, i) in predictionSet.outcomes"
              class="flex flex-wrap bg-grey rounded-lg pl-3 pr-4 py-[6px] items-center w-full relative gap-x-9 gap-y-4"
              :class="{ 'border-1 border-primary': winningOutcome?.id === outcome.id }"
            >
              <div
                class="absolute w-0.5 h-6 left-0 top-1/2 bottom-1/2 -translate-y-1/2"
                :style="{ backgroundColor: outcomeColors[i] }"
              ></div>

              <div class="flex justify-between items-center flex-grow-[10] gap-8 min-w-[220px]">
                <div class="flex">
                  <div class="w-[56px] h-[56px] flex-shrink-0">
                    <img
                      class="rounded-[78px] w-full h-full object-cover"
                      src="https://app-dev.ignitemarket.xyz/favicon.png"
                    />
                  </div>

                  <div class="flex flex-col ml-4">
                    <div class="text-[16px] leading-[24px] font-bold text-white pt-[4px]">
                      {{ outcome.name }}
                    </div>

                    <div class="text-[14px] leading-[20px] font-medium text-grey-lightest mt-[4px]">
                      {{ formatTokenAmount(outcome.volume, 2) }} USDC
                    </div>
                  </div>
                </div>

                <div
                  class="font-bold text-[16px] leading-[24px]"
                  v-if="predictionSet.setStatus !== PredictionSetStatus.FINALIZED"
                >
                  {{ Number(outcome.latestChance.chance * 100).toFixed(0) }} %
                </div>
                <div v-if="winningOutcome?.id === outcome.id" class="flex items-center justify-center">
                  <NuxtIcon class="text-primary text-[24px]" name="icon/complete" />
                </div>
              </div>

              <div
                v-if="tradeEnabled(predictionSet.setStatus, predictionSet.endTime)"
                class="flex items-center flex-grow-[1]"
              >
                <BasicButton
                  class="mr-3 w-full"
                  size="large"
                  type="secondary"
                  :btnClass="['bg-statusGreen/20 border-statusGreen hover:bg-statusGreen']"
                  @click="selectOutcome(TransactionType.BUY, outcome)"
                  :selected="selectedOutcome.id === outcome.id && selectedAction === TransactionType.BUY"
                  :selectedClass="['!bg-statusGreen !border-statusGreen']"
                >
                  Buy
                </BasicButton>
                <BasicButton
                  class="w-full"
                  size="large"
                  type="secondary"
                  :btnClass="['bg-statusRed/20 border-statusRed hover:bg-statusRed']"
                  @click="selectOutcome(TransactionType.SELL, outcome)"
                  :selected="selectedOutcome.id === outcome.id && selectedAction === TransactionType.SELL"
                  :selectedClass="['!bg-statusRed !border-statusRed']"
                >
                  Sell
                </BasicButton>
              </div>
            </div>
          </div>

          <!-- RULES -->
          <div class="border-1 border-grey-lighter rounded-lg mt-10 flex-col p-6 text-wrap break-words">
            <div class="font-bold text-[14px] leading-[20px] mb-4 text-white">Rules</div>
            <div class="font-medium text-[14px] leading-[20px] mb-4 text-white/80">
              {{ predictionSet.outcomeResolutionDef }}
            </div>
          </div>

          <!-- CONTRACTS -->
          <div
            class="border-1 border-grey-lighter rounded-lg mt-10 p-6 flex font-medium text-[14px] leading-[20px] justify-between sm:flex-row flex-col gap-x-11 gap-y-6"
          >
            <div class="flex border-r-grey-lighter sm:pr-2 items-center flex-grow flex-wrap justify-between gap-2">
              <div class="text-white/80">Contract</div>
              <div class="flex items-center">
                <div class="ml-auto font-bold hover:text-primary cursor-pointer">
                  {{ shortenAddress(predictionSet.chainData.contractAddress) }}
                </div>
                <NuxtIcon
                  class="ml-2 text-white cursor-pointer"
                  name="icon/copy"
                  @click="copyToClipboard(predictionSet.chainData.contractAddress)"
                />
              </div>
            </div>
            <div class="border-[0.5px] border-grey-lighter w-[1px] hidden sm:block"></div>

            <div class="flex border-l-grey-lighter sm:pl-2 items-center flex-grow flex-wrap justify-between gap-2">
              <div class="text-white/80">Resolver</div>
              <div class="flex items-center">
                <div class="ml-auto font-bol hover:text-primary cursor-pointer">
                  {{ shortenAddress(config.public.ORACLE_CONTRACT) }}
                </div>
                <NuxtIcon
                  class="ml-2 text-white cursor-pointer"
                  name="icon/copy"
                  @click="copyToClipboard(config.public.ORACLE_CONTRACT)"
                />
              </div>
            </div>
          </div>

          <div class="mt-9">
            <n-tabs
              type="line"
              animated
              :theme-overrides="{
                tabTextColorActiveLine: '#F5F5F5',
              }"
            >
              <n-tab-pane name="Comments" tab="Comments">
                <PredictionSetComments :prediction-set-id="predictionSet.id"></PredictionSetComments>
              </n-tab-pane>
              <n-tab-pane name="Top holders" tab="Top holders">
                <PredictionSetHolders
                  :prediction-set-id="predictionSet.id"
                  :outcomes="predictionSet.outcomes"
                ></PredictionSetHolders>
              </n-tab-pane>
              <n-tab-pane name="Activity" tab="Activity">
                <PredictionSetActivity :prediction-set-id="predictionSet.id"></PredictionSetActivity>
              </n-tab-pane>
            </n-tabs>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px] mb-6">
          <PredictionSetAction
            v-if="actionsEnabled(predictionSet.setStatus, predictionSet.endTime)"
            :contract-address="predictionSet.chainData.contractAddress"
            :outcome="selectedOutcome"
            :action="selectedAction"
            :status="predictionSet.setStatus"
            :end-time="predictionSet.endTime.toString()"
            :outcomes="predictionSet.outcomes"
          >
          </PredictionSetAction>

          <PredictionSetPhase
            v-if="predictionSet.setStatus !== PredictionSetStatus.FINALIZED"
            :prediction-set="predictionSet"
          >
          </PredictionSetPhase>

          <PredictionSetResults
            v-if="predictionSet.setStatus === PredictionSetStatus.FINALIZED"
            :outcome="winningOutcome"
            :contract-address="predictionSet.chainData.contractAddress"
            :condition-id="predictionSet.chainData.conditionId"
          >
          </PredictionSetResults>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import Status from '~/components/parts/PredictionSet/Status.vue';
import {
  type OutcomeInterface,
  type PredictionSetInterface,
  type PredictionSetResponse,
  PredictionSetStatus,
  TransactionType,
} from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

// Chart colors
const outcomeColors = ['#F95F85', '#4A61C9', '#639266', '#F1B11B'];

const REFRESH_INTERVAL = 10_000;

const { params } = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { loggedIn } = useUserStore();

const loading = ref<boolean>(true);
const refreshInterval = ref<NodeJS.Timeout>();
const predictionSet = ref<PredictionSetInterface | null>();
const selectedOutcome = ref();
const selectedAction = ref();
const winningOutcome = ref();
const graphOutcomes = ref();
const watclistLoading = ref(false);

onMounted(async () => {
  await sleep(10);
  await getPredictionSet();
});

onUnmounted(() => {
  clearInterval(refreshInterval.value);
});

async function selectOutcome(transaction: TransactionType, outcome: OutcomeInterface) {
  selectedAction.value = transaction;
  selectedOutcome.value = outcome;
}

async function getPredictionSet(silent: boolean = false) {
  if (!silent) {
    loading.value = true;
  }

  try {
    const res = await $api.get<PredictionSetResponse>(Endpoints.predictionSetsById(Number(params?.id)));
    predictionSet.value = res.data;

    graphOutcomes.value = res.data.outcomes.map((o, i) => ({
      id: o.id,
      name: o.name,
      color: outcomeColors?.[i],
    }));

    if (predictionSet.value.setStatus === PredictionSetStatus.FINALIZED) {
      winningOutcome.value = predictionSet.value.outcomes.find(o => o.id === predictionSet.value?.winner_outcome_id);

      clearInterval(refreshInterval.value);
    } else {
      // TODO: look at url if another outcome is selected.
      if (!selectedOutcome.value || !selectedAction.value) {
        selectedOutcome.value = predictionSet.value.outcomes[0];
        selectedAction.value = TransactionType.BUY;
      }

      if (!refreshInterval.value) {
        refreshInterval.value = setInterval(async () => {
          await getPredictionSet(true);
        }, REFRESH_INTERVAL);
      }
    }
  } catch (error) {
    router.push({ name: 'index' });
  } finally {
    loading.value = false;
  }
}

async function toggleWatchlist() {
  if (!predictionSet.value || !loggedIn || watclistLoading.value) {
    return;
  }
  watclistLoading.value = true;
  if (predictionSet.value.isWatched) {
    // Delete if already watched
    try {
      await $api.delete(Endpoints.predictionSetUserWatchlist(predictionSet.value.id));
      predictionSet.value.isWatched = false;
    } catch (error) {
      console.error(error);
    }
  } else {
    // Add to watchlist
    try {
      await $api.post(Endpoints.predictionSetUserWatchlist(predictionSet.value.id));
      predictionSet.value.isWatched = true;
    } catch (error) {
      console.error(error);
    }
  }
  watclistLoading.value = false;
}

function copyLink() {
  copyToClipboard(window.location.href);
}
</script>
