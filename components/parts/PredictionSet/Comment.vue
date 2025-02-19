<template>
  <div class="flex flex-row w-full">
    <jazzicon
      class="cursor-pointer rounded-[50%] w-[32px] h-[32px] flex-shrink-0"
      :address="comment.walletAddress"
      :diameter="32"
    />

    <div class="flex flex-col ml-4 flex-grow w-full">
      <div class="flex">
        <div class="text-[12px] leading-[16px] text-white/80 font-medium cursor-pointer hover:text-primary-bright">
          {{ comment.username }}
        </div>
        <div class="ml-[10px] text-[12px] leading-[16px] text-grey-lightest font-medium">
          {{ formatDistanceToNow(new Date(comment.createTime), { addSuffix: true }) }}
        </div>
      </div>

      <div class="text-[12px] leading-[16px] text-white font-medium mt-[10px] w-[90%]">
        {{ comment.content }}
      </div>

      <div
        class="mt-[10px] text-[12px] leading-[16px] text-grey-lightest font-medium cursor-pointer hover:opacity-80 w-fit"
        @click="handleFirstLvlReply"
      >
        Reply
      </div>

      <div v-if="showReply" class="mt-[10px] w-full">
        <n-input
          placeholder="Add comment"
          size="medium"
          v-model:value="firstReply"
          :disabled="!isConnected"
          class="text-[12px]"
          ref="firstReplyRef"
        >
          <template #prefix>
            <div class="text-[12px] text-primary-light">{{ replyPrefix }}</div>
          </template>

          <template #suffix>
            <NuxtIcon
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

      <div v-for="replyComment of comment.replies" class="mt-[10px] w-full">
        <div class="flex flex-row w-full">
          <jazzicon
            class="cursor-pointer rounded-[50%] w-[32px] h-[32px] flex-shrink-0"
            :address="replyComment.walletAddress"
            :diameter="32"
          />

          <div class="flex flex-col ml-4 flex-grow w-full">
            <div class="flex w-full">
              <div
                class="text-[12px] leading-[16px] text-white/80 font-medium cursor-pointer hover:text-primary-bright"
              >
                {{ replyComment.username }}
              </div>
              <div class="ml-[10px] text-[12px] leading-[16px] text-grey-lightest font-medium">
                {{ formatDistanceToNow(new Date(replyComment.createTime), { addSuffix: true }) }}
              </div>
            </div>

            <div class="text-[12px] leading-[16px] text-white font-medium mt-[10px] w-full">
              {{ replyComment.content }}
            </div>

            <div
              class="mt-[10px] text-[12px] leading-[16px] text-grey-lightest font-medium cursor-pointer hover:opacity-80 w-fit"
              @click="handleSecondLvlReply(replyComment)"
            >
              Reply
            </div>

            <div v-if="replyTo === replyComment.id" class="mt-[10px] w-full">
              <n-input
                placeholder="Add comment"
                size="medium"
                v-model:value="secondReply"
                :disabled="!isConnected"
                class="text-[12px]"
                :ref="el => (secondReplyRefs[replyComment.id] = el as any)"
              >
                <template #prefix>
                  <div class="text-[12px] text-primary-light">{{ replyPrefix }}</div>
                </template>

                <template #suffix>
                  <NuxtIcon
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
import type { CommentInterface } from '~/lib/types/prediction-set';
import { formatDistanceToNow } from 'date-fns';
import { useAccount } from '@wagmi/vue';
import Endpoints from '~/lib/values/endpoints';
import type { InputInst } from 'naive-ui';

const props = defineProps({
  comment: { type: Object as PropType<CommentInterface>, default: {}, required: true },
});

const { isConnected } = useAccount();

const firstReply = ref('');
const secondReply = ref('');

const replyLoading = ref(false);
const showReply = ref(false);
const replyTo = ref<any>(null);
const replyPrefix = ref('');

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
    });

    replyTo.value = null;
    showReply.value = false;

    firstReply.value = '';
    secondReply.value = '';
  } catch (error) {
    console.log(error);
  } finally {
    replyLoading.value = true;
  }
}

// async function addReply1(replyContent: string) {
//   if (!reply.value) {
//     return;
//   }

//   replyLoading.value = true;
//   try {
//     const parentId = props.comment.parent_comment_id ? props.comment.parent_comment_id : props.comment.id;

//     const res = await $api.post<GeneralResponse<any>>(Endpoints.comments, {
//       prediction_set_id: props.comment.prediction_set_id,
//       content: reply.value,
//       parent_comment_id: parentId,
//     });

//     reply.value = '';
//     showReply.value = false;
//   } catch (error) {
//     console.log(error);
//   } finally {
//     replyLoading.value = true;
//   }
// }

function handleFirstLvlReply() {
  firstReply.value = '';
  secondReply.value = '';

  replyTo.value = null;
  showReply.value = !showReply.value;
  replyPrefix.value = `@${props.comment.username}`;

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

  if (replyTo.value) {
    nextTick(() => {
      secondReplyRefs.value[replyComment.id]?.focus();
    });
  }
}
</script>

<style scoped></style>
