<script setup lang="ts">
import CypherQueryEditor from '~/components/cypher/CypherQueryEditor.vue'

useSeoMeta({
  title: 'Cypher Query - Museum Knowledge Graph',
  ogTitle: 'Cypher Query - Museum Knowledge Graph',
  description: 'Query koleksi dan sejarah museum menggunakan bahasa Cypher.',
  ogDescription: 'Query koleksi dan sejarah museum menggunakan bahasa Cypher.'
})
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <div class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium mb-4">
          <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
          <span>Query Cypher Museum</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-stone-900 dark:text-stone-50">
          Cypher Query Interface
        </h1>
        <p class="text-lg text-stone-600 dark:text-stone-400">
          Query koleksi artefak, galeri, dan pameran museum menggunakan bahasa Cypher.
        </p>
      </div>
      <CypherQueryEditor />
    </div>
  </div>
</template>