<template>
  <div class="bg-grey-dark pt-4">
    <n-menu
      v-model:value="selectedMenu"
      class="text-[14px] leading-[20px] font-medium"
      mode="horizontal"
      :options="menuOptions"
      :render-icon="renderMenuIcon"
      :render-label="renderMenuLabel"
      :render-extra="renderMenuExtra"
      responsive
    />

    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { MenuOption } from 'naive-ui';
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import { PredictionSetCategory } from '~/lib/types/prediction-set';

const menuOptions = [
  {
    label: 'Top markets',
    key: 'index',
    to: 'index',
    iconName: 'icon/fire',
  },
];

const predictionCategories = Object.values(PredictionSetCategory).map(category => ({
  label: category,
  key: category.toLowerCase(),
  path: '/category/' + category.toLowerCase(),
}));
menuOptions.push(...(predictionCategories as any));

const props = defineProps({
  sliceName: { type: Boolean, default: false },
});
const route = useRoute();
const selectedMenu = ref<string>(routeToKey(route));

watch(
  () => route,
  route => {
    selectedMenu.value = routeToKey(route);
  }
);

function routeToKey(route: RouteLocationNormalizedLoadedGeneric) {
  if (route.params && Object.keys(route.params).length !== 0) {
    const ar = route.path.split('/');
    return ar[ar.length - 1];
  } else return routeNameToKey(route.name?.toString() || '');
}

function routeNameToKey(name: string) {
  return props.sliceName ? removeIdOrSlug(name) : name;
}

function removeIdOrSlug(text: string) {
  return text.replace(/(-id|-slug).*/g, '');
}

/**
 * Render functions
 */
function renderMenuLabel(option: MenuOption) {
  if ('disabled' in option && option.disabled) {
    return h('span', { class: 'text-body font-medium' }, { default: () => option.label as string });
  } else if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, () => option.label as string);
  } else if ('path' in option) {
    return h(resolveComponent('NuxtLink'), { to: { path: option.path } }, () => option.label as string);
  } else if ('to' in option) {
    return h(
      resolveComponent('NuxtLink'),
      { to: { name: option.to, query: option.query, params: option.params }, class: 'font-medium' },
      () => option.label as string
    );
  }

  return h('span', { class: 'text' }, { default: () => option.label as string });
}

function renderMenuIcon(option: MenuOption) {
  if ('iconName' in option) {
    return h(resolveComponent('NuxtIcon'), { name: option.iconName, class: 'text-base mr-0' }, '');
  }
  return null;
}

function renderMenuExtra(_option: MenuOption) {
  return null;
}
</script>

<style scoped>
.n-menu.n-menu--horizontal {
  justify-content: flex-start;
  height: 44px;
  border-bottom: 1px solid var(--n-divider-color);
}

:deep(.n-menu-item) {
  height: 44px;
  padding: 0 20px;
}

:deep(.n-menu.n-menu--horizontal .n-menu-item-content) {
  padding: 0 2px;
}

:deep(.n-menu.n-menu--horizontal .n-menu-item-content.n-menu-item-content--selected .n-menu-item-content-header a) {
  color: #fff;
}

:deep(.n-menu.n-menu--horizontal .n-menu-item-content.n-menu-item-content--selected) {
  color: #fff;
  border-bottom: 2px solid theme('colors.primary.DEFAULT') !important; /* Fix - one px is not visible */
}

:deep(.n-menu-item:hover .n-menu-item-content) {
  color: var(--n-primary-color);
}

:deep(.n-menu-item-content__icon) {
  margin-right: 2px !important;
  width: auto !important;
}

:deep(.n-menu .n-submenu:last-child .n-menu-item-content-header) {
  font-size: 25px;
  line-height: 1;
  font-weight: 700;
}
</style>
