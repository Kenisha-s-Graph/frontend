<script setup lang="ts">
import CypherQueryEditor from '~/components/cypher/CypherQueryEditor.vue'

useSeoMeta({
  title: 'Cypher Query - Historical Knowledge Graph',
  ogTitle: 'Cypher Query - Historical Knowledge Graph',
  description: 'Query data historis dari era BC hingga AD menggunakan bahasa Cypher. Eksplorasi tokoh dan peristiwa sejarah secara mendalam.',
  ogDescription: 'Query data historis dari era BC hingga AD menggunakan bahasa Cypher. Eksplorasi tokoh dan peristiwa sejarah secara mendalam.'
})
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <div class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-stone-900 dark:text-stone-50">
          Cypher Query Interface
        </h1>
        <p class="text-lg text-stone-600 dark:text-stone-400">
          Eksplorasi data sejarah dari era BC hingga AD dengan query Cypher interaktif
        </p>
      </div>
      <CypherQueryEditor />
    </div>
  </div>
</template>