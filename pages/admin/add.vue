<!-- eslint-disable vue/html-quotes -->
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

      <!-- COPY NOTIFICATION -->
      <div v-if="showCopyNotification" class="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <div class="flex items-center gap-2 text-primary">
          <NuxtIcon name="icon/copy" class="text-[16px]" />
          <span class="text-[14px] font-medium">
            Prediction data has been copied from another prediction. You can modify the details below.
            <span class="text-white/80 text-[12px]">*Categories are not copied!</span>
          </span>
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
              <n-form-item path="resolutionType" label="Resolution Type" class="mb-3">
                <n-radio-group v-model:value="form.resolutionType">
                  <n-radio :value="ResolutionType.MANUAL">Manual</n-radio>
                  <n-radio :value="ResolutionType.AUTOMATIC">Automatic</n-radio>
                </n-radio-group>
              </n-form-item>
              <n-form-item path="consensusThreshold" label="Consensus threshold (%)" class="mb-3">
                <n-input-number v-model:value="form.consensusThreshold" :min="1" :max="100" placeholder="60" />
              </n-form-item>
              <div v-if="form.resolutionType === ResolutionType.AUTOMATIC">
                <div class="mb-8">
                  <div class="text-white/80 text-[14px] leading-[20px] mb-4 font-medium">
                    Data Sources (Minimum 3 required) - {{ form.dataSources.length }}
                  </div>
                  <n-collapse v-if="form.dataSources.length > 0" class="mb-4">
                    <n-collapse-item
                      v-for="(dataSource, idx) in form.dataSources"
                      :key="idx"
                      :title="`Data Source ${idx + 1}`"
                      :name="idx"
                    >
                      <template #header-extra>
                        <BasicButton type="gradient" size="small" @click="removeDataSource(idx)">
                          <div class="flex items-center gap-2">Remove <NuxtIcon name="icon/close" /></div>
                        </BasicButton>
                      </template>
                      <div class="space-y-3 pt-2">
                        <n-form-item :path="`dataSources.${idx}.endpoint`" label="Endpoint" class="mb-3">
                          <div class="flex items-center gap-2 w-full">
                            <div class="text-white/60 text-[14px] min-w-[200px]">{{ apiProxyPrefix }}</div>
                            <n-input
                              v-model:value="dataSource.endpoint"
                              placeholder="coingecko/api/v3/coins/bitcoin/market_chart"
                              size="large"
                              class="flex-1"
                            />
                          </div>
                        </n-form-item>
                        <n-form-item :path="`dataSources.${idx}.httpMethod`" label="HTTP Method" class="mb-3">
                          <n-select
                            v-model:value="dataSource.httpMethod"
                            :options="httpMethodOptions"
                            placeholder="Select HTTP method"
                            default-value="GET"
                          />
                        </n-form-item>
                        <n-form-item
                          :path="`dataSources.${idx}.queryParams`"
                          label="Query Parameters (JSON)"
                          class="mb-3"
                        >
                          <n-input
                            v-model:value="dataSource.queryParams"
                            type="textarea"
                            placeholder='{"key": "value"}'
                            :autosize="{ minRows: 2, maxRows: 4 }"
                          />
                        </n-form-item>
                        <n-form-item :path="`dataSources.${idx}.headers`" label="Headers (JSON)" class="mb-3">
                          <n-input
                            v-model:value="dataSource.headers"
                            type="textarea"
                            placeholder='{"Authorization": "Bearer token"}'
                            :autosize="{ minRows: 2, maxRows: 4 }"
                          />
                        </n-form-item>
                        <n-form-item
                          v-if="
                            dataSource.httpMethod === 'POST' ||
                            dataSource.httpMethod === 'PUT' ||
                            dataSource.httpMethod === 'PATCH'
                          "
                          :path="`dataSources.${idx}.body`"
                          label="Body (JSON)"
                          class="mb-3"
                        >
                          <n-input
                            v-model:value="dataSource.body"
                            type="textarea"
                            placeholder='{"key": "value"}'
                            :autosize="{ minRows: 2, maxRows: 4 }"
                          />
                        </n-form-item>
                        <n-form-item
                          :path="`dataSources.${idx}.jqQuery`"
                          label="JQ Query"
                          class="mb-3"
                          :feedback="
                            dataSource?.jqTestResult?.error
                              ? dataSource?.jqTestResult?.error
                              : dataSource?.jqTestResult?.success
                                ? 'Success! (JSON response: ' + JSON.stringify(dataSource?.jqTestResult?.data) + ')'
                                : ''
                          "
                        >
                          <div class="flex gap-2 w-full">
                            <n-input
                              v-model:value="dataSource.jqQuery"
                              type="textarea"
                              placeholder='{ "outcomeIdx": .result }'
                              :autosize="{ minRows: 2, maxRows: 4 }"
                              class="flex-1"
                            />
                            <BasicButton type="secondary" :loading="dataSource.testingJq" @click="testJqQuery(idx)">
                              Test JQ
                            </BasicButton>
                          </div>
                        </n-form-item>
                        <n-form-item :path="`dataSources.${idx}.abi`" label="ABI (JSON)" class="mb-3">
                          <n-input
                            v-model:value="dataSource.abi"
                            type="textarea"
                            placeholder='{"components": [{"internalType": "uint256", "name": "outcomeIdx", "type": "uint256"}], "type": "tuple"}'
                            :autosize="{ minRows: 3, maxRows: 6 }"
                          />
                        </n-form-item>
                      </div>
                    </n-collapse-item>
                  </n-collapse>
                  <BasicButton type="secondary" inner-class="flex-cc" @click="addDataSource">
                    <NuxtIcon name="icon/plus" /> Add Data Source
                  </BasicButton>
                </div>
              </div>
              <div class="flex gap-4 flex-wrap">
                <n-form-item path="startTime" label="Start Time (UTC)" class="mb-3">
                  <n-date-picker
                    v-model:value="startTimeDisplay"
                    type="datetime"
                    placeholder="Select start time (UTC)"
                    update-value-on-close
                    :is-date-disabled="(ts: number) => startDateDisabled(ts, true)"
                    default-time="00:00:00"
                  >
                    <template #now>
                      <n-button size="tiny" @click="onNow('startTime')">Now</n-button>
                    </template>
                  </n-date-picker>
                </n-form-item>
                <n-form-item path="endTime" label="End Time (UTC)" class="mb-3">
                  <n-date-picker
                    v-model:value="endTimeDisplay"
                    type="datetime"
                    placeholder="Select end time (UTC)"
                    update-value-on-close
                    :is-date-disabled="(ts: number) => endDateDisabled(ts, true)"
                    default-time="00:00:00"
                  >
                    <template #now>
                      <n-button size="tiny" @click="onNow('endTime')">Now</n-button>
                    </template>
                  </n-date-picker>
                </n-form-item>
                <n-form-item
                  v-if="form.resolutionType === ResolutionType.AUTOMATIC"
                  path="attestationTime"
                  label="Attestation Time (UTC)"
                  class="mb-3"
                >
                  <n-date-picker
                    v-model:value="attestationTimeDisplay"
                    type="datetime"
                    placeholder="Select attestation time (UTC)"
                    update-value-on-close
                    default-time="00:00:00"
                    style="width: 100%"
                  >
                    <template #now>
                      <n-button size="tiny" @click="onNow('attestationTime')">Now</n-button>
                    </template>
                  </n-date-picker>
                </n-form-item>
                <n-form-item path="resolutionTime" label="Resolution Time (UTC)" class="mb-3" update-value-on-close>
                  <n-date-picker
                    v-model:value="resolutionTimeDisplay"
                    type="datetime"
                    placeholder="Select resolution time (UTC)"
                    update-value-on-close
                    :is-date-disabled="(ts: number) => resolutionDateDisabled(ts, true)"
                    default-time="00:00:00"
                  >
                    <template #now>
                      <n-button size="small" @click="onNow('resolutionTime')">Now</n-button>
                    </template>
                  </n-date-picker>
                </n-form-item>
              </div>
              <n-form-item path="imgUrl" label="Market Image" class="mb-3">
                <div class="flex items-center gap-2 w-full">
                  <!-- <n-input v-model:value="form.imgUrl" placeholder="Image URL" class="w-full" /> -->
                  <PredictionSetAdminImageUpload
                    v-model:model-value="form.imgUrl"
                    :default-value="form.imgUrl"
                    folder="prediction-sets"
                  />
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
                        folder="outcomes"
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
          <div class="border-1 border-grey-lighter rounded-lg p-6 mb-6">
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
          <div
            v-if="form.resolutionType === ResolutionType.AUTOMATIC"
            class="border-1 border-grey-lighter rounded-lg p-6"
          >
            <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Generate from Template:</h3>
            <n-select
              v-model:value="selectedTemplateId"
              :options="templateOptions"
              placeholder="Select a template (optional)"
              clearable
              @update:value="onTemplateSelected"
            />
            <div
              v-if="selectedTemplate && selectedTemplate.variables"
              class="mt-4 p-4 border-1 border-grey-lighter rounded-lg"
            >
              <div class="text-white/80 text-[14px] leading-[20px] mb-3 font-medium">Template Variables</div>
              <div class="space-y-3">
                <template v-for="(varDef, varKey) in selectedTemplate.variables">
                  <n-form-item
                    v-if="varDef.type === 'number'"
                    :key="'number-' + String(varKey)"
                    :label="varDef.label"
                    class="mb-3"
                  >
                    <template v-if="varDef.link" #label>
                      <div class="flex items-center gap-1">
                        {{ varDef.label }}
                        <a :href="varDef.link" target="_blank"> <NuxtIcon name="icon/external-link" /> </a>
                      </div>
                    </template>
                    <n-input-number
                      :value="templateVariables[String(varKey)]"
                      :placeholder="`Enter ${varDef.label.toLowerCase()}`"
                      :min="0"
                      :precision="varDef.precision ?? 2"
                      style="width: 100%"
                      @update:value="val => (templateVariables[String(varKey)] = val)"
                    />
                  </n-form-item>
                  <n-form-item
                    v-if="varDef.type === 'string'"
                    :key="'string-' + String(varKey)"
                    :label="varDef.label"
                    class="mb-3"
                  >
                    <template v-if="varDef.link" #label>
                      <div class="flex items-center gap-1">
                        {{ varDef.label }}
                        <a :href="varDef.link" target="_blank"> <NuxtIcon name="icon/external-link" /> </a>
                      </div>
                    </template>
                    <n-input
                      :value="templateVariables[String(varKey)]"
                      :placeholder="`Enter ${varDef.label.toLowerCase()}`"
                      style="width: 100%"
                      @update:value="val => (templateVariables[String(varKey)] = val)"
                    />
                  </n-form-item>
                  <n-form-item
                    v-if="varDef.type === 'select'"
                    :key="'select-' + String(varKey)"
                    :label="varDef.label || String(varKey)"
                    class="mb-3"
                  >
                    <n-select
                      :value="templateVariables[String(varKey)]"
                      :options="varDef.options"
                      :default-value="varDef.default"
                      :placeholder="varDef.label ? `Select ${varDef.label.toLowerCase()}` : `Select ${String(varKey)}`"
                      @update:value="val => (templateVariables[String(varKey)] = val)"
                    />
                  </n-form-item>
                  <n-form-item
                    v-if="varDef.type === 'datetime'"
                    :key="'datetime-' + String(varKey)"
                    :label="varDef.label"
                    class="mb-3"
                  >
                    <n-date-picker
                      :value="getTemplateDateValue(varKey as string)"
                      type="datetime"
                      :placeholder="`Select ${varDef.label.toLowerCase()}`"
                      update-value-on-close
                      default-time="00:00:00"
                      style="width: 100%"
                      @update:value="val => setTemplateDateValue(varKey as string, val)"
                    />
                  </n-form-item>
                  <n-form-item
                    v-if="varDef.type === 'pandascore-match'"
                    :key="'pandascore-' + String(varKey)"
                    :label="varDef.label"
                    class="mb-3"
                  >
                    <PredictionSetAdminPandascoreMatchSearch
                      :value="templateVariables[String(varKey)]"
                      @update:value="val => (templateVariables[String(varKey)] = val)"
                      @match-selected="match => onPandascoreMatchSelected(match)"
                    />
                  </n-form-item>
                </template>
                <BasicButton
                  type="primary"
                  :disabled="!canGenerateFromTemplate"
                  :loading="generatingFromTemplate"
                  style="width: 100%"
                  @click="generateFromTemplate"
                >
                  Generate from Template
                </BasicButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useMessage, type FormRules } from 'naive-ui';
