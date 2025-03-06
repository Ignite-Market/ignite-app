<template>
  <div class="mt-5 pb-[33vh]">
    <div>
      <SelectOptions
        :default-value="0"
        class="min-w-32 w-[12vw] max-w-xs"
        :options="outcomes"
        label-field="name"
        value-field="outcomeIndex"
        :loading="loading"
        @update:value="value => getHolders(1, value)"
        :theme-overrides="{ peers: { InternalSelection: { color: '#292929' } } }"
      />
    </div>
    <div v-if="!loading && !items.length" class="text-center mt-6">No holders</div>
    <div v-else>
      <div class="flex flex-col mt-6 gap-y-5">
        <div class="flex justify-between text-xs max-w-[99%]">
          <div>Holder</div>
          <div>Shares</div>
        </div>
        <n-skeleton v-if="loading" v-for="i in 10" :key="i" height="32px" width="100%" class="rounded-[8px]" />
        <PredictionSetHolder v-else :item="item" v-for="item of items" />
      </div>
      <div v-if="pagination.itemCount! > pagination.page! * pagination.pageSize" class="mt-4 flex">
        <button
          :disabled="loading"
          @click="() => getHolders(pagination.page! + 1, lastOutcome!)"
          class="m-auto underline"
        >
          Show More
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Endpoints from '~/lib/values/endpoints';
import { type OutcomeInterface } from '~/lib/types/prediction-set';

const props = defineProps({
  predictionSetId: { type: Number, required: true },
  outcomes: { type: Array as PropType<OutcomeInterface[]>, required: true },
});

const lastOutcome = ref(null as number | null);

const loading = ref(false);

const items = ref<any>([]);

const pagination = ref({ ...createPagination(), pageSize: 10 });

onMounted(async () => {
  await getHolders();
});

async function getHolders(page: number = 1, outcomeIndex: number = 0) {
  if (outcomeIndex === lastOutcome.value && page === pagination.value.page) {
    return;
  }
  if (!loading.value) {
    loading.value = true;
    try {
      pagination.value.page = page;
      const res = await $api.get<GeneralItemsResponse<any>>(Endpoints.predictionSetHolders, {
        predictionId: props.predictionSetId,
        outcomeId: props.outcomes[outcomeIndex].id,
        page,
        limit: pagination.value.pageSize,
        orderBy: 'outcomeTokens',
        desc: true,
      });
      lastOutcome.value = outcomeIndex;

      items.value = page === 1 ? res.data.items : [...items.value, ...res.data.items];
      pagination.value.itemCount = res.data.total;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }
}
</script>
