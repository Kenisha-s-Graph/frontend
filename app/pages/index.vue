<script setup lang="ts">
import { features } from '~/data/features'
import { navigateTo } from '#app'

useSeoMeta({
  title: 'Historical Knowledge Graph',
  ogTitle: 'Historical Knowledge Graph',
  description: 'Eksplorasi pengetahuan sejarah melalui pencarian, query interaktif, dan info box entitas.',
  ogDescription: 'Eksplorasi pengetahuan sejarah melalui pencarian, query interaktif, dan info box entitas.'
})
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Hero Section -->
    <UContainer class="py-16 sm:py-24">
      <div class="text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          Jelajahi <span class="text-primary">Knowledge Graph</span> Sejarah
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Temukan, eksplorasi, dan pelajari entitas sejarah melalui fitur pencarian, query Cypher interaktif, dan info box yang informatif.
        </p>
      </div>

      <!-- Feature Cards -->
      <div class="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <UCard
          v-for="feature in features"
          :key="feature.id"
          class="relative p-6 sm:p-8 rounded-2xl transition-all hover:shadow-lg"
          :class="{ 'cursor-pointer': feature.available }"
          @click="feature.available && navigateTo(feature.route)"
        >
          <!-- Feature Image -->
          <div class="mb-6 aspect-[4/3] rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            <UIcon
              v-if="feature.icon"
              :name="feature.icon"
              class="w-24 h-24 text-primary/20"
            />
          </div>

          <!-- Feature Content -->
          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-semibold mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ feature.description }}
              </p>
            </div>

            <!-- Status Badge -->
            <div class="pt-2">
              <UBadge
                v-if="!feature.available"
                color="neutral"
                variant="subtle"
                size="sm"
              >
                Segera Hadir
              </UBadge>
              <UBadge
                v-else
                color="primary"
                variant="subtle"
                size="sm"
              >
                Tersedia
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>