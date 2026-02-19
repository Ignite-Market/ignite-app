<template>
  <Modal
    v-model:show="isOpen"
    display-directive="show"
    size="large"
    class="!bg-grey-dark border-none"
    title="Generate social post"
    @update:show="onModalUpdate"
  >
    <div class="p-4 flex flex-col gap-4">
      <div class="text-white/80 text-sm">
        Step {{ step }} of 2 – generate the image first, then upload and choose where to post.
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1">
          <div class="text-white font-semibold mb-2">Image Preview</div>
          <div
            class="border border-grey-lighter rounded-lg bg-grey-light flex items-center justify-center min-h-[260px] overflow-hidden p-2"
          >
            <img v-if="previewUrl" :src="previewUrl" alt="Generated preview" class="max-h-[320px] rounded-lg" />
            <div v-else class="text-grey-lightest text-sm">Generate to see a preview</div>
          </div>
          <div class="flex gap-3 mt-4 flex-wrap">
            <BasicButton
              v-if="step === 1"
              type="secondary"
              :loading="generating"
              :disabled="!prediction || !!uploadedUrl"
              @click="generateImage"
            >
              {{ previewUrl ? 'Regenerate' : 'Generate' }}
            </BasicButton>

            <template v-if="step === 1">
              <BasicButton type="primary" :loading="uploading" :disabled="uploading" @click="uploadImage">
                Next (upload)
              </BasicButton>
            </template>
            <template v-else>
              <div class="w-full">
                <p class="text-white/80 text-sm mb-2">Select where to post</p>
                <n-select
                  v-model:value="selectedMedia"
                  :options="mediaOptions"
                  size="large"
                  class="min-w-[200px] max-w-[320px] mb-4"
                  placeholder="Select destinations"
                  multiple
                />
                <p class="text-white/80 text-sm mb-2">Message</p>
                <n-input
                  v-model:value="messageText"
                  type="textarea"
                  placeholder="Message"
                  class="w-full mb-4"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                />
              </div>
              <BasicButton
                type="primary"
                :loading="sending"
                :disabled="!messageText || !selectedMedia?.length"
                @click="sendPost"
              >
                Post
              </BasicButton>
            </template>

            <BasicButton type="secondary" ghost @click="closeModal">Cancel</BasicButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Offscreen render target for generating the preview -->
    <div class="absolute -left-[9999px] top-0" aria-hidden="true">
      <div ref="captureRef" class="w-[360px]">
        <PredictionSetCard v-if="prediction" :prediction-set="prediction" :is-screenshot="true" />
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { toPng } from 'html-to-image';
import type { PredictionSetInterface } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';
import { uploadDataUrlToS3 } from '~/lib/utils/upload';

const message = useMessage();
const config = useRuntimeConfig();
const isOpen = ref(false);
const prediction = ref<PredictionSetInterface | null>(null);
const previewUrl = ref('');
const dataUrl = ref('');
const uploadedUrl = ref('');
const generating = ref(false);
const uploading = ref(false);
const sending = ref(false);
const captureRef = ref<HTMLElement | null>(null);
const step = ref(1);
const selectedMedia = ref<Array<'x' | 'discord'>>(['x', 'discord']);
const messageText = ref('');
const mediaOptions = [
  { label: 'X', value: 'x' },
  { label: 'Discord', value: 'discord' },
];

interface PostResponse {
  x?: { success: boolean; tweetId?: string; error?: string };
  discord?: { success: boolean; error?: string };
}

const emit = defineEmits(['sent']);

function onModalUpdate(show: boolean) {
  if (!show) {
    closeModal();
  }
}

async function generateImage(allowStrip = true) {
  if (!captureRef.value || !prediction.value) {
    console.log('no captureRef or prediction');
    return;
  }
  generating.value = true;
  uploadedUrl.value = '';
  step.value = 1;
  const restore = prepareImages(captureRef.value);
  try {
    await nextTick();
    await waitForImages(captureRef.value);
    const generated = await toPng(captureRef.value, {
      cacheBust: true,
      pixelRatio: 2,
    });
    previewUrl.value = generated;
    dataUrl.value = generated;
  } catch (error) {
    restore();
    if (allowStrip && stripExternalImages(captureRef.value)) {
      // Retry once with external images replaced by placeholder to avoid CORS taint.
      return generateImage(false);
    }
    console.error('Failed to generate image', error);
    message.error('Failed to generate preview image (CORS).');
  } finally {
    restore();
    generating.value = false;
  }
}

