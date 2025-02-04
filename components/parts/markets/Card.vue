<template>
  <n-card class="max-w-[360px] max-h-[220px] bg-grey-light" :content-class="'!p-3'">
    <div class="flex border-b border-white/10 pb-3">
      <div class="w-[38px] h-[38px] flex-shrink-0">
        <img
          class="rounded-[8px] w-full h-full object-cover"
          src="https://s3-alpha-sig.figma.com/img/a21f/779d/2c0931626f7c395eb6d83153a833f8ea?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mGfPGCxcLctO2MjpQ9yHbPzUhvDKiJFQ0ErmAlBuiWaEk6FaSRYX9Xpyjl5IdWzZFFh78DQM07GesQA~qVlI88J7nhuOgF-CebWhNIZHKRYT1JhDhfip9VjM85Uk3W8uomvwydyj~Oef2nt8asqEqjxdPLaD7c9Ab01AfE4a8ygRqzmVf5A-IB8984h3cKlRORBngKXeRU3uMnx88UoL-5wasTjnGFZ5HpJqDzPUQTOLVzzN40A0YOeqhH~Byk0rtQTui1Yz9OKxrr~tgK7VRDJ4r5-ApHQiA3RcrhED-E7KGr14Ye34lP4zcp9aOWyG5ory399LBcZRZT8HmuRHfQ__"
        />
      </div>
      <div class="ml-4 text-[14px] leading-[20px] font-medium">
        BTC to break 111K USDT by 31st Jan 2025, 10:01am UTC time
      </div>
    </div>

    <div class="relative">
      <div class="flex flex-col mt-[10px] border-b border-white/10 pb-3 scroll-container h-[100px] overflow-y-scroll">
        <div class="flex flex-row w-full">
          <div>Yes</div>
          <div class="flex ml-auto justify-center items-center">
            <div class="mr-[6px]">50%</div>
            <div class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px]">Buy 5</div>
            <div class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px]">Buy 10</div>
            <div class="px-1.5 border-1 bg-statusRed/20 border-statusRed rounded-[8px]">Sell</div>
          </div>
        </div>
        <div class="flex flex-row w-full mt-[10px]">
          <div>Yes</div>
          <div class="flex ml-auto justify-center items-center">
            <div class="mr-[6px]">50%</div>
            <div class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px]">Buy 5</div>
            <div class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px]">Buy 10</div>
            <div class="px-1.5 border-1 bg-statusRed/20 border-statusRed rounded-[8px]">Sell</div>
          </div>
        </div>
        <div class="flex flex-row w-full mt-[10px]">
          <div>Yes</div>
          <div class="flex ml-auto justify-center items-center">
            <div class="mr-[6px]">50%</div>
            <div class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px]">Buy 5</div>
            <div class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px]">Buy 10</div>
            <div class="px-1.5 border-1 bg-statusRed/20 border-statusRed rounded-[8px]">Sell</div>
          </div>
        </div>
        <div class="flex flex-row w-full mt-[10px]">
          <div>Yes</div>
          <div class="flex ml-auto justify-center items-center">
            <div class="mr-[6px]">50%</div>
            <div class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px]">Buy 5</div>
            <div class="mr-[6px] px-1.5 border-1 bg-statusGreen/20 border-statusGreen rounded-[8px]">Buy 10</div>
            <div class="px-1.5 border-1 bg-statusRed/20 border-statusRed rounded-[8px]">Sell</div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-[1px] left-0 right-0 h-[45px] pointer-events-none" 
           style="background: linear-gradient(0deg, #292929 22.08%, rgba(41, 41, 41, 0) 100.08%);">
      </div>
    </div>

    <div class="flex flex-row mt-[10px] items-center justify-center text-[12px] leading-[16px]">
      <div class="bg-statusGreen/20 text-statusGreen font-bold rounded-[20px] py-[2px] px-[6px]">Active</div>
      <div class="ml-[10px]">3d 3h 56min</div>
      <div class="ml-auto font-medium">0.35$</div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
const props = defineProps({
  category: { type: String, default: '' },
});
</script>

<style scoped>
.scroll-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari and Opera */
}

.scroll-container {
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  scrollbar-width: none; /* For Firefox */
}
</style>
