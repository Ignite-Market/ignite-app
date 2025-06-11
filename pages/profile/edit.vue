<template>
  <Dashboard :loading="userStore.loadingProfile || isInitializing">
    <FormWrapper class="mt-8" :title="'Account information'">
      <FormUserProfile />
    </FormWrapper>

    <FormWrapper v-if="userStore.user?.email" class="mt-8" :title="'Confirm email address'">
      <FormUserConfirm />
    </FormWrapper>
  </Dashboard>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const { isInitializing } = useLoggedIn(onInit);
const router = useRouter();
function onInit(loggedIn: boolean) {
  if (!loggedIn) {
    router.push('/');
  }
}
</script>
