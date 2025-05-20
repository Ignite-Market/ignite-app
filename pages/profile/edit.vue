<template>
  <Dashboard :loading="userStore.loadingProfile">
    <FormWrapper class="mt-8" :title="'Account information'">
      <FormUserProfile />
    </FormWrapper>

    <FormWrapper v-if="userStore.user?.email" class="mt-8" :title="'Confirm email address'">
      <FormUserConfirm />
    </FormWrapper>

    <!--
    <FormWrapper :title="'Email'">
      <n-h5>{{ $t('profile.email.changeRequest') }}</n-h5>
      <FormUserEmail />
    </FormWrapper> -->
  </Dashboard>
</template>

<script lang="ts" setup>
// const { t } = useI18n();
const userStore = useUserStore();

onMounted(async () => {
  // await userStore.getUserData();
});

/** Modal Change password */
const showModalChangePassword = ref(false);

/** Close modal after password has been changed */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function passwordChanged() {
  setTimeout(() => {
    showModalChangePassword.value = false;
  }, 2000);
}
</script>
