<template>
  <Dashboard>
    <div class="px-4 max-w-[1241px] m-auto">
      <!-- HEADER -->
      <div class="flex mb-10 justify-center text-center flex-wrap gap-4 relative">
        <Btn
          class="left-[-72px] absolute"
          btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
          type="link"
          to="/admin"
        >
          <NuxtIcon name="icon/arrow-back" class="text-[24px]" />
        </Btn>
        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="flex flex-col">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">Create new prediction</div>
            <div class="flex mt-4 items-center">
              <div class="text-white/80 text-[14px] leading-[20px]">
                Fill in the details to create a new prediction market.
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- CONTENT -->
      <div class="flex flex-col-reverse md:flex-row justify-center">
        <div class="flex flex-col min-w-[250px] max-w-[736px] w-full">
          <div class="border-1 border-grey-lighter rounded-lg p-6 w-full">
            <n-form ref="formRef" :model="form" :rules="rules" @submit.prevent="submit">
              <n-form-item path="collateral_token_id" label="Collateral Token" class="mb-3">
                <CollateralSelect
                  :default-value="form.collateral_token_id || undefined"
                  placeholder="Select token"
                  @update:value="value => (form.collateral_token_id = value || null)"
                />
              </n-form-item>
              <n-form-item path="question" label="Market question" class="mb-3">
                <n-input v-model:value="form.question" placeholder="Market question" :maxlength="255" size="large" />
              </n-form-item>
              <n-form-item path="outcomeResolutionDef" label="Outcome resolution definition" class="mb-3">
                <n-input
                  v-model:value="form.outcomeResolutionDef"
                  type="textarea"
                  placeholder="How will the outcome be determined?"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                  :maxlength="2000"
                  size="large"
                />
              </n-form-item>
              <div class="flex gap-4 flex-wrap">
                <n-form-item path="startTime" label="Start Time" class="mb-3">
                  <n-date-picker
                    v-model:value="form.startTime"
                    type="datetime"
                    placeholder="Select start time"
                    update-value-on-close
                    :is-date-disabled="startDateDisabled"
                    default-time="00:00:00"
                  />
                </n-form-item>
                <n-form-item path="endTime" label="End Time" class="mb-3">
                  <n-date-picker
                    v-model:value="form.endTime"
                    type="datetime"
                    placeholder="Select end time"
                    update-value-on-close
                    :is-date-disabled="endDateDisabled"
                    default-time="00:00:00"
                  />
                </n-form-item>
                <n-form-item path="resolutionTime" label="Resolution Time" class="mb-3" update-value-on-close>
                  <n-date-picker
                    v-model:value="form.resolutionTime"
                    type="datetime"
                    placeholder="Select resolution time"
                    update-value-on-close
                    :is-date-disabled="resolutionDateDisabled"
                    default-time="00:00:00"
                  />
                </n-form-item>
              </div>
              <n-form-item path="imgUrl" label="Market Image" class="mb-3">
                <div class="flex items-center gap-2 w-full">
                  <!-- <n-input v-model:value="form.imgUrl" placeholder="Image URL" class="w-full" /> -->
                  <PredictionSetAdminImageUpload v-model:model-value="form.imgUrl" :default-value="form.imgUrl" />
                  <div v-if="form.imgUrl">
                    <img
                      :src="form.imgUrl"
                      alt="Market image"
                      class="w-10 h-10 min-w-10 min-h-10 object-cover rounded"
                    />
                  </div>
                </div>
              </n-form-item>
              <n-form-item path="predictionOutcomes" label="Prediction Outcomes" class="mb-3">
                <div>
                  <div
                    v-for="(outcome, idx) in form.predictionOutcomes"
                    :key="idx"
                    class="flex items-center gap-2 mb-6 flex-wrap"
                  >
                    <n-input
                      v-model:value="outcome.name"
                      placeholder="Outcome name"
                      :maxlength="150"
                      class="sm:max-w-[200px]"
                    />
                    <div class="sm:max-w-[200px] lg:max-w-[300px]">
                      <PredictionSetAdminImageUpload
                        v-model:model-value="outcome.imgUrl"
                        :default-value="outcome.imgUrl"
                      />
                    </div>
                    <div v-if="outcome.imgUrl">
                      <img
                        :src="outcome.imgUrl"
                        alt="Outcome image"
                        class="w-10 h-10 min-w-10 min-h-10 object-cover rounded"
                      />
                    </div>
                    <BasicButton type="error" @click="removeOutcome(idx)"><NuxtIcon name="icon/close" /></BasicButton>
                  </div>
                  <BasicButton
                    type="secondary"
                    inner-class="flex-cc"
                    :disabled="form.predictionOutcomes.length >= 8"
                    @click="addOutcome"
                  >
                    <NuxtIcon name="icon/plus" /> Add Outcome
                  </BasicButton>
                </div>
              </n-form-item>
              <n-form-item path="categories" label="Categories" class="mb-3">
                <n-select
                  v-model:value="form.categories"
                  :options="categoryOptions"
                  multiple
                  placeholder="Select categories"
                />
              </n-form-item>
              <div class="flex">
                <BasicButton :btn-class="['!font-bold']" :size="'large'" :loading="loading" submit>
                  Create Prediction
                </BasicButton>
              </div>
            </n-form>
          </div>
        </div>
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px] mb-6">
          <div class="border-1 border-grey-lighter rounded-lg p-6">
            <div class="font-medium leading-[20px] mb-6 text-white/80">
              <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Generate prediction suggestions:</h3>
              <n-input
                v-model:value="suggestionPrompt"
                type="textarea"
                placeholder="Enter prompt"
                :autosize="{ minRows: 3, maxRows: 8 }"
                :maxlength="2000"
                size="large"
              />
              <BasicButton
                btn-class="mt-4"
                :size="'large'"
                :loading="loadingSuggestions || loading"
                :disabled="!suggestionPrompt"
                @click="generateSuggestions"
              >
                Generate
              </BasicButton>
            </div>
            <div v-if="predictionStore.suggestions.length > 0">
              <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Suggestions:</h3>
              <div v-for="suggestion in predictionStore.suggestions" :key="suggestion.question">
                <div
                  class="mb-4 border-1 border-transparent flex-cc justify-between bg-grey-light rounded-lg p-2"
                  :class="{ '!border-primary': suggestion.question === form.question }"
                >
                  <div class="text-white/80 text-[14px] leading-[20px]">
                    {{ suggestion.question }}
                  </div>
                  <BasicButton type="gradient" btn-class="group" @click="useSuggestion(suggestion)">
                    <NuxtIcon name="icon/plus" class="group-hover:text-primary text-[20px]" />
                  </BasicButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useMessage, type FormRules } from 'naive-ui';
