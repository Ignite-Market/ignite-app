<template>
  <Card
    class="max-w-xl"
    size="lg"
    :title="`${nft.name} #${nft.id}`"
    :content="nft.description"
    :image="{ src: nft.image }"
  >
    <NuxtLink v-if="open && link" class="absolute top-0 left-0 right-0 bottom-0" type="secondary" :to="link"></NuxtLink>

    <div class="absolute top-0 left-2 flex gap-2 -translate-y-1/2">
      <IconBadge v-if="!isDatePassedBy(offer.offerExpirationTime)" class="relative bg-green-darker" :border="true">
        <NuxtIcon name="icon/list-bullet" class="icon-auto text-black" filled />
      </IconBadge>
      <IconBadge v-else-if="listed" class="relative bg-grey-light" :border="true">
        <NuxtIcon name="icon/list-bullet" class="icon-auto text-black" filled />
      </IconBadge>
      <IconBadge v-if="offer" class="relative bg-yellow-dark" :border="true">
        <NuxtIcon name="icon/dollar" class="icon-auto text-black" filled />
      </IconBadge>
    </div>

    <IconBadge v-if="verified" class="top-0 right-2 bg-blue -translate-y-1/2">
      <NuxtIcon name="icon/check" class="icon-auto" filled />
    </IconBadge>

    <div class="absolute bottom-0 left-2 flex gap-2 translate-y-1/2">
      <IconBadge
        class="relative"
        :class="[
          { 'bg-chain-ethereum': nft.chainId === base.id || nft.chainId === baseSepolia.id },
          { 'bg-chain-moonbeam': nft.chainId === moonbeam.id || nft.chainId === moonbaseAlpha.id },
          { 'bg-chain-bnb': nft.chainId === bsc.id || nft.chainId === bscTestnet.id },
        ]"
        :border="true"
      >
        <NuxtIcon :name="`logo/chain/${nft.chainId}`" class="text-[34px] text-black" filled />
      </IconBadge>
      <!-- <IconTag v-if="activeLoan" class="relative bg-blue" :border="true"><span>DA</span></IconTag>
      <IconTag v-if="listed" class="relative bg-purple" :border="true"><span>RWA</span></IconTag> -->
    </div>

    <div class="relative flex flex-col justify-end items-start h-full z-1">
      <div class="flex flex-wrap gap-2 mb-2">
        <IconTag v-if="true" color="red">#Listed</IconTag>
        <IconTag v-if="true" color="blue">#RWA</IconTag>
        <IconTag v-if="nft.chainId" color="green">#{{ chain.name }}</IconTag>
        <IconTag v-if="Number(nft?.approved)">#Approved</IconTag>
      </div>

      <OfferRequestDetails v-if="offerRequest?.id" :offer-request="offerRequest" />

      <Btn v-if="offerRequest?.id" :loading="loadingOfferRequest" @click="modalOfferVisible = true"> Accept offer </Btn>

      <template v-else-if="offer?.id">
        <OfferDetails :offer="offer" />
        <ActionLoanActions :offer="offer" @created="$emit('loanCreated')" />
      </template>
      <Btn v-else @click="modalNewOfferRequestVisible = true"> Request loan </Btn>

      <slot />
    </div>

    <modal v-model:show="modalNewOfferRequestVisible" title="New offer request">
      <FormOfferRequest :nft="nft" @submit-success="onOfferRequestCreated" />
    </modal>
    <modal v-model:show="modalOfferVisible">
      <ActionOffer v-if="offerRequest?.id" :offer-request="offerRequest" @done="modalOfferVisible = false" />
    </modal>
  </Card>
</template>

<script lang="ts" setup>
import { useChains } from '@wagmi/vue';
import { base, baseSepolia, moonbaseAlpha, moonbeam, bsc, bscTestnet, type Chain } from 'viem/chains';
import { ContractType } from '~/lib/config/contracts';
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import { type NFT } from '~/lib/types/asset';
import type { AnyOffer, AnyOfferRequest } from '~/lib/types/offer';

defineEmits(['loanCreated']);
const props = defineProps({
  nft: { type: Object as PropType<NFT>, default: {} },
  offer: { type: Object as PropType<AnyOffer>, default: {} },
  offerRequest: { type: Object as PropType<AnyOfferRequest>, default: {} },
  offers: { type: Boolean, default: false },
  // verified: { type: Boolean, default: true },
  open: { type: Boolean, default: false },
});

const router = useRouter();
const chains = useChains();
const assetStore = useAssetStore();
const { getContractAddressByChain } = useContracts();
const { loadingOfferRequest } = useOffer();

const modalOfferVisible = ref<boolean>(false);
const modalNewOfferRequestVisible = ref<boolean>(false);

const link = ref<string>('');
const chain: Chain = chains.value.find(c => c.id === props.nft.chainId) || chains.value[0];

onMounted(async () => {
  if (props.open) {
    link.value = await getAssetLink();
  }
});

const listed = computed(() => props.offer?.id && !props.offer.loanHash);
const verified = computed(() => Number(props.nft?.approved) > 0);

function onOfferRequestCreated() {
  modalNewOfferRequestVisible.value = false;
  router.push({ name: 'offer-requests' });
}

async function getAssetLink() {
  let asset: any = parseAssetFromOffer(props.offer || props.offerRequest);

  if (!asset?.id) {
    const nftContractAddress = getContractAddressByChain(ContractType.NFT);
    asset = await assetStore.getAssetByContractAndId(props.nft.chainId, nftContractAddress, props.nft.id);
  }
  return asset && asset.id ? `/assets/${asset.id}` : '';
}
</script>
