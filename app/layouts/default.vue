<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Dashboard',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Cypher Query',
    to: '/cypher',
    active: route.path.startsWith('/cypher')
  },
  {
    label: 'Search',
    to: '/search',
    active: route.path.startsWith('/search')
  },
  {
    label: 'Infobox',
    to: '/infobox',
    active: route.path.startsWith('/infobox')
  }
])
</script>

<template>
  <UHeader>
    <template #title>
      <span class="font-bold text-primary">Kenisha's Graph</span>
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