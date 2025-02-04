<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';
import type { BtnSize } from '~/components/general/Btn.vue';
import { parseWormholeChainId } from '~/lib/config/contracts';
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import { equalsIgnoreCase } from '~/lib/misc/strings';
import { WormholeMessageReceived } from '~/lib/types/contractEvent';
import { OfferStatus, type OfferInterface, type OfferListInterface } from '~/lib/types/offer';

const emit = defineEmits(['created']);
const props = defineProps({
  offer: { type: Object as PropType<OfferInterface | OfferListInterface>, required: true },
  size: { type: String as PropType<BtnSize>, default: 'medium' },
});

const router = useRouter();
const { address } = useAccount();
const contractEventStore = useContractEventStore();

const { getEvents, getLoanStatus, waitForTransaction } = useContractEvent();

const modalLoanVisible = ref<boolean>(false);

onMounted(async () => {
  if (props.offer.status === OfferStatus.PROCESSING) {
    const asset = parseAssetFromOffer(props.offer);
    const e = await contractEventStore.fetchEventsByLoanHash(props.offer.loanHash, parseWormholeChainId(asset.chainId));
    console.log(e);
  } else if (props.offer.status === OfferStatus.LOAN_CREATED) {
    await waitForTransaction(props.offer.loanHash, parseWormholeChainId(props.offer.loanChainId));
  }
});

const loanStatus = computed(() => getLoanStatus(props.offer.loanHash));

async function onLoanCreated() {
  props.offer.status = OfferStatus.PROCESSING;
  modalLoanVisible.value = false;
  emit('created');
  setTimeout(() => router.push({ name: 'loan' }), 1000);
}

async function onRepaid() {
  await waitForTransaction(props.offer.loanHash, parseWormholeChainId(props.offer.loanChainId));
}
</script>

<template>
  <Btn
    v-if="
      offer.status === OfferStatus.PUBLISHED &&
      equalsIgnoreCase(address, offer.borrowerAddress) &&
      !isDatePassedBy(offer.offerExpirationTime)
    "
    :class="$attrs?.class"
    @click="modalLoanVisible = true"
  >
    Create Loan
  </Btn>
  <template
    v-else-if="
      (offer.status === OfferStatus.PROCESSING || offer.status === OfferStatus.LOAN_CREATED) &&
      loanStatus <= WormholeMessageReceived.LOAN_CRATED
    "
  >
    <ActionDefaultLoan
      v-if="equalsIgnoreCase(address, offer.lenderAddress) && isDatePassedBy(offer.loanExpirationTime)"
      :class="$attrs?.class"
      :loan="offer"
    />
    <ActionRepay v-else-if="equalsIgnoreCase(address, offer.borrowerAddress)" :loan="offer" @repayed="onRepaid" />
  </template>

  <modal v-model:show="modalLoanVisible">
    <ActionLoan v-if="offer?.id" :class="$attrs?.class" :offer="offer" @done="onLoanCreated" />
  </modal>
</template>
