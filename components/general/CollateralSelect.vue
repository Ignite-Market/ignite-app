<template>
  <SelectOptions
    :value="selectedCollateralToken"
    :options="tokenOptions"
    :default-value="defaultValue"
    v-bind="$attrs"
    :render-label="renderTokenLabel"
    :theme-overrides="{
      peers: {
        InternalSelection: {
          color: '#292929',
          clearColor: '#C56AC6',
        },
      },
    }"
    @update:value="value => emit('update:value', value)"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  defaultValue: {
    type: Number,
    default: undefined,
  },
});

const emit = defineEmits<{
  (e: 'update:value', value: number | undefined): void;
}>();

const tokenStore = useTokensStore();

const selectedCollateralToken = ref<number | undefined>(props.defaultValue);

watch(
  () => props.defaultValue,
  value => {
    if (value !== selectedCollateralToken.value) {
      selectedCollateralToken.value = value;
    }
  }
);

const tokenOptions = computed(() => {
  return Object.values(tokenStore.items).map(token => ({
    label: token.name,
    value: token.id,
  }));
});

const renderTokenLabel = (option: any) => {
  const token = tokenStore.items[option.value];
  return [
    h(
      'div',
      {
        class: 'flex items-center',
      },
      [
        h(resolveComponent('Image'), {
          src: token.imgUrl,
          class: 'rounded-full w-6 h-6 object-cover mr-1',
        }),
        h('div', token.name),
      ]
    ),
  ];
};
</script>
