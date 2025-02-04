<template>
  <div v-if="offerRequest?.id" class="my-4">
    <h3>Offer request</h3>
    <p>
      <strong>{{ $t('form.label.loanAmount') }}: </strong>
      <span>{{ offerRequest.loanAmount }}</span>
    </p>
    <p>
      <strong>{{ $t('form.label.repayAmount') }}: </strong>
      <span>
        {{
          getFixed(
            calcRepayAmount(Number(offerRequest.loanAmount), offerRequest.interestRate, offerRequest.loanDuration)
          )
        }}
      </span>
    </p>
    <p>
      <strong>{{ $t('form.label.loanDuration') }}: </strong>
      <span>{{ secondsToHumanTime(offerRequest.loanDuration) }}</span>
    </p>
    <p>
      <strong>{{ $t('form.label.interestRate') }}: </strong>
      <span>{{ offerRequest.interestRate / 100 }}%</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { AnyOfferRequest } from '~/lib/types/offer';

defineProps({
  offerRequest: { type: Object as PropType<AnyOfferRequest>, default: {} },
});
</script>
