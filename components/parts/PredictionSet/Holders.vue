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
        @update:value="value => getActivity(value)"
        :theme-overrides="{ peers: { InternalSelection: { color: '#292929' } } }"
      />
    </div>
    <div v-if="loading">
      <Spinner />
    </div>
    <div v-else-if="!items.length" class="text-center">No holders</div>
    <div v-else>
      <div class="flex flex-col mt-6 gap-y-5">
        <div class="flex justify-between text-xs max-w-[99%]">
          <div>Holder</div>
          <div>Shares</div>
        </div>
        <PredictionSetHolder :item="item" v-for="item of items" />
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

const pagination = ref({ ...createPagination(), pageSize: 50 });

onMounted(async () => {
  await getActivity();
});

async function getActivity(outcomeIndex: number = 0) {
  if (outcomeIndex === lastOutcome.value) {
    return;
  }
  if (!loading.value) {
    loading.value = true;
    try {
      const res = await $api.get<GeneralItemsResponse<any>>(Endpoints.predictionSetHolders, {
        predictionId: props.predictionSetId,
        outcomeId: props.outcomes[outcomeIndex].id,
        page: 1,
        limit: pagination.value.pageSize,
        orderBy: 'outcomeTokens',
        desc: true,
      });
      lastOutcome.value = outcomeIndex;

      items.value = res.data.items;
      pagination.value.itemCount = res.data.total;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }
}
</script>
