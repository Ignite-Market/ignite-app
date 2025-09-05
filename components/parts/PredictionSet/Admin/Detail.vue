<template>
  <div class="flex flex-col gap-y-5">
    <!-- Question and Description -->
    <div class="flex flex-row gap-x-5">
      <div>
        <div class="text-[14px] text-white font-semibold">Question</div>
        <div class="text-[14px] text-grey-lightest">{{ prediction.question }}</div>
      </div>
      <div>
        <div class="text-[14px] text-white font-semibold">Outcome Resolution Definition</div>
        <div class="text-[14px] text-grey-lightest">{{ prediction.outcomeResolutionDef }}</div>
      </div>
    </div>

    <!-- Status, Dates, Resolution Type, Consensus -->
    <div class="flex flex-row gap-x-10">
      <div>
        <div class="text-[14px] text-white font-semibold">Id</div>
        <div class="text-[14px] text-grey-lightest">{{ prediction.id }}</div>
      </div>
      <div>
        <div class="text-[14px] text-white font-semibold">Status</div>
        <div class="text-[14px] text-grey-lightest">{{ getStatusName(prediction.setStatus, prediction.endTime) }}</div>
      </div>
      <div :title="localDate(prediction.startTime)">
        <div class="text-[14px] text-white font-semibold">Start Time (UTC)</div>
        <div class="text-[14px] text-grey-lightest">{{ formatDateToUTC(prediction.startTime) }}</div>
      </div>
      <div :title="localDate(prediction.endTime)">
        <div class="text-[14px] text-white font-semibold">End Time (UTC)</div>
        <div class="text-[14px] text-grey-lightest">{{ formatDateToUTC(prediction.endTime) }}</div>
      </div>
      <div :title="localDate(prediction.resolutionTime)">
        <div class="text-[14px] text-white font-semibold">Resolution Time (UTC)</div>
        <div class="text-[14px] text-grey-lightest">{{ formatDateToUTC(prediction.resolutionTime) }}</div>
      </div>
      <div>
        <div class="text-[14px] text-white font-semibold">Resolution Type</div>
        <div class="text-[14px] text-grey-lightest">{{ resolutionTypeName }}</div>
      </div>
      <div>
        <div class="text-[14px] text-white font-semibold">Consensus Threshold</div>
        <div class="text-[14px] text-grey-lightest">{{ prediction.consensusThreshold }}%</div>
      </div>
    </div>

    <!-- Collateral Token -->
    <div class="flex flex-row gap-x-5 items-center">
      <div class="text-[14px] text-white font-semibold">Collateral Token</div>
      <div v-if="collateralToken">
        <span v-if="collateralToken.imgUrl">
          <Image :src="collateralToken.imgUrl" class="rounded-full w-6 h-6 object-cover inline-block mr-1" />
        </span>
        <span class="text-[14px] text-grey-lightest font-bold">{{ collateralToken.symbol }}</span>
        <span class="text-[14px] text-grey-lightest ml-2">{{ collateralToken.name }}</span>
      </div>
      <div v-else class="text-[14px] text-grey-lightest">-</div>
    </div>

    <!-- Funding and Transaction Volumes -->
    <div class="flex flex-row gap-x-10">
      <div>
        <div class="text-[14px] text-white font-semibold">Total Volume</div>
        <div class="text-[14px] text-grey-lightest">
          {{ formatCollateralAmount(prediction.volume || 0, collateralToken?.decimals || 0) }}
          {{ collateralToken?.symbol || '' }}
        </div>
      </div>
      <div v-if="prediction.setStatus > PredictionSetStatus.PENDING">
        <div class="text-[14px] text-white font-semibold">Question ID</div>
        <div class="text-[14px] text-grey-lightest">
          {{ numberToBytes32(prediction.id) }}
        </div>
      </div>
    </div>

    <!-- Outcomes -->
    <div>
      <div class="text-[14px] text-white font-semibold mb-2">Outcomes</div>
      <div class="flex flex-row flex-wrap gap-6">
        <div v-for="outcome in prediction.outcomes" :key="outcome.id">
          <div
            class="flex flex-col items-center border border-grey-lighter rounded-lg p-3 min-w-[160px]"
            :class="{ 'border-primary': outcome.id === prediction.winner_outcome_id }"
          >
            <Image v-if="outcome.imgUrl" :src="outcome.imgUrl" class="rounded-full w-12 h-12 object-cover mb-2" />
            <div class="text-[14px] text-white font-bold">{{ outcome.name }}</div>
            <div v-if="outcome.latestChance" class="text-[12px] text-grey-lightest">
              Chance: {{ outcome.latestChance }}%
            </div>
            <div class="text-xs text-grey-lightest">Index: {{ outcome.outcomeIndex }}</div>
          </div>
          <div
            v-if="outcome.id === prediction.winner_outcome_id"
            class="text-[14px] text-primary mt-1 font-bold w-full text-center"
          >
            Winner
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PredictionSetInterface } from '~/lib/types/prediction-set';
import { useTokensStore } from '~/stores/collateral-tokens';
import { formatCollateralAmount } from '~/lib/utils/numbers';
import { getStatusName } from '~/lib/utils/prediction-set';
import Image from '~/components/general/Image.vue';
import { formatDateToUTC } from '~/lib/utils/dates';

import { PredictionSetStatus, ResolutionType } from '~/lib/types/prediction-set';

const { prediction } = defineProps<{ prediction: PredictionSetInterface }>();

const tokensStore = useTokensStore();
const collateralToken = computed(() => tokensStore.getToken(prediction.collateral_token_id));

const resolutionTypeName = computed(() => {
  switch (prediction.resolutionType) {
    case ResolutionType.AUTOMATIC:
      return 'Automatic';
    case ResolutionType.MANUAL:
      return 'Manual';
    default:
      return prediction.resolutionType;
  }
});

function localDate(date: string | Date) {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return 'Local: ' + d.toLocaleString();
}
</script>
