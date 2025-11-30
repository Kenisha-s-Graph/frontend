<script setup lang="ts">
import { features } from '~/data/features'

useSeoMeta({
  title: 'Historical Knowledge Graph - BC to AD',
  ogTitle: 'Historical Knowledge Graph - BC to AD',
  description: 'Jelajahi tokoh dan peristiwa sejarah dari era BC hingga AD, dari Zoro hingga Nero melalui Knowledge Graph interaktif.',
  ogDescription: 'Jelajahi tokoh dan peristiwa sejarah dari era BC hingga AD, dari Zoro hingga Nero melalui Knowledge Graph interaktif.'
})
</script>

<template>
  <div class="relative min-h-screen bg-amber-50/30 dark:bg-stone-950">
    <!-- Hero Section -->
    <UContainer class="py-16 sm:py-24">
      <div class="text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Jelajahi <span class="text-amber-700 dark:text-amber-500">Historical Event and People</span>
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Temukan tokoh dan peristiwa bersejarah dari era Before Christ hingga Anno Domini. Eksplorasi hubungan antar tokoh, peristiwa penting, dan warisan sejarah mereka melalui Knowledge Graph interaktif.
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
            Query <span class="text-amber-700 dark:text-amber-500">dengan Cypher</span>
          </h2>
          <p class="text-lg text-stone-600 dark:text-stone-400 mb-8">
            Eksplorasi data historis dengan bahasa query Cypher. Telusuri hubungan antar tokoh sejarah, peristiwa penting, dan warisan mereka dari era BC hingga AD secara mendalam.
          </p>

          <!-- Feature List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Query Interaktif Real-Time</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Jalankan query Cypher untuk mengeksplorasi tokoh sejarah, dinasti, peristiwa, dan hubungan mereka.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Template Query Sejarah</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Gunakan contoh query untuk menemukan kaisar Romawi, filsuf Yunani, atau peristiwa bersejarah.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Visualisasi Data Historis</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Lihat hasil query dalam format tabel yang mudah dipahami dengan detail properti lengkap.
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
            Mulai Query Sejarah
          </UButton>
        </div>
      </div>
    </UContainer>

    <!-- Search Feature - Image Right -->
    <UContainer class="py-16 sm:py-24 bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-stone-900/50 dark:to-stone-900/30">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <div class="lg:col-span-6 order-2 lg:order-1 mt-12 lg:mt-0">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-stone-900 dark:text-stone-50">
            Pencarian <span class="text-amber-700 dark:text-amber-500">Tokoh & Peristiwa Sejarah</span>
          </h2>
          <p class="text-lg text-stone-600 dark:text-stone-400 mb-8">
            Temukan tokoh bersejarah dari Zoro hingga Nero, atau peristiwa penting dari era BC hingga AD. Cari berdasarkan nama, posisi, negara, atau dampak peristiwa dengan pencarian yang cepat dan akurat.
          </p>

          <!-- Feature List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Pencarian Cerdas dengan Auto-Suggest</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Ketik nama tokoh atau peristiwa dan dapatkan saran otomatis untuk hasil yang relevan.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Filter Berdasarkan Lokasi & Tipe</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Filter hasil pencarian berdasarkan negara, benua, atau tipe entitas (tokoh/peristiwa).
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-amber-700 dark:text-amber-500" />
              </div>
              <div>
                <h3 class="font-semibold mb-1 text-stone-900 dark:text-stone-100">Infobox Detail dengan Relasi</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm">
                  Lihat informasi lengkap tokoh atau peristiwa beserta hubungan mereka dengan entitas lain.
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
            Mulai Pencarian
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
  </div>
</template>