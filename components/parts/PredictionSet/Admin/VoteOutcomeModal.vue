<template>
  <Modal
    v-model:show="show"
    display-directive="show"
    class="!bg-grey-dark border-none max-w-md"
    :mask-closable="!loading"
  >
    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-bold text-center mb-2">Vote for Outcome</h2>

      <div class="flex flex-col items-center gap-2 mb-2 bg-grey-light/10 rounded-lg">
        <Image v-if="outcome.imgUrl" :src="outcome.imgUrl" class="rounded-full w-16 h-16 object-cover" />
        <div class="text-lg font-bold text-white">{{ outcome.name }}</div>
        <div>Prediction: {{ prediction.question }}</div>
      </div>

      <div class="text-sm text-grey-lightest text-center">
        Are you sure you want to vote for this outcome? This action cannot be undone.
      </div>

      <div class="flex flex-col gap-3">
        <BasicButton
          v-if="currentAddress"
          class="w-full"
          type="outline"
          :disabled="loading"
          @click="voteWithCurrentWallet"
        >
          Vote
        </BasicButton>

        <BasicButton class="flex-1" type="secondary" :disabled="loading" @click="closeModal"> Cancel </BasicButton>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useAccount } from '@wagmi/vue';
import type { PredictionSetInterface, OutcomeInterface } from '~/lib/types/prediction-set';
import { useMessage } from 'naive-ui';
import { numberToBytes32 } from '~/lib/utils/numbers';
import { ContractType } from '~/lib/config/contracts';
import useContracts from '~/composables/useContracts';
import useTxWait from '~/composables/useTxWait';
import { contractError } from '~/lib/utils/errors';
import BasicButton from '~/components/general/BasicButton.vue';

const props = defineProps<{
  prediction: PredictionSetInterface;
  outcome: OutcomeInterface;
}>();

const emit = defineEmits<{
  (e: 'voted'): void;
}>();

const { address: currentAddress } = useAccount();
const messageProvider = useMessage();
const { ensureCorrectNetwork, initContract } = useContracts();
const txWait = useTxWait();

const show = defineModel<boolean>('show', { default: false });

const loading = ref(false);

async function voteWithCurrentWallet() {
  if (!currentAddress.value) {
    messageProvider.error('No wallet connected');
    return;
  }

  await submitVote();
}

async function submitVote() {
  loading.value = true;

  try {
    await ensureCorrectNetwork();

    // Convert prediction ID to bytes32 questionId
    const questionId = numberToBytes32(props.prediction.id) as `0x${string}`;
    const outcomeIdx = props.outcome.outcomeIndex;

    const contract = await initContract(ContractType.ORACLE);
    txWait.hash.value = await contract.write.vote([questionId, BigInt(outcomeIdx)]);

    await txWait.wait();

    messageProvider.success('Vote submitted successfully');
    emit('voted');
    closeModal();
  } catch (error: any) {
    console.error('Voting error:', error);
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    if (
      !errorMessage.includes('User rejected') &&
      !errorMessage.includes('rejected') &&
      !errorMessage.includes('denied')
    ) {
      messageProvider.error('Failed to submit vote: ' + contractError(error));
    }
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  show.value = false;
}
</script>
