<script setup lang="ts">
import CypherQueryEditor from '~/components/cypher/CypherQueryEditor.vue'

useSeoMeta({
  title: 'Cypher Query - Historical Knowledge Graph',
  ogTitle: 'Cypher Query - Historical Knowledge Graph',
  description: 'Query historical knowledge graph using Cypher query language.',
  ogDescription: 'Query historical knowledge graph using Cypher query language.'
})
</script>

<template>
  <div class="relative min-h-screen">
    <UContainer class="py-16">
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Cypher Query Interface
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Query historical events and people using Cypher query language
        </p>
      </div>
      <CypherQueryEditor />
    </UContainer>
  </div>
</template>