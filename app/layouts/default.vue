<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Museum',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Query Cypher',
    to: '/cypher',
    active: route.path.startsWith('/cypher')
  },
  {
    label: 'Pencarian',
    to: '/search',
    active: route.path.startsWith('/search')
  }
])
</script>

<template>
  <UHeader class="border-b border-amber-200 dark:border-amber-900/50">
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-building-library" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
        <span class="font-bold text-amber-900 dark:text-amber-100">HistoPedia</span>
      </div>
    </template>
    <UNavigationMenu :items="items" />
    <template #right>
      <UColorModeButton />
      <UTooltip text="GitHub">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/Kenisha-s-Graph"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>