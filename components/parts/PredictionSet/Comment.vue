<template>
  <div class="flex flex-row w-full max-w-[99%] flex-grow">
    <jazzicon
      class="cursor-pointer rounded-[50%] w-[32px] h-[32px] flex-shrink-0"
      :address="comment.walletAddress"
      :diameter="32"
      @click="openUserProfile(comment.user_id)"
    />

    <div class="flex flex-col ml-4 flex-grow">
      <div class="flex relative">
        <div
          class="text-[12px] leading-[16px] text-white/80 font-medium cursor-pointer hover:text-primary-bright"
          @click="openUserProfile(comment.user_id)"
        >
          {{ comment.username }}
        </div>
        <div class="ml-[10px] text-[12px] leading-[16px] text-grey-lightest font-medium">
          {{ formatDistanceToNow(new Date(comment.createTime), { addSuffix: true }) }}
        </div>
        <div v-if="isConnected" class="ml-auto">
          <PredictionSetCommentOptions
            :comment="comment"
            @delete="(deletedComment: any) => handleDelete(comment, deletedComment)"
          />
        </div>
      </div>

      <div
        class="text-[12px] leading-[16px] text-white font-medium mt-[10px] w-[100%] break-all pr-4"
        :class="{ 'text-white/60': comment.status === SqlModelStatus.DELETED }"
      >
        {{ comment.content }}
      </div>

      <div
        class="mt-[10px] text-[12px] leading-[16px] text-grey-lightest font-medium cursor-pointer hover:opacity-80 w-fit"
        @click="handleFirstLvlReply"
      >
        Reply
      </div>

      <div v-if="showReply" class="my-[10px] w-full">
        <n-input
          ref="firstReplyRef"
          v-model:value="firstReply"
          placeholder="Add comment"
          size="medium"
          :disabled="!isConnected || replyLoading"
          :loading="replyLoading"
          class="text-[12px]"
          :maxlength="600"
          @keyup.enter="addReply(firstReply)"
        >
          <template #prefix>
            <div class="text-[12px] text-primary-light">{{ replyPrefix }}</div>
          </template>

          <template #suffix>
            <NuxtIcon
              v-if="!replyLoading"
              class="text-white text-[20px] cursor-pointer"
              :class="{
                '!cursor-default': !firstReply,
                '!opacity-70': !firstReply,
                'hover:text-primary-bright': firstReply,
              }"
              name="icon/send"
              @click="addReply(firstReply)"
            />
          </template>
        </n-input>
      </div>

      <div v-for="replyComment of comment.replies" :key="replyComment.id" class="mt-[10px] w-full">
        <div class="flex flex-row w-full">
          <jazzicon
            class="cursor-pointer rounded-[50%] w-[32px] h-[32px] flex-shrink-0"
            :address="replyComment.walletAddress"
            :diameter="32"
            @click="openUserProfile(replyComment.user_id)"
          />

          <div class="flex flex-col ml-4 flex-grow w-full">
            <div class="flex w-full">
              <div
                class="text-[12px] leading-[16px] text-white/80 font-medium cursor-pointer hover:text-primary-bright"
                @click="openUserProfile(replyComment.user_id)"
              >
                {{ replyComment.username }}
              </div>
              <div class="ml-[10px] text-[12px] leading-[16px] text-grey-lightest font-medium">
                {{ formatDistanceToNow(new Date(replyComment.createTime), { addSuffix: true }) }}
              </div>
              <div class="ml-auto">
                <PredictionSetCommentOptions
                  :comment="replyComment"
                  @delete="(deletedComment: any) => handleDelete(replyComment, deletedComment)"
                />
              </div>
            </div>

            <div
              class="text-[12px] leading-[16px] text-white font-medium mt-[10px] w-full break-all pr-4"
              :class="{ 'text-white/60': replyComment.status === SqlModelStatus.DELETED }"
            >
              <span
                v-if="replyComment.status !== SqlModelStatus.DELETED"
                class="text-primary-light hover:text-primary-bright cursor-pointer"
                @click="openUserProfile(replyComment.reply_user_id)"
              >
                @{{ replyComment.taggedUserUsername }}&nbsp;
              </span>
              {{ replyComment.content }}
            </div>

            <div
              class="mt-[10px] text-[12px] leading-[16px] text-grey-lightest font-medium cursor-pointer hover:opacity-80 w-fit"
              @click="handleSecondLvlReply(replyComment)"
            >
              Reply
            </div>

            <div v-if="replyTo === replyComment.id" class="my-[10px] w-full">
              <n-input
                :ref="el => (secondReplyRefs[replyComment.id] = el as any)"
                v-model:value="secondReply"
                placeholder="Add comment"
                size="medium"
                :disabled="!isConnected || replyLoading"
                :loading="replyLoading"
                class="text-[12px]"
                :maxlength="600"
                @keyup.enter="addReply(secondReply)"
              >
                <template #prefix>
                  <div class="text-[12px] text-primary-light">{{ replyPrefix }}</div>
                </template>

                <template #suffix>
                  <NuxtIcon
                    v-if="!replyLoading"
                    class="text-white text-[20px] cursor-pointer"
                    :class="{
                      '!cursor-default': !secondReply,
                      '!opacity-70': !secondReply,
                      'hover:text-primary-bright': secondReply,
                    }"
                    name="icon/send"
                    @click="addReply(secondReply)"
                  />
                </template>
              </n-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns';
