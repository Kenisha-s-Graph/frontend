<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { SearchSuggestion, PersonResult, EventResult } from '~/types/search';

useSeoMeta({
  title: 'Pencarian Museum - Museum Knowledge Graph',
  ogTitle: 'Pencarian Museum - Museum Knowledge Graph',
  description: 'Cari koleksi artefak, tokoh, dan peristiwa sejarah museum.',
  ogDescription: 'Cari koleksi artefak, tokoh, dan peristiwa sejarah museum.'
});

const { fetchSuggestions, fetchSearchResults } = useSearch();

// State
const searchQuery = ref('');
const suggestions = ref<SearchSuggestion[]>([]);
const showSuggestions = ref(false);
const loadingSuggestions = ref(false);
const loadingResults = ref(false);
const hasSearched = ref(false);

const persons = ref<PersonResult[]>([]);
const events = ref<EventResult[]>([]);

type FilterType = 'all' | 'person' | 'event';
const activeFilter = ref<FilterType>('all');

// Debounced search untuk suggestions
let debounceTimer: NodeJS.Timeout;
watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  
  if (!newQuery.trim()) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  loadingSuggestions.value = true;
  showSuggestions.value = true;

  debounceTimer = setTimeout(async () => {
    try {
      suggestions.value = await fetchSuggestions(newQuery);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      loadingSuggestions.value = false;
    }
  }, 300);
});

// Computed untuk hasil yang difilter
const filteredResults = computed(() => {
  if (activeFilter.value === 'person') return persons.value;
  if (activeFilter.value === 'event') return events.value;
  return [...persons.value, ...events.value];
});

const totalResults = computed(() => persons.value.length + events.value.length);

// Functions
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;

  showSuggestions.value = false;
  loadingResults.value = true;
  hasSearched.value = true;

  try {
    const results = await fetchSearchResults(searchQuery.value);
    persons.value = results.results.persons;
    events.value = results.results.events;
  } catch (error) {
    console.error('Error fetching search results:', error);
  } finally {
    loadingResults.value = false;
  }
};

const selectSuggestion = (suggestion: SearchSuggestion) => {
  searchQuery.value = suggestion.name;
  showSuggestions.value = false;
  handleSearch();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
  } else if (event.key === 'Escape') {
    showSuggestions.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  suggestions.value = [];
  persons.value = [];
  events.value = [];
  hasSearched.value = false;
  activeFilter.value = 'all';
};

const truncateText = (text: string, maxLines: number = 2) => {
  const words = text.split(' ');
  const lineHeight = 24; // approximate
  const maxChars = maxLines * 80; // approximate chars per line
  
  if (text.length <= maxChars) return text;
  
  return text.slice(0, maxChars) + '...';
};

