<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import Endpoints from '~/lib/values/endpoints';
import { useUserStore } from '~/stores/user';
import { apiError } from '~/lib/utils/errors';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const token = ref<string | null>(null);
const loading = ref(true);
const success = ref(false);

// Watch for route query parameters to be ready
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

// Function to confirm email
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

<template>
  <Dashboard class="pt-110">
    <div class="px-4 max-w-[1241px] m-auto mb-16">
      <!-- HEADER -->
      <div class="flex mb-10 justify-between flex-wrap gap-4">
        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="w-[80px] h-[80px] flex-shrink-0">
            <Image src="https://images.ignitemarket.xyz/points.png" class="rounded-[8px] w-full h-full object-cover" />
          </div>
          <div class="flex flex-col">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">Email verification</div>
            <!--            <div class="flex mt-4 items-center">-->
            <!--              <div class="text-white/80 text-[14px] leading-[20px]">-->
            <!--                Earn points now to qualify for our upcoming token airdrop-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>

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
