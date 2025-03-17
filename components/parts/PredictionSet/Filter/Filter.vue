<template>
  <div class="flex gap-4 justify-between items-center flex-wrap">
    <PredictionSetFilterSearch class="max-w-[300px] min-w-[160px] basis-[160px] flex-grow" />
    <div class="flex gap-2 basis-[260px] justify-end flex-grow">
      <PredictionSetFilterStatus class="max-w-[200px] min-w-[130px] w-full" />
      <PredictionSetFilterSort class="max-w-[200px] min-w-[130px] w-full" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
