<script setup lang="ts">
import type { InfoboxResponse, FormattedFact, RelatedNode } from '~/types/infobox';

const route = useRoute();
const router = useRouter();
const { fetchInfobox } = useInfobox();

const loading = ref(true);
const error = ref<string | null>(null);
const rawData = ref<InfoboxResponse | null>(null);

// Track from which page user came from
const fromPage = ref<string>('search');

onMounted(() => {
  // Check if user came from semantic-search or search
  const referrer = document.referrer;
  if (referrer.includes('/semantic-search')) {
    fromPage.value = 'semantic-search';
  } else if (referrer.includes('/search')) {
    fromPage.value = 'search';
  }
});

const backButtonConfig = computed(() => {
  if (fromPage.value === 'semantic-search') {
    return {
      label: 'Back to Semantic Search',
      to: '/semantic-search'
    };
  }
  return {
    label: 'Back to Search',
    to: '/search'
  };
});

useSeoMeta({
  title: 'Infobox - Historical Knowledge Graph',
  ogTitle: 'Infobox - Historical Knowledge Graph',
  description: 'View detailed information about historical persons and events.',
  ogDescription: 'View detailed information about historical persons and events.'
});

watchEffect(async () => {
  const id = route.params.id as string;
  
  if (!id) {
    error.value = 'ID not found in URL';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    
    rawData.value = await fetchInfobox(id);
  } catch (e: any) {
    console.error('Error loading infobox:', e);
    error.value = e.message || 'Failed to load data';
  } finally {
    loading.value = false;
  }
});

const entityType = computed(() => {
  if (!rawData.value) return 'other';
  
  if (rawData.value.labels.includes('Person')) return 'person';
  if (rawData.value.labels.includes('Event')) return 'event';
  if (rawData.value.labels.includes('Award')) return 'award';
  if (rawData.value.labels.includes('City')) return 'city';
  if (rawData.value.labels.includes('Country')) return 'country';
  if (rawData.value.labels.includes('Dynasty')) return 'dynasty';
  if (rawData.value.labels.includes('Occupation')) return 'occupation';
  if (rawData.value.labels.includes('Position')) return 'position';
  
  return 'other';
});

const entityTypeLabel = computed(() => {
  const labelMap: Record<string, string> = {
    person: 'Historical Person',
    event: 'Historical Event',
    award: 'Award',
    city: 'City',
    country: 'Country',
    dynasty: 'Dynasty',
    occupation: 'Occupation',
    position: 'Position',
    other: 'Other'
  };
  return labelMap[entityType.value] || 'Entity';
});

const entityTypeBadgeColor = computed<'error' | 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | undefined>(() => {
  const colorMap: Record<string, 'error' | 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | undefined> = {
    person: 'primary',
    event: 'warning',
    award: 'success',
    city: 'info',
    country: 'secondary',
    dynasty: 'secondary',
    occupation: 'neutral',
    position: 'neutral',
    other: 'neutral'
  };
  return colorMap[entityType.value] ?? 'neutral';
});

const entityName = computed(() => {
  if (!rawData.value) return '';
  return rawData.value.properties.full_name || rawData.value.properties.name || '';
});

const entityImage = computed(() => {
  if (!rawData.value) return '/images/img-placeholder.jpg';
  return rawData.value.properties.image_url || '/images/img-placeholder.jpg';
});

const entityDescription = computed(() => {
  if (!rawData.value) return '';
  return rawData.value.properties.abstract || 
         rawData.value.properties.description || 
         'No description available';
});

