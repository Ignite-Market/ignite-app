<script lang="ts" setup>
import { useChainId } from '@wagmi/vue';
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import { OfferStatus, type OfferInterface, type OfferListInterface } from '~/lib/types/offer';

const emit = defineEmits(['done']);
const props = defineProps({
  offer: { type: Object as PropType<OfferInterface | OfferListInterface>, required: true },
});

const txWait = useTxWait();
const message = useMessage();
const chainId = useChainId();
const { confirmOffer } = useOffer();
const { ensureCorrectNetwork, getContractAddressByChain, resetContracts } = useContracts();
const { approve, getApproved } = useNft();

const asset = parseAssetFromOffer(props.offer);
const isApproved = ref<boolean>(false);
const loading = reactive({
  approve: false,
  confirm: false,
});

onMounted(async () => {
  if (chainId.value != asset.chainId) {
    resetContracts();
    await ensureCorrectNetwork(asset.chainId);
  }
  isApproved.value = await checkIfApproved();
  if (!isApproved.value) {
    approveNft();
  }
});

async function checkIfApproved(): Promise<boolean> {
  if (!asset.tokenId) return false;

  try {
    const approve = await getApproved(asset.tokenId, asset.contractAddress);
    return approve === getContractAddressByChain();
  } catch (e) {
    console.error(e);
    message.error(contractError(e));
    resetContracts();
  }
  return false;
}

async function approveNft() {
  if (!asset.tokenId) return false;

  loading.approve = true;
  try {
    txWait.hash.value = await approve(asset.tokenId, asset.contractAddress);
    const receipt = await txWait.wait();
    console.debug(receipt);

    isApproved.value = true;
  } catch (e) {
    console.error(e);
    message.error(contractError(e));
    resetContracts();
  }
  loading.approve = false;
}

async function confirm() {
  loading.confirm = true;

  try {
    const receipt = await confirmOffer(props.offer);

    if (receipt) {
      props.offer.status = OfferStatus.PROCESSING;
      emit('done');
    }
  } catch (e) {
    console.error(e);
    message.warning('Failed to submit transaction. Please try later or contact support');
  }

  loading.confirm = false;
}
</script>

<template>
  <div class="mb-8">
    <div class="mb-6 text-center font-serif uppercase">
      <h3 class="mb-1 text-xl font-semibold">complete your Loan</h3>
    </div>

    <ProcessStep
      :loading="loading.approve"
      :done="isApproved"
      :step="1"
      title="Approve NFT"
      description="You'll be asked to approve this NFT from your wallet."
      text-action="Approve"
      text-done="Approved"
      class="mb-6"
      @action="approveNft()"
    />

    <ProcessStep
      :disabled="!isApproved"
      :loading="loading.confirm"
      :loading-action="loading.confirm"
      :step="2"
      title="Create Loan"
      text-action="Confirm"
      @action="confirm()"
    />
  </div>
</template>
