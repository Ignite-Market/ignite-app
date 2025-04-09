<template>
  <n-dropdown
    v-if="show"
    v-model:show="showDropdown"
    trigger="click"
    :options="options"
    :size="'small'"
    placement="bottom-end"
    class="bg-grey-light"
  >
    <NuxtIcon class="text-white text-[12px] cursor-pointer hover:text-primary-bright" name="icon/more" />
  </n-dropdown>

  <modal v-model:show="showDeleteModal" class="w-[320px] border-none" :mask-closable="!loadingDelete">
    <div class="flex flex-col">
      <div class="flex w-full items-center justify-center mb-3">
        <NuxtIcon name="icon/warn" class="text-primary text-[40px]" />
      </div>

      <div class="flex items-center justify-center text-[16px] leading-[20px] font-bold">Delete proposal</div>
      <div class="text-center text-[14px] leading-[16px] mt-6 mb-4">Are you sure you want to delete this proposal?</div>

      <div class="flex gap-x-4">
        <BasicButton
          class="w-full mt-3"
          type="secondary"
          size="large"
          :disabled="loadingDelete"
          @click="showDeleteModal = false"
        >
          Cancel
        </BasicButton>
        <BasicButton class="w-full mt-3" size="large" :loading="loadingDelete" @click="deleteProposal">
          Yes
        </BasicButton>
      </div>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { ProposalRoundStatus, type Proposal, type ProposalRound } from '~/lib/types/proposal';
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  proposal: { type: Object as PropType<Proposal>, default: () => {}, required: true },
  round: { type: Object as PropType<ProposalRound>, default: () => {}, required: true },
});

const emit = defineEmits(['delete']);

const message = useMessage();
const userStore = useUserStore();
const router = useRouter();

const showDropdown = ref(false);
const showDeleteModal = ref(false);
const loadingDelete = ref(false);
const show = ref(true);

const options = ref<any[]>([]);

onMounted(() => {
  if (userStore.user.id !== props.proposal.user_id) {
    options.value = [
      {
        key: 'report',
        type: 'render',
        disabled: true,
        props: {
          onClick: () => {
            message.success('Proposal reported.');
            showDropdown.value = false;
          },
        },
        render: () => {
          return h(
            'div',
            {
              class:
                'flex items-center gap-1 px-2 text-[14px] cursor-pointer hover:text-primary-bright justify-start py-1 text-white/80',
            },
            [
              h(resolveComponent('NuxtIcon'), {
                name: 'icon/flag',
                class: 'text-[15px]',
              }),
              'Report',
            ]
          );
        },
      },
    ];
  } else {
    options.value = [
      {
        key: 'delete',
        type: 'render',
        props: {
          onClick: () => {
            showDeleteModal.value = true;
            showDropdown.value = false;
          },
        },
        render: () => {
          return h(
            'div',
            {
              class:
                'flex items-center gap-1 px-2 text-[14px] cursor-pointer hover:text-primary-bright justify-start py-1 text-white/80',
            },
            [
              h(resolveComponent('NuxtIcon'), {
                name: 'icon/trash',
                class: 'text-[15px]',
              }),
              'Delete',
            ]
          );
        },
      },
    ];

    if (props.round.roundStatus === ProposalRoundStatus.ACTIVE && props.proposal.totalVotes === 0) {
      options.value.push({
        key: 'edit',
        type: 'render',
        props: {
          onClick: () => {
            showDropdown.value = false;

            router.push({
              name: 'proposals-id-edit',
              params: { id: props.proposal.id },
            });
          },
        },
        render: () => {
          return h(
            'div',
            {
              class:
                'flex items-center gap-1 px-2 text-[14px] cursor-pointer hover:text-primary-bright justify-start py-1 text-white/80',
            },
            [
              h(resolveComponent('NuxtIcon'), {
                name: 'icon/edit',
                class: 'text-[15px]',
              }),
              'Edit',
            ]
          );
        },
      });
    }
  }
});

async function deleteProposal() {
  loadingDelete.value = true;

  try {
    await $api.delete<GeneralResponse<any>>(Endpoints.proposalById(props.proposal.id));

    showDeleteModal.value = false;
    emit('delete');

    message.success('Proposal deleted.');
  } catch (error) {
    message.error('Error while deleting proposal. Please try again.');
  } finally {
    loadingDelete.value = false;
  }
}
</script>

<style scoped></style>
