<template>
  <div v-if="isLoading" class="grid h-screen place-items-center">
    <BaseSpinner />
  </div>
  <section v-else-if="!isLoading && medias.length" class="pt-48">
    <BaseContainer>
      <div>
        <div class="flex items-center justify-between">
          All
          <div class="space-x-3">
            <button
              type="button"
              class="transition-colors hover:text-custom-primary"
              :class="{ 'text-custom-primary': layout === 'grid' }"
              @click="changeLayout('grid')"
            >
              <LayoutGrid :size="24" />
            </button>
            <button
              type="button"
              class="transition-colors hover:text-custom-primary"
              :class="{ 'text-custom-primary': layout === 'list' }"
              @click="changeLayout('list')"
            >
              <LayoutList :size="24" />
            </button>
          </div>
        </div>
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
        v-if="layout === 'grid'"
        class="mt-7 grid place-items-center gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <template v-for="media in medias" :key="media.id">
          <MediaCardGrid :media="media" :img-width="imgWidth" />
        </template>
      </div>
      <div
        v-if="layout === 'list'"
        class="mt-7 grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3"
      >
        <MediaCardList v-for="media in medias" :key="media.id" :media="media" />
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'
import { useCommonStore } from '@/stores/common'
import { useToast } from '@/components/ui/toast/use-toast'

import BaseSpinner from '@/components/ui/loader/BaseSpinner.vue'
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import MediaCardList from '@/components/MediaCardList.vue'
import MediaCardGrid from '@/components/MediaCardGrid.vue'
import { X, LayoutGrid, LayoutList } from 'lucide-vue-next'

const route = useRoute()
const movieStore = useMovieStore()
const tvStore = useTVStore()
const commonStore = useCommonStore()
const { toast } = useToast()
const medias = ref<(Movie | TV)[]>([])
const isLoading = ref<boolean>(false)
const imgWidth = ref<number>(200)

const layout = computed<string>(() => {
  return commonStore.layout
})

watchEffect(async () => {
  isLoading.value = true
  try {
    if (route.path === '/movies') {
      await getMovies()
    } else if (route.path === '/tv-shows') {
      await getTVShows()
    }
  } catch (error) {
    handleFetchError(error)
  } finally {
    isLoading.value = false
  }
})

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

async function getMovies(): Promise<void> {
  await movieStore.getMovies()
  medias.value = movieStore.movies
}

async function getTVShows(): Promise<void> {
  await tvStore.getTVShows()
  medias.value = tvStore.tvShows
}

function handleFetchError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.'
  toast({ title: errorMessage, variant: 'destructive' })
}

function handleResize(): void {
  imgWidth.value = window.innerWidth < 768 ? 342 : 200
}

async function changeLayout(layout: string): Promise<void> {
  if (layout !== commonStore.layout) {
    isLoading.value = true
    commonStore.$patch({
      layout: layout
    })
    await nextTick()
    isLoading.value = false
  }
}
</script>
