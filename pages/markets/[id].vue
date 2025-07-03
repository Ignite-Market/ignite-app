<template>
  <Dashboard :loading="loading">
    <div v-if="predictionSet" class="px-4 max-w-[1241px] m-auto">
      <!-- HEADER -->
      <div class="flex mb-10 justify-between flex-wrap gap-4 relative">
        <Btn
          class="left-[-72px] absolute"
          btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
          type="link"
          @click="router.back()"
        >
          <NuxtIcon name="icon/arrow-back" class="text-[24px]" />
        </Btn>

        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="w-[80px] h-[80px] flex-shrink-0">
            <Image :src="predictionSet.imgUrl" class="rounded-[8px] w-full h-full object-cover" />
          </div>
          <div class="flex flex-col">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">
              {{ predictionSet.question }}
            </div>

            <div class="flex mt-4 xs:items-center items-start gap-4 xs:flex-row flex-col">
              <Status :status="predictionSet.setStatus" :end-time="new Date(predictionSet.endTime)" />

              <div class="border-r-1 border-r-white/25 h-[14px] xs:block hidden"></div>

              <div
                class="text-white/80 text-[14px] leading-[20px]"
                :title="dateTimeToDateAndTime(predictionSet.endTime)"
              >
                Ends on {{ toMonthAndYear(predictionSet.endTime) }}
              </div>

              <div class="border-r-1 border-r-white/25 h-[14px] xs:block hidden"></div>

              <n-popover trigger="hover" raw :show-arrow="false" placement="bottom-start">
                <template #trigger>
                  <div class="flex items-center justify-center cursor-pointer">
                    <div v-if="collateralToken?.imgUrl">
                      <Image
                        :src="collateralToken.imgUrl"
                        :title="collateralToken.name"
                        class="rounded-full w-[18px] h-[18px] object-cover mr-1"
                      />
                    </div>
                    <div class="text-white/80 text-[14px] leading-[20px]">
                      {{
                        formatCollateralAmount(
                          BigInt(predictionSet.fundingVolume || 0) + BigInt(predictionSet.transactionsVolume || 0),
                          collateralToken?.decimals || 0
                        )
                      }}
                      {{ collateralToken?.symbol || '' }}
                    </div>
                  </div>
                </template>
                <div class="flex flex-col text-[12px]">
                  <div class="flex items-center">
                    <div class="font-semibold">Funding volume:</div>
                    <div v-if="collateralToken?.imgUrl">
                      <Image
                        :src="collateralToken.imgUrl"
                        :title="collateralToken.name"
                        class="rounded-full w-[14px] h-[14px] object-cover mx-1"
                      />
                    </div>

                    {{ formatCollateralAmount(predictionSet.fundingVolume || 0, collateralToken?.decimals || 0) }}
                    {{ collateralToken?.symbol || '' }}
                  </div>

                  <div class="flex items-center">
                    <div class="font-semibold">Trading volume:</div>
                    <div v-if="collateralToken?.imgUrl">
                      <Image
                        :src="collateralToken.imgUrl"
                        :title="collateralToken.name"
                        class="rounded-full w-[14px] h-[14px] object-cover mx-1"
                      />
                    </div>
                    {{ formatCollateralAmount(predictionSet.transactionsVolume || 0, collateralToken?.decimals || 0) }}
                    {{ collateralToken?.symbol || '' }}
                  </div>
                </div>
              </n-popover>
            </div>
          </div>
        </div>
        <div class="flex gap-1.5 mt-2">
          <Btn
            v-if="loggedIn"
            btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
            type="link"
            @click="toggleWatchlist"
          >
            <NuxtIcon
              :name="predictionSet.isWatched ? 'icon/star' : 'icon/star-outline'"
              :class="predictionSet.isWatched && 'text-primary'"
              class="text-[20px]"
            />
          </Btn>
          <Btn btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter" type="link" @click="copyLink">
            <NuxtIcon name="icon/link" class="text-[20px]" />
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
              :start-time="new Date(predictionSet.startTime)"
              :end-time="new Date(predictionSet.endTime)"
            />
          </div>

          <!-- OPEN POSITIONS -->
          <div
            v-if="
              predictionSet.positions &&
              predictionSet.positions.length &&
              loggedIn &&
              predictionSet.setStatus !== PredictionSetStatus.FINALIZED
            "
          >
            <PredictionSetPositions
              :positions="predictionSet.positions"
              :contract-address="predictionSet.chainData.contractAddress"
              :prediction-set="predictionSet"
              :collateral-token="collateralToken"
              :loading="positionsLoading"
              @sell="(id: number, amount: number) => sellPosition(id, amount)"
            />
          </div>
          <div v-else-if="loggedIn && positionsLoading">
            <n-skeleton height="169px" width="100%" class="rounded-[8px]" />
          </div>

          <!-- FUNDING POSITIONS -->
          <div
            v-if="
              predictionSet.fundingPositions &&
              predictionSet.fundingPositions !== '0' &&
              loggedIn &&
              predictionSet.setStatus !== PredictionSetStatus.FINALIZED
            "
          >
            <div
              class="border-1 border-grey-lighter rounded-lg mt-10 p-6 text-wrap break-words flex justify-center"
              :class="{ 'animate-pulse': fundingPositionsLoading }"
            >
              <div class="font-bold text-[14px] leading-[20px] pt-0.5 text-white">Funding position</div>
              <div class="ml-auto flex items-center">
                <div v-if="collateralToken?.imgUrl">
                  <Image
                    :src="collateralToken.imgUrl"
                    :title="collateralToken.name"
                    class="rounded-full w-[18px] h-[18px] object-cover mr-1"
                  />
                </div>
                <div class="text-white/80 text-[14px] leading-[20px]">
                  {{ formatCollateralAmount(predictionSet.fundingPositions, collateralToken?.decimals || 0) }}
                  {{ collateralToken?.symbol || '' }}
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="loggedIn && fundingPositionsLoading">
            <n-skeleton height="72px" width="100%" class="rounded-[8px] mt-10" />
          </div>

          <!-- Mobile FUND btn -->
          <div v-if="predictionSet && !isMd" class="w-full mt-10">
            <BasicButton
              size="large"
              type="secondary"
              class="w-full"
              :btn-class="['bg-statusBlue/20 border-statusBlue hover:bg-statusBlue w-full']"
              @click="() => selectOutcome(TransactionType.FUND, predictionSet?.outcomes[0])"
            >
              Fund
            </BasicButton>
          </div>

          <!-- OUTCOMES -->
          <div class="flex flex-col gap-y-[6px] mt-10">
            <div
              v-for="(outcome, i) in predictionSet.outcomes"
              :key="i"
              class="flex flex-wrap bg-grey rounded-lg pl-3 pr-4 py-[6px] items-center w-full relative gap-x-9 gap-y-4 overflow-hidden"
              :class="{
                'border-1 border-primary': winningOutcome?.id === outcome.id,
              }"
            >
              <div
                class="absolute w-0.5 h-6 left-0 top-1/2 bottom-1/2 -translate-y-1/2 z-1 transition-all duration-500"
                :style="{ backgroundColor: outcomeColors[i] }"
                :class="{
                  'h-full':
                    selectedOutcome?.id === outcome.id && predictionSet.setStatus === PredictionSetStatus.ACTIVE,
                }"
              ></div>

              <div
                class="flex justify-between items-center flex-grow-[10] gap-8 min-w-[220px]"
                :class="{
                  'cursor-pointer': !winningOutcome?.id && predictionSet.setStatus === PredictionSetStatus.ACTIVE,
                }"
                @click="
                  winningOutcome?.id || predictionSet.setStatus !== PredictionSetStatus.ACTIVE
                    ? null
                    : selectOutcome(TransactionType.BUY, outcome)
                "
              >
                <div class="flex">
                  <div class="w-[56px] h-[56px] flex-shrink-0">
                    <Image :src="outcome.imgUrl" class="rounded-[78px] w-full h-full object-cover" />
                  </div>

                  <div class="flex flex-col ml-4">
                    <div class="text-[16px] leading-[24px] font-bold text-white pt-[4px]">
                      {{ outcome.name }}
                    </div>

                    <div class="flex flex-row items-center justify-center mt-[4px]">
                      <div v-if="collateralToken?.imgUrl">
                        <Image
                          :src="collateralToken.imgUrl"
                          :title="collateralToken.name"
                          class="rounded-full w-[14px] h-[14px] object-cover mr-1"
                        />
                      </div>

                      <div class="text-[14px] leading-[20px] font-medium text-grey-lightest">
                        {{ formatCollateralAmount(outcome.volume, collateralToken?.decimals || 0) }}
                        {{ collateralToken?.symbol || '' }}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="predictionSet.setStatus !== PredictionSetStatus.FINALIZED"
                  class="font-bold text-[16px] leading-[24px]"
                >
                  {{ Number(outcome.latestChance * 100).toFixed(0) }} %
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
                  size="large"
                  type="secondary"
                  :btn-class="['bg-statusGreen/20 border-statusGreen hover:bg-statusGreen mr-3 w-full']"
                  :selected="selectedOutcome?.id === outcome.id && selectedAction === TransactionType.BUY"
                  :selected-class="['!bg-statusGreen !border-statusGreen']"
                  @click="selectOutcome(TransactionType.BUY, outcome)"
                >
                  Buy
                </BasicButton>
                <BasicButton
                  size="large"
                  type="secondary"
                  :btn-class="['bg-statusRed/20 border-statusRed hover:bg-statusRed w-full']"
                  :selected="selectedOutcome?.id === outcome.id && selectedAction === TransactionType.SELL"
                  :selected-class="['!bg-statusRed !border-statusRed']"
                  @click="selectOutcome(TransactionType.SELL, outcome)"
                >
                  Sell
                </BasicButton>
              </div>
            </div>
          </div>

          <!-- RULES -->
          <div class="border-1 border-grey-lighter rounded-lg mt-10 flex-col p-6 text-wrap break-words">
            <div class="font-bold text-[14px] leading-[20px] mb-4 text-white">Rules</div>
            <div
              class="font-medium text-[14px] leading-[20px] mb-4 text-white/80"
              v-html="formatRules(predictionSet.outcomeResolutionDef)"
            ></div>
          </div>

          <!-- CONTRACTS -->
          <div
            class="border-1 border-grey-lighter rounded-lg mt-10 p-6 flex font-medium text-[14px] leading-[20px] justify-between sm:flex-row flex-col gap-x-11 gap-y-6"
          >
            <div class="flex border-r-grey-lighter sm:pr-2 items-center flex-grow flex-wrap justify-between gap-2">
              <div class="text-white/80">Contract</div>
              <div class="flex items-center">
                <div
                  class="ml-auto font-bold hover:text-primary-bright cursor-pointer"
                  @click="openExplorer(predictionSet.chainData.contractAddress)"
                >
                  {{ shortenAddress(predictionSet.chainData.contractAddress) }}
                </div>
                <NuxtIcon
                  class="ml-2 text-white cursor-pointer hover:text-primary-bright"
                  name="icon/copy"
                  @click="copyToClipboard(predictionSet.chainData.contractAddress)"
                />
              </div>
            </div>
            <div class="border-[0.5px] border-grey-lighter w-[1px] hidden sm:block"></div>

            <div class="flex border-l-grey-lighter sm:pl-2 items-center flex-grow flex-wrap justify-between gap-2">
              <div class="text-white/80">Resolver</div>
              <div class="flex items-center">
                <div
                  class="ml-auto font-bol hover:text-primary-bright cursor-pointer"
                  @click="openExplorer(config.public.ORACLE_CONTRACT)"
                >
                  {{ shortenAddress(config.public.ORACLE_CONTRACT) }}
                </div>
                <NuxtIcon
                  class="ml-2 text-white cursor-pointer hover:text-primary-bright"
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
                <CommentListing :entity-id="predictionSet.id" :entity-type="CommentEntityTypes.PREDICTION_SET" />
              </n-tab-pane>
              <n-tab-pane name="Top holders" tab="Top holders">
                <PredictionSetHolders :prediction-set-id="predictionSet.id" :outcomes="predictionSet.outcomes" />
              </n-tab-pane>
              <n-tab-pane name="Activity" tab="Activity">
                <PredictionSetActivity :prediction-set-id="predictionSet.id" />
              </n-tab-pane>
            </n-tabs>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px] mb-10">
          <div class="mobile:hidden">
            <PredictionSetAction
              v-if="actionsEnabled(predictionSet.setStatus, predictionSet.endTime)"
              :contract-address="predictionSet.chainData.contractAddress"
              :outcome="selectedOutcome"
              :action="selectedAction"
              :status="predictionSet.setStatus"
              :end-time="predictionSet.endTime.toString()"
              :outcomes="predictionSet.outcomes"
              :default-value="defaultActionValue"
              :collateral-token="collateralToken"
              @action-changed="(action: TransactionType) => (selectedAction = action)"
              @transaction-successful="
                (transactionType: TransactionType) =>
                  transactionType === TransactionType.FUND
                    ? poolForFundingPositionsChanges()
                    : poolForPositionsChanges()
              "
            />
          </div>

          <PredictionSetPhase
            v-if="predictionSet.setStatus !== PredictionSetStatus.FINALIZED"
            :prediction-set="predictionSet"
          />

          <PredictionSetResults
            v-if="predictionSet.setStatus === PredictionSetStatus.FINALIZED"
            :outcome="winningOutcome"
            :contract-address="predictionSet.chainData.contractAddress"
            :condition-id="predictionSet.chainData.conditionId"
            :collateral-token="collateralToken"
            :prediction-set-id="predictionSet.id"
          />
        </div>
      </div>
    </div>
  </Dashboard>

  <div
    v-if="!isMd"
    class="fixed bottom-0 left-0 right-0 h-6 cursor-pointer flex items-center justify-center"
    @click="actionModal = true"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div class="w-16 h-1 bg-grey-lighter rounded-full"></div>
  </div>
  <n-drawer
    v-if="!!predictionSet && !isMd"
    v-model:show="actionModal"
    placement="bottom"
    default-height="auto"
    @close="actionModal = false"
  >
    <div class="h-full w-full" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <PredictionSetAction
        v-if="actionsEnabled(predictionSet.setStatus, predictionSet.endTime)"
        :contract-address="predictionSet.chainData.contractAddress"
        :outcome="selectedOutcome"
        :action="selectedAction"
        :status="predictionSet.setStatus"
        :end-time="predictionSet.endTime.toString()"
        :outcomes="predictionSet.outcomes"
        :default-value="defaultActionValue"
        :collateral-token="collateralToken"
        show-select-outcome
        @outcome-selected="
          (outcomeId: number) => (selectedOutcome = predictionSet?.outcomes.find(o => o.id === outcomeId))
        "
        @action-changed="(action: TransactionType) => (selectedAction = action)"
        @transaction-successful="
          (transactionType: TransactionType) =>
            transactionType === TransactionType.FUND ? poolForFundingPositionsChanges() : poolForPositionsChanges()
        "
      />
    </div>
  </n-drawer>
