<template>
  <div class="mt-5 pb-12">
    <n-input
      v-model:value="comment"
      placeholder="Add comment"
      size="large"
      :disabled="!isConnected || commentLoading"
      :loading="commentLoading"
      :maxlength="600"
      @keyup.enter="addComment()"
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
    <div v-if="!loading && !comments.length" class="text-center mt-6 text-[14px] text-grey-lightest">No comments</div>

    <div v-else class="flex flex-col mt-6 gap-y-5">
      <template v-if="loading">
        <div v-for="i in 10" :key="i" class="flex">
          <n-skeleton height="32px" width="32px" class="rounded-full" />
          <n-skeleton height="68px" width="100%" class="rounded-[8px] ml-4" />
        </div>
      </template>
      <CommentCard v-for="commentItem of comments" v-else :key="commentItem.id" :comment="commentItem" />
    </div>
    <div v-if="!!comments.length && pagination.itemCount! > pagination.page! * pagination.pageSize" class="mt-4 flex">
      <button :disabled="loading" class="m-auto underline" @click="() => getComments(pagination.page! + 1)">
        Show More
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';
import { CommentEntityTypes } from '~/lib/types/comment';
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  entityId: { type: Number, required: true },
  entityType: { type: Number as PropType<CommentEntityTypes>, required: true },
});

const message = useMessage();
const { isConnected } = useAccount();

const comment = ref('');
const loading = ref(false);
const commentLoading = ref(false);
const comments = ref<any>([]);
const pagination = ref({ ...createPagination(), pageSize: 10 });

onMounted(async () => {
  await getComments();
});

async function getComments(page: number = 1) {
  loading.value = true;
  try {
    pagination.value.page = page;

    const res = await $api.get<GeneralItemsResponse<any>>(Endpoints.comments, {
      entityId: props.entityId,
      entityType: props.entityType,
      orderBy: ['id'],
      page,
      limit: pagination.value.pageSize,
      desc: [true],
    });

    comments.value = [...comments.value, ...res.data.items];
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
      entity_id: props.entityId,
      entityType: props.entityType,
      content: comment.value,
      ...(parentId ? { parent_comment_id: parentId } : {}),
    });

    comments.value = [res.data, ...comments.value];
    comment.value = '';
  } catch (error: any) {
    message.error(apiError(error));
  } finally {
    commentLoading.value = false;
  }
}
</script>
