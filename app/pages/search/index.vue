<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { SearchRequest } from '~/types/search';
import type { PersonSearchResult, EventSearchResult } from '~/types/search-response';
import type { SuggestionItem } from '~/types/search-suggestion';
import { useSearchSuggestion } from '~/data/search-suggestion';
import { useDropdownFilter } from '~/data/dropdown-filter';

useSeoMeta({
  title: 'Pencarian Tokoh & Peristiwa Sejarah - Historical Knowledge Graph',
  ogTitle: 'Pencarian Tokoh & Peristiwa Sejarah - Historical Knowledge Graph',
  description: 'Cari tokoh dan peristiwa sejarah dari era BC hingga AD. Temukan kaisar, filsuf, dan peristiwa bersejarah dari Zoro hingga Nero.',
  ogDescription: 'Cari tokoh dan peristiwa sejarah dari era BC hingga AD. Temukan kaisar, filsuf, dan peristiwa bersejarah dari Zoro hingga Nero.'
});

const { fetchSuggestions } = useSearchSuggestion();
const { fetchSearchResults } = useSearch();
const { fetchDropdownFilter } = useDropdownFilter();

// State
const searchQuery = ref('');
const suggestions = ref<SuggestionItem[]>([]);
const showSuggestions = ref(false);
const loadingSuggestions = ref(false);
const loadingResults = ref(false);
const hasSearched = ref(false);

const persons = ref<PersonSearchResult[]>([]);
const events = ref<EventSearchResult[]>([]);
const totalPersonCount = ref(0);
const totalEventCount = ref(0);

const totalPersonFound = ref(0);
const totalEventFound = ref(0);

// Filter State
type SearchType = 'all' | 'person' | 'event';
type FilterMode = 'country' | 'continent';

const searchType = ref<SearchType>('all');
const filterMode = ref<FilterMode>('country');
const selectedCountries = ref<string[]>([]);
const selectedContinents = ref<string[]>([]);

const availableCountries = ref<string[]>([]);
const availableContinents = ref<string[]>([]);
const loadingFilters = ref(false);

// Load filter options
onMounted(async () => {
  loadingFilters.value = true;
  try {
    const data = await fetchDropdownFilter();
    availableCountries.value = data.countries;
    availableContinents.value = data.continents;
  } catch (error) {
    console.error('Error loading filters:', error);
  } finally {
    loadingFilters.value = false;
  }
});

// Watch filter mode changes
watch(filterMode, () => {
  selectedCountries.value = [];
  selectedContinents.value = [];
});

// Debounced search untuk suggestions
let debounceTimer: NodeJS.Timeout;
watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  
  if (!newQuery.trim() || newQuery.trim().length < 2) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  loadingSuggestions.value = true;
  showSuggestions.value = true;

  debounceTimer = setTimeout(async () => {
    try {
      const result = await fetchSuggestions(newQuery);
      suggestions.value = result.suggestions;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      suggestions.value = [];
    } finally {
      loadingSuggestions.value = false;
    }
  }, 300);
});

// Computed untuk hasil yang difilter
const filteredResults = computed(() => {
  return [...persons.value, ...events.value];
});

const totalResults = computed(() => persons.value.length + events.value.length);

const searchTypeOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Tokoh', value: 'person' },
  { label: 'Peristiwa', value: 'event' }
];

// Computed untuk filter options
const filterOptions = computed(() => {
  const arr = filterMode.value === 'country' ? availableCountries.value : availableContinents.value;
  return arr.map(item => ({ label: item, value: item }));
});

const selectedFilters = computed({
  get: () => filterMode.value === 'country' ? selectedCountries.value : selectedContinents.value,
  set: (val) => {
    if (filterMode.value === 'country') {
      selectedCountries.value = val;
    } else {
      selectedContinents.value = val;
    }
  }
});

// Computed untuk cek apakah ada data lebih banyak
const hasMoreResults = computed(() => {
  console.log('totalPersonFound:', totalPersonFound.value, 'totalEventFound:', totalEventFound.value);
  return (totalPersonFound.value + totalEventFound.value) > 19;
});

const loadingMore = ref(false);

