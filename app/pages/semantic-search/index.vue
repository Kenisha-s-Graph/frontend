<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SemanticSearchRequest, SemanticPersonResult, SemanticEventResult } from '~/types/semantic-search';

useSeoMeta({
  title: 'Semantic Search - Historical Knowledge Graph',
  ogTitle: 'Semantic Search - Historical Knowledge Graph',
  description: 'Search for historical figures and events using semantic similarity. Find related concepts and topics.',
  ogDescription: 'Search for historical figures and events using semantic similarity. Find related concepts and topics.'
});

const { fetchSemanticSearch } = useSemanticSearch();

// State
const searchQuery = ref('');
const enableLimit = ref(false);
const searchLimit = ref<number | null>(50);
const loadingResults = ref(false);
const hasSearched = ref(false);

const persons = ref<SemanticPersonResult[]>([]);
const events = ref<SemanticEventResult[]>([]);

// Computed
const filteredResults = computed(() => {
  return [...persons.value, ...events.value];
});

const totalResults = computed(() => persons.value.length + events.value.length);

// Functions
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;

  loadingResults.value = true;
  hasSearched.value = true;

  try {
    const payload: SemanticSearchRequest = {
      query: searchQuery.value
    };

    // Only add limit if toggle is enabled AND value exists and valid
    if (enableLimit.value && searchLimit.value !== null && searchLimit.value > 0) {
      payload.limit = searchLimit.value;
    }
    // If enableLimit is false, backend will use default limit of 20

    console.log('Search payload:', payload); // Debug log

    const results = await fetchSemanticSearch(payload);
    
    persons.value = results.persons;
    events.value = results.events;
  } catch (error) {
    console.error('Error fetching semantic search results:', error);
  } finally {
    loadingResults.value = false;
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  persons.value = [];
  events.value = [];
  hasSearched.value = false;
  enableLimit.value = false;
  searchLimit.value = 50;
};

const navigateToInfobox = (result: SemanticPersonResult | SemanticEventResult) => {
  if (!result.element_id) {
    console.error('No element_id found in result');
    return;
  }
  
  navigateTo(`/infobox/${encodeURIComponent(result.element_id)}`);
};

const truncateText = (text: string, maxLines: number = 2) => {
  const maxChars = maxLines * 80;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '...';
};

