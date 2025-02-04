<template>
  <DataTable title="Proposals" :columns="columns" :row-props="rowProps" :store="store">
    <modal v-model:show="modalOfferVisible">
      <ActionOffer
        v-if="currentRow?.id"
        :key="currentRow.id"
        :offer-request="currentRow"
        @done="modalOfferVisible = false"
      />
    </modal>
  </DataTable>
</template>

<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';
import type { DataTableColumns } from 'naive-ui';
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import { truncateWallet } from '~/lib/misc/strings';
import { SqlModelStatus } from '~/lib/types';
import { Chains } from '~/lib/types/asset';
import type { BaseStore } from '~/lib/types/config';
import type { OfferRequestInterface, OfferRequestListInterface } from '~/lib/types/offer';
import { ON_CLICK_OPEN } from '~/lib/values/general.values';

defineProps({
  store: { type: Object as PropType<BaseStore<OfferRequestListInterface, OfferRequestInterface>>, required: true },
});

const { t } = useI18n();
const router = useRouter();
const { isConnected } = useAccount();

const modalOfferVisible = ref<boolean>(false);
const currentRow = ref<OfferRequestListInterface>({} as OfferRequestListInterface);

const rowProps = (row: OfferRequestListInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push(`/offer-requests/${row.id}`);
      }
    },
  };
};

const createColumns = (): DataTableColumns<OfferRequestListInterface> => {
  return [
    {
      key: 'asset_id',
      title: 'Asset',
      sorter: 'default',
      minWidth: 150,
      className: ON_CLICK_OPEN,
      render(row: OfferRequestListInterface) {
        return h(resolveComponent('AssetDetails'), { asset: parseAssetFromOffer(row) });
      },
    },
    {
      key: 'borrowerAddress',
      title: t('form.label.borrowerAddress'),
      sorter: 'default',
      className: ON_CLICK_OPEN,
      render(row: OfferRequestListInterface) {
        return h(
          resolveComponent('TableEllipsis'),
          { text: truncateWallet(row.borrowerAddress), tooltip: row.borrowerAddress },
          ''
        );
      },
    },
    {
      key: 'interestRate',
      title: t('form.label.interestRate'),
      sorter: 'default',
      className: ON_CLICK_OPEN,
      render(row: OfferRequestListInterface) {
        return `${row.interestRate / 100}%`;
      },
    },
    {
      key: 'loanAmount',
      title: t('form.label.loanAmount'),
      sorter: 'default',
      className: ON_CLICK_OPEN,
    },
    {
      key: 'loanChainId',
      title: t('form.label.chain'),
      sorter: 'default',
      render(row: OfferRequestListInterface) {
        return Chains[row.loanChainId];
      },
    },
    {
      key: 'loanDuration',
      title: t('form.label.loanDuration'),
      sorter: 'default',
      render(row: OfferRequestListInterface) {
        return secondsToHumanTime(row.loanDuration);
      },
    },
    {
      key: 'loanTokenContract',
      title: t('form.label.loanTokenContract'),
      sorter: 'default',
      render(row: OfferRequestListInterface) {
        return h(
          resolveComponent('TableLink'),
          {
            text: truncateWallet(row.loanTokenContract),
            link: contractLink(row.loanTokenContract, row.loanChainId),
          },
          ''
        );
      },
    },
    {
      key: 'status',
      title: t('general.status'),
      sorter: 'default',
      minWidth: 90,
      render(row: OfferRequestListInterface) {
        return SqlModelStatus[row.status];
      },
    },
    {
      key: 'Actions',
      title: 'Actions',
      minWidth: 90,
      render() {
        if (!isConnected.value) return '';

        return h(
          resolveComponent('Btn'),
          {
            size: 'small',
            onClick: () => {
              modalOfferVisible.value = true;
            },
          },
          h('small', { class: 'whitespace-nowrap tracking-wide' }, 'Select offer request')
        );
      },
    },
  ];
};
const columns = createColumns();
</script>