// Functions
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;

  showSuggestions.value = false;
  loadingResults.value = true;
  hasSearched.value = true;

  try {
    const payload: SearchRequest = {
      query: searchQuery.value,
      current_person_count: 0, // Reset untuk pencarian baru
      current_event_count: 0,
      search_type: searchType.value
    };

    // Add filter based on mode
    if (filterMode.value === 'country' && selectedCountries.value.length > 0) {
      payload.filter_country = selectedCountries.value;
    } else if (filterMode.value === 'continent' && selectedContinents.value.length > 0) {
      payload.filter_continent = selectedContinents.value;
    }

    const results = await fetchSearchResults(payload);
    
    // Reset dan simpan data baru
    persons.value = results.persons.data;
    events.value = results.events.data;
    totalPersonCount.value = results.persons.data.length;
    totalEventCount.value = results.events.data.length;
    totalPersonFound.value = results.persons.total_found;
    totalEventFound.value = results.events.total_found;
  } catch (error) {
    console.error('Error fetching search results:', error);
  } finally {
    loadingResults.value = false;
  }
};

const loadMore = async () => {
  if (!searchQuery.value.trim()) return;

  loadingMore.value = true;

  try {
    const payload: SearchRequest = {
      query: searchQuery.value,
      current_person_count: totalPersonCount.value,
      current_event_count: totalEventCount.value,
      search_type: searchType.value
    };

    if (filterMode.value === 'country' && selectedCountries.value.length > 0) {
      payload.filter_country = selectedCountries.value;
    } else if (filterMode.value === 'continent' && selectedContinents.value.length > 0) {
      payload.filter_continent = selectedContinents.value;
    }

    const results = await fetchSearchResults(payload);

    persons.value = [...persons.value, ...results.persons.data];
    events.value = [...events.value, ...results.events.data];
    totalPersonCount.value += results.persons.data.length;
    totalEventCount.value += results.events.data.length;

    totalPersonFound.value = results.persons.total_found;
    totalEventFound.value = results.events.total_found;
  } catch (error) {
    console.error('Error loading more results:', error);
  } finally {
    loadingMore.value = false;
  }
};

const navigateToInfobox = (result: PersonSearchResult | EventSearchResult) => {
  console.log('Navigating to infobox with result:', result);
  
  if (!result.element_id) {
    console.error('No element_id found in result');
    return;
  }
  
  console.log('Using element_id:', result.element_id);
  navigateTo(`/infobox/${encodeURIComponent(result.element_id)}`);
};

const selectSuggestion = (suggestion: SuggestionItem) => {
  searchQuery.value = suggestion.text;
  showSuggestions.value = false;
  
  console.log('Selected suggestion:', suggestion);
  
  if (!suggestion.element_id) {
    console.error('No element_id found in suggestion');
    handleSearch();
    return;
  }
  
  console.log('Using element_id:', suggestion.element_id);
  navigateTo(`/infobox/${encodeURIComponent(suggestion.element_id)}`);
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
  searchType.value = 'all';
  selectedCountries.value = [];
  selectedContinents.value = [];
  totalPersonCount.value = 0;
  totalEventCount.value = 0;
  totalPersonFound.value = 0;
  totalEventFound.value = 0;
};


const truncateText = (text: string, maxLines: number = 2) => {
  const maxChars = maxLines * 80;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '...';
};

