<template>
  <BaseSpinnerContainer v-if="isLoading" />
  <ApiErrorFallback v-else-if="!isLoading && isError" />
  <section v-else-if="!isLoading && topRatedList.length">
    <BaseCarousel ref="carouselEl" :options="options" autoplay>
      <CarouselSlide v-for="(list, index) in topRatedList" :key="index + 'e' + list.id">
        <HeroSection :media="list" />
        <div class="dots-container"></div>
      </CarouselSlide>
    </BaseCarousel>
    <div v-if="!isLoading && trendingMovies.length" class="mt-24">
      <MediaCarousel title="Trending Movies" :medias="trendingMovies" link="/movies" />
    </div>
    <div v-if="!isLoading && trendingTVShows.length" class="mb-16 mt-36">
      <MediaCarousel title="Trending TV Shows" :medias="trendingTVShows" link="/tv-shows" />
    </div>
  </section>
  <section v-else class="grid h-screen place-items-center">
    <EmptyData />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'
import { useToast } from '@/components/ui/toast/use-toast'

import BaseSpinnerContainer from '@/components/ui/loader/BaseSpinnerContainer.vue'
import ApiErrorFallback from '@/components/ui/error/ApiErrorFallback.vue'
import EmptyData from '@/components/ui/error/EmptyData.vue'
import BaseCarousel from '@/components/ui/carousel/BaseCarousel.vue'
import CarouselSlide from '@/components/ui/carousel/CarouselSlide.vue'
import HeroSection from '@/components/common/HeroSection.vue'
import MediaCarousel from '@/components/MediaCarousel.vue'

const movieStore = useMovieStore()
const tvStore = useTVStore()
const { toast } = useToast()
const isLoading = ref<boolean>(false)
const isError = ref<boolean>(false)
const topRatedMovies = ref<Movie[]>([])
const topRatedTVShows = ref<TV[]>([])
const topRatedList = ref<(Movie | TV)[]>([])
const trendingMovies = ref<Movie[]>([])
const trendingTVShows = ref<TV[]>([])
const carouselEl = ref<InstanceType<typeof BaseCarousel> | null>(null)
const options = reactive({
  Panzoom: {
    touch: false
  },
  Navigation: false,
  Dots: {
    classes: {
      list: 'f-carousel__dots dots-container',
      hasDots: ''
    },
    dynamicFrom: 5
  },
  transition: 'classic',
  Autoplay: {
    timeout: 3000,
    showProgress: false
  }
})

onMounted(async () => {
  await fetchData()
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

async function fetchData(): Promise<void> {
  isLoading.value = true
  isError.value = false
  try {
    await Promise.all([
      getTopRatedMovies(),
      getTopRatedTVShows(),
      getTrendingMovies(),
      getTrendingTVShows()
    ])
    combinedArray()
  } catch (error) {
    isError.value = true
    handleFetchError(error)
  } finally {
    isLoading.value = false
  }
}

async function getTopRatedMovies(): Promise<void> {
  await movieStore.getTopRatedMovies(1)
  topRatedMovies.value = movieStore.topRatedMovies
}

async function getTopRatedTVShows(): Promise<void> {
  await tvStore.getTopRatedTVShows(1)
  topRatedTVShows.value = tvStore.topRatedTVShows
}

async function getTrendingMovies(): Promise<void> {
  await movieStore.getTrendingMovies()
  trendingMovies.value = movieStore.trendingMovies
}

async function getTrendingTVShows(): Promise<void> {
  await tvStore.getTrendingTVShows()
  trendingTVShows.value = tvStore.trendingTVShows
}

function combinedArray(): void {
  const combinedArray = [...topRatedMovies.value, ...topRatedTVShows.value] as [Movie, TV]

  shuffleArray(combinedArray)
}

function shuffleArray(array: [Movie, TV]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  topRatedList.value = array.splice(0, 10)
}

function handleFetchError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.'
  toast({ title: errorMessage, variant: 'destructive' })
}

function handleResize(): void {
  carouselEl.value?.destroyCarousel()
  options.Panzoom.touch = window.innerWidth <= 1024 ? true : false
  carouselEl.value?.initCarousel()
}
</script>
