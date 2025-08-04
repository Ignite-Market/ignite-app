<template>
  <div class="">
    <div class="flex justify-between mb-2 items-center">
      <div class="text-sm text-grey-lightest">Outcome distribution</div>
      <BasicButton type="secondary" size="small" @click="equalizeDistribution">Equal</BasicButton>
    </div>
    <div v-for="(outcome, index) in props.outcomes" :key="outcome.id" class="">
      <div class="flex items-center justify-between gap-2">
        <div class="w-full">
          <div class="flex items-center justify-between mb-2">
            <div class="text-center font-bold text-[12px] leading-[16px]">{{ outcome.name }}</div>
            <div
              class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-dark cursor-pointer"
              @click="toggleLock(index)"
            >
              <NuxtIcon
                class="text-white transition-all"
                :class="{ 'opacity-100': lockedSliders[index], 'opacity-40': !lockedSliders[index] }"
                :name="lockedSliders[index] ? 'icon/lock' : 'icon/lock-unlock'"
              />
            </div>
          </div>
          <n-slider
            :value="probabilities[index] || 0"
            :format-tooltip="(val: number) => `${Math.round(val)}%`"
            :min="1"
            :max="100"
            :step="1"
            :disabled="lockedSliders[index]"
            @update:value="(val: number) => updateDistribution(index, val)"
          />
        </div>
        <n-input-number
          :value="probabilities[index] || 0"
          :min="1"
          :max="100"
          :step="1"
          :precision="0"
          :disabled="lockedSliders[index]"
          :show-button="false"
          class="max-w-[75px]"
          @update:value="(val: number | null) => val && updateDistribution(index, val)"
        >
          <template #suffix>
            <div class="text-xs">%</div>
          </template>
        </n-input-number>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OutcomeInterface } from '~/lib/types/prediction-set';

const props = defineProps({
  outcomes: { type: Array as PropType<OutcomeInterface[]>, default: () => [], required: true },
});

// Returned distributions
const model = defineModel<number[]>();

// Probabilities that the sliders work with
const probabilities = ref<number[]>(props.outcomes.map(() => Math.floor(100 / props.outcomes.length)));

// Track which sliders are locked
const lockedSliders = ref<boolean[]>(props.outcomes.map(() => false));

const convertProbabilitiesToDistribution = (probabilities: number[]) => {
  if (probabilities.length === 0) return [];

  const total = probabilities.reduce((sum, val) => sum + val, 0);
  if (total === 0) return probabilities;

  return probabilities.map(val => {
    // Convert probability to distribution: (100 / val) * (total / 100)
    const inverse = (100 / val) * (total / 100);
    return Math.round(inverse);
  });
};

// Update model when probabilities change
watch(
  probabilities,
  newValue => {
    if (newValue && newValue.length > 0) {
      model.value = convertProbabilitiesToDistribution(newValue);
    }
  },
  { deep: true }
);

const toggleLock = (index: number) => {
  lockedSliders.value[index] = !lockedSliders.value[index];
};

const updateDistribution = (index: number, value: number) => {
  if (!probabilities.value) return;

  // Ensure value is an integer and at least 1
  const integerValue = Math.max(1, Math.round(value));

  // Calculate the change in the selected outcome
  const oldValue = probabilities.value[index];
  const change = integerValue - oldValue;

  // Update the selected outcome
  const newDistribution = [...probabilities.value];
  newDistribution[index] = integerValue;

  // Get unlocked outcomes (excluding the current one being adjusted)
  const unlockedIndices = lockedSliders.value
    .map((locked, i) => ({ locked, index: i, value: newDistribution[i] }))
    .filter(item => !item.locked && item.index !== index)
    .map(item => item.index);

  if (unlockedIndices.length > 0) {
    // Distribute the change equally among all unlocked outcomes
    const equalReduction = Math.round(change / unlockedIndices.length);
    for (const i of unlockedIndices) {
      newDistribution[i] = Math.max(1, newDistribution[i] - equalReduction);
    }
    // Ensure total equals exactly 100 with integer values and minimum 1
    fixRounding(newDistribution);
    probabilities.value = newDistribution;
  }
  // If no unlocked outcomes available, we don't adjust anything
};

function fixRounding(arr: number[]) {
  // Make sure nothing falls below 1 and sum is exactly 100
  const sum = arr.reduce((a, b) => a + b, 0);
  if (sum === 100) return;

  // Adjust the element with the largest value (to avoid going below 1)
  const delta = 100 - sum; // +ve or −ve
  const idx = delta > 0 ? arr.indexOf(Math.min(...arr)) : arr.indexOf(Math.max(...arr));
  arr[idx] = Math.max(1, arr[idx] + delta);
}

// Equalize the distribution, doesn't need to sum to 100
const equalizeDistribution = () => {
  if (!probabilities.value) return;

  const n = probabilities.value.length;
  const base = Math.floor(100 / n);

  const newDistribution = Array.from({ length: n }, () => base);

  probabilities.value = newDistribution;
};
</script>