const isPersonResult = (result: any): result is SemanticPersonResult => {
  return result.type === 'person';
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const getSimilarityColor = (score: number) => {
  if (score >= 0.85) return 'text-green-600 dark:text-green-500';
  if (score >= 0.75) return 'text-blue-600 dark:text-blue-500';
  if (score >= 0.65) return 'text-amber-600 dark:text-amber-500';
  return 'text-stone-600 dark:text-stone-500';
};

const getSimilarityLabel = (score: number) => {
  if (score >= 0.85) return 'Very High';
  if (score >= 0.75) return 'High';
  if (score >= 0.65) return 'Moderate';
  return 'Low';
};
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <div class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-stone-900 dark:text-stone-50">
          Semantic Search for <span class="text-amber-700 dark:text-amber-500">Historical Figures & Events</span>
        </h1>
        <p class="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Search by concepts, topics, or themes. Find historically related figures and events based on semantic similarity using vector embeddings.
        </p>
      </div>

      <!-- Search Box -->
      <div class="max-w-5xl mx-auto mb-12">
        <div class="space-y-4">
          <!-- Search Input -->
          <div class="relative">
            <UInput
              v-model="searchQuery"
              size="xl"
              placeholder="Search by concept (e.g., religion, war, philosophy, empire)..."
              icon="i-heroicons-sparkles"
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

          <!-- Limit Toggle and Search Button -->
          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div class="flex items-center gap-3 flex-1">
              <!-- Toggle Switch -->
              <UToggle
                v-model="enableLimit"
                size="md"
              />
              <label class="text-sm font-medium text-stone-700 dark:text-stone-300 whitespace-nowrap cursor-pointer" @click="enableLimit = !enableLimit">
                Custom Limit
              </label>
              
              <!-- Limit Input (only show when enabled) -->
              <template v-if="enableLimit">
                <UInput
                  v-model="searchLimit"
                  type="number"
                  placeholder="50"
                  size="md"
                  class="w-32"
                />
                <span class="text-xs text-stone-500 dark:text-stone-400">
                  results
                </span>
              </template>
              <span v-else class="text-xs text-stone-500 dark:text-stone-400">
                (default: 20 results)
              </span>
            </div>
            
            <UButton
              @click="handleSearch"
              color="primary"
              :loading="loadingResults"
              size="lg"
              class="sm:w-auto w-full"
            >
              <UIcon v-if="!loadingResults" name="i-heroicons-magnifying-glass" class="w-5 h-5 mr-2" />
              {{ loadingResults ? 'Searching...' : 'Search' }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="hasSearched" class="max-w-7xl mx-auto">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Search Results
          </h2>
          <div class="text-sm text-stone-600 dark:text-stone-400">
            {{ totalResults }} results found
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingResults" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <USkeleton v-for="i in 6" :key="i" class="h-48" />
        </div>

        <!-- Results List -->
        <div v-else-if="filteredResults.length > 0">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <UCard
              v-for="result in filteredResults"
              :key="result.element_id"
              class="hover:shadow-lg transition-shadow cursor-pointer"
              @click="navigateToInfobox(result)"
            >
              <div class="flex gap-4">
                <!-- Image (Left) -->
                <div class="flex-shrink-0">
                  <img
                    :src="result.image || '/images/img-placeholder.jpg'"
                    :alt="result.name"
                    class="w-24 h-24 object-cover rounded-lg border-2 border-amber-200 dark:border-amber-900"
                    @error="(e) => (e.target as HTMLImageElement).src = '/images/img-placeholder.jpg'"
                  />
                </div>

                <!-- Content (Right) -->
                <div class="flex-1 min-w-0">
                  <!-- Type Badge and Similarity Score -->
                  <div class="flex items-center justify-between mb-2">
                    <UBadge
                      :color="isPersonResult(result) ? 'primary' : 'warning'"
                      variant="subtle"
                      size="xs"
                    >
                      {{ isPersonResult(result) ? 'Figure' : 'Event' }}
                    </UBadge>
                    <UBadge
                      color="primary"
                      variant="solid"
                      size="xs"
                    >
                      <UIcon name="i-heroicons-chart-bar" class="w-3 h-3 mr-1" />
                      {{ (result.similarity_score * 100).toFixed(1) }}%
                    </UBadge>
                  </div>

                  <!-- Name -->
                  <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                    {{ result.name }}
                  </h3>

                  <!-- Similarity Label -->
                  <div :class="['text-xs font-semibold mb-2', getSimilarityColor(result.similarity_score)]">
                    {{ getSimilarityLabel(result.similarity_score) }} Match
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-stone-600 dark:text-stone-400 mb-3 line-clamp-2">
                    {{ truncateText(result.description || '-', 2) }}
                  </p>

                  <!-- Meta Info -->
                  <div class="space-y-1 text-xs text-stone-500 dark:text-stone-500">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-heroicons-map-pin" class="w-3 h-3" />
                      <span>{{ result.context?.country || '-' }}</span>
                    </div>
                    <div v-if="isPersonResult(result) && result.context?.positions?.length > 0" class="flex items-center gap-1">
                      <UIcon name="i-heroicons-briefcase" class="w-3 h-3" />
                      <span>{{ result.context.positions[0] }}</span>
                    </div>
                    <div v-if="isPersonResult(result) && result.context?.death_date" class="flex items-center gap-1">
                      <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                      <span>{{ new Date(result.context.death_date).getFullYear() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Back to Top Button -->
          <div class="flex justify-center mt-8">
            <UButton
              color="primary"
              variant="soft"
              size="md"
              @click="scrollToTop"
            >
              <UIcon name="i-heroicons-arrow-up" class="w-5 h-5 mr-2" />
              Back to Top
            </UButton>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 mx-auto text-stone-400 mb-4" />
          <h3 class="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            No results found
          </h3>
          <p class="text-stone-600 dark:text-stone-400 mb-6">
            Try using different keywords or concepts
          </p>
          <UButton @click="clearSearch" color="primary" variant="outline">
            Clear Search
          </UButton>
        </div>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-16 max-w-3xl mx-auto">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
          <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-amber-600 dark:text-amber-500" />
        </div>
        <h3 class="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Start Your Semantic Search
        </h3>
        <p class="text-stone-600 dark:text-stone-400 mb-8">
          Search for abstract concepts, themes, or topics to discover related historical figures and events.
        </p>

        <!-- Example Searches -->
        <div class="text-left">
          <h4 class="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
            Try These Example Searches:
          </h4>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="example in ['religion', 'philosophy', 'military', 'empire', 'art', 'science']"
              :key="example"
              @click="searchQuery = example; handleSearch()"
              color="neutral"
              variant="outline"
              size="sm"
            >
              {{ example }}
            </UButton>
          </div>
        </div>
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