</template>

<script lang="ts" setup>
import Status from '~/components/parts/PredictionSet/Status.vue';
import { CommentEntityTypes } from '~/lib/types/comment';
import {
  type OutcomeInterface,
  type PredictionSetInterface,
  type PredictionSetResponse,
  PredictionSetStatus,
  TransactionType,
} from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

// Chart colors
const outcomeColors = [
  '#F95F85',
  '#4A61C9',
  '#639266',
  '#F1B11B',
  '#FF6B3B',
  '#B620E0',
  '#00B7C2',
  '#8438FF',
  '#E03E52',
  '#FF8F00',
  '#6C00A2',
  '#00A86B',
];

const REFRESH_INTERVAL = 10_000;
const POLLING_INTERVAL = 5_000;
const POLLING_TIMEOUT = 30_000;

const { params, query } = useRoute();
const { isMd } = useScreen();
const { loggedIn } = useLoggedIn();
const router = useRouter();
const config = useRuntimeConfig();
const tokensStore = useTokensStore();

const loading = ref<boolean>(true);
const positionsLoading = ref<boolean>(false);
const fundingPositionsLoading = ref<boolean>(false);

const refreshInterval = ref<NodeJS.Timeout>();
const predictionSet = ref<PredictionSetInterface | null>();
const selectedOutcome = ref();
const selectedAction = ref();
const winningOutcome = ref();
const graphOutcomes = ref();
const watchlistLoading = ref(false);
const actionModal = ref(false);
const defaultActionValue = ref(0);
const collateralToken = ref<CollateralToken>();
const touchStart = ref({ x: 0, y: 0 });
const touchThreshold = 50; // minimum pixels to trigger swipe

