<template>
  <div>
    <n-tabs
      v-model:value="selectedTab"
      type="line"
      animated
      size="large"
      :theme-overrides="{
        tabTextColorActiveLine: '#F5F5F5',
      }"
    >
      <n-tab-pane :name="ProfileTabs.PREDICTIONS" :tab="ProfileTabs.PREDICTIONS">
        <div class="mb-3">
          <ProfileListTable :tab="ProfileTabs.PREDICTIONS" :user-id="userId" />
        </div>
      </n-tab-pane>
      <n-tab-pane :name="ProfileTabs.FUNDING_POSITIONS" :tab="ProfileTabs.FUNDING_POSITIONS">
        <div class="mb-3">
          <ProfileListTable :tab="ProfileTabs.FUNDING_POSITIONS" :user-id="userId" />
        </div>
      </n-tab-pane>
      <n-tab-pane :name="ProfileTabs.ACTIVITY" :tab="ProfileTabs.ACTIVITY">
        <div class="mb-3">
          <ProfileListTable :tab="ProfileTabs.ACTIVITY" :user-id="userId" />
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ProfileTabs } from '~/lib/types';
defineProps({
  userId: { type: Number, required: true },
});

const selectedTab = ref(ProfileTabs.PREDICTIONS);
</script>
