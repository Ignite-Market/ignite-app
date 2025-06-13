<template>
  <div class="relative flex flex-col justify-center items-center min-h-screen h-full bg-grey-dark px-4">
    <div class="w-full max-w-[500px]">
      <div class="rounded-xl border-1 border-grey-lighter p-[1px]">
        <div class="card p-6 md:p-8 lg:p-12 !bg-grey-dark">
          <div class="flex flex-col items-center text-center bg-grey-dark">
            <NuxtIcon name="logo/IgniteMarketSm" class="icon-auto mb-8" filled />

            <h2 class="text-[24px] leading-[34px] font-bold text-white mb-4">Page not found</h2>

            <p class="text-white/80 text-[16px] leading-[22px] mb-8">
              Hmm, looks like you've wandered into uncharted territory. Let's get you back on track!
            </p>

            <BasicButton type="primary" size="medium" class="w-full max-w-[200px]" @click="handleError">
              Go home
            </BasicButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BasicButton from '~/components/general/BasicButton.vue';

// Clear error and redirect to home page.
const handleError = () => clearError({ redirect: '/' });
</script>