const facts = computed<FormattedFact[]>(() => {
  if (!rawData.value) return [];
  
  const props = rawData.value.properties;
  const formattedFacts: FormattedFact[] = [];
  
  const skipProperties = ['image_url', 'description', 'abstract', 'name'];

  Object.entries(props).forEach(([key, value]) => {
    if (skipProperties.includes(key) || value === null || value === undefined) return;
    
    const label = key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    let formattedValue = value;
    
    if (typeof value === 'number') {
      formattedValue = value.toLocaleString('en-US');
    } else if (typeof value === 'string' && value.includes('T00:00:00Z')) {
      formattedValue = new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (Array.isArray(value)) {
      formattedValue = value.join(', ');
    }
    
    formattedFacts.push({ label, value: String(formattedValue) });
  });
  
  return formattedFacts;
});

const getNodeDisplayName = (node: RelatedNode): string => {
  const props = node.properties;
  
  if (props.full_name) return props.full_name;
  if (props.name) return props.name;
  if (props.label) return props.label;
  if (props.city) return props.city;
  if (props.country) return props.country;
  if (props.occupation) return props.occupation;
  if (props.position) return props.position;
  
  const firstValue = Object.entries(props).find(([key, val]) => 
    val !== null && 
    val !== undefined && 
    (typeof val === 'string' || typeof val === 'number')
  );
  
  return firstValue ? String(firstValue[1]) : 'Unknown';
};

const getNodeType = (labels: string[]): string => {
  if (labels.includes('Event')) return 'event';
  if (labels.includes('Person')) return 'person';
  if (labels.includes('Award')) return 'award';
  if (labels.includes('City')) return 'city';
  if (labels.includes('Country')) return 'country';
  if (labels.includes('Dynasty')) return 'dynasty';
  if (labels.includes('Occupation')) return 'occupation';
  if (labels.includes('Position')) return 'position';
  
  return 'other';
};

const formatRelationship = (relationship: string): string => {
  return relationship
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

const getRelationIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    person: 'i-heroicons-user',
    event: 'i-heroicons-calendar',
    award: 'i-heroicons-trophy',
    city: 'i-heroicons-map-pin',
    country: 'i-heroicons-globe-americas',
    dynasty: 'i-heroicons-user-group',
    occupation: 'i-heroicons-briefcase',
    position: 'i-heroicons-shield-check',
    other: 'i-heroicons-star'
  };
  return iconMap[type] || 'i-heroicons-link';
};

type BadgeColor = 'error' | 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | undefined;

const getRelationColor = (type: string): BadgeColor => {
  const colorMap: Record<string, BadgeColor> = {
    person: 'primary',
    event: 'warning',
    award: 'success',
    city: 'info',
    country: 'secondary',
    dynasty: 'secondary',
    occupation: 'neutral',
    position: 'neutral',
    other: 'neutral'
  };
  return colorMap[type] ?? 'neutral';
};

const getRelationLabel = (type: string): string => {
  const labelMap: Record<string, string> = {
    person: 'Person',
    event: 'Event',
    award: 'Award',
    city: 'City',
    country: 'Country',
    dynasty: 'Dynasty',
    occupation: 'Occupation',
    position: 'Position',
    other: 'Other'
  };
  return labelMap[type] || 'Other';
};

const navigateToRelation = (node: RelatedNode) => {
  navigateTo(`/infobox/${encodeURIComponent(node.element_id)}`);
};

const handleBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    navigateTo(backButtonConfig.value.to);
  }
};
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <div class="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-6">
        <UButton
          @click="handleBack"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          size="sm"
        >
          {{ backButtonConfig.label }}
        </UButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 mx-auto text-amber-600 dark:text-amber-500 animate-spin mb-4" />
        <p class="text-stone-600 dark:text-stone-400">Loading data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-red-600 dark:text-red-500 mb-4" />
        <h3 class="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Failed to Load Data
        </h3>
        <p class="text-stone-600 dark:text-stone-400 mb-6">{{ error }}</p>
        <UButton @click="handleBack" color="primary">
          Go Back
        </UButton>
      </div>

      <!-- Content -->
      <div v-else-if="rawData" class="grid lg:grid-cols-12 gap-8">
        <!-- Main Content - Infobox -->
        <div class="lg:col-span-8">
          <div class="bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/50 overflow-hidden">
            <div class="p-6 sm:p-8">
              <div class="flex flex-col md:flex-row gap-6 items-end mb-8">
                <div class="flex-1 flex flex-col justify-end">
                  <UBadge
                    :color="entityTypeBadgeColor"
                    variant="solid"
                    size="md"
                    class="mb-3 w-fit"
                  >
                    {{ entityTypeLabel }}
                  </UBadge>
                  <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4 break-words">
                    {{ entityName }}
                  </h1>
                  <div class="prose dark:prose-invert max-w-none">
                    <p class="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                      {{ entityDescription }}
                    </p>
                  </div>
                </div>

                <div class="flex-shrink-0 w-full md:w-48 lg:w-56">
                  <div class="relative h-64 rounded-lg overflow-hidden border-4 border-amber-200 dark:border-amber-900 shadow-lg">
                    <img
                      :src="entityImage"
                      :alt="entityName"
                      class="w-full h-full object-cover"
                      @error="(e) => (e.target as HTMLImageElement).src = '/images/img-placeholder.jpg'"
                    />
                  </div>
                </div>
              </div>

              <UDivider class="my-8" />

              <!-- Facts Table -->
              <div v-if="facts.length > 0">
                <h2 class="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  Detailed Information
                </h2>
                <div class="grid md:grid-cols-2 gap-4">
                  <div
                    v-for="(fact, index) in facts"
                    :key="index"
                    class="bg-amber-50/50 dark:bg-stone-800/50 rounded-lg p-4 border border-amber-100 dark:border-stone-700"
                  >
                    <dt class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                      {{ fact.label }}
                    </dt>
                    <dd class="text-base font-medium text-stone-900 dark:text-stone-100 break-all">
                      {{ fact.value }}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Relations -->
        <div class="lg:col-span-4">
          <div class="sticky top-8 space-y-4">
            <!-- Relations Card -->
            <UCard v-if="rawData.related_nodes && rawData.related_nodes.length > 0">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-link" class="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  <h2 class="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Related Entities
                  </h2>
                </div>
                <p class="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  {{ rawData.related_nodes.length }} relation(s) found
                </p>
              </template>

              <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                <div
                  v-for="node in rawData.related_nodes"
                  :key="node.element_id"
                  class="group p-3 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-stone-900"
                  @click="navigateToRelation(node)"
                >
                  <div class="flex gap-3 items-start">
                    <div class="flex-shrink-0">
                      <img
                        :src="node.properties.image_url || '/images/img-placeholder.jpg'"
                        :alt="getNodeDisplayName(node)"
                        class="w-12 h-12 object-cover rounded-lg border-2 border-amber-200 dark:border-amber-900 group-hover:border-amber-400 dark:group-hover:border-amber-600 transition-colors"
                        @error="(e) => (e.target as HTMLImageElement).src = '/images/img-placeholder.jpg'"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start gap-2 mb-1">
                        <UIcon
                          :name="getRelationIcon(getNodeType(node.labels))"
                          :class="{
                            'text-blue-600 dark:text-blue-500': getNodeType(node.labels) === 'person',
                            'text-orange-600 dark:text-orange-500': getNodeType(node.labels) === 'event',
                            'text-green-600 dark:text-green-500': getNodeType(node.labels) === 'award',
                            'text-cyan-600 dark:text-cyan-500': getNodeType(node.labels) === 'city',
                            'text-purple-600 dark:text-purple-500': getNodeType(node.labels) === 'country' || getNodeType(node.labels) === 'dynasty',
                            'text-stone-600 dark:text-stone-500': getNodeType(node.labels) === 'occupation' || getNodeType(node.labels) === 'position',
                            'text-amber-600 dark:text-amber-500': getNodeType(node.labels) === 'other'
                          }"
                          class="w-4 h-4 mt-0.5 flex-shrink-0"
                        />
                        <div class="flex-1">
                          <h3 class="font-semibold text-stone-900 dark:text-stone-100 text-sm line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                            {{ getNodeDisplayName(node) }}
                          </h3>
                          <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            {{ formatRelationship(node.relationship) }}
                          </p>
                        </div>
                      </div>
                      <UBadge
                        :color="getRelationColor(getNodeType(node.labels))"
                        variant="subtle"
                        size="xs"
                      >
                        {{ getRelationLabel(getNodeType(node.labels)) }}
                      </UBadge>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Info Card -->
            <UCard>
              <div class="text-center">
                <UIcon name="i-heroicons-information-circle" class="w-8 h-8 mx-auto text-amber-600 dark:text-amber-500 mb-3" />
                <p class="text-xs text-stone-600 dark:text-stone-400">
                  This data is sourced from Kaggle & Wikidata and can be further developed.
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for relations */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #b45309;
}
</style>