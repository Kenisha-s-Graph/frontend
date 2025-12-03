<script setup lang="ts">
import { features } from '~/data/features'

useSeoMeta({
  title: 'Historical Knowledge Graph - BC to AD',
  ogTitle: 'Historical Knowledge Graph - BC to AD',
  description: 'Explore historical figures and events from BC to AD era, from Zoro to Nero through an interactive Knowledge Graph.',
  ogDescription: 'Explore historical figures and events from BC to AD era, from Zoro to Nero through an interactive Knowledge Graph.'
})
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <!-- Hero Section -->
    <UContainer class="py-16 sm:py-24">
      <div class="text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Explore <span class="text-amber-700 dark:text-amber-500">Historical Events and People</span>
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Discover historical figures and events from the Before Christ to Anno Domini era. Explore relationships between figures, important events, and their historical legacy through an interactive Knowledge Graph.
        </p>
      </div>
    </UContainer>

    <!-- Cypher Query Feature - Image Left -->
    <UContainer class="py-16 sm:py-24">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <div class="lg:col-span-6 mb-12 lg:mb-0">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-lg blur-2xl"></div>
            <NuxtImg
              src="/images/cypher-img.png"
              alt="Cypher Query Interface"
              class="relative w-full h-auto rounded-lg shadow-2xl border border-amber-200 dark:border-amber-900"
              width="600"
              height="400"
            />
          </div>
        </div>

        <div class="lg:col-span-6">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-stone-900 dark:text-stone-50">
            Query <span class="text-amber-700 dark:text-amber-500">with Cypher</span>
          </h2>
          <p class="text-lg text-stone-600 dark:text-stone-400 mb-8">
            Explore historical data with Cypher query language. Discover relationships between historical figures, important events, and their legacies from BC to AD era in depth.
          </p>

          <!-- Feature List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Real-Time Interactive Query</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Run Cypher queries to explore historical figures, dynasties, events, and their relationships.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Historical Query Templates</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Use example queries to find Roman emperors, Greek philosophers, or historical events.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Historical Data Visualization</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  View query results in an easy-to-understand table format with complete property details.
                </p>
              </div>
            </div>
          </div>

          <UButton
            to="/cypher"
            size="lg"
            color="primary"
            icon="i-heroicons-arrow-right"
            trailing
            class="shadow-lg shadow-amber-500/20"
          >
            Start Historical Query
          </UButton>
        </div>
      </div>
    </UContainer>

    <!-- Search Feature - Image Right -->
    <UContainer class="py-16 sm:py-24 bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-stone-900/50 dark:to-stone-900/30">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <div class="lg:col-span-6 order-2 lg:order-1 mt-12 lg:mt-0">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-stone-900 dark:text-stone-50">
            Search for <span class="text-amber-700 dark:text-amber-500">Historical Figures & Events</span>
          </h2>
          <p class="text-lg text-stone-600 dark:text-stone-400 mb-8">
            Find historical figures from Zoro to Nero, or important events from BC to AD era. Search by name, position, country, or event impact with fast and accurate search.
          </p>

          <!-- Feature List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Smart Search with Auto-Suggest</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Type a figure or event name and get automatic suggestions for relevant results.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Filter by Location & Type</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Filter search results by country, continent, or entity type (figure/event).
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Detailed Infobox with Relations</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  View complete information about figures or events along with their relationships to other entities.
                </p>
              </div>
            </div>
          </div>

          <UButton
            to="/search"
            size="lg"
            color="primary"
            icon="i-heroicons-arrow-right"
            trailing
            class="shadow-lg shadow-amber-500/20"
          >
            Start Searching
          </UButton>
        </div>

        <div class="lg:col-span-6 order-1 lg:order-2">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-600/20 rounded-lg blur-2xl"></div>
            <NuxtImg
              src="/images/search-event.jpg"
              alt="Search Historical Events and People"
              class="relative w-full h-auto rounded-lg shadow-2xl border border-amber-200 dark:border-amber-900"
              width="600"
              height="400"
            />
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Semantic Search Feature - Image Left -->
    <UContainer class="py-16 sm:py-24">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <div class="lg:col-span-6 mb-12 lg:mb-0">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-lg blur-2xl"></div>
            <NuxtImg
              src="/images/semantic-search.png"
              alt="Semantic Search Interface"
              class="relative w-full h-auto rounded-lg shadow-2xl border border-amber-200 dark:border-amber-900"
              width="600"
              height="400"
            />
          </div>
        </div>

        <div class="lg:col-span-6">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-stone-900 dark:text-stone-50">
            <span class="text-amber-700 dark:text-amber-500">Semantic Search</span> by Concept
          </h2>
          <p class="text-lg text-stone-600 dark:text-stone-400 mb-8">
            Discover historical figures and events based on meaning and context using vector embeddings. Search for abstract concepts like "religion" or "philosophy" to find semantically related results.
          </p>

          <!-- Feature List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Vector Embedding Similarity</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Find results based on semantic meaning using vector embedding similarity algorithms.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Relevance Scoring</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  See similarity scores to understand how closely each result matches your search concept.
                </p>
              </div>
            </div>
          </div>

          <UButton
            to="/semantic-search"
            size="lg"
            color="primary"
            icon="i-heroicons-sparkles"
            trailing
            class="shadow-lg shadow-amber-500/20"
          >
            Try Semantic Search
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>