const isPersonResult = (result: any): result is PersonSearchResult => {
  return result.type === 'person';
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <div class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-stone-900 dark:text-stone-50">
          Cari <span class="text-amber-700 dark:text-amber-500">Tokoh & Peristiwa</span> Sejarah
        </h1>
        <p class="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Temukan tokoh bersejarah dari Zoro hingga Nero dan peristiwa penting dari era BC hingga AD
        </p>
      </div>

      <!-- Search Box -->
      <div class="max-w-5xl mx-auto mb-8">
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
                v-for="(suggestion, idx) in suggestions"
                :key="idx"
                @click="selectSuggestion(suggestion)"
                class="w-full px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-3"
              >
                <UIcon
                  :name="suggestion.type === 'person' ? 'i-heroicons-user' : 'i-heroicons-calendar'"
                  class="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0"
                />
                <div class="flex-1">
                  <div class="font-medium text-stone-900 dark:text-stone-100">{{ suggestion.text }}</div>
                  <div class="text-xs text-stone-500 dark:text-stone-400 capitalize">{{ suggestion.type }}</div>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Section - Before Search (Centered) -->
      <div v-if="!hasSearched" class="max-w-5xl mx-auto mb-12">
        <UCard>
          <div class="space-y-4">
            <div class="text-center mb-4">
              <p class="text-sm text-stone-600 dark:text-stone-400">
                Gunakan filter untuk mempersempit hasil pencarian
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <!-- Dropdown Tipe Pencarian -->
              <USelect
                v-model="searchType"
                :items="searchTypeOptions"
                placeholder="Tipe Pencarian"
                class="w-full sm:w-1/2"
              />

              <!-- Dropdown Filter Lokasi -->
              <div class="w-full sm:w-1/2">
                <div class="flex gap-2 mb-2">
                  <UButton
                    :color="filterMode === 'country' ? 'primary' : 'neutral'"
                    :variant="filterMode === 'country' ? 'solid' : 'outline'"
                    @click="filterMode = 'country'"
                    size="sm"
                  >
                    <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
                    Negara
                  </UButton>
                  <UButton
                    :color="filterMode === 'continent' ? 'primary' : 'neutral'"
                    :variant="filterMode === 'continent' ? 'solid' : 'outline'"
                    @click="filterMode = 'continent'"
                    size="sm"
                  >
                    <UIcon name="i-heroicons-globe-americas" class="w-4 h-4 mr-1" />
                    Benua
                  </UButton>
                </div>
                <USelect
                  v-model="selectedFilters"
                  :items="filterOptions"
                  multiple
                  :loading="loadingFilters"
                  placeholder="Pilih satu atau lebih..."
                  searchable
                  class="w-full"
                />
              </div>
            </div>

            <!-- Selected Items Display -->
            <div v-if="selectedFilters.length > 0" class="flex flex-wrap gap-2 mt-3">
              <UBadge
                v-for="item in selectedFilters"
                :key="item"
                color="primary"
                variant="subtle"
                size="sm"
              >
                {{ item }}
                <button
                  @click="selectedFilters = selectedFilters.filter(f => f !== item)"
                  class="ml-1 hover:text-amber-700"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                </button>
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Results Section with Sidebar Filter -->
      <div v-if="hasSearched">
        <div class="grid lg:grid-cols-4 gap-6">
          <!-- Sidebar Filter (Left) -->
          <div class="lg:col-span-1 max-w-xs w-full">
            <UCard class="sticky top-4">
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                    Tipe Pencarian
                  </h3>
                  <div class="space-y-2">
                    <UButton
                      :color="searchType === 'all' ? 'primary' : 'neutral'"
                      :variant="searchType === 'all' ? 'solid' : 'ghost'"
                      @click="searchType = 'all'; handleSearch()"
                      size="sm"
                      block
                    >
                      Semua ({{ totalResults }})
                    </UButton>
                    <UButton
                      :color="searchType === 'person' ? 'primary' : 'neutral'"
                      :variant="searchType === 'person' ? 'solid' : 'ghost'"
                      @click="searchType = 'person'; handleSearch()"
                      size="sm"
                      block
                    >
                      Tokoh ({{ totalPersonCount }})
                    </UButton>
                    <UButton
                      :color="searchType === 'event' ? 'primary' : 'neutral'"
                      :variant="searchType === 'event' ? 'solid' : 'ghost'"
                      @click="searchType = 'event'; handleSearch()"
                      size="sm"
                      block
                    >
                      Peristiwa ({{ totalEventCount }})
                    </UButton>
                  </div>
                </div>

                <UDivider />

                <div>
                  <h3 class="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                    Filter Lokasi
                  </h3>
                  <div class="flex gap-2 mb-3">
                  <UButton
                  :color="filterMode === 'country' ? 'primary' : 'neutral'"
                  :variant="filterMode === 'country' ? 'solid' : 'outline'"
                  @click="filterMode = 'country'"
                  size="sm"
                >
                  <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
                  Negara
                </UButton>
                <UButton
                  :color="filterMode === 'continent' ? 'primary' : 'neutral'"
                  :variant="filterMode === 'continent' ? 'solid' : 'outline'"
                  @click="filterMode = 'continent'"
                  size="sm"
                >
                  <UIcon name="i-heroicons-globe-americas" class="w-4 h-4 mr-1" />
                  Benua
                </UButton>
                  </div>

                  <USelect
                    v-model="selectedFilters"
                    :items="filterOptions"
                    multiple
                    :loading="loadingFilters"
                    placeholder="Pilih satu atau lebih..."
                    searchable
                    class="w-full"
                  />

                  <div v-if="selectedFilters.length > 0" class="flex flex-wrap gap-2 mt-3">
                    <UBadge
                      v-for="item in selectedFilters"
                      :key="item"
                      color="primary"
                      variant="subtle"
                      size="xs"
                    >
                      {{ item }}
                      <button
                        @click="selectedFilters = selectedFilters.filter(f => f !== item)"
                        class="ml-1"
                      >
                        <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                      </button>
                    </UBadge>
                  </div>

                  <UButton
                    @click="handleSearch"
                    color="primary"
                    size="sm"
                    block
                    class="mt-4"
                  >
                    Terapkan Filter
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Results (Right) -->
          <div class="lg:col-span-3">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-stone-900 dark:text-stone-100">
                Hasil Pencarian
              </h2>
              <div class="text-sm text-stone-600 dark:text-stone-400">
                {{ filteredResults.length }} hasil ditemukan
              </div>          
            </div>

            <!-- Loading State -->
            <div v-if="loadingResults" class="grid gap-4 md:grid-cols-2">
              <USkeleton v-for="i in 4" :key="i" class="h-48" />
            </div>

            <!-- Results List -->
            <div v-else-if="filteredResults.length > 0">
              <div class="grid gap-6 md:grid-cols-2">
                <UCard
                  v-for="result in filteredResults"
                  :key="`${result.type}-${result.element_id}-${result.context?.country}`"
                  class="hover:shadow-lg transition-shadow cursor-pointer"
                  @click="navigateToInfobox(result)"
                >
                  <div class="flex gap-4">
                    <!-- Image -->
                    <div class="flex-shrink-0">
                      <img
                        :src="result.image || '/images/img-placeholder.jpg'"
                        :alt="result.name"
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
                        {{ result.name }}
                      </h3>

                      <!-- Description (2 lines max) -->
                      <p class="text-sm text-stone-600 dark:text-stone-400 mb-3 line-clamp-2">
                        {{ truncateText(result.description || '-', 2) }}
                      </p>

                      <!-- Meta Info -->
                      <div class="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-500">
                        <div class="flex items-center gap-1">
                          <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                          <span>{{ result.context?.country || '-' }}</span>
                        </div>
                        <div v-if="isPersonResult(result)" class="flex items-center gap-1">
                          <UIcon name="i-heroicons-briefcase" class="w-4 h-4" />
                          <span>
                            {{ result.context?.positions?.[0] || '-' }}
                          </span>
                        </div>
                        <div v-else class="flex items-center gap-1">
                          <UIcon name="i-heroicons-bolt" class="w-4 h-4" />
                          <span>{{ result.context?.impact || '-' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </UCard>
              </div>

              <!-- Load More Button -->
              <div v-if="hasMoreResults" class="flex justify-center mt-8">
                <UButton
                  @click="loadMore"
                  :loading="loadingMore"
                  color="primary"
                  size="lg"
                  variant="outline"
                >
                  <UIcon v-if="!loadingMore" name="i-heroicons-arrow-down" class="w-5 h-5 mr-2" />
                  {{ loadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}
                </UButton>
              </div>

              <div class="flex justify-center mt-4">
                <UButton
                  color="primary"
                  variant="soft"
                  size="md"
                  @click="scrollToTop"
                >
                  <UIcon name="i-heroicons-arrow-up" class="w-5 h-5 mr-2" />
                  Kembali ke Atas
                </UButton>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-16">
              <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 mx-auto text-stone-400 mb-4" />
              <h3 class="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Tidak ada hasil ditemukan
              </h3>
              <p class="text-stone-600 dark:text-stone-400 mb-6">
                Coba gunakan kata kunci yang berbeda atau ubah filter
              </p>
              <UButton @click="clearSearch" color="primary" variant="outline">
                Hapus Pencarian
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
          <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-amber-600 dark:text-amber-500" />
        </div>
        <h3 class="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Mulai pencarian Anda
        </h3>
        <p class="text-stone-600 dark:text-stone-400">
          Ketik nama tokoh atau peristiwa sejarah, lalu tekan Enter atau klik tombol Cari
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