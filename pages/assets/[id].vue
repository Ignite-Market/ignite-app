<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <BtnBack to="/assets" />
    </template>

    <div class="flex gap-4">
      <CardNft v-if="asset" :nft="nft" class="max-w-xl" />
      <Card class="w-full">
        <h2 class="mb-2">RWA Providers</h2>
        <p>
          <NuxtIcon name="icon/verified" class="float-left text-lg text-green mt-[2px] mr-1" />
          Verified by ...
        </p>
      </Card>
    </div>

    <!-- <Card v-if="asset" title="Get a Loan">
      <FormOfferRequest :nft="nft" />
      <template #additional>
        <div class="flex items-end">
        </div>
      </template>
    </Card> -->

    <TableOfferRequest :store="offerRequestStore" />
    <TableOffer :store="offerStore" />
  </Dashboard>
</template>

<script lang="ts" setup>
import type { AssetInterface, NFT } from '~/lib/types/asset';

const { t } = useI18n();
const { params } = useRoute();
const router = useRouter();
const { parseAssetToNft } = useNft();
const assetStore = useAssetStore();
const offerStore = useOfferStore();
const offerRequestStore = useOfferRequestStore();

const pageLoading = ref<boolean>(true);
const asset = ref<AssetInterface | null>();
const nft = ref<NFT>();

onMounted(async () => {
  await sleep(10);

  try {
    asset.value = await assetStore.getAsset(Number(params?.id));

    if (asset.value?.id) {
      nft.value = await parseAssetToNft(asset.value);

      offerStore.resetFilters();
      await offerStore.fetch({ asset_id: asset.value.id });

      offerRequestStore.resetFilters();
      await offerRequestStore.fetch({ asset_id: asset.value.id });
    } else {
      router.push({ name: 'assets' });
    }
  } catch (e) {
    console.error(e);
    router.push({ name: 'assets' });
  }

  pageLoading.value = false;
});
</script>