onMounted(async () => {
  await sleep(10);
  await getPredictionSet();
  if (query) {
    if (query.transaction) {
      selectedAction.value = +query.transaction;
      if (query.outcome) {
        selectedOutcome.value = predictionSet.value?.outcomes.find(x => x.id === +query.outcome!);
      }
      if (query.value) {
        defaultActionValue.value = +query.value;
      }
      actionModal.value = true;
      router.replace({ query: undefined });
    }
  }
});

onUnmounted(() => {
  clearInterval(refreshInterval.value);
});

watch(
  () => loggedIn.value,
  async () => {
    await getPredictionSet(true);
  }
);

function sellPosition(outcomeId: number, sharesAmount: number) {
  selectedAction.value = TransactionType.SELL;
  selectedOutcome.value = predictionSet.value?.outcomes.find(x => x.id === outcomeId);
  defaultActionValue.value = sharesAmount;
  actionModal.value = true;
}

function selectOutcome(transaction: TransactionType, outcome?: OutcomeInterface) {
  selectedAction.value = transaction;
  selectedOutcome.value = outcome;
  actionModal.value = true;
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
      latestChance: o.latestChance,
    }));

    if (!collateralToken.value) {
      await tokensStore.ensureLoaded();
      collateralToken.value = tokensStore.getToken(predictionSet.value.collateral_token_id);
    }

    if (predictionSet.value.setStatus === PredictionSetStatus.FINALIZED) {
      winningOutcome.value = predictionSet.value.outcomes.find(o => o.id === predictionSet.value?.winner_outcome_id);

      clearInterval(refreshInterval.value);
    } else {
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
  if (!predictionSet.value || !loggedIn.value || watchlistLoading.value) {
    return;
  }

  watchlistLoading.value = true;
  if (predictionSet.value.isWatched) {
    // Delete if already watched.
    try {
      predictionSet.value.isWatched = false;
      await $api.delete(Endpoints.predictionSetUserWatchlist(predictionSet.value.id));
    } catch (error) {
      predictionSet.value.isWatched = true;
      console.error(error);
    }
  } else {
    // Add to watchlist.
    try {
      predictionSet.value.isWatched = true;
      await $api.post(Endpoints.predictionSetUserWatchlist(predictionSet.value.id));
    } catch (error) {
      predictionSet.value.isWatched = false;
      console.error(error);
    }
  }
  watchlistLoading.value = false;
}

