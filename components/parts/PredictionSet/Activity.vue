<template>
  <div class="mt-5 pb-[33vh]">
    <div class="flex flex-col mt-6 gap-y-5">
      <PredictionSetActivityItem :item="item" v-for="item of items" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  predictionSetId: { type: Number, required: true },
});

const loading = ref(false);

const items = ref<any>([]);

const pagination = ref({ ...createPagination(), pageSize: 50 });

onMounted(async () => {
  await getActivity();
});

async function getActivity(page: number = 1) {
  if (!loading.value) {
    loading.value = true;
    try {
      pagination.value.page = page;
      const res = await $api.get<GeneralItemsResponse<any>>(Endpoints.PredictionSetActivity(props.predictionSetId), {
        page,
        limit: pagination.value.pageSize,
      });

      items.value = [...res.data.items, ...res.data.items];
      pagination.value.itemCount = res.data.total;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = true;
    }
  }
}
</script>
