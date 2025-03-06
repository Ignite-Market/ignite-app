<template>
  <div class="mt-5 pb-[33vh]">
    <n-input
      placeholder="Add comment"
      size="large"
      v-model:value="comment"
      :disabled="!isConnected || commentLoading"
      :loading="commentLoading"
      @keyup.enter="addComment()"
      :maxlength="600"
    >
      <template #suffix>
        <NuxtIcon
          v-if="!commentLoading"
          class="text-white text-[20px] cursor-pointer"
          :class="{ '!cursor-default': !comment, '!opacity-70': !comment, 'hover:text-primary-bright': comment }"
          name="icon/send"
          @click="addComment()"
        />
      </template>
    </n-input>
    <div v-if="!loading && !comments.length" class="text-center mt-6">No comments</div>

    <div v-else class="flex flex-col mt-6 gap-y-5">
      <PredictionSetComment :comment="comment" v-for="comment of comments"></PredictionSetComment>
    </div>
    <div v-if="!!comments.length && pagination.itemCount! > pagination.page! * pagination.pageSize" class="mt-4 flex">
      <BasicButton :disabled="loading" @click="() => getComments(pagination.page! + 1)" class="m-auto"
        >Show More</BasicButton
      >
    </div>
    <div v-if="loading">
      <Spinner />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  predictionSetId: { type: Number, required: true },
});

const comment = ref('');
const loading = ref(false);
const commentLoading = ref(false);

const comments = ref<any>([]);

const { isConnected } = useAccount();

const pagination = ref({ ...createPagination(), pageSize: 10 });

onMounted(async () => {
  await getComments();
});

async function getComments(page: number = 1) {
  loading.value = true;
  try {
    pagination.value.page = page;
    const res = await $api.get<GeneralItemsResponse<any>>(Endpoints.predictionSetComments(props.predictionSetId), {
      orderBy: ['id'],
      page,
      limit: pagination.value.pageSize,
      desc: [true],
    });

    comments.value = res.data.items;
    pagination.value.itemCount = res.data.total;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

// TODO: Hide replies, infinite scrolling.

async function addComment(parentId: number = 0) {
  if (!comment.value) {
    return;
  }

  commentLoading.value = true;
  try {
    const res = await $api.post<GeneralResponse<any>>(Endpoints.comments, {
      prediction_set_id: props.predictionSetId,
      content: comment.value,
      ...(parentId ? { parent_comment_id: parentId } : {}),
    });

    comments.value = [res.data, ...comments.value];
    comment.value = '';
  } catch (error) {
    console.log(error);
  } finally {
    commentLoading.value = false;
  }
}
</script>
