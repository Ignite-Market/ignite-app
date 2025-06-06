<template>
  <div class="w-full max-w-lg">
    <div v-if="userStore?.user?.emailStatus">
      Successfully confirmed
    </div>
    <div v-else>
      Email confirmation pending.
      <BasicButton size="small" class="ml-2" :disabled="isButtonDisabled" @click="resendConfirmation">
        Resend confirmation
        <span v-if="isButtonDisabled">({{ remainingSeconds }}s)</span>
      </BasicButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Endpoints from '~/lib/values/endpoints';

const { t } = useI18n();
const userStore = useUserStore();
const isButtonDisabled = ref(false);
const remainingSeconds = ref(30);
let countdownTimer: NodeJS.Timeout | null = null;

function startCountdown() {
  isButtonDisabled.value = true;
  remainingSeconds.value = 30;

  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  countdownTimer = setInterval(() => {
    remainingSeconds.value--;
    if (remainingSeconds.value <= 0) {
      isButtonDisabled.value = false;
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }
  }, 1000);
}

onUnmounted(() => {
  // Clean up timer when component is destroyed
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});

// Submit
async function resendConfirmation() {
  if (isButtonDisabled.value) return;

  startCountdown();

  await $api.post(Endpoints.emailVerification, { email: userStore?.user?.email });
}
</script>

<style scoped lang="postcss">

</style>
