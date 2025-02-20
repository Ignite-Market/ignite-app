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

    <div class="flex flex-col mt-6 gap-y-5">
      <PredictionSetComment :comment="comment" v-for="comment of comments"></PredictionSetComment>
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

onMounted(async () => {
  await getComments();
});

async function getComments() {
  loading.value = true;
  try {
    const res = await $api.get<GeneralItemsResponse<any>>(Endpoints.predictionSetComments(props.predictionSetId), {
      orderBy: ['id'],
      desc: [true],
    });

    comments.value = res.data.items;

    console.log(comments.value);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = true;
  }
}

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
