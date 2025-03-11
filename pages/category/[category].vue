<template>
  <Dashboard>
    <PredictionSetListing :category="category" />
  </Dashboard>
</template>

<script lang="ts" setup>
import { PredictionSetCategory } from '~/lib/types/prediction-set';
const route = useRoute();

const category = route.params.category as string;

definePageMeta({
  validate: route => {
    return (
      typeof route.params.category === 'string' &&
      !!Object.values(PredictionSetCategory).find(c => c.toLowerCase() === route.params.category)
    );
  },
});
</script>
