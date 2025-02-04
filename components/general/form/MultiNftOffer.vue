<template>
  <div class="w-full flex flex-col gap-6">
    <FormFileUpload @fileUploaded="onFileUploaded" />

    <TableOfferPreview v-if="showPreview && nftsData.length" :offers="nftsData" />

    <Btn v-if="!autoSubmit" :disabled="!fileData?.length" :loading="loading" @click="createMultiNftLoan()">
      Create Multiple Offers
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import { SimpleMerkleTree } from '@openzeppelin/merkle-tree';
import { useAccount, useChainId, type Config } from '@wagmi/vue';
import { signMessage } from '@wagmi/vue/actions';
import { toBytes, type Address } from 'viem';
import Endpoints from '~/lib/values/endpoints';
import { generateLoanHash } from '~/lib/misc/web3';
import type { CsvNftData, OfferBatchResponse, OfferClaimData } from '~/lib/types/offer';
import type { HexString } from '@openzeppelin/merkle-tree/dist/bytes';
import { parseClaimDataToOffer, parseCsvNftToClaimData } from '~/lib/misc/parsers';

const props = defineProps({
  autoSubmit: { type: Boolean, default: false },
  showPreview: { type: Boolean, default: false },
});

const { t } = useI18n();
const message = useMessage();
const userStore = useUserStore();
const assetStore = useAssetStore();
const { $wagmiConfig } = useNuxtApp();

const chainId = useChainId();
const { address } = useAccount();
const { checkAllowance } = useOffer();
const { getTokenStore } = useToken();

const fileData = ref<Array<any>>([]);
const nftsData = ref<OfferClaimData[]>([]);
const totalRepay = ref<number>(0);
const loading = ref<boolean>();

const onFileUploaded = (data: CsvNftData[]) => {
  fileData.value = data;
  nftsData.value = data.map(i => parseCsvNftToClaimData(i, address.value as Address));
  totalRepay.value = data.reduce((acc, currentValue) => acc + Number(currentValue['Buy Back Amount']), 0);

  if (props.autoSubmit) {
    createMultiNftLoan();
  }
};

const parseOfferData = async (
  claimData: OfferClaimData,
  signature: string,
  merkleRoot: string,
  merkleProofs: HexString[]
) => {
  const asset = await assetStore.getAssetByContractAndId(chainId.value, claimData.nftContract, claimData.nftId);
  return parseClaimDataToOffer(
    claimData,
    chainId.value,
    asset?.ownerAddress as Address,
    signature,
    merkleRoot,
    merkleProofs
  );
};

async function createMultiNftLoan() {
  if (!address.value) return;

  loading.value = true;
  try {
    const tokenStore = getTokenStore();
    if (bigIntToNum(tokenStore.balance) < totalRepay.value) {
      message.error('Your balance is too low');
      loading.value = false;
      return;
    }
    if (!(await checkAllowance(numToBigInt(totalRepay.value)))) {
      message.error('You need to increase your allowance');
      loading.value = false;
      return;
    }

    console.debug(nftsData.value);
    const claims = nftsData.value.map(data => generateLoanHash(data));
    const tree = SimpleMerkleTree.of(claims);

    const signature = await signMessage($wagmiConfig as Config, { message: { raw: toBytes(tree.root) } });
    // console.debug(await validateSignature(address.value, tree.root, signature));

    const offers = await Promise.all(
      nftsData.value.map(async (d, i) => await parseOfferData(d, signature, tree.root, tree.getProof(i)))
    );
    await $api.post<OfferBatchResponse>(Endpoints.batchOffer(), { offers });

    message.success('Multi-offer created');
  } catch (e) {
    console.error(e);
    message.error(apiError(e));
  }
  loading.value = false;
}
</script>
