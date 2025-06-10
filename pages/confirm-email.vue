<template>
  <Dashboard>
    <div class="px-4 max-w-[1241px] m-auto mb-16 mt-[120px]">
      <div>
        <div v-if="success" class="text-center">
          <h4 class="mb-2">Email has been successfully verified.</h4>
          <p>Your email has been successfully verified. Redirecting to the homepage...</p>
        </div>
        <div v-else class="text-center">
          <h4 class="mb-2">Verifying email</h4>
          <template v-if="loading">
            <p>Please wait, while we verify your email address...</p>
            <div class="spinner-border text-primary mt-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </template>
          <p v-else>Error during email verification. Please try again.</p>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiError } from '~/lib/utils/errors';
import Endpoints from '~/lib/values/endpoints';
import { useUserStore } from '~/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const token = ref<string | null>(null);
const loading = ref(true);
const success = ref(false);

watch(
  () => route.query,
  query => {
    if (query.token) {
      token.value = query.token as string;
      confirmEmail();
    } else {
      router.replace('/');
    }
  },
  { immediate: true }
);

async function confirmEmail() {
  if (token.value) {
    loading.value = true;
    try {
      const res: any = await $api.patch(Endpoints.changeMail, { token: token.value });
      success.value = true;
      userStore.saveUser(res.data);

      // Redirect to profile after a short delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: any) {
      console.error(error);
      loading.value = false;
      // Show error message
      if (window.$message) {
        window.$message.error(apiError(error));
      }
    }
  }
}
</script>

<style scoped lang="postcss">
.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