import Endpoints from '../../lib/values/endpoints';
import { useTokensStore } from '~/stores/collateral-tokens';
import { usePredictionStore } from '~/stores/prediction';
import { PredictionSetCategory, ResolutionType } from '~/lib/types/prediction-set';
import BasicButton from '~/components/general/BasicButton.vue';
import { getCurrentUTCTimestamp } from '~/lib/utils/dates';

const message = useMessage();
const formRef = ref();
const loading = ref(false);
const tokensStore = useTokensStore();
const predictionStore = usePredictionStore();
const router = useRouter();
const suggestionPrompt = ref('');
const loadingSuggestions = ref(false);
const showCopyNotification = ref(false);

// Template-related state
const selectedTemplateId = ref<string | null>(null);
const selectedTemplate = ref<any>(null);
const templates = ref<any[]>([]);
const templateVariables = ref<any>({});
const generatingFromTemplate = ref(false);

// API Proxy prefix based on environment
const apiProxyPrefix = computed(() => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? 'https://api-proxy-dev.ignitemarket.xyz/' : 'https://api-proxy.ignitemarket.xyz/';
});

// Template options for select
const templateOptions = computed(() => {
  if (!templates.value) return [];
  console.log(templates.value);
  return templates.value?.map(t => ({
    label: t.name,
    value: t.id,
  }));
});

