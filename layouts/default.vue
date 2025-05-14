<template>
  <div v-if="!userStore.loadingProfile" ref="mainContentRef" class="relative">
    <n-layout class="h-screen">
      <n-layout :native-scrollbar="false">
        <div>
          <NuxtPage />
          <!-- <CookieConsent /> -->
        </div>
      </n-layout>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
/** Global messages */
const message = useMessage();
window.$message = message;

const userStore = useUserStore();
const mainContentRef = ref<HTMLDivElement>();
</script>
