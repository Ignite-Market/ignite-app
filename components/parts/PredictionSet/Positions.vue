<template>
  <div
    v-if="processedPositions.length"
    class="border-1 border-grey-lighter rounded-lg mt-10 flex-col p-6 px-0 text-wrap break-words"
    :class="{ 'animate-pulse': loading }"
  >
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
import { MIN_SHARE_DISPLAY } from '~/lib/values/general.values';
import { colors } from '~/tailwind.config';

const { calcSellAmountInCollateral } = useFixedMarketMaker();

const props = defineProps({
  positions: { type: Array<any>, default: [], required: true },
  contractAddress: { type: String as PropType<Address>, default: null, required: true },
  predictionSet: { type: Object as PropType<PredictionSetInterface>, default: null, required: true },
  collateralToken: { type: Object as PropType<CollateralToken>, default: () => {}, required: true },
  loading: { type: Boolean, default: false, required: true },
});

const emit = defineEmits(['sell']);

const processedPositions = ref<any[]>([]);
const columns = ref<any[]>([]);

watchEffect(async () => {
  const enriched = await Promise.all(
    props.positions
      .filter(pos => bigIntToNum(pos.sharesAmount, props.collateralToken.decimals) >= MIN_SHARE_DISPLAY)
      .map(async pos => {
        const collateralAmount = await calcSellAmountInCollateral(
          Number(pos.sharesAmount) / Math.pow(10, props.collateralToken.decimals),
          pos.outcomeIndex,
          props.contractAddress,
          props.predictionSet.outcomes.map(o => o.positionId),
          props.collateralToken.decimals
        );

        return {
          ...pos,
          returnAmount: Number(collateralAmount),
        };
      })
  );

  processedPositions.value = enriched;
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
        return h('div', { class: 'text-white/80' }, floorOutcomeAmount(row.sharesAmount));
      },
    },
    {
      title: 'AVG',
      key: 'avgBuyPrice',
      render(row: any) {
        return h('div', { class: 'flex whitespace-nowrap text-white/80' }, [
          h('div', { class: 'mr-1' }, row.avgBuyPrice.toFixed(2)),
          h('span', { class: 'text-[11px] opacity-60 mt-auto font-light' }, props.collateralToken.symbol),
        ]);
      },
    },
    {
      title: 'Value',
      key: 'returnAmount',
      render(row: any) {
        return h('div', { class: 'flex whitespace-nowrap text-white/80' }, [
          h('div', { class: 'mr-1' }, (row.returnAmount / Math.pow(10, props.collateralToken.decimals)).toFixed(2)),
          h('span', { class: 'text-[11px] opacity-60 mt-auto font-light' }, props.collateralToken.symbol),
        ]);
      },
    },
    {
      title: 'Return',
      key: 'calculatedReturn',
      render(row: any) {
        const currentCollateralAmount = row.avgBuyPrice * row.sharesAmount;
        const collateralReturn =
          (row.returnAmount - currentCollateralAmount) / Math.pow(10, props.collateralToken.decimals || 6);
        const returnPercentage = ((row.returnAmount - currentCollateralAmount) / currentCollateralAmount) * 100;

        const displayCollateral = `${collateralReturn > 0 ? '+' : ''}` + collateralReturn.toFixed(2);
        const displayPercentage = `(${returnPercentage > 0 ? '+' : ''}${returnPercentage.toFixed(2)} %)`;
        const percentageClass = `${returnPercentage >= 0 ? 'text-statusGreen font-semibold' : 'text-statusRed font-semibold'}`;

        return h('div', { class: 'flex whitespace-nowrap' }, [
          h('div', { class: 'w-[110px] text-white/80 flex whitespace-nowrap' }, [
            h('div', { class: 'mr-1' }, displayCollateral),
            h('span', { class: 'text-[11px] opacity-60 mt-auto font-light' }, props.collateralToken.symbol),
          ]),
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
            onClick: () => emit('sell', row.outcomeId, floorOutcomeAmount(row.sharesAmount)),
          },
          {
            default: () => 'Sell',
          }
        );
      },
    });
});
</script>
