<template>
  <n-dropdown :options="options" :disabled="loading" @select="handleSelect">
    <BasicButton type="gradient" :loading="loading">
      <NuxtIcon name="icon/menu" />
    </BasicButton>
  </n-dropdown>
</template>

<script lang="ts" setup>
import Endpoints from '~/lib/values/endpoints';
import type { BannerInterface } from '~/lib/types/banner';
import { SqlModelStatus } from '~/lib/types';

const { banner } = defineProps<{ banner: BannerInterface }>();

const emit = defineEmits(['refresh', 'edit']);

const loading = ref(false);

const options = [
  {
    label: 'Edit',
    key: 'edit',
  },
  {
    label: banner.status === SqlModelStatus.ACTIVE ? 'Deactivate' : 'Activate',
    key: 'toggle',
  },
  {
    label: 'Delete',
    key: 'delete',
  },
];

async function toggleActive() {
  try {
    loading.value = true;
    await $api.patch(Endpoints.bannerToggle(banner.id));
    emit('refresh');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function deleteBanner() {
  try {
    loading.value = true;
    await $api.delete(Endpoints.bannerById(banner.id));
    emit('refresh');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function handleSelect(key: string | number) {
  if (key === 'edit') {
    emit('edit', banner);
  } else if (key === 'toggle') {
    await toggleActive();
  } else if (key === 'delete') {
    await deleteBanner();
  }
}
</script>