// Check if template can be generated
const canGenerateFromTemplate = computed(() => {
  if (!selectedTemplate.value || !selectedTemplate.value.variables) return false;

  const vars = selectedTemplate.value.variables;
  for (const [key, varDef] of Object.entries(vars)) {
    const varDefTyped = varDef as any;
    if (varDefTyped.required && !templateVariables.value[key]) {
      return false;
    }
  }

  return true;
});

// Helper functions for dynamic date handling
function getTemplateDateValue(varKey: string): number | null {
  if (!templateVariables.value[varKey]) return null;
  const utcDate = new Date(templateVariables.value[varKey]);
  return utcDate.getTime() + utcDate.getTimezoneOffset() * 60000;
}

function setTemplateDateValue(varKey: string, value: number | null) {
  if (value) {
    const displayDate = new Date(value);
    templateVariables.value[varKey] = new Date(
      displayDate.getTime() - displayDate.getTimezoneOffset() * 60000
    ).toISOString();
  } else {
    templateVariables.value[varKey] = null;
  }
}

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
  startTime: getCurrentUTCTimestamp(),
  endTime: null as number | null,
  resolutionTime: null as number | null,
  attestationTime: null as number | null,
  imgUrl: '',
  predictionOutcomes: [] as Array<{ name: string; imgUrl: string }>,
  categories: [] as string[],
  resolutionType: ResolutionType.MANUAL,
  consensusThreshold: 60,
  dataSources: [] as Array<{
    endpoint: string;
    httpMethod: string;
    queryParams: string;
    headers: string;
    body: string;
    jqQuery: string;
    abi: string;
    testingJq?: boolean;
    jqTestResult?: { success: boolean; error?: string; data?: any };
  }>,
};

