<template>
  <div v-if="isLoading" class="grid h-screen place-items-center">
    <BaseSpinner />
  </div>
  <section v-else-if="!isLoading && medias.length" class="pt-48">
    <BaseContainer>
      <div class="mb-7 px-5">
        <div>All</div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <span
            class="flex items-center gap-x-1.5 rounded-full bg-custom-secondary px-3 py-1 text-sm font-medium"
            >Action <X :size="13" />
          </span>
          <span
            class="flex items-center gap-x-1.5 rounded-full bg-custom-secondary px-3 py-1 text-sm font-medium"
            >Drama <X :size="13" />
          </span>
        </div>
      </div>

      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] place-items-center gap-x-2 gap-y-10"
      >
        <template v-for="media in medias" :key="media.id">
          <MediaCard :media="media" />
        </template>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'
import { useToast } from '@/components/ui/toast/use-toast'

import BaseSpinner from '@/components/ui/loader/BaseSpinner.vue'
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import MediaCard from '@/components/MediaCard.vue'
import { X } from 'lucide-vue-next'

const route = useRoute()
const movieStore = useMovieStore()
const tvStore = useTVStore()
const { toast } = useToast()
const medias = ref<(Movie | TV)[]>([])
const isLoading = ref<boolean>(false)

watchEffect(async () => {
  if (route.path === '/movies') {
    isLoading.value = true
    await getMovies()
    isLoading.value = false
  }
  if (route.path === '/tv-shows') {
    isLoading.value = true
    await getTVShows()
    isLoading.value = false
  }
})

async function getMovies(): Promise<void> {
  try {
    await movieStore.getMovies()
    medias.value = movieStore.movies
  } catch (error) {
    handleFetchError(error)
  }
}

async function getTVShows(): Promise<void> {
  try {
    await tvStore.getTVShows()
    medias.value = tvStore.tvShows
  } catch (error) {
    handleFetchError(error)
  }
}

function handleFetchError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.'
  toast({ title: errorMessage, variant: 'destructive' })
}
</script>
