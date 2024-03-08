<template>
  <BaseSpinnerContainer v-if="isLoading" />
  <ApiErrorFallback v-else-if="!isLoading && isError" />
  <section v-else class="pt-32 sm:pt-36 lg:pt-40 2xl:pt-44">
    <BaseContainer>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <select v-model="filters.type" class="bg-transparent outline-none">
            <option class="bg-custom-bg" value="all">All</option>
            <option class="bg-custom-bg" value="popular">Popular</option>
            <option class="bg-custom-bg" value="top-rated">Top Rated</option>
          </select>
          <Separator orientation="vertical" class="!h-4" />
          <select
            ref="genreDropdown"
            class="bg-transparent outline-none"
            @change="handleGenreFilter"
          >
            <option class="bg-custom-bg" selected disabled>Genre</option>
            <option v-for="genre in genres" :key="genre.id" class="bg-custom-bg" :value="genre.id">
              {{ genre.name }}
            </option>
          </select>
        </div>
        <div v-if="filteredMedias.length" class="space-x-3">
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
      <template v-if="filteredMedias.length">
        <div
          v-if="layout === 'grid'"
          class="mt-5 grid place-items-center gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <template v-for="media in filteredMedias" :key="media.id">
            <MediaCardGrid :media="media" :img-width="imgWidth" />
          </template>
        </div>
        <div
          v-if="layout === 'list'"
          class="mt-7 grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3"
        >
          <MediaCardList v-for="media in filteredMedias" :key="media.id" :media="media" />
        </div>
        <div class="mb-8 mt-16 flex justify-center">
          <Pagination
            v-model:page="currentPage"
            :total="500"
            :sibling-count="1"
            :items-per-page="1"
            :default-page="1"
            :show-edges="showPaginationEdges"
            @update:page="changeQueryPage"
          >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst
                class="size-8 border-0 bg-primary hover:bg-custom-primary xs:size-10"
              />
              <PaginationPrev
                class="size-8 border-0 bg-primary hover:bg-custom-primary xs:size-10"
              />
              <template v-for="(item, index) in items" :key="item">
                <PaginationListItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                >
                  <Button
                    class="size-8 p-0 hover:bg-custom-primary xs:size-10"
                    :class="{
                      'bg-custom-primary': item.value === currentPage
                    }"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>
              <PaginationNext
                class="size-8 border-0 bg-primary hover:bg-custom-primary xs:size-10"
              />
              <PaginationLast
                class="size-8 border-0 bg-primary hover:bg-custom-primary xs:size-10"
              />
            </PaginationList>
          </Pagination>
        </div>
      </template>
      <EmptyData v-else class="py-16" />
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movies'
import type { Movie, Genre } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'
import { useCommonStore } from '@/stores/common'
import { useToast } from '@/components/ui/toast/use-toast'

import BaseSpinnerContainer from '@/components/ui/loader/BaseSpinnerContainer.vue'
import ApiErrorFallback from '@/components/ui/error/ApiErrorFallback.vue'
import EmptyData from '@/components/ui/error/EmptyData.vue'
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import MediaCardList from '@/components/MediaCardList.vue'
import MediaCardGrid from '@/components/MediaCardGrid.vue'
import { X, LayoutGrid, LayoutList } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()
const tvStore = useTVStore()
const commonStore = useCommonStore()
const { toast } = useToast()
const medias = ref<(Movie | TV)[]>([])
const isLoading = ref<boolean>(false)
const isError = ref<boolean>(false)
const imgWidth = ref<number>(200)
const genres = ref<Genre[]>([])
const filters = reactive({
  type: 'all',
  genres: [] as number[]
})
const genreDropdown = ref<HTMLSelectElement | null>(null)
const currentPage = ref<number>(1)
const showPaginationEdges = ref<boolean>(false)

const layout = computed<string>(() => {
  return commonStore.layout
})

const filteredMedias = computed<(Movie | TV)[]>(() => {
  if (filters.genres.length === 0) return medias.value

  return medias.value.filter((media) => {
    return media.genre_ids?.some((genreId) => filters.genres.includes(genreId))
  })
})

const filteredGenres = computed<Genre[]>(() => {
  return genres.value.filter((genre) => filters.genres.includes(genre.id))
})

watch(
  () => filters.type,
  (newValue) => {
    initData(newValue)
  },
  { deep: true }
)

watch(
  () => filters.genres,
  (newValue) => {
    if (newValue.length === 0 && genreDropdown.value) {
      genreDropdown.value.selectedIndex = 0
    }
  },
  { deep: true }
)

watchEffect(async () => {
  getCurrentPage()
  initData()
  await fetchAllGenres()
})

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function getCurrentPage() {
  const page = route.query.page

  if (typeof page === 'string') {
    const newPage = parseInt(page)
    currentPage.value = isNaN(newPage) ? 1 : newPage
    return
  }

  currentPage.value = 1
}

async function initData(type: string = 'all') {
  isLoading.value = true
  isError.value = false

  const fetchFunctions: Record<string, () => Promise<void>> = {
    all: fetchAllMedia,
    popular: fetchPopularMedia,
    'top-rated': fetchTopRatedMedia
  }

  const fetchFunction = fetchFunctions[type as keyof typeof fetchFunctions]

  if (fetchFunction) {
    try {
      await fetchFunction()
    } catch (error) {
      isError.value = true
      handleFetchError(error)
    } finally {
      isLoading.value = false
    }
  } else {
    isLoading.value = false
    isError.value = false
  }
}

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
  await movieStore.getMovies(currentPage.value)
  medias.value = movieStore.movies
}

async function getPopularMovies(): Promise<void> {
  await movieStore.getPopularMovies(currentPage.value)
  medias.value = movieStore.popularMovies
}

async function getTopRatedMovies(): Promise<void> {
  await movieStore.getTopRatedMovies(currentPage.value)
  medias.value = movieStore.topRatedMovies
}

async function getTVShowsGenres(): Promise<void> {
  await tvStore.getGenres()
  genres.value = tvStore.genres
}

async function getTVShows(): Promise<void> {
  await tvStore.getTVShows(currentPage.value)
  medias.value = tvStore.tvShows
}

async function getPopularTVShows(): Promise<void> {
  await tvStore.getPopularTVShows(currentPage.value)
  medias.value = tvStore.popularTVShows
}

async function getTopRatedTVShows(): Promise<void> {
  await tvStore.getTopRatedTVShows(currentPage.value)
  medias.value = tvStore.topRatedTVShows
}

function handleFetchError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.'
  toast({ title: errorMessage, variant: 'destructive' })
}

function handleResize(): void {
  imgWidth.value = window.innerWidth < 768 ? 342 : 200
  showPaginationEdges.value = window.innerWidth >= 640
}

async function changeLayout(layout: string): Promise<void> {
  if (layout !== commonStore.layout) {
    isLoading.value = true
    commonStore.$patch({
      layout: layout
    })
    handleResize()
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

function changeQueryPage(value: number) {
  router.push({ path: route.path, query: { page: value } })
}
</script>