import { useAccount } from '@wagmi/vue';
import type { InputInst } from 'naive-ui';
import type { CommentInterface } from '~/lib/types/prediction-set';
import { SqlModelStatus } from '~/lib/types';
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  comment: { type: Object as PropType<CommentInterface>, default: () => {}, required: true },
});

const { isConnected } = useAccount();
const router = useRouter();
const userStore = useUserStore();

const firstReply = ref('');
const secondReply = ref('');

const replyLoading = ref(false);

const showReply = ref(false);
const replyTo = ref<any>(null);
const replyPrefix = ref('');
const taggedUser = ref();

const firstReplyRef = ref<InputInst | null>(null);
const secondReplyRefs = ref<Record<string, InputInst>>({});

async function addReply(replyContent: string) {
  if (!replyContent) {
    return;
  }

  replyLoading.value = true;
  try {
    const parentId = props.comment.parent_comment_id ? props.comment.parent_comment_id : props.comment.id;

    const res = await $api.post<GeneralResponse<any>>(Endpoints.comments, {
      prediction_set_id: props.comment.prediction_set_id,
      content: replyContent,
      parent_comment_id: parentId,
      reply_user_id: taggedUser.value,
    });

    // eslint-disable-next-line vue/no-mutating-props
    props.comment.replies = [...(props.comment.replies || []), res.data];

    replyTo.value = null;
    showReply.value = false;

    firstReply.value = '';
    secondReply.value = '';
  } catch (error) {
    console.log(error);
  } finally {
    replyLoading.value = false;
  }
}

function handleFirstLvlReply() {
  firstReply.value = '';
  secondReply.value = '';

  replyTo.value = null;
  showReply.value = !showReply.value;
  replyPrefix.value = `@${props.comment.username}`;
  taggedUser.value = props.comment.user_id;

  if (showReply.value) {
    nextTick(() => {
      firstReplyRef.value?.focus();
    });
  }
}

function handleSecondLvlReply(replyComment: CommentInterface) {
  firstReply.value = '';
  secondReply.value = '';

  showReply.value = false;
  replyTo.value = replyTo.value === replyComment.id && replyTo.value ? null : replyComment.id;
  replyPrefix.value = `@${replyComment.username}`;
  taggedUser.value = replyComment.user_id;

  if (replyTo.value) {
    nextTick(() => {
      secondReplyRefs.value[replyComment.id]?.focus();
    });
  }
}

function openUserProfile(userId: number) {
  if (userId === userStore.user.id) {
    router.push('/profile');
    return;
  }

  router.push({
    name: 'profile-id',
    params: { id: userId },
  });
}

function handleDelete(comment: CommentInterface, deletedComment: any) {
  comment.content = deletedComment.content;
  comment.status = deletedComment.status;
}
</script>

<style scoped></style>
