<template>
  <div v-if="offer?.id" class="my-4">
    <h3>Offer</h3>
    <p>
      <strong>{{ $t('general.status') }}: </strong>
      <span>{{ OfferStatus[offer.status] }}</span>
    </p>
    <p>
      <strong>{{ $t('form.label.loanAmount') }}: </strong>
      <span>{{ bigIntToNum(offer.loanAmount) }}</span>
    </p>
    <p>
      <strong>{{ $t('form.label.repayAmount') }}: </strong>
      <span>
        {{ bigIntToNum(calcRepayAmount(Number(offer.loanAmount), Number(offer.interestRate), offer.loanDuration)) }}
      </span>
    </p>
    <p>
      <strong>{{ $t('form.label.loanDuration') }}: </strong>
      <span>{{ secondsToHumanTime(offer.loanDuration) }}</span>
    </p>
    <p>
      <strong>{{ $t('form.label.interestRate') }}: </strong>
      <span>{{ offer.interestRate / 100 }}%</span>
    </p>
    <p class="flex items-center gap-2">
      <strong>{{ $t('form.label.chain') }}: </strong>
      <NuxtIcon :name="`logo/chain/${asset.chainId}`.trim()" class="text-2xl text-black" filled />
      <span>{{ Chains[asset.chainId] }}</span>
    </p>
    <p class="flex items-center gap-1">
      <strong>{{ $t('form.label.repayChain') }}: </strong>
      <NuxtIcon :name="`logo/chain/${offer.loanChainId}`.trim()" class="text-2xl text-black" filled />
      <span>{{ Chains[offer.loanChainId] }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import { Chains } from '~/lib/types/asset';
import { OfferStatus, type OfferInterface, type OfferListInterface } from '~/lib/types/offer';

const props = defineProps({
  offer: { type: Object as PropType<OfferInterface | OfferListInterface>, default: {} },
});

const asset = parseAssetFromOffer(props.offer);
</script>
