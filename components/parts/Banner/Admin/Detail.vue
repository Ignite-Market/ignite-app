<template>
  <div class="flex flex-col gap-y-5">
    <!-- Title and Description -->
    <div class="flex flex-row gap-x-5">
      <div>
        <div class="text-[14px] text-white font-semibold">Title</div>
        <div class="text-[14px] text-grey-lightest">{{ banner.title }}</div>
      </div>
      <div>
        <div class="text-[14px] text-white font-semibold">Description</div>
        <div class="text-[14px] text-grey-lightest">{{ banner.description }}</div>
      </div>
    </div>

    <!-- Button Text and Prediction Set ID -->
    <div class="flex flex-row gap-x-10">
      <div>
        <div class="text-[14px] text-white font-semibold">Button Text</div>
        <div class="text-[14px] text-grey-lightest">{{ banner.button }}</div>
      </div>
      <div>
        <div class="text-[14px] text-white font-semibold">Prediction Set ID</div>
        <div class="text-[14px] text-grey-lightest">{{ banner.prediction_set_id }}</div>
      </div>
      <div>
        <div class="text-[14px] text-white font-semibold">Status</div>
        <div class="text-[14px] text-grey-lightest">
          <span :class="banner.status === SqlModelStatus.ACTIVE ? 'text-green-400' : 'text-red-400'">
            {{ banner.status === SqlModelStatus.ACTIVE ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Image Preview -->
    <div>
      <div class="text-[14px] text-white font-semibold mb-2">Image Preview</div>
      <div class="flex items-center gap-4">
        <div class="w-[106px] h-[126px] rounded-[8px] border border-grey-lighter overflow-hidden">
          <Image :src="banner.imageUrl" class="w-full h-full object-cover" />
        </div>
        <div class="text-[12px] text-grey-lightest">
          <div>Image URL: {{ banner.imageUrl }}</div>
        </div>
      </div>
    </div>

    <!-- Dates -->
    <div class="flex flex-row gap-x-10">
      <div>
        <div class="text-[14px] text-white font-semibold">Created At</div>
        <div class="text-[14px] text-grey-lightest">{{ formatDate(banner.createTime) }}</div>
      </div>
      <div>
        <div class="text-[14px] text-white font-semibold">Updated At</div>
        <div class="text-[14px] text-grey-lightest">{{ formatDate(banner.updateTime) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BannerInterface } from '~/lib/types/banner';
import Image from '~/components/general/Image.vue';
import { SqlModelStatus } from '~/lib/types';

const { banner } = defineProps<{ banner: BannerInterface }>();

function formatDate(date: string) {
  if (!date) return '-';
  return new Date(date).toLocaleString();
}
</script>