const isPersonResult = (result: any): result is PersonResult => {
  return 'position' in result;
};
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <div class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium mb-4">
          <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
          <span>Pencarian Koleksi Museum</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-stone-900 dark:text-stone-50">
          Cari <span class="text-amber-700 dark:text-amber-500">Tokoh & Peristiwa</span> Sejarah
        </h1>
        <p class="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Temukan informasi lengkap tentang tokoh sejarah dan peristiwa penting dalam koleksi museum
        </p>
      </div>

      <!-- Search Box - Dibuat lebih lebar seperti Google -->
      <div class="max-w-5xl mx-auto mb-12">
        <div class="relative">
          <div class="relative">
            <UInput
              v-model="searchQuery"
              size="xl"
              placeholder="Cari nama tokoh, peristiwa, deskripsi, posisi, atau dampak..."
              icon="i-heroicons-magnifying-glass"
              :trailing="false"
              @keydown="handleKeydown"
              class="w-full"
            >
              <template #trailing>
                <div class="flex items-center gap-2">
                  <UButton
                    v-if="searchQuery"
                    icon="i-heroicons-x-mark"
                    color="neutral"
                    variant="ghost"
                    size="md"
                    @click="clearSearch"
                  />
                </div>
              </template>
            </UInput>
          </div>

          <!-- Suggestions Dropdown -->
          <div
            v-if="showSuggestions && (suggestions.length > 0 || loadingSuggestions)"
            class="absolute z-10 w-full mt-2 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-amber-200 dark:border-amber-900/50 overflow-hidden"
          >
            <div v-if="loadingSuggestions" class="p-4 text-center text-stone-600 dark:text-stone-400">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin inline-block" />
              <span class="ml-2">Mencari...</span>
            </div>
            <div v-else class="max-h-96 overflow-y-auto">
              <button
                v-for="suggestion in suggestions"
                :key="suggestion.id"
                @click="selectSuggestion(suggestion)"
                class="w-full px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-3"
              >
                <UIcon
                  :name="suggestion.type === 'person' ? 'i-heroicons-user' : 'i-heroicons-calendar'"
                  class="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0"
                />
                <div class="flex-1">
                  <div class="font-medium text-stone-900 dark:text-stone-100">{{ suggestion.name }}</div>
                  <div class="text-xs text-stone-500 dark:text-stone-400 capitalize">{{ suggestion.type }}</div>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="hasSearched">
        <!-- Filter Tabs -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <UButton
              :color="activeFilter === 'all' ? 'primary' : 'neutral'"
              :variant="activeFilter === 'all' ? 'solid' : 'ghost'"
              @click="activeFilter = 'all'"
              size="sm"
            >
              Semua ({{ totalResults }})
            </UButton>
            <UButton
              :color="activeFilter === 'person' ? 'primary' : 'neutral'"
              :variant="activeFilter === 'person' ? 'solid' : 'ghost'"
              @click="activeFilter = 'person'"
              size="sm"
            >
              Tokoh ({{ persons.length }})
            </UButton>
            <UButton
              :color="activeFilter === 'event' ? 'primary' : 'neutral'"
              :variant="activeFilter === 'event' ? 'solid' : 'ghost'"
              @click="activeFilter = 'event'"
              size="sm"
            >
              Peristiwa ({{ events.length }})
            </UButton>
          </div>
          <div class="text-sm text-stone-600 dark:text-stone-400">
            {{ filteredResults.length }} hasil ditemukan
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingResults" class="grid gap-4 md:grid-cols-2">
          <USkeleton v-for="i in 4" :key="i" class="h-48" />
        </div>

        <!-- Results List -->
        <div v-else-if="filteredResults.length > 0" class="grid gap-6 md:grid-cols-2">
          <UCard
            v-for="result in filteredResults"
            :key="result.id"
            class="hover:shadow-lg transition-shadow"
          >
            <div class="flex gap-4">
              <!-- Image -->
              <div class="flex-shrink-0">
                <img
                  :src="result.image_url || '/placeholder.jpg'"
                  :alt="'name' in result ? result.name : result.full_name"
                  class="w-24 h-24 object-cover rounded-lg border-2 border-amber-200 dark:border-amber-900"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- Badge Type -->
                <UBadge
                  :color="isPersonResult(result) ? 'primary' : 'warning'"
                  variant="subtle"
                  size="xs"
                  class="mb-2"
                >
                  {{ isPersonResult(result) ? 'Tokoh' : 'Peristiwa' }}
                </UBadge>

                <!-- Name -->
                <h3 class="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
                  {{ isPersonResult(result) ? result.full_name : result.name }}
                </h3>

                <!-- Description (2 lines max) -->
                <p class="text-sm text-stone-600 dark:text-stone-400 mb-3 line-clamp-2">
                  {{ truncateText(result.description, 2) }}
                </p>

                <!-- Meta Info -->
                <div class="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-500">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                    <span>{{ result.country }}</span>
                  </div>
                  <div v-if="isPersonResult(result)" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-briefcase" class="w-4 h-4" />
                    <span>{{ result.position }}</span>
                  </div>
                  <div v-else class="flex items-center gap-1">
                    <UIcon name="i-heroicons-bolt" class="w-4 h-4" />
                    <span>{{ (result as EventResult).impact }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 mx-auto text-stone-400 mb-4" />
          <h3 class="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Tidak ada hasil ditemukan
          </h3>
          <p class="text-stone-600 dark:text-stone-400 mb-6">
            Coba gunakan kata kunci yang berbeda
          </p>
          <UButton @click="clearSearch" color="primary" variant="outline">
            Hapus Pencarian
          </UButton>
        </div>
      </div>

      <!-- Initial State (Before Search) -->
      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
          <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-amber-600 dark:text-amber-500" />
        </div>
        <h3 class="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Mulai pencarian Anda
        </h3>
        <p class="text-stone-600 dark:text-stone-400">
          Ketik nama tokoh atau peristiwa sejarah untuk memulai
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>