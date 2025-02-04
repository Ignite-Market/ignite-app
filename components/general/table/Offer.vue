<template>
  <DataTable title="Offers" :columns="columns" :row-props="rowProps" :store="store">
    <modal v-model:show="modalLoanVisible">
      <ActionLoan v-if="currentRow?.id" class="text-white" :offer="currentRow" @done="modalLoanVisible = false" />
    </modal>
  </DataTable>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';
import { Chains } from '~/lib/types/asset';
import { type OfferInterface, type OfferListInterface, OfferStatus } from '~/lib/types/offer';
import { ON_CLICK_OPEN } from '~/lib/values/general.values';
import { truncateWallet } from '~/lib/misc/strings';
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import type { BaseStore } from '~/lib/types/config';

defineProps({
  store: { type: Object as PropType<BaseStore<OfferListInterface, OfferInterface>>, required: true },
});

const { t } = useI18n();
const router = useRouter();
const { getName } = useToken();

const modalLoanVisible = ref<boolean>(false);
const currentRow = ref<OfferListInterface>({} as OfferListInterface);
const contractName = ref('');

onMounted(async () => {
  try {
    contractName.value = await getName();
  } catch (error) {}
});

const isOfferExpired = (row: OfferListInterface) => {
  return row.status === OfferStatus.PUBLISHED && isDatePassedBy(row.offerExpirationTime);
};

const rowProps = (row: OfferListInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath()) && !isOfferExpired(row)) {
        router.push(`/offers/${row.id}`);
      }
    },
  };
};
const createColumns = (): DataTableColumns<OfferListInterface> => {
  return [
    {
      key: 'asset_id',
      title: 'Asset',
      sorter: 'default',
      minWidth: 150,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        return h(resolveComponent('AssetDetails'), { asset: parseAssetFromOffer(row) });
      },
    },
    {
      key: 'borrowerAddress',
      title: t('form.label.borrowerAddress'),
      sorter: 'default',
      minWidth: 80,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        return h(
          resolveComponent('TableEllipsis'),
          { text: truncateWallet(row.borrowerAddress), tooltip: row.borrowerAddress },
          ''
        );
      },
    },
    {
      key: 'lenderAddress',
      title: t('form.label.lenderAddress'),
      sorter: 'default',
      minWidth: 80,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        return h(
          resolveComponent('TableEllipsis'),
          { text: truncateWallet(row.lenderAddress), tooltip: row.lenderAddress },
          ''
        );
      },
    },
    {
      key: 'loanDuration',
      title: t('form.label.loanDuration'),
      sorter: 'default',
      minWidth: 80,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        return secondsToHumanTime(row.loanDuration);
      },
    },
    {
      sorter: 'default',
      key: 'loanAmount',
      title: t('form.label.loanAmount'),
      minWidth: 80,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        return (BigInt(row.loanAmount) / 10n ** 18n).toString();
      },
    },
    {
      key: 'interestRate',
      title: t('form.label.interestRate'),
      sorter: 'default',
      minWidth: 80,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        return `${row.interestRate / 100}%`;
      },
    },
    {
      key: 'loanChainId',
      title: t('form.label.chain'),
      sorter: 'default',
      minWidth: 80,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        return Chains[row.asset__chainId];
      },
    },
    {
      key: 'loanChainId',
      minWidth: 80,
      className: ON_CLICK_OPEN,
      title: t('form.label.repayChain'),
      render(row: OfferListInterface) {
        return Chains[row.loanChainId];
      },
    },
    {
      key: 'loanTokenContract',
      title: t('form.label.loanTokenContract'),
      sorter: 'default',
      minWidth: 80,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        // return (
        //   h(
        //     resolveComponent('TableLink'),
        //     {
        //       text: truncateWallet(row.loanTokenContract),
        //       link: contractLink(row.loanTokenContract, row.loanChainId),
        //     },
        //     ''
        //   )
        // );
        return contractName.value;
      },
    },
    // {
    //   key: 'repayTokenContract',
    //   minWidth: 80,
    //   className: ON_CLICK_OPEN,
    //   title: t('form.label.repayTokenContract'),
    //   render(row: OfferListInterface) {
    //     return h(
    //       resolveComponent('TableLink'),
    //       {
    //         text: truncateWallet(row.repayTokenContract),
    //         link: contractLink(row.repayTokenContract, row.repayChainId),
    //       },
    //       ''
    //     );
    //   },
    // },
    {
      key: 'status',
      title: t('general.status'),
      sorter: 'default',
      minWidth: 80,
      className: ON_CLICK_OPEN,
      render(row: OfferListInterface) {
        if (isOfferExpired(row)) {
          return 'Expired';
        }
        return OfferStatus[row.status];
      },
    },
    {
      key: 'actions',
      render(row: OfferListInterface) {
        return h(resolveComponent('ActionLoanActions'), {
          offer: row,
          class: 'whitespace-nowrap tracking-wide text-xs',
          size: 'small',
        });
      },
    },
  ];
};
const columns = createColumns();
</script>
