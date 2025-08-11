<template>
  <div class="mt-5 pb-[33vh]">
    <div v-if="!loading && !items.length" class="text-center mt-6 text-[14px] text-grey-lightest">No activity</div>
    <div v-else-if="items.length" class="flex flex-col mt-6 gap-y-5">
      <PredictionSetActivityItem
        v-for="item of items"
        :key="item.transactionId"
        :item="item"
        :is-user="!!props.userId"
      />
      <div v-if="pagination.itemCount! > pagination.page! * pagination.pageSize" class="flex">
        <button :disabled="loading" class="m-auto underline" @click="() => getActivity(pagination.page! + 1)">
          Show More
        </button>
      </div>
    </div>
    <div v-if="loading" class="flex flex-col gap-y-5">
      <n-skeleton v-for="i in 10" :key="i" height="32px" width="100%" class="rounded-[8px]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  predictionSetId: { type: Number, required: true },
  userId: { type: Number, required: false, default: undefined },
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
        ...(props.userId ? { userId: props.userId } : {}),
      });

      items.value = [...items.value, ...res.data.items];
      pagination.value.itemCount = res.data.total;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
}
</script>
