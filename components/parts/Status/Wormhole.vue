<template>
  <n-space vertical>
    <h3 class="mb-2">Wormhole status</h3>
    <n-steps vertical :current="step" :status="currentStatus">
      <n-step title="LOAN_CRATE_STARTED" description="Loan create started" />
      <n-step title="LOAN_CRATED" description="Loan created" />
      <template
        v-if="
          step === WormholeMessageReceived.REPAYMENT_STARTED || step === WormholeMessageReceived.REPAYMENT_COMPLETED
        "
      >
        <n-step title="REPAYMENT_STARTED" description="Repayment started" />
        <n-step title="REPAYMENT_COMPLETED" description="Repayment completed" />
      </template>
      <template
        v-if="step === WormholeMessageReceived.DEFAULT_STARTED || step === WormholeMessageReceived.DEFAULT_COMPLETED"
      >
        <n-step title="DEFAULT_STARTED" description="Loan default started" />
        <n-step title="DEFAULT_COMPLETED" description="Loan default completed" />
      </template>
    </n-steps>
  </n-space>
</template>
<script setup lang="ts">
import { WormholeMessageReceived } from '~/lib/types/contractEvent';

const props = defineProps({
  step: { type: Number, required: true },
});

const currentStatus = computed(() => {
  switch (props.step) {
    case WormholeMessageReceived.DEFAULT_COMPLETED:
    case WormholeMessageReceived.REPAYMENT_COMPLETED:
      return 'finish';
    default:
      return 'process';
  }
});
</script>
