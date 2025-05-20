<template>
  <div class="w-full max-w-lg">
    <div v-if="userStore?.user?.emailStatus">
      Successfully confirmed
    </div>
    <div v-else>
      Email confirmation pending.
      <BasicButton size="small" @click="resendConfirmation" class="ml-2">Resend confirmation</BasicButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Endpoints from '~/lib/values/endpoints';

const { t } = useI18n();
const userStore = useUserStore();

onMounted(async () => {
});

// Submit
async function resendConfirmation() {
  const res = await $api.post(Endpoints.emailVerification, { email: userStore?.user?.email });
  console.log(res);
  console.log(res.data);
}
</script>

<style scoped lang="postcss">

</style>