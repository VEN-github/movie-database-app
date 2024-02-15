<template>
  <div v-if="isLoading" class="grid h-screen place-items-center">
    <BaseSpinner />
  </div>
  <section v-else-if="!isLoading && medias.length" class="pt-48">
    <BaseContainer>
      <div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <select v-model="filters.type" class="bg-transparent">
              <option class="bg-red-300" value="all">All</option>
              <option class="bg-red-300" value="popular">Popular</option>
              <option class="bg-red-300" value="top rated">Top Rated</option>
            </select>
            <Separator orientation="vertical" class="!h-4" />
            <select class="bg-transparent" @change="handleGenreFilter">
              <option value="">Genre</option>
              <option v-for="genre in genres" :key="genre.id" class="bg-red-300" :value="genre.id">
                {{ genre.name }}
              </option>
            </select>
          </div>
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
        <div v-if="filteredGenres.length" class="mt-3 flex flex-wrap items-center gap-2">
          <span
            v-for="genre in filteredGenres"
            :key="genre.id"
            class="flex items-center gap-x-1.5 rounded-full bg-custom-secondary px-3 py-1 text-sm font-medium"
            >{{ genre.name }}
            <button type="button" @click="removeFilterGenre(genre.id)"><X :size="13" /></button>
          </span>
        </div>
      </div>
      <div
        v-if="layout === 'grid'"
        class="mt-5 grid place-items-center gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <template v-for="media in filteredMedia" :key="media.id">
          <MediaCardGrid :media="media" :img-width="imgWidth" />
        </template>
      </div>
      <div
        v-if="layout === 'list'"
        class="mt-7 grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3"
      >
        <MediaCardList v-for="media in filteredMedia" :key="media.id" :media="media" />
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/movies'
import type { Movie, Genre } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'
import { useCommonStore } from '@/stores/common'
import { useToast } from '@/components/ui/toast/use-toast'

import BaseSpinner from '@/components/ui/loader/BaseSpinner.vue'
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import MediaCardList from '@/components/MediaCardList.vue'
import MediaCardGrid from '@/components/MediaCardGrid.vue'
import { X, LayoutGrid, LayoutList } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const movieStore = useMovieStore()
const tvStore = useTVStore()
const commonStore = useCommonStore()
const { toast } = useToast()
const medias = ref<(Movie | TV)[]>([])
const isLoading = ref<boolean>(false)
const imgWidth = ref<number>(200)
const genres = ref<Genre[]>([])
const filters = reactive({
  type: 'all',
  genres: [] as number[]
})

const layout = computed<string>(() => {
  return commonStore.layout
})

const filteredMedia = computed<(Movie | TV)[]>(() => {
  if (filters.genres.length === 0) return medias.value

  return medias.value.filter((media) => {
    return media.genre_ids.some((genreId) => filters.genres.includes(genreId))
  })
})

const filteredGenres = computed<Genre[]>(() => {
  return genres.value.filter((genre) => filters.genres.includes(genre.id))
})

watch(
  () => filters.type,
  async (newValue) => {
    const fetchFunctions: Record<string, () => Promise<void>> = {
      all: fetchAllMedia,
      popular: fetchPopularMedia,
      'top rated': fetchTopRatedMedia
    }
    const fetchFunction = fetchFunctions[newValue as keyof typeof fetchFunctions]

    if (fetchFunction) {
      isLoading.value = true
      try {
        await fetchFunction()
      } catch (error) {
        handleFetchError(error)
      } finally {
        isLoading.value = false
      }
    }
  },
  { deep: true }
)

watchEffect(async () => {
  isLoading.value = true
  try {
    await fetchAllGenres()
    await fetchAllMedia()
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

async function fetchAllGenres() {
  if (route.path === '/movies') {
    await getMovieGenres()
  } else if (route.path === '/tv-shows') {
    await getTVShowsGenres()
  }
}

async function fetchAllMedia() {
  if (route.path === '/movies') {
    await getMovies()
  } else if (route.path === '/tv-shows') {
    await getTVShows()
  }
}

async function fetchPopularMedia() {
  if (route.path === '/movies') {
    await getPopularMovies()
  } else if (route.path === '/tv-shows') {
    await getPopularTVShows()
  }
}

async function fetchTopRatedMedia() {
  if (route.path === '/movies') {
    await getTopRatedMovies()
  } else if (route.path === '/tv-shows') {
    await getTopRatedTVShows()
  }
}

async function getMovieGenres(): Promise<void> {
  await movieStore.getGenres()
  genres.value = movieStore.genres
}

async function getMovies(): Promise<void> {
  await movieStore.getMovies()
  medias.value = movieStore.movies
}

async function getPopularMovies(): Promise<void> {
  await movieStore.getPopularMovies()
  medias.value = movieStore.popularMovies
}

async function getTopRatedMovies(): Promise<void> {
  await movieStore.getTopRatedMovies()
  medias.value = movieStore.topRatedMovies
}

async function getTVShowsGenres(): Promise<void> {
  await tvStore.getGenres()
  genres.value = tvStore.genres
}

async function getTVShows(): Promise<void> {
  await tvStore.getTVShows()
  medias.value = tvStore.tvShows
}

async function getPopularTVShows(): Promise<void> {
  await tvStore.getPopularTVShows()
  medias.value = tvStore.popularTVShows
}

async function getTopRatedTVShows(): Promise<void> {
  await tvStore.getTopRatedTVShows()
  medias.value = tvStore.topRatedTVShows
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

function handleGenreFilter(e: Event): void {
  const selectedGenre = (e.target as HTMLInputElement).value
  filters.genres.push(parseInt(selectedGenre))
}

function removeFilterGenre(id: number): void {
  const index = filters.genres.findIndex((genre) => genre === id)
  filters.genres.splice(index, 1)
}
</script>