async function uploadImage() {
  if (!prediction.value) return;
  if (!dataUrl.value) {
    uploadedUrl.value = '';
    step.value = 2;
    return;
  }
  uploading.value = true;
  try {
    const fileName = `prediction-${prediction.value.id}-${Date.now()}.png`;
    uploadedUrl.value = await uploadDataUrlToS3(dataUrl.value, 'prediction-cards', fileName);
    console.log('uploadedUrl', uploadedUrl.value);
    previewUrl.value = uploadedUrl.value;
    step.value = 2;
  } catch (error) {
    console.error('Failed to upload image', error);
    message.error('Failed to upload image.');
  } finally {
    uploading.value = false;
  }
}

async function sendPost() {
  if (!messageText.value) {
    message.error('Message is required.');
    return;
  }
  if (!selectedMedia.value?.length) {
    message.error('Select where to post.');
    return;
  }
  sending.value = true;
  try {
    const payload = {
      message: messageText.value,
      imgLink: uploadedUrl.value || undefined,
      socialMedias: selectedMedia.value.map(m => m.toLowerCase()),
    };
    const res = await $api.post<PostResponse>(Endpoints.predictionSetsSocialPost, payload);

    const summaries: string[] = [];
    if (res?.x) {
      summaries.push(
        res.x.success
          ? `X: success${res.x.tweetId ? ` (id ${res.x.tweetId})` : ''}`
          : `X: failed${res.x.error ? ` - ${res.x.error}` : ''}`
      );
    }
    if (res?.discord) {
      summaries.push(
        res.discord.success
          ? 'Discord: success'
          : `Discord: failed${res.discord.error ? ` - ${res.discord.error}` : ''}`
      );
    }
    if (summaries.length) {
      message.info(summaries.join(' | '));
    }
    message.success('Post request sent.');
    emit('sent');
    // closeModal();
  } catch (error) {
    console.error('Failed to send post', error);
    message.error('Failed to send post.');
  } finally {
    sending.value = false;
  }
}

function closeModal() {
  isOpen.value = false;
  previewUrl.value = '';
  dataUrl.value = '';
  uploadedUrl.value = '';
  prediction.value = null;
  step.value = 1;
  selectedMedia.value = ['x', 'discord'];
  messageText.value = '';
}

function getQuestionUrl(pred: PredictionSetInterface): string {
  const base = (config.public.url as string) || '';
  if (!base) return '';
  return `${base.replace(/\/$/, '')}/markets/${pred.id}`;
}

function openModal(pred: PredictionSetInterface) {
  const changed = !prediction.value || prediction.value?.id !== pred.id;

  if (changed) {
    previewUrl.value = '';
    dataUrl.value = '';
    uploadedUrl.value = '';
    step.value = 1;
    selectedMedia.value = ['x', 'discord'];
    const questionUrl = getQuestionUrl(pred);
    messageText.value =
      'New market is up on IgniteMarket 🚀' + '\n\n' + (pred.question || '') + (questionUrl ? `\n${questionUrl}` : '');
  }
  prediction.value = pred;
  isOpen.value = true;
  if (!dataUrl.value || !previewUrl.value) {
    // generate initial preview after component renders
    nextTick(() => generateImage());
  }
}

defineExpose({
  openModal,
  closeModal,
});

async function waitForImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll('img'));
  await Promise.all(
    images.map(
      img =>
        new Promise<void>(resolve => {
          if (img.complete && img.naturalWidth !== 0) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

function prepareImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll('img'));
  const originals: Array<{ img: HTMLImageElement; src: string; crossOrigin: string | null }> = [];

  images.forEach(img => {
    const src = img.getAttribute('src') || '';
    if (!src) return;
    originals.push({ img, src, crossOrigin: img.getAttribute('crossorigin') });
    img.setAttribute('crossorigin', 'anonymous');
  });

  return () => {
    originals.forEach(({ img, src, crossOrigin }) => {
      img.setAttribute('src', src);
      if (crossOrigin === null) {
        img.removeAttribute('crossorigin');
      } else {
        img.setAttribute('crossorigin', crossOrigin);
      }
    });
  };
}

function stripExternalImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll('img'));
  let stripped = false;
  images.forEach(img => {
    const src = img.getAttribute('src') || '';
    const isExternal = /^https?:\/\//i.test(src) && !src.startsWith(window.location.origin);
    if (isExternal) {
      img.setAttribute('src', PLACEHOLDER_IMAGE);
      stripped = true;
    }
  });
  return stripped;
}

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220"><rect width="100%" height="100%" fill="%23252525"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23555555" font-size="14">Image unavailable (CORS)</text></svg>';
</script>
