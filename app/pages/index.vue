<script setup lang="ts">
import { features } from '~/data/features'

useSeoMeta({
  title: 'Museum Knowledge Graph',
  ogTitle: 'Museum Knowledge Graph',
  description: 'Eksplorasi koleksi dan sejarah museum melalui pencarian, query interaktif, dan info box artefak.',
  ogDescription: 'Eksplorasi koleksi dan sejarah museum melalui pencarian, query interaktif, dan info box artefak.'
})
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <!-- Hero Section -->
    <UContainer class="py-16 sm:py-24">
      <div class="text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium mb-6">
          <UIcon name="i-heroicons-building-library" class="w-5 h-5" />
          <span>Digital Museum Collection</span>
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Jelajahi <span class="text-amber-700 dark:text-amber-500">Museum Knowledge Graph</span>
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Temukan, eksplorasi, dan pelajari koleksi artefak serta sejarah museum melalui fitur pencarian, query Cypher interaktif, dan info box artefak yang informatif.
        </p>
      </div>
    </UContainer>

    <!-- Cypher Query Feature - Image Left -->
    <UContainer class="py-16 sm:py-24">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <!-- Left: Laptop Image -->
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

        <!-- Right: Content -->
        <div class="lg:col-span-6">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-stone-900 dark:text-stone-50">
            Eksplorasi Koleksi <span class="text-amber-700 dark:text-amber-500">dengan Query Cypher</span>
          </h2>
          <p class="text-lg text-stone-600 dark:text-stone-400 mb-8">
            Tulis dan jalankan query Cypher untuk menelusuri koleksi artefak, sejarah pameran, dan hubungan antar objek di museum secara mendalam.
          </p>

          <!-- Feature List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Query Koleksi Interaktif</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Telusuri koleksi artefak, galeri, dan pameran dengan query Cypher secara real-time.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Contoh Query Museum</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Gunakan template query untuk eksplorasi koleksi dan sejarah museum.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Hasil Visual Koleksi</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Lihat hasil pencarian dalam format tabel atau visual koleksi yang mudah dipahami.
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
            Mulai Eksplorasi
          </UButton>
        </div>
      </div>
    </UContainer>

    <!-- Search Feature - Image Right -->
    <UContainer class="py-16 sm:py-24 bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-stone-900/50 dark:to-stone-900/30">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <!-- Left: Content -->
        <div class="lg:col-span-6 order-2 lg:order-1 mt-12 lg:mt-0">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-stone-900 dark:text-stone-50">
            Pencarian <span class="text-amber-700 dark:text-amber-500">Artefak & Pameran</span>
          </h2>
          <p class="text-lg text-stone-600 dark:text-stone-400 mb-8">
            Cari artefak, galeri, atau pameran museum secara cepat melalui kolom pencarian yang intuitif. Temukan informasi koleksi dan sejarahnya dengan mudah.
          </p>

          <!-- Feature List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Pencarian Koleksi Cepat</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Temukan artefak, galeri, atau pameran dengan pencarian berbasis kata kunci.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Filter Kategori Koleksi</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Pilih kategori seperti Artefak, Galeri, atau Pameran untuk hasil yang relevan.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Info Box Artefak</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Akses info box dengan detail lengkap tentang artefak dan sejarahnya.
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
            Mulai Eksplorasi
          </UButton>
        </div>

        <!-- Right: Laptop Image -->
        <div class="lg:col-span-6 order-1 lg:order-2">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-600/20 rounded-lg blur-2xl"></div>
            <NuxtImg
              src="/images/search-event.jpg"
              alt="Search Museum Events"
              class="relative w-full h-auto rounded-lg shadow-2xl border border-amber-200 dark:border-amber-900"
              width="600"
              height="400"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>