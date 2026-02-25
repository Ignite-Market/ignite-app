<template>
  <div class="flex flex-col gap-2 w-full">
    <n-select
      v-model:value="selectedVideogame"
      filterable
      placeholder="Select Videogame..."
      :options="videogameOptions"
      :loading="loadingVideogames"
      clearable
    />
    <n-select
      v-model:value="selectedLeague"
      filterable
      placeholder="Select League..."
      :options="leagueOptions"
      :loading="loadingLeagues"
      :disabled="!selectedVideogame"
      clearable
    />
    <n-select
      v-model:value="selectedValue"
      filterable
      placeholder="Select Match..."
      :options="matchOptions"
      :loading="loadingMatches"
      :disabled="!selectedLeague"
      clearable
      @update:value="handleUpdateValue"
    >
      <template #empty> No matches found... </template>
    </n-select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps<{
  value: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: number | null): void;
  (e: 'match-selected', match: any): void;
}>();

const selectedValue = computed({
  get: () => props.value,
  set: val => emit('update:value', val),
});

const selectedVideogame = ref<string | null>(null);
const selectedLeague = ref<string | null>(null);

const loadingVideogames = ref(false);
const loadingLeagues = ref(false);
const loadingMatches = ref(false);

const videogameOptions = ref<any[]>([]);
const leagueOptions = ref<any[]>([]);
const matchOptions = ref<any[]>([]);

const videogamesData = ref<any[]>([]);

onMounted(async () => {
  try {
    loadingVideogames.value = true;
    const response = await $api.get<any>('/prediction-templates/pandascore/videogames');
    videogamesData.value = response.data;
    videogameOptions.value = response.data.map((vg: any) => ({
      label: vg.name,
      value: vg.slug,
    }));
  } catch (error) {
    console.error('Error fetching videogames:', error);
  } finally {
    loadingVideogames.value = false;
  }
});

watch(selectedVideogame, newVal => {
  selectedLeague.value = null;
  leagueOptions.value = [];
  selectedValue.value = null;
  matchOptions.value = [];
  emit('match-selected', null);

  if (!newVal) return;

  const game = videogamesData.value.find((vg: any) => vg.slug === newVal);
  if (game && game.leagues) {
    // Some endpoints may return nested leagues
    leagueOptions.value = game.leagues.map((l: any) => ({
      label: l.name,
      value: l.slug,
    }));
  }
});

watch(selectedLeague, async newVal => {
  selectedValue.value = null;
  matchOptions.value = [];
  emit('match-selected', null);

  if (!newVal) return;

  try {
    loadingMatches.value = true;
    const response = await $api.get<any>(`/prediction-templates/pandascore/leagues/${newVal}/matches`);
    matchOptions.value = response.data.map((match: any) => {
      const date = new Date(match.begin_at);
      const optionsTitle: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      const dateStr = date.toLocaleString(undefined, optionsTitle);

      return {
        label: `${match.name} - ${dateStr}`,
        value: match.id,
        rawMatch: match,
      };
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
  } finally {
    loadingMatches.value = false;
  }
});

const handleUpdateValue = (val: number | null, option: any) => {
  if (option && option.rawMatch) {
    emit('match-selected', option.rawMatch);
  } else {
    emit('match-selected', null);
  }
};
</script>
