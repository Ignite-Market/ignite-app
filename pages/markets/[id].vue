<template>
  <Dashboard :loading="loading">
    <div v-if="predictionSet" class="relative">
      <div class="flex flex-col max-w-[736px]">
        <!-- HEADER -->
        <div class="flex">
          <div class="w-[80px] h-[80px] flex-shrink-0">
            <img
              class="rounded-[8px] w-full h-full object-cover"
              src="https://s3-alpha-sig.figma.com/img/a21f/779d/2c0931626f7c395eb6d83153a833f8ea?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mGfPGCxcLctO2MjpQ9yHbPzUhvDKiJFQ0ErmAlBuiWaEk6FaSRYX9Xpyjl5IdWzZFFh78DQM07GesQA~qVlI88J7nhuOgF-CebWhNIZHKRYT1JhDhfip9VjM85Uk3W8uomvwydyj~Oef2nt8asqEqjxdPLaD7c9Ab01AfE4a8ygRqzmVf5A-IB8984h3cKlRORBngKXeRU3uMnx88UoL-5wasTjnGFZ5HpJqDzPUQTOLVzzN40A0YOeqhH~Byk0rtQTui1Yz9OKxrr~tgK7VRDJ4r5-ApHQiA3RcrhED-E7KGr14Ye34lP4zcp9aOWyG5ory399LBcZRZT8HmuRHfQ__"
            />
          </div>
          <div class="flex flex-col ml-8">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">
              {{ predictionSet.question }}
            </div>

            <div class="flex mt-4 items-center">
              <PredictionSetStatus
                :status="predictionSet.setStatus"
                :endTime="predictionSet.endTime.toString()"
              ></PredictionSetStatus>

              <div class="mx-4 border-r-1 border-r-white/25 h-[14px]"></div>

              <div class="text-white/80 text-[14px] leading-[20px]">
                Ends on {{ toMonthAndYear(predictionSet.endTime) }}
              </div>

              <div class="mx-4 border-r-1 border-r-white/25 h-[14px]"></div>

              <div class="text-white/80 text-[14px] leading-[20px]">1,283 USDC</div>
            </div>
          </div>
        </div>

        <!-- OUTCOMES -->
        <div class="flex flex-col gap-y-[6px] mt-10">
          <div
            v-for="outcome in predictionSet.outcomes"
            class="flex bg-grey rounded-lg pl-3 py-[6px] items-center w-full"
          >
            <div class="flex">
              <div class="w-[56px] h-[56px] flex-shrink-0">
                <img
                  class="rounded-[78px] w-full h-full object-cover"
                  src="https://s3-alpha-sig.figma.com/img/a21f/779d/2c0931626f7c395eb6d83153a833f8ea?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mGfPGCxcLctO2MjpQ9yHbPzUhvDKiJFQ0ErmAlBuiWaEk6FaSRYX9Xpyjl5IdWzZFFh78DQM07GesQA~qVlI88J7nhuOgF-CebWhNIZHKRYT1JhDhfip9VjM85Uk3W8uomvwydyj~Oef2nt8asqEqjxdPLaD7c9Ab01AfE4a8ygRqzmVf5A-IB8984h3cKlRORBngKXeRU3uMnx88UoL-5wasTjnGFZ5HpJqDzPUQTOLVzzN40A0YOeqhH~Byk0rtQTui1Yz9OKxrr~tgK7VRDJ4r5-ApHQiA3RcrhED-E7KGr14Ye34lP4zcp9aOWyG5ory399LBcZRZT8HmuRHfQ__"
                />
              </div>

              <div class="flex flex-col ml-4">
                <div class="text-[16px] leading-[24px] font-bold text-white">
                  {{ outcome.name }}
                </div>

                <div class="text-[14px] leading-[20px] font-medium text-grey-lightest mt-[4px]">$ 1,845,924</div>
              </div>
            </div>

            <div class="flex items-center ml-auto pr-4">
              <div class="font-bold text-[16px] leading-[24px] mr-9">47%</div>
              <div class="flex ml-auto">
                <BasicButton
                  class="mr-3"
                  size="large"
                  type="secondary"
                  :btnClass="['bg-statusGreen/20 border-statusGreen hover:bg-statusGreen']"
                  @click="selectOutcome(TransactionType.BUY, outcome)"
                  :selected="true"
                >
                  Buy
                </BasicButton>
                <BasicButton
                  size="large"
                  type="secondary"
                  :btnClass="['bg-statusRed/20 border-statusRed hover:bg-statusRed']"
                  @click="selectOutcome(TransactionType.SELL, outcome)"
                >
                  Sell
                </BasicButton>
              </div>
            </div>
          </div>
        </div>

        <!-- RULES -->
        <div class="border-1 border-grey-lighter rounded-lg mt-10 flex-col p-6">
          <div class="font-bold text-[14px] leading-[20px] mb-4 text-white">Rules</div>
          <div class="font-medium text-[14px] leading-[20px] mb-4 text-white/80">
            {{ predictionSet.outcomeResolutionDef }}
          </div>
        </div>

        <!-- CONTRACTS -->
        <div
          class="border-1 border-grey-lighter rounded-lg mt-10 p-6 grid grid-cols-2 font-medium text-[14px] leading-[20px]"
        >
          <div class="flex border-r-[0.5px] border-r-grey-lighter pr-11 items-center">
            <div class="text-white/80">Contract</div>
            <div class="ml-auto font-bold">address</div>
          </div>

          <div class="flex border-l-[0.5px] border-l-grey-lighter pl-11 items-center">
            <div class="text-white/80">Resolver</div>
            <div class="ml-auto font-bold">address</div>
          </div>
        </div>
      </div>

      <div class="absolute top-0 right-0">
        <PredictionSetAction
          :contract-address="predictionSet.chainData.contractAddress"
          :outcome="selectedOutcome"
          :action="selectedAction"
          :status="predictionSet.setStatus"
        >
        </PredictionSetAction>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import {
  type OutcomeInterface,
  type PredictionSetInterface,
  type PredictionSetResponse,
  TransactionType,
} from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

const { params } = useRoute();
const router = useRouter();

const loading = ref<boolean>(true);

const predictionSet = ref<PredictionSetInterface | null>();
const selectedOutcome = ref();
const selectedAction = ref();

onMounted(async () => {
  loading.value = true;

  await sleep(10);

  try {
    const res = await $api.get<PredictionSetResponse>(Endpoints.predictionSetsById(Number(params?.id)));

    predictionSet.value = res.data;

    // TODO: look at url if another outcome is selected.
    selectedOutcome.value = predictionSet.value.outcomes[0];
    selectedAction.value = TransactionType.BUY;
  } catch (error) {
    router.push({ name: 'index' });
  } finally {
    loading.value = false;
  }
});

async function selectOutcome(transaction: TransactionType, outcome: OutcomeInterface) {
  selectedAction.value = transaction;
  selectedOutcome.value = outcome;
}
</script>