import Endpoints from '../../lib/values/endpoints';
import { useTokensStore } from '~/stores/collateral-tokens';
import { PredictionSetCategory, ResolutionType } from '~/lib/types/prediction-set';
import BasicButton from '~/components/general/BasicButton.vue';

const message = useMessage();
const formRef = ref();
const loading = ref(false);
const tokensStore = useTokensStore();
const predictionStore = usePredictionStore();
const router = useRouter();
const suggestionPrompt = ref('');
const loadingSuggestions = ref(false);

useLoggedIn(onInit);

function onInit(loggedIn: boolean, isAdmin: boolean) {
  if (!loggedIn || !isAdmin) {
    router.replace('/');
  }
}

const initialForm = {
  collateral_token_id: null as number | null,
  question: '',
  outcomeResolutionDef: '',
  startTime: new Date().getTime() + 1000 * 60 * 60,
  endTime: null,
  resolutionTime: null,
  imgUrl: '',
  predictionOutcomes: [] as Array<{ name: string; imgUrl: string }>,
  categories: [],
};

const form = ref(initialForm);

const rules: FormRules = {
  collateral_token_id: { required: true, message: 'Please select a collateral token.' },
  question: { required: true, message: 'Please enter a market question.' },
  outcomeResolutionDef: { required: true, message: 'Please describe how the outcome will be resolved.' },
  startTime: [
    { required: true, message: 'Please select a start time.' },
    {
      validator: () => !startDateDisabled(new Date(form.value.startTime!).getTime()),
      message: 'Start time must be in the future.',
      trigger: 'change',
    },
  ],
  endTime: [
    { required: true, message: 'Please select an end time.' },
    {
      validator: () => !endDateDisabled(new Date(form.value.endTime!).getTime()),
      message: 'End time must be after start time.',
      trigger: 'change',
    },
  ],
  resolutionTime: [
    { required: true, message: 'Please select a resolution time.' },
    {
      validator: () => !resolutionDateDisabled(new Date(form.value.resolutionTime!).getTime()),
      message: 'Resolution time must be after end time.',
      trigger: 'change',
    },
  ],
  imgUrl: { required: true, message: 'Please insert an image URL.' },
  predictionOutcomes: [
    {
      required: true,
      validator: () => form.value.predictionOutcomes.length >= 2,
      message: 'Please specify at least two outcomes.',
    },
    {
      validator: () => form.value.predictionOutcomes.every(o => o.name && o.name.length > 0),
      message: 'Each outcome must have a name.',
    },
    {
      validator: () => form.value.predictionOutcomes.every(o => o.imgUrl && o.imgUrl.length > 0),
      message: 'Each outcome must have an image.',
    },
  ],
};

onMounted(async () => {
  await tokensStore.ensureLoaded();
});

const categoryOptions = Object.values(PredictionSetCategory)
  .filter(x => x !== 'All')
  .map(cat => ({ label: cat, value: cat }));

const startDateDisabled = (ts: number) => {
  const endTime = form.value.endTime ? new Date(form.value.endTime).getTime() : null;
  if (endTime && ts > endTime) return true;
  return false;
};

const endDateDisabled = (ts: number) => {
  const startTime = form.value.startTime ? new Date(form.value.startTime).getTime() : null;
  if (startTime && ts < startTime) return true;
  return ts <= Date.now();
};

const resolutionDateDisabled = (ts: number) => {
  const endTime = form.value.endTime ? new Date(form.value.endTime).getTime() : null;
  if (endTime && ts < endTime) return true;
  return ts <= Date.now();
};

function addOutcome() {
  form.value.predictionOutcomes.push({ name: '', imgUrl: '' });
}

function removeOutcome(idx: number) {
  form.value.predictionOutcomes.splice(idx, 1);
}

async function submit() {
  await formRef.value?.validate();
  try {
    loading.value = true;
    await $api.post(Endpoints.predictionSets, {
      ...form.value,
      consensusThreshold: 60,
      resolutionType: ResolutionType.MANUAL,
    });
    form.value = initialForm;
    message.success('Prediction created');
  } catch (error) {
    message.error('Failed to create prediction.');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function generateSuggestions() {
  if (!suggestionPrompt.value) return;

  try {
    loadingSuggestions.value = true;
    // const response = await $api.post(Endpoints.predictionSets, {
    //   prompt: suggestionPrompt.value,
    // });
    await predictionStore.generateSuggestions(suggestionPrompt.value);
  } catch (error) {
    console.error(error);
  } finally {
    loadingSuggestions.value = false;
  }
}

function useSuggestion(suggestion: any) {
  form.value = { ...suggestion };
}
</script>
