<template>
  <Modal
    v-model:show="isOpen"
    display-directive="show"
    size="large"
    class="!bg-grey-dark border-none"
    :title="editId ? 'Edit Banner' : 'Add New Banner'"
    @update:show="onModalUpdate"
  >
    <div class="rounded-lg p-6 w-full">
      <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleSubmit">
        <n-form-item path="title" label="Title" class="mb-3">
          <n-input v-model:value="formData.title" placeholder="Enter banner title" :maxlength="255" size="large" />
        </n-form-item>

        <n-form-item path="description" label="Description" class="mb-3">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="Enter banner description"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :maxlength="500"
            size="large"
          />
        </n-form-item>

        <n-form-item path="button" label="Button Text" class="mb-3">
          <n-input v-model:value="formData.button" placeholder="Enter button text" :maxlength="50" size="large" />
        </n-form-item>

        <n-form-item path="imageUrl" label="Image URL" class="mb-3">
          <PredictionSetAdminImageUpload
            v-model:model-value="formData.imageUrl"
            :default-value="formData.imageUrl"
            folder="banners"
          />
        </n-form-item>

        <n-form-item path="prediction_set_id" label="Prediction Set ID" class="mb-3">
          <n-input-number
            v-model:value="formData.prediction_set_id"
            placeholder="Enter prediction set ID"
            :min="1"
            size="large"
          />
        </n-form-item>
        <div class="flex gap-4 mt-6">
          <BasicButton type="primary" :loading="loading" size="large" @click="handleSubmit">
            {{ editId ? 'Update Banner' : 'Create Banner' }}
          </BasicButton>
          <BasicButton type="secondary" size="large" @click="closeModal"> Cancel </BasicButton>
        </div>
      </n-form>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui';
import type { BannerInterface } from '~/lib/types/banner';
import Endpoints from '~/lib/values/endpoints';

const emit = defineEmits(['refresh', 'close']);

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const isOpen = ref(false);

const editId = ref<number | null>(null);

const formData = ref({
  title: '',
  description: '',
  button: '',
  imageUrl: '',
  prediction_set_id: null as number | null,
});

const rules: FormRules = {
  title: {
    required: true,
    message: 'Please enter a title',
    trigger: 'blur',
  },
  description: {
    required: true,
    message: 'Please enter a description',
    trigger: 'blur',
  },
  button: {
    required: false,
    message: 'Please enter button text',
    trigger: 'blur',
  },
  imageUrl: {
    required: true,
    message: 'Please select an image',
    trigger: 'blur',
  },
  prediction_set_id: {
    required: false,
    trigger: 'blur',
    validator: (_rule, value) => {
      if (value && value <= 0) {
        return new Error('Please enter a valid prediction set ID');
      }
      return true;
    },
  },
};

function resetForm() {
  formData.value = {
    title: '',
    description: '',
    button: '',
    imageUrl: '',
    prediction_set_id: null,
  };
}

function populateForm(banner: BannerInterface) {
  formData.value = {
    title: banner.title,
    description: banner.description,
    button: banner.button,
    imageUrl: banner.imageUrl,
    prediction_set_id: banner.prediction_set_id,
  };
}

function onModalUpdate(show: boolean) {
  if (!show) {
    closeModal();
  }
}

function closeModal() {
  isOpen.value = false;
  resetForm();
  emit('close');
}

async function handleSubmit() {
  try {
    loading.value = true;
    await formRef.value?.validate();
    if (editId.value) {
      await $api.put(Endpoints.bannerById(editId.value), formData.value);
    } else {
      await $api.post(Endpoints.banners, formData.value);
    }

    emit('refresh');
    closeModal();
  } catch (error) {
    console.error('Error saving banner:', error);
  } finally {
    loading.value = false;
  }
}

// Expose methods for parent component
defineExpose({
  isOpen,
  openModal: (banner?: BannerInterface | null) => {
    if (banner) {
      populateForm(banner);
      editId.value = banner.id;
    } else {
      resetForm();
    }
    isOpen.value = true;
  },
  closeModal,
});
</script>
