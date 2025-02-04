<script lang="ts" setup>
import { useChainId, useAccount } from '@wagmi/vue';
import type { FormInst, FormItemRule, FormRules, FormValidationError, SelectOption } from 'naive-ui';
import type { Address } from 'viem';
import { ruleRequired } from '~/lib/misc/validation';
import type { OfferRequestListInterface, OfferRequestResponse } from '~/lib/types/offer';
import Endpoints from '~/lib/values/endpoints';
import { ContractType } from '~/lib/config/contracts';
import type { NFT } from '~/lib/types/asset';

type FormOfferRequest = {
  chainId: number | null;
  tokenId: number | null;
  borrowerAddress: Address | undefined;
  contractAddress: string;
  interestRate: number | null;
  loanAmount: number | null;
  loanChainId: number | null;
  loanDuration: number | null;
  loanTokenContract: string;
  months: number | null;
  days: number | null;
  seconds: number | null;
  nft: number | null;
};

const emit = defineEmits(['submitSuccess', 'close']);
const props = defineProps({
  nft: { type: Object as PropType<NFT>, default: {} },
});
console.log(props.nft);

const { t } = useI18n();
const message = useMessage();
const assetStore = useAssetStore();

const chainId = useChainId();
const { address } = useAccount();
const { labelInfo } = useContent();
const { getContractAddressByChain } = useContracts();
const { getBalance, getTokenOfOwner, getNftById, getName, getSymbol } = useNft();

const loading = ref<boolean>(true);
const formRef = ref<FormInst | null>(null);
const nfts = ref<SelectOption[]>([]);

const nftContractAddress = getContractAddressByChain(ContractType.NFT);
const loanTokenContract = getContractAddressByChain(ContractType.TOKEN);

const formData = reactive<FormOfferRequest>({
  chainId: props.nft?.chainId || chainId.value,
  tokenId: props.nft?.id || props.nft?.tokenId,
  contractAddress: props.nft?.contractAddress || nftContractAddress,
  borrowerAddress: address.value,
  interestRate: null,
  loanAmount: null,
  loanChainId: chainId.value,
  loanDuration: null,
  loanTokenContract,
  months: null,
  days: null,
  seconds: null,
  nft: null,
});

const rules: FormRules = {
  interestRate: ruleRequired(t('validation.interestRateRequired')),
  loanAmount: ruleRequired(t('validation.loanAmountRequired')),
  loanDuration: {
    validator: validateLoanDuration,
    message: t('validation.loanDurationRequired'),
  },

  nft: { required: !props.nft, message: t('validation.nftRequired') },
};

onMounted(async () => {
  await loadNftsFromContract();
  await sleep(100);
  nfts.value = assetStore.nfts.map(nft => ({ value: nft.id, label: nft.name }));
  loading.value = false;
});

function validateLoanDuration(_: FormItemRule, value: string): boolean {
  return !!formData.months || !!formData.days || !!formData.seconds;
}

async function loadNftsFromContract() {
  try {
    const balance = await getBalance();
    console.log(balance);

    await Array.from({ length: Number(balance) }, async (_, i) => {
      const tokenId = Number(await getTokenOfOwner(i));
      if (!assetStore.nftIDs.has(tokenId)) {
        assetStore.nftIDs.add(tokenId);

        if (!(tokenId in assetStore.nftsData)) {
          assetStore.nftsData[tokenId] = await getNftById(tokenId);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      await createOfferRequest();
    }
  });
}

async function createOfferRequest() {
  loading.value = true;

  const bodyData: Record<string, any> = Object.assign({}, formData);
  bodyData.interestRate = Math.floor((formData?.interestRate || 0) * 100);
  bodyData.loanAmount = BigInt(formData.loanAmount || 0).toString();
  bodyData.loanDuration = (formData.months || 0) * 2592000 + (formData.days || 0) * 86400 + (formData.seconds || 0);

  if (!props.nft && formData.nft) {
    const nft = assetStore.nftById(formData.nft);
    if (nft) {
      bodyData.tokenId = nft.id;
      bodyData.tokenURI = nft.uri;
      bodyData.contractAddress = nft.contractAddress;
    }
  } else {
    bodyData.tokenURI = props.nft.uri;
  }
  bodyData.contractName = await getName();
  bodyData.contractSymbol = await getSymbol();

  delete bodyData.nft;
  delete bodyData.months;
  delete bodyData.days;
  delete bodyData.seconds;

  try {
    const { data } = await $api.post<OfferRequestResponse>(Endpoints.offerRequests(), bodyData);
    message.success(t('form.success.offerRequest'));

    emit('submitSuccess', data);
  } catch (error) {
    message.error(apiError(error));
  }
  loading.value = false;
}
</script>

<template>
  <n-form ref="formRef" class="max-w-sm mt-4 mx-auto" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
    <!-- NFT -->
    <n-form-item v-show="!nft" path="nft" :label="$t('form.label.nft')" :label-props="{ for: 'nft' }">
      <select-options
        v-model:value="formData.nft"
        :options="nfts"
        class="w-full"
        :input-props="{ id: 'nft' }"
        :placeholder="$t('form.placeholder.select')"
        clearable
      />
    </n-form-item>

    <!-- Loan Amount -->
    <n-form-item path="loanAmount" :label="$t('form.label.loanAmount')" :label-props="{ for: 'loanAmount' }">
      <n-input-number
        v-model:value="formData.loanAmount"
        class="w-full"
        :input-props="{ id: 'loanAmount' }"
        :placeholder="$t('form.placeholder.number')"
        :min="0"
      />
    </n-form-item>

    <!-- Interest Rate -->
    <n-form-item
      path="interestRate"
      :label="labelInfo('interestRate') as string"
      :label-props="{ for: 'interestRate' }"
    >
      <n-input-number
        v-model:value="formData.interestRate"
        class="w-full"
        :input-props="{ id: 'interestRate' }"
        :placeholder="$t('form.placeholder.decimal')"
        :precision="2"
        :min="0"
      />
    </n-form-item>

    <!-- Loan Duration -->
    <n-form-item
      path="loanDuration"
      :label="labelInfo('loanDuration') as string"
      :label-props="{ for: 'loanDuration' }"
    >
      <div class="flex gap-2">
        <n-input-number
          v-model:value="formData.months"
          :input-props="{ id: 'loanDuration' }"
          placeholder="Months"
          :precision="0"
          :min="0"
        />
        <n-input-number v-model:value="formData.days" placeholder="Days" :precision="0" :min="0" />
        <n-input-number v-model:value="formData.seconds" placeholder="Seconds" :precision="0" :min="0" />
      </div>
    </n-form-item>

    <!-- Submit button -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.submit')" />
      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.createOfferRequest') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>
