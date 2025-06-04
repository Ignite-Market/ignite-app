<template>
  <div class="bg-grey-dark pt-4">
    <!-- <n-menu
      v-model:value="selectedMenu"
      class="text-[14px] leading-[20px] font-medium"
      mode="horizontal"
      :options="menuOptions"
      :render-icon="renderMenuIcon"
      :render-label="renderMenuLabel"
      :render-extra="renderMenuExtra"
    /> -->

    <VueHorizontal class="text-sm leading-5 font-medium border-b border-white/10">
      <div v-for="item in menuOptions" :key="item.key" class="px-5 !min-h-[44px]">
        <NuxtLink
          :to="item.to || item.path"
          :title="item.label"
          :class="[
            'px-0.5 border-b border-transparent grid items-center h-full',
            '[&.router-link-active]:border-primary [&.router-link-active>.nav-icon]:text-primary',
          ]"
          :style="{
            gridTemplateAreas: '\'icon content arrow\'',
            gridTemplateColumns: 'auto 1fr auto',
            transition: 'border-color 0.3s cubic-bezier(.4, 0, .2, 1)',
          }"
        >
          <div v-if="item.iconName" class="mr-0.5 nav-icon" :style="{ gridArea: 'icon' }">
            <NuxtIcon :name="item.iconName" class="text-base mr-0" />
          </div>

          <div :style="{ gridArea: 'content' }">
            {{ item.label }}
          </div>

          <!-- <div :style="{ gridArea: 'arrow' }"></div> -->
        </NuxtLink>
      </div>

      <template #btn-prev>
        <div class="h-[44px] w-[60px] bg-gradient-to-l from-transparent to-bg to-[66%] flex items-center justify-start">
          <NuxtIcon name="icon/arrow-down" class="text-[32px] m-0 text-white rotate-90" />
        </div>
      </template>

      <template #btn-next>
        <div class="h-[44px] w-[60px] bg-gradient-to-r from-transparent to-bg to-[66%] flex items-center justify-end">
          <NuxtIcon name="icon/arrow-down" class="text-[32px] m-0 text-white -rotate-90" />
        </div>
      </template>
    </VueHorizontal>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import VueHorizontal from 'vue-horizontal';
import { PredictionSetCategory } from '~/lib/types/prediction-set';

const menuOptions = [
  {
    label: 'Top markets',
    key: 'index',
    to: '/',
    iconName: 'icon/fire',
    path: '',
  },
];

const predictionCategories = Object.values(PredictionSetCategory).map(category => ({
  label: category,
  key: category.toLowerCase(),
  path: '/category/' + category.toLowerCase(),
}));
menuOptions.push(...(predictionCategories as any));
</script>

<style scoped>
:deep(.v-hl-btn.v-hl-btn-next),
:deep(.v-hl-btn.v-hl-btn-prev) {
  transform: none !important;
}
</style>
