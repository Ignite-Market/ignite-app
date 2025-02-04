<template>
  <Btn :loading="loading" @click="loan()">defaultLoan</Btn>
</template>

<script lang="ts" setup>
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import { OfferStatus, type AnyOffer } from '~/lib/types/offer';

const props = defineProps({
  loan: { type: Object as PropType<AnyOffer>, required: true },
});

const txWait = useTxWait();
const message = useMessage();
const offerStore = useOfferStore();

const { defaultLoan } = useLendeeFi();
const { ensureCorrectNetwork } = useContracts();
const { getTokenBalance, getTokenStore } = useToken();
const { calcCosts } = useWormhole();

const loading = ref<boolean>(false);

async function loan() {
  loading.value = true;
  try {
    await ensureCorrectNetwork(props.loan.loanChainId);

    const asset = parseAssetFromOffer(props.loan);
    const costs = await calcCosts(props.loan.loanChainId, asset.chainId);
    txWait.hash.value = await defaultLoan(props.loan.loanHash, costs);

    const receipt = await txWait.wait();
    if (receipt) {
      message.success('Loan successfully defaulted');
      offerStore.updateOfferStatusByLoanHash(props.loan.loanHash, OfferStatus.LOAN_DEFAULTED);

      const tokenStore = getTokenStore();
      tokenStore.balance = await getTokenBalance();
    }
  } catch (e) {
    console.error(e);
    message.error(contractError(e));
  }
  loading.value = false;
}
</script>