const form = ref(initialForm);

// Helper function to convert UTC timestamp to display format for date picker
function utcToDisplay(utcTimestamp: number): number {
  // The timestamp is already UTC, we want to show it as UTC in the picker
  // We need to adjust it so the picker displays it as UTC time
  const utcDate = new Date(utcTimestamp);
  // Add timezone offset to make the picker show UTC time instead of local time
  return utcDate.getTime() + utcDate.getTimezoneOffset() * 60000;
}

// Helper function to convert display timestamp from date picker to UTC timestamp
function displayToUtc(displayTimestamp: number): number {
  // The date picker gives us a timestamp that represents UTC time
  // We need to convert this back to actual UTC timestamp
  const displayDate = new Date(displayTimestamp);
  // Subtract timezone offset to get the actual UTC timestamp
  return displayDate.getTime() - displayDate.getTimezoneOffset() * 60000;
}

// Computed properties to handle UTC display in date pickers
const startTimeDisplay = computed({
  get: () => {
    if (!form.value.startTime) return null;
    // Convert UTC timestamp to display format for the picker
    return utcToDisplay(form.value.startTime);
  },
  set: (value: number | null) => {
    if (value) {
      // Convert display format to UTC timestamp
      form.value.startTime = displayToUtc(value);
    } else {
      form.value.startTime = null as any;
    }
  },
});

const endTimeDisplay = computed({
  get: () => {
    if (!form.value.endTime) return null;
    // Convert UTC timestamp to display format for the picker
    return utcToDisplay(form.value.endTime);
  },
  set: (value: number | null) => {
    if (value) {
      // Convert display format to UTC timestamp
      form.value.endTime = displayToUtc(value);
    } else {
      form.value.endTime = null as any;
    }
  },
});

const resolutionTimeDisplay = computed({
  get: () => {
    if (!form.value.resolutionTime) return null;
    // Convert UTC timestamp to display format for the picker
    return utcToDisplay(form.value.resolutionTime);
  },
  set: (value: number | null) => {
    if (value) {
      // Convert display format to UTC timestamp
      form.value.resolutionTime = displayToUtc(value);
    } else {
      form.value.resolutionTime = null as any;
    }
  },
});

const attestationTimeDisplay = computed({
  get: () => {
    if (!form.value.attestationTime) return null;
    // Convert UTC timestamp to display format for the picker
    return utcToDisplay(form.value.attestationTime);
  },
  set: (value: number | null) => {
    if (value) {
      // Convert display format to UTC timestamp
      form.value.attestationTime = displayToUtc(value);
    } else {
      form.value.attestationTime = null as any;
    }
  },
});

const rules: FormRules = {
  collateral_token_id: { required: true, message: 'Please select a collateral token.' },
  question: { required: true, message: 'Please enter a market question.' },
  outcomeResolutionDef: { required: true, message: 'Please describe how the outcome will be resolved.' },
  startTime: [
    { required: true, message: 'Please select a start time.' },
    {
      validator: () => !startDateDisabled(new Date(form.value.startTime!).getTime(), false),
      message: 'Start time must be in the future.',
      trigger: 'change',
    },
  ],
  endTime: [
    { required: true, message: 'Please select an end time.' },
    {
      validator: () => !endDateDisabled(new Date(form.value.endTime!).getTime(), false),
      message: 'End time must be after start time.',
      trigger: 'change',
    },
  ],
  resolutionTime: [
    { required: true, message: 'Please select a resolution time.' },
    {
      validator: () => !resolutionDateDisabled(new Date(form.value.resolutionTime!).getTime(), false),
      message: 'Resolution time must be after end time.',
      trigger: 'change',
    },
    {
      validator: () => {
        if (form.value.resolutionType !== ResolutionType.AUTOMATIC) return true;
        const attestation = form.value.attestationTime;
        const resolution = form.value.resolutionTime;
        console.log(attestation, resolution);
        if (!attestation || !resolution) return true;
        const minResolution = attestation + 15 * 60 * 1000; // 15 min in ms
        return resolution >= minResolution;
      },
      message: 'For automatic resolution, resolution time must be at least 15 minutes after attestation time.',
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
  resolutionType: { required: true, message: 'Please select a resolution type.' },
  consensusThreshold: {
    required: true,
    type: 'number',
    validator: (_rule: any, value: number | null) => value != null && value >= 1 && value <= 100,
    message: 'Consensus threshold is required (1–100%).',
    trigger: 'blur',
  },
  dataSources: [
    {
      validator: () => {
        if (form.value.resolutionType === ResolutionType.AUTOMATIC) {
          if (form.value.dataSources.length < 2) {
            return false;
          }
          return form.value.dataSources.every(ds => ds.endpoint && ds.jqQuery && ds.abi);
        }
        return true;
      },
      message:
        'Automatic predictions require at least 2 data sources. Each data source must have endpoint, JQ query, and ABI.',
      trigger: 'change',
    },
  ],
};

onMounted(async () => {
  await tokensStore.ensureLoaded();

  // Load templates
  try {
    const templatesResponse = await $api.get<GeneralResponse<any[]>>(Endpoints.predictionTemplates);
    templates.value = templatesResponse?.data || [];
  } catch (error) {
    console.error('Failed to load templates:', error);
  }

  // Check for copied prediction data from store
  if (predictionStore.copiedPrediction) {
    try {
      const copiedData = predictionStore.copiedPrediction;
      // Populate form with copied data
      form.value = {
        ...form.value,
        collateral_token_id: copiedData.collateral_token_id || null,
        question: copiedData.question || '',
        outcomeResolutionDef: copiedData.outcomeResolutionDef || '',
        imgUrl: copiedData.imgUrl || '',
        predictionOutcomes: copiedData.predictionOutcomes || [],
        categories: copiedData.categories || [],
        startTime: copiedData.startTime || getCurrentUTCTimestamp() + 1000 * 60 * 60,
        endTime: copiedData.endTime || null,
        resolutionTime: copiedData.resolutionTime || null,
        attestationTime: copiedData.attestationTime || null,
        resolutionType: (copiedData as any).resolutionType || ResolutionType.MANUAL,
        consensusThreshold: (copiedData as any).consensusThreshold ?? 60,
        dataSources: (copiedData as any).dataSources || [],
      };

      // Clear the copied data from store
      predictionStore.clearCopiedPrediction();

      // Show success message and notification
      message.success('Prediction data copied successfully!');
      showCopyNotification.value = true;
    } catch (error) {
      console.error('Error using copied prediction data:', error);
      predictionStore.clearCopiedPrediction();
    }
  }
});

const categoryOptions = Object.values(PredictionSetCategory)
  .filter(x => x !== 'All')
  .map(cat => ({ label: cat, value: cat }));

const httpMethodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
];

const startDateDisabled = (ts: number, format = true) => {
  const utcTs = format ? displayToUtc(ts) : ts;
  const endTime = form.value.endTime ? new Date(form.value.endTime).getTime() : null;
  if (endTime && utcTs > endTime) return true;
  return false;
};

const endDateDisabled = (ts: number, format = true) => {
  const startTime = form.value.startTime ? new Date(form.value.startTime).getTime() : null;
  const utcTs = format ? displayToUtc(ts) : ts;
  if (startTime && utcTs < startTime) return true;
  return utcTs <= Date.now();
};

const resolutionDateDisabled = (ts: number, format = true) => {
  const endTime = form.value.endTime ? new Date(form.value.endTime).getTime() : null;
  const utcTs = format ? displayToUtc(ts) : ts;
  if (endTime && utcTs < endTime) return true;
  return utcTs <= Date.now();
};

const onNow = (date: 'endTime' | 'resolutionTime' | 'startTime' | 'attestationTime') => {
  const currentUtcTimestamp = getCurrentUTCTimestamp();
  form.value[date] = currentUtcTimestamp;
};

function addOutcome() {
  form.value.predictionOutcomes.push({ name: '', imgUrl: '' });
}

function removeOutcome(idx: number) {
  form.value.predictionOutcomes.splice(idx, 1);
}

function addDataSource() {
  form.value.dataSources.push({
    endpoint: '',
    httpMethod: 'GET',
    queryParams: '',
    headers: '',
    body: '',
    jqQuery: '',
    abi: '',
  });
}

function removeDataSource(idx: number) {
  form.value.dataSources.splice(idx, 1);
}

async function testJqQuery(idx: number) {
  const dataSource = form.value.dataSources[idx];
  if (!dataSource.jqQuery) {
    message.warning('Please enter a JQ query first');
    return;
  }

  dataSource.testingJq = true;
  dataSource.jqTestResult = undefined;

  try {
    // Parse JSON fields if they're strings
    let queryParams: any = null;
    let headers: any = null;
    let body: any = null;

    if (dataSource.queryParams) {
      try {
        queryParams =
          typeof dataSource.queryParams === 'string' ? JSON.parse(dataSource.queryParams) : dataSource.queryParams;
      } catch (e) {
        // Invalid JSON, will be handled by backend
      }
    }

    if (dataSource.headers) {
      try {
        headers = typeof dataSource.headers === 'string' ? JSON.parse(dataSource.headers) : dataSource.headers;
      } catch (e) {
        // Invalid JSON, will be handled by backend
      }
    }

    if (dataSource.body) {
      try {
        body = typeof dataSource.body === 'string' ? JSON.parse(dataSource.body) : dataSource.body;
      } catch (e) {
        // Invalid JSON, will be handled by backend
      }
    }

    // Add prefix to endpoint if it doesn't already have it
    let fullEndpoint = dataSource.endpoint || '';
    if (fullEndpoint && !fullEndpoint.startsWith('http')) {
      fullEndpoint = apiProxyPrefix.value + fullEndpoint;
    }

    const response = await $api.post<GeneralResponse<{ success: boolean; error?: string; data?: any }>>(
      Endpoints.testJqQuery,
      {
        jqQuery: dataSource.jqQuery,
        endpoint: fullEndpoint || undefined,
        httpMethod: dataSource.httpMethod || 'GET',
        queryParams: queryParams || undefined,
        headers: headers || undefined,
        body: body || undefined,
      }
    );

    dataSource.jqTestResult = response.data;
    if (response.data.success) {
      message.success('JQ query test successful!');
    } else {
      message.error(`JQ query test failed: ${response.data.error}`);
    }
  } catch (error: any) {
    dataSource.jqTestResult = {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to test JQ query',
    };
    message.error('Failed to test JQ query');
  } finally {
    dataSource.testingJq = false;
  }
}

async function submit() {
  await formRef.value?.validate();
  try {
    loading.value = true;

    const dataSourceIds: number[] = [];

    // If automatic resolution, create data sources first
    if (form.value.resolutionType === ResolutionType.AUTOMATIC) {
      if (form.value.dataSources.length < 2) {
        message.error('Automatic predictions require at least 2 data sources.');
        return;
      }

      // Create each data source
      for (const dataSource of form.value.dataSources) {
        if (!dataSource.endpoint || !dataSource.jqQuery || !dataSource.abi) {
          message.error('All data sources must have endpoint, JQ query, and ABI.');
          return;
        }

        // Parse JSON fields
        let queryParams: any = null;
        let headers: any = null;
        let body: any = null;
        let abi: any = null;

        try {
          if (dataSource.queryParams) {
            queryParams =
              typeof dataSource.queryParams === 'string' ? JSON.parse(dataSource.queryParams) : dataSource.queryParams;
          }
          if (dataSource.headers) {
            headers = typeof dataSource.headers === 'string' ? JSON.parse(dataSource.headers) : dataSource.headers;
          }
          if (dataSource.body) {
            body = typeof dataSource.body === 'string' ? JSON.parse(dataSource.body) : dataSource.body;
          }
          if (dataSource.abi) {
            abi = typeof dataSource.abi === 'string' ? JSON.parse(dataSource.abi) : dataSource.abi;
            // Stringify ABI for storage
            abi = JSON.stringify(abi);
          }
        } catch (e: any) {
          message.error(`Invalid JSON in data source: ${e?.message || 'Invalid JSON'}`);
          return;
        }

        try {
          // Add prefix to endpoint if it doesn't already have it
          let fullEndpoint = dataSource.endpoint || '';
          if (fullEndpoint && !fullEndpoint.startsWith('http')) {
            fullEndpoint = apiProxyPrefix.value + fullEndpoint;
          }

          const dataSourceResponse = await $api.post<GeneralResponse<{ id: number }>>(Endpoints.dataSources, {
            endpoint: fullEndpoint,
            httpMethod: dataSource.httpMethod || 'GET',
            queryParams,
            headers,
            body,
            jqQuery: dataSource.jqQuery,
            abi,
          });

          dataSourceIds.push(dataSourceResponse.data.id);
        } catch (error: any) {
          message.error(`Failed to create data source: ${error.response?.data?.message || error.message}`);
          return;
        }
      }
    }

    // Create prediction set
    await $api.post(Endpoints.predictionSets, {
      ...form.value,
      consensusThreshold: form.value.consensusThreshold ?? 60,
      resolutionType: form.value.resolutionType,
      dataSourceIds: dataSourceIds.length > 0 ? dataSourceIds : undefined,
    });

    form.value = { ...initialForm };
    message.success('Prediction created');
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to create prediction.');
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
  form.value = JSON.parse(JSON.stringify(suggestion));
}

function onPandascoreMatchSelected(match: any) {
  if (!match) return;

  let homeTeam = '';
  let awayTeam = '';

  if (match.opponents && match.opponents.length >= 2) {
    homeTeam = match.opponents[0]?.opponent?.name || '';
    awayTeam = match.opponents[1]?.opponent?.name || '';
  }

  templateVariables.value = {
    ...templateVariables.value,
    homeTeamName: homeTeam,
    awayTeamName: awayTeam,
    sofascoreMatchId: null,
    ...(match.begin_at ? { attestationTime: match.begin_at } : {}),
  };
}

async function onTemplateSelected(templateId: string | null) {
  if (!templateId) {
    selectedTemplate.value = null;
    templateVariables.value = {};
    return;
  }

  try {
    const template = await $api.get<GeneralResponse<any>>(Endpoints.predictionTemplateById(templateId));
    selectedTemplate.value = template.data;

    // Dynamically initialize variables based on template definition
    const vars: any = {};
    if (template.data?.variables) {
      for (const [key, varDef] of Object.entries(template.data.variables)) {
        const varDefTyped = varDef as any;
        if (varDefTyped.default !== undefined) {
          vars[key] = varDefTyped.default;
        } else {
          vars[key] = null;
        }
      }
    }
    templateVariables.value = vars;
  } catch (error) {
    console.error('Failed to load template:', error);
    message.error('Failed to load template details');
  }
}

async function generateFromTemplate() {
  if (!selectedTemplateId.value || !canGenerateFromTemplate.value) {
    return;
  }

  try {
    generatingFromTemplate.value = true;

    // Dynamically build variables object from templateVariables
    const variables: any = {};
    for (const [key, value] of Object.entries(templateVariables.value)) {
      if (value !== null && value !== undefined && value !== '') {
        variables[key] = value;
      }
    }

    const res = await $api.post<
      GeneralResponse<{
        question: string;
        outcomeResolutionDef: string;
        dataSources: any[];
        defaults: any;
      }>
    >(Endpoints.generateFromTemplate(selectedTemplateId.value), variables);

    const result = res.data;

    // Populate form with generated data
    form.value.question = result.question;
    form.value.outcomeResolutionDef = result.outcomeResolutionDef;

    // Set defaults
    if (result.defaults) {
      if (result.defaults.collateral_token_id) {
        form.value.collateral_token_id = result.defaults.collateral_token_id;
      }
      if (result.defaults.outcomes) {
        form.value.predictionOutcomes = result.defaults.outcomes;
      }
    }

    // Set attestation time and end time from template variable if available
    if (templateVariables.value.attestationTime) {
      // Convert ISO string to UTC timestamp (milliseconds)
      const attestationDate = new Date(templateVariables.value.attestationTime);
      const attestationTimestamp = attestationDate.getTime();

      // Set attestationTime
      form.value.attestationTime = attestationTimestamp;

      // Set endTime (market close) only if attestation time is in the future
      if (attestationTimestamp > Date.now()) {
        form.value.endTime = attestationTimestamp;

        // Set resolutionTime to 1 hour after endTime if endTime is set
        if (form.value.endTime) {
          form.value.resolutionTime = form.value.endTime + 60 * 60 * 1000; // Add 1 hour in milliseconds
        }
      }
    }

    // Process data sources - remove prefix from endpoint for display
    form.value.dataSources = result.dataSources.map(ds => {
      const endpoint = ds.endpoint || '';
      const endpointPath = endpoint.replace(apiProxyPrefix.value, '');

      return {
        endpoint: endpointPath,
        httpMethod: ds.httpMethod || 'GET',
        queryParams: ds.queryParams ? JSON.stringify(ds.queryParams) : '',
        headers: ds.headers ? JSON.stringify(ds.headers) : '',
        body: ds.body ? JSON.stringify(ds.body) : '',
        jqQuery: ds.jqQuery || '',
        abi: ds.abi || '',
        testingJq: false,
        jqTestResult: undefined,
      };
    });

    message.success('Template generated successfully!');
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Failed to generate from template');
    console.error(error);
  } finally {
    generatingFromTemplate.value = false;
  }
}
</script>
