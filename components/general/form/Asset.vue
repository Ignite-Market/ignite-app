<script lang="ts" setup>
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { moonbaseAlpha } from 'viem/chains';
import { ruleRequired } from '~/lib/misc/validation';
import type { AssetInterface } from '~/lib/types/asset';
import Endpoints from '~/lib/values/endpoints';

type FormAsset = {
  chainId: number | null;
  tokenId: number | null;
  contractAddress: string;
  contractName: string;
  contractSymbol: string;
  tokenURI: string;
  metadata: string;
};

const { t } = useI18n();
const message = useMessage();

const emit = defineEmits(['submitActive', 'submitSuccess', 'close']);

const loading = ref(false);
const formRef = ref<FormInst | null>(null);

const formData = ref<FormAsset>({
  chainId: moonbaseAlpha.id,
  tokenId: 1,
  contractAddress: '',
  contractName: '',
  contractSymbol: '',
  tokenURI: '',
  metadata: '',
});

const rules: FormRules = {
  contractAddress: ruleRequired(t('validation.contractAddress')),
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      await createAsset();
    }
  });
}

async function createAsset() {
  loading.value = true;

  try {
    const res = await $api.post<AssetInterface>(Endpoints.assets(), formData.value);

    if (res.data) {
    }
  } catch (error) {
    message.error(apiError(error));
  }
  loading.value = false;
  emit('submitActive', false);
}
</script>

<template>
  <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <n-form-item path="chainId" :label="$t('form.label.chainId')" :label-props="{ for: 'chainId' }">
      <n-input-number
        v-model:value="formData.chainId"
        :input-props="{ id: 'chainId' }"
        :placeholder="$t('form.placeholder.userId')"
        :min="1"
      />
    </n-form-item>
    <n-form-item path="tokenId" :label="$t('form.label.tokenId')" :label-props="{ for: 'tokenId' }">
      <n-input-number
        v-model:value="formData.tokenId"
        :input-props="{ id: 'tokenId' }"
        :placeholder="$t('form.placeholder.userId')"
        :min="1"
      />
    </n-form-item>

    <n-form-item
      path="contractAddress"
      :label="$t('form.label.contractAddress')"
      :label-props="{ for: 'contractAddress' }"
    >
      <n-input
        v-model:value="formData.contractAddress"
        :input-props="{ id: 'contractAddress' }"
        :placeholder="$t('form.typeText')"
      />
    </n-form-item>

    <n-form-item path="contractName" :label="$t('form.label.contractName')" :label-props="{ for: 'contractName' }">
      <n-input
        v-model:value="formData.contractName"
        :input-props="{ id: 'contractName' }"
        :placeholder="$t('form.text')"
      />
    </n-form-item>

    <n-form-item
      path="contractSymbol"
      :label="$t('form.label.contractSymbol')"
      :label-props="{ for: 'contractSymbol' }"
    >
      <n-input
        v-model:value="formData.contractSymbol"
        :input-props="{ id: 'contractSymbol' }"
        :placeholder="$t('form.typeText')"
      />
    </n-form-item>

    <n-form-item path="tokenURI" :label="$t('form.label.tokenURI')" :label-props="{ for: 'tokenURI' }">
      <n-input v-model:value="formData.tokenURI" :input-props="{ id: 'tokenURI' }" :placeholder="$t('form.typeText')" />
    </n-form-item>

    <n-form-item path="metadata" :label="$t('form.label.metadata')" :label-props="{ for: 'metadata' }">
      <n-input v-model:value="formData.metadata" :input-props="{ id: 'metadata' }" :placeholder="$t('form.typeText')" />
    </n-form-item>

    <!-- Submit button -->
    <n-form-item>
      <input type="submit" class="hidden" :value="$t('form.submit')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.createAsset') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>
