<template>
  <div class="border-1 border-grey-lighter rounded-lg mt-10 flex-col p-6 px-0 text-wrap break-words">
    <div class="font-bold text-[14px] leading-[20px] mb-4 text-white px-6">Positions</div>

    <div class="text-[12px]">
      <n-data-table
        :columns="columns"
        :data="processedPositions"
        :bordered="false"
        :theme-overrides="{
          tdColor: colors.grey.dark,
          thColor: colors.grey.dark,
          tdColorHover: colors.grey.dark,
          borderColor: colors.transparent,
          borderRadius: '8px',
          thPaddingMedium: '0 12px 12px 1.5rem',
          tdPaddingMedium: '12px 12px 12px 1.5rem',
          thTextColor: colors.grey.lightest,
        }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Address } from 'viem';
import BasicButton from '~/components/general/BasicButton.vue';
import type { PredictionSetInterface } from '~/lib/types/prediction-set';
import { colors } from '~/tailwind.config';

const { calcSellAmountInCollateral } = useFixedMarketMaker();
const { getTokenStore } = useCollateralToken();
const tokenStore = getTokenStore();

const props = defineProps({
  positions: { type: Array<any>, default: [], required: true },
  contractAddress: { type: String as PropType<Address>, default: null, required: true },
  predictionSet: { type: Object as PropType<PredictionSetInterface>, default: null, required: true },
});

const emit = defineEmits(['sell']);

const processedPositions = ref<any[]>([]);
const columns = ref<any[]>([]);

watchEffect(async () => {
  const enriched = await Promise.all(
    props.positions.map(async pos => {
      const collateralAmount = await calcSellAmountInCollateral(
        Number(pos.sharesAmount) / Math.pow(10, tokenStore.decimals),
        pos.outcomeIndex,
        props.contractAddress,
        props.predictionSet.outcomes.map(o => o.positionId)
      );

      return {
        ...pos,
        returnAmount: Number(collateralAmount),
      };
    })
  );

  processedPositions.value = enriched;

  console.log(tradeEnabled(props.predictionSet.setStatus, props.predictionSet.endTime));
});

onMounted(() => {
  columns.value = [
    {
      title: 'Outcome',
      key: 'outcomeName',
      render(row: any) {
        return h('div', { class: 'font-bold text-white/80' }, row.outcomeName);
      },
    },
    {
      title: 'QTY',
      key: 'sharesAmount',
      render(row: any) {
        return h('div', { class: 'text-white/80' }, formatTokenAmount(row.sharesAmount, tokenStore.decimals));
      },
    },
    {
      title: 'AVG',
      key: 'avgBuyPrice',
      render(row: any) {
        return h('div', { class: 'text-white/80' }, row.avgBuyPrice.toFixed(2));
      },
    },
    {
      title: 'Value',
      key: 'returnAmount',
      render(row: any) {
        return h('div', { class: 'text-white/80' }, (row.returnAmount / Math.pow(10, tokenStore.decimals)).toFixed(2));
      },
    },
    {
      title: 'Return',
      key: 'calculatedReturn',
      render(row: any) {
        const collateralReturn = (row.returnAmount - row.collateralAmount) / Math.pow(10, tokenStore.decimals);
        const returnPercentage = ((row.returnAmount - row.collateralAmount) / row.collateralAmount) * 100;

        const displayCollateral = `${collateralReturn > 0 ? '+' : ''}` + collateralReturn.toFixed(2);
        const displayPercentage = `(${returnPercentage > 0 ? '+' : ''}${returnPercentage.toFixed(2)} %)`;
        const percentageClass = `${returnPercentage >= 0 ? 'text-statusGreen font-semibold' : 'text-statusRed font-semibold'}`;

        return h('div', { class: 'flex whitespace-nowrap' }, [
          h('div', { class: 'mr-1 w-[50px]' }, displayCollateral),
          h('span', { class: percentageClass }, displayPercentage),
        ]);
      },
    },
  ];

  if (tradeEnabled(props.predictionSet.setStatus, props.predictionSet.endTime))
    columns.value.push({
      title: '',
      key: 'actions',
      render(row: any) {
        return h(
          BasicButton,
          {
            type: 'secondary',
            size: 'small',
            onClick: () =>
              emit('sell', row.outcomeId, Number(formatTokenAmount(row.sharesAmount, tokenStore.decimals))),
          },
          'Sell'
        );
      },
    });
});
</script>
