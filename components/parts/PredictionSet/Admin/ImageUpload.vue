<template>
  <div class="w-full">
    <div>
      <n-auto-complete
        :value="selectedImage"
        placeholder="Enter existing image name or a custom image url"
        class="w-full"
        :options="imageOptions"
        :render-option="renderImageLabel"
        :show-empty="!selectedImage?.startsWith('http')"
        @update:value="value => (selectedImage = value)"
      >
        <template #suffix>
          <div>
            <BasicButton type="secondary" size="small" @click.stop.prevent="showModal = true">Upload</BasicButton>
          </div>
        </template>

        <template #empty>
          <div class="text-center text-grey-darker text-grey-lightest">No images found</div>
        </template>
      </n-auto-complete>
    </div>
  </div>
  <Modal v-model:show="showModal" title="Upload new image" :show-close-button="false">
    <n-upload
      ref="uploadRef"
      directory-dnd
      :max="1"
      accept="image/*"
      list-type="image"
      :default-upload="false"
      :custom-request="customUpload"
      @change="handleChange"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <NuxtIcon name="icon/archive" />
          </n-icon>
        </div>
        <n-text style="font-size: 16px"> Click or drag an image to this area to upload </n-text>
      </n-upload-dragger>
    </n-upload>
    <BasicButton type="primary" class="mt-4" :disabled="!file" @click="startUpload">Upload</BasicButton>
  </Modal>
</template>

<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  defaultValue: { type: String, default: undefined },
  folder: { type: String, default: '' },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
}>();

const selectedImage = ref<string | undefined>(props.defaultValue || undefined);
const showModal = ref(false);
const uploadRef = ref<any | null>(null);
const file = ref<File | null | undefined>(null);

const isExistingImage = computed(() =>
  images.value.some(image => image.key === 'upload/' + props.folder + '/' + selectedImage.value)
);

const { images, fetchImages, getFileName } = useS3Images();

// S3 bucket URL
const S3_BUCKET_URL = 'https://ignite-market-images.s3.amazonaws.com/';
const IMAGE_URL = 'https://images.ignitemarket.xyz/upload/' + props.folder + '/';

watch(
  () => props.defaultValue,
  () => {
    if (props.defaultValue) {
      selectedImage.value = props.defaultValue;
    }
  }
);

watch(selectedImage, () => {
  if (selectedImage.value?.startsWith('http')) {
    emit('update:modelValue', selectedImage.value);
  } else if (selectedImage.value && isExistingImage.value) {
    emit('update:modelValue', IMAGE_URL + selectedImage.value);
  } else {
    emit('update:modelValue', null);
  }
});

const imageOptions = computed(() => {
  const options = images.value
    .map(image => ({
      label: getFileName(image.key),
      value: image.key,
      type: 'image',
    }))
    .filter(x => x.label.includes(selectedImage.value || ''));
  return options;
});

// Render image label for the select component
function renderImageLabel(data: {
  node: VNode;
  option: { type: string; label: string; value: string };
  selected: boolean;
}) {
  return h(
    'div',
    {
      class: 'flex items-center gap-2 p-1 hover:bg-grey-lightest/20 m-1 rounded cursor-pointer',
      onClick: () => {
        selectedImage.value = data.option.label;
      },
    },
    [
      h('img', {
        src: IMAGE_URL + data.option.label,
        alt: data.option.label,
        class: 'w-12 h-12 min-w-12 min-h-12 object-cover rounded',
      }),
      h(
        'div',
        {
          class: 'text-sm',
        },
        data.option.label
      ),
    ]
  );
}

function handleChange(data: { fileList: UploadFileInfo[] }) {
  file.value = data.fileList[0].file;
}

async function uploadFile(file: File, onUrlCreated?: () => void) {
  if (!file) return;

  const res = await $api.post<any>(Endpoints.imageUpload, { fileName: props.folder + '/' + file.name });
  onUrlCreated?.();
  await fetch(res.data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
}

async function customUpload({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) {
  // const formData = new FormData();
  // if (data) {
  //   Object.keys(data).forEach(key => {
  //     formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
  //   });
  // }
  // formData.append(file.name, file.file as File);

  if (!file.file) return;
  try {
    await uploadFile(file.file, () => onProgress({ percent: 50 }));
    onFinish();
    refreshImages();
    selectedImage.value = file.file.name;
    await sleep(500);
    emit('update:modelValue', IMAGE_URL + selectedImage.value);
    showModal.value = false;
  } catch (error) {
    onError();
  }
}

function startUpload() {
  console.log('startUpload');
  uploadRef.value?.submit();
}

async function refreshImages() {
  await fetchImages(S3_BUCKET_URL, `upload/${props.folder}`);
}

// Load images when component mounts
onMounted(() => {
  refreshImages();
});
</script>