function copyLink() {
  copyToClipboard(window.location.href);
}

function openExplorer(address: string) {
  const explorer = getExplorer();

  window.open(`${explorer}/address/${address}`, '_blank');
}

function poolForPositionsChanges() {
  console.log('called: poolForPositionsChanges');
  let positionsInterval = null as any;
  positionsLoading.value = true;

  setTimeout(() => {
    if (positionsInterval) {
      clearInterval(positionsInterval);
      positionsLoading.value = false;
    }
  }, POLLING_TIMEOUT);

  const currentPositions = predictionSet.value?.positions || [];
  return new Promise(function (resolve) {
    positionsInterval = setInterval(async () => {
      try {
        const res = await $api.get<GeneralResponse<any>>(Endpoints.predictionSetPositions(Number(params?.id)));

        const newPositions = res.data || [];

        if (predictionSet.value) {
          predictionSet.value.positions = newPositions;
        }

        if (JSON.stringify(currentPositions) !== JSON.stringify(newPositions)) {
          clearInterval(positionsInterval);
          positionsLoading.value = false;
          resolve(newPositions);
        }
      } catch (error) {
        console.error(error);
        clearInterval(positionsInterval);
        positionsLoading.value = false;
      }
    }, POLLING_INTERVAL);
  });
}

function poolForFundingPositionsChanges() {
  // Positions will also change.
  if (predictionSet.value?.setStatus === PredictionSetStatus.ACTIVE) {
    poolForPositionsChanges();
  }

  let fundingPositionsInterval = null as any;
  fundingPositionsLoading.value = true;

  setTimeout(() => {
    if (fundingPositionsInterval) {
      clearInterval(fundingPositionsInterval);
      fundingPositionsLoading.value = false;
    }
  }, POLLING_TIMEOUT);

  const currentFundingPositions = predictionSet.value?.fundingPositions || 0;

  return new Promise(function (resolve) {
    fundingPositionsInterval = setInterval(async () => {
      try {
        const res = await $api.get<GeneralResponse<any>>(Endpoints.predictionSetFundingPositions(Number(params?.id)));

        const newFundingPositions = res.data || 0;

        if (predictionSet.value) {
          predictionSet.value.fundingPositions = newFundingPositions;
        }

        console.log('currentFundingPositions', currentFundingPositions);
        console.log('newFundingPositions', newFundingPositions);

        if (currentFundingPositions !== newFundingPositions) {
          clearInterval(fundingPositionsInterval);
          fundingPositionsLoading.value = false;
          resolve(newFundingPositions);
        }
      } catch (error) {
        console.error(error);
        clearInterval(fundingPositionsInterval);
        fundingPositionsLoading.value = false;
      }
    }, POLLING_INTERVAL);
  });
}

function formatRules(text: string): string {
  if (!text) return '';

  // First escape any HTML to prevent XSS
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Convert URLs to clickable links
  const withLinks = escaped.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary-light hover:underline">$1</a>'
  );

  // Convert newlines to <br> tags
  return withLinks.replace(/\n/g, '<br>');
}

function handleTouchStart(event: TouchEvent) {
  touchStart.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };
}

function handleTouchEnd(event: TouchEvent) {
  const touchEnd = {
    x: event.changedTouches[0].clientX,
    y: event.changedTouches[0].clientY,
  };

  const deltaY = touchStart.value.y - touchEnd.y;

  // If swiped up more than threshold - open drawer.
  if (deltaY > touchThreshold) {
    actionModal.value = true;
  }
  // If swiped down more than threshold - close drawer.
  else if (deltaY < -touchThreshold) {
    actionModal.value = false;
  }
}
</script>
