<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
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
    label: 'Semantic Search',
    to: '/semantic-search',
    active: route.path.startsWith('/semantic-search')
  }
])

const links = computed(() => items.value.map(item => ({
  label: item.label,
  to: item.to
})))
</script>

<template>
  <UHeader 
    :links="links"
    class="border-b border-amber-200 dark:border-amber-900/50"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2">
        <UIcon name="i-heroicons-building-library" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
        <span class="font-bold text-amber-900 dark:text-amber-100">HistoPedia</span>
      </NuxtLink>
    </template>

    <template #default>
      <UNavigationMenu :items="items" class="hidden lg:flex" />
    </template>

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