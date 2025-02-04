<script lang="ts" setup>
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { ruleRequired } from '~/lib/misc/validation';
import type { OfferInterface } from '~/lib/types/offer';
import Endpoints from '~/lib/values/endpoints';

type FormOffer = {
  asset_id: number | null;
  batch_id: number | null;
  interestRate: string | null;
  loanAmount: string | null;
  loanChainId: number | null;
  loanDuration: number | null;
  loanTokenId: string | null;
  loanContract: string | null;
};

const { t } = useI18n();
const message = useMessage();

const emit = defineEmits(['submitActive', 'submitSuccess', 'close']);

const loading = ref(false);
const formRef = ref<FormInst | null>(null);

const formData = ref<FormOffer>({
  asset_id: null,
  batch_id: null,
  interestRate: null,
  loanAmount: null,
  loanChainId: null,
  loanDuration: null,
  loanTokenId: null,
  loanContract: null,
});

const rules: FormRules = {
  asset_id: ruleRequired(t('validation.assetRequired')),
  batch_id: ruleRequired(t('validation.batchRequired')),
  interestRate: ruleRequired(t('validation.interestRateRequired')),
  loanAmount: ruleRequired(t('validation.loanAmountRequired')),
  loanChainId: ruleRequired(t('validation.chainRequired')),
  loanDuration: ruleRequired(t('validation.durationRequired')),
  loanTokenId: ruleRequired(t('validation.tokenRequired')),
  loanContract: ruleRequired(t('validation.contractRequired')),
};

// Submit handlers
async function createOffer() {
  loading.value = true;
  emit('submitActive', true);

  try {
    const res = await $api.post<OfferInterface>(Endpoints.OFFER, formData.value);

    if (res.data) {
      emit('submitSuccess');
      emit('submitActive', false);
    }
  } catch (error) {
    message.error(apiError(error));
  }
  loading.value = false;
  emit('submitActive', false);
}

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      await createOffer();
    }
  });
}
</script>

<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!-- Asset ID -->
    <n-form-item path="asset_id" :label="$t('form.label.asset')" :label-props="{ for: 'asset_id' }">
      <n-input-number
        v-model:value="formData.asset_id"
        :input-props="{ id: 'asset_id' }"
        :placeholder="$t('form.placeholder.asset')"
      />
    </n-form-item>

    <!-- Batch ID -->
    <n-form-item path="batch_id" :label="$t('form.label.batch')" :label-props="{ for: 'batch_id' }">
      <n-input-number
        v-model:value="formData.batch_id"
        :input-props="{ id: 'batch_id' }"
        :placeholder="$t('form.placeholder.batch')"
      />
    </n-form-item>

    <!-- Interest Rate -->
    <n-form-item path="interestRate" :label="$t('form.label.interestRate')" :label-props="{ for: 'interestRate' }">
      <n-input-number
        v-model:value="formData.interestRate"
        :input-props="{ id: 'interestRate' }"
        :placeholder="$t('form.placeholder.interestRate')"
        :precision="2"
        :min="0"
      />
    </n-form-item>

    <!-- Loan Amount -->
    <n-form-item path="loanAmount" :label="$t('form.label.loanAmount')" :label-props="{ for: 'loanAmount' }">
      <n-input-number
        v-model:value="formData.loanAmount"
        :input-props="{ id: 'loanAmount' }"
        :placeholder="$t('form.placeholder.loanAmount')"
        :precision="2"
        :min="0"
      />
    </n-form-item>

    <!-- Chain ID -->
    <n-form-item path="loanChainId" :label="$t('form.label.chain')" :label-props="{ for: 'loanChainId' }">
      <n-input-number
        v-model:value="formData.loanChainId"
        :input-props="{ id: 'loanChainId' }"
        :placeholder="$t('form.placeholder.chain')"
      />
    </n-form-item>

    <!-- Loan Duration -->
    <n-form-item path="loanDuration" :label="$t('form.label.duration')" :label-props="{ for: 'loanDuration' }">
      <n-input-number
        v-model:value="formData.loanDuration"
        :input-props="{ id: 'loanDuration' }"
        :placeholder="$t('form.placeholder.duration')"
        :min="1"
      />
    </n-form-item>

    <!-- Token ID -->
    <n-form-item path="loanTokenId" :label="$t('form.label.tokenId')" :label-props="{ for: 'loanTokenId' }">
      <n-input
        v-model:value="formData.loanTokenId"
        :input-props="{ id: 'loanTokenId' }"
        :placeholder="$t('form.placeholder.tokenId')"
      />
    </n-form-item>

    <!-- Contract Address -->
    <n-form-item path="loanContract" :label="$t('form.label.contract')" :label-props="{ for: 'loanContract' }">
      <n-input
        v-model:value="formData.loanContract"
        :input-props="{ id: 'loanContract' }"
        :placeholder="$t('form.placeholder.contract')"
      />
    </n-form-item>

    <!-- Submit button -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.submit')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.createOffer') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>
