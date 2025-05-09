<template>
  <Dashboard :loading="loading">
    <div class="px-4 max-w-[1241px] m-auto">
      <!-- HEADER -->
      <div class="flex mb-10 justify-between flex-wrap gap-4 relative">
        <Btn
          class="left-[-72px] absolute"
          btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
          type="link"
          @click="router.back()"
        >
          <NuxtIcon name="icon/arrow-back" class="text-[24px]" />
        </Btn>

        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="flex flex-col">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">Edit your proposal</div>
            <div class="flex mt-4 items-center">
              <div class="text-white/80 text-[14px] leading-[20px]">
                You can only make changes while the voting round is still active and your proposal is without votes.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="flex flex-col-reverse md:flex-row justify-center">
        <!-- LEFT -->
        <div class="flex flex-col min-w-[250px] max-w-[736px] w-full">
          <div class="border-1 border-grey-lighter rounded-lg p-6 w-full">
            <n-form ref="formRef" :model="form" :rules="rules" @submit.prevent="submit">
              <n-form-item path="question" label="Market question" class="mb-3">
                <n-input v-model:value="form.question" placeholder="Market question" size="large" />
              </n-form-item>

              <n-form-item path="outcomes" label="Market outcomes" class="mb-3">
                <n-dynamic-tags
                  v-model:value="form.outcomes"
                  size="large"
                  class="rounded-lg [&_.n-tag]:border-1 [&_.n-tag]:border-grey-lighter [&_.n-tag]:rounded-[8px] [&_.n-tag]:px-4 [&_.n-tag]:py-2 [&_.n-tag]:h-[40px] [&_.n-tag]:flex [&_.n-tag]:items-center [&_.n-button]:h-[40px] [&_.n-button]:px-4 [&_.n-button]:py-2 [&_.n-button]:rounded-[8px] [&_.n-button]:!bg-transparent [&_.n-button]:hover:!bg-grey-light/10"
                />
              </n-form-item>

              <n-form-item path="generalResolutionDef" label="Market description" class="mb-3">
                <n-input
                  v-model:value="form.generalResolutionDef"
                  type="textarea"
                  placeholder="Describe the market and how the outcome will be determined..."
                  :autosize="{ minRows: 5, maxRows: 10 }"
                  size="large"
                />
              </n-form-item>

              <div class="flex">
                <BasicButton
                  :btn-class="['!font-bold']"
                  :size="'large'"
                  :disabled="!loggedIn"
                  :loading="proposalLoading"
                >
                  Save Changes
                </BasicButton>
              </div>
            </n-form>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px] mb-6">
          <div class="border-1 border-grey-lighter rounded-lg p-6">
            <div class="font-medium leading-[20px] mb-6 text-white/80">
              <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Submission Guidelines:</h3>
              <ul class="list-disc pl-5 mb-4 text-white/80 text-[14px]">
                <li class="mb-0.5">
                  Clearly define your market question (e.g., "Will Bitcoin reach $100k by end of 2024?")
                </li>
                <li class="mb-0.5">
                  Specify possible outcomes (typically binary Yes/No, but can include multiple options)
                </li>
                <li class="mb-0.5">
                  Describe the market and provide resolution criteria - how will the outcome be determined and from
                  which sources can the outcome be verified?
                </li>
              </ul>

              <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Selection Process:</h3>
              <p class="mb-4 text-white/80 text-[14px]">
                Each round lasts one week. The community votes on proposals, and the proposal with the most votes will
                be selected and implemented as an official market. The creator will receive a predefined number of
                points as a reward!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { type FormRules } from 'naive-ui';
import type { ProposalResponse } from '~/lib/types/proposal';
import Endpoints from '~/lib/values/endpoints';

const { loggedIn } = useLoggedIn();
const { params } = useRoute();
const router = useRouter();
const userStore = useUserStore();
const message = useMessage();
const formRef = ref();

const proposalId = ref(0);
const loading = ref(true);
const proposalLoading = ref(false);

const form = ref({
  question: '',
  outcomes: [] as any,
  generalResolutionDef: '',
});

const rules: FormRules = {
  question: {
    required: true,
    message: 'Please enter market question.',
  },
  outcomes: {
    required: true,
    message: 'Please specify at least two outcomes.',
    validator: () => {
      return form.value.outcomes.length >= 2;
    },
  },
  generalResolutionDef: {
    required: true,
    message: 'Please provide market description and resolution criteria.',
  },
};

onMounted(async () => {
  proposalId.value = Number(params?.id);
  if (!proposalId.value) {
    router.back();
  }

  await sleep(10);
  await getProposal();
});

async function getProposal() {
  try {
    const res = await $api.get<ProposalResponse>(Endpoints.proposalById(proposalId.value));

    form.value = {
      question: res.data.question,
      outcomes: res.data.outcomes,
      generalResolutionDef: res.data.generalResolutionDef,
    };

    if (res.data.user_id !== userStore.user.id) {
      router.push({
        name: 'proposals-id',
        params: { id: proposalId.value },
      });
    }
  } catch (error) {
    message.error(apiError(error));
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!loggedIn.value) {
    return;
  }

  try {
    await formRef.value?.validate();
  } catch (errors) {
    return;
  }

  proposalLoading.value = true;
  try {
    await $api.patch(Endpoints.proposalById(proposalId.value), {
      question: form.value.question,
      outcomes: form.value.outcomes,
      generalResolutionDef: form.value.generalResolutionDef,
    });

    message.success('Proposal updated successfully.');
    router.push({
      name: 'proposals-id',
      params: { id: proposalId.value },
    });
  } catch (error) {
    message.error(apiError(error));
  } finally {
    proposalLoading.value = false;
  }
}
</script>
