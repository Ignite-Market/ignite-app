<template>
  <div class="mt-5 pb-[33vh]">
    <div v-if="!loading && !items.length" class="text-center mt-6">No activity</div>
    <div v-else class="flex flex-col mt-6 gap-y-5">
      <PredictionSetActivityItem :item="item" v-for="item of items" />
      <div v-if="pagination.itemCount! > pagination.page! * pagination.pageSize" class="flex">
        <BasicButton :disabled="loading" @click="() => getActivity(pagination.page! + 1)" class="m-auto"
          >Show More</BasicButton
        >
      </div>
    </div>
    <div v-if="loading">
      <Spinner />
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
      const res = await $api.get<GeneralItemsResponse<any>>(Endpoints.predictionSetActivity, {
        predictionId: props.predictionSetId,
        page,
        limit: pagination.value.pageSize,
        orderBy: 'transactionTime',
        desc: true,
      });

      items.value = [...items.value, ...res.data.items];
      pagination.value.itemCount = res.data.total;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }
}
</script>
