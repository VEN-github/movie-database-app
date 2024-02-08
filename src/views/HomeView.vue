<template>
  <div v-if="isLoading" class="grid h-screen place-items-center">
    <BaseSpinner />
  </div>
  <section v-else-if="!isLoading && trendingList.length">
    <BaseCarousel ref="carouselEl" :options="options" autoplay>
      <CarouselSlide v-for="(trending, index) in trendingList" :key="index + 'e' + trending.id">
        <HeroSection :trending="trending" />
        <div class="dots-container"></div>
      </CarouselSlide>
    </BaseCarousel>
  </section>
  <section v-if="trendingMovies.length" class="mt-24">
    <MediaCarousel title="Trending Movies" :medias="trendingMovies" />
  </section>
  <section v-if="trendingTVShows.length" class="mb-16 mt-36">
    <MediaCarousel title="Trending TV Shows" :medias="trendingTVShows" />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'
import { useToast } from '@/components/ui/toast/use-toast'

import BaseCarousel from '@/components/ui/carousel/BaseCarousel.vue'
import CarouselSlide from '@/components/ui/carousel/CarouselSlide.vue'
import HeroSection from '@/components/common/HeroSection.vue'
import BaseSpinner from '@/components/ui/loader/BaseSpinner.vue'
import MediaCarousel from '@/components/MediaCarousel.vue'

const movieStore = useMovieStore()
const tvStore = useTVStore()
const { toast } = useToast()
const isLoading = ref<boolean>(false)
const trendingMovies = ref<Movie[]>([])
const trendingTVShows = ref<TV[]>([])
const trendingList = ref<(Movie | TV)[]>([])
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
  await Promise.all([getTrendingMovies(), getTrendingTVShows()])
  combinedArray()
  isLoading.value = false
}

async function getTrendingMovies(): Promise<void> {
  try {
    await movieStore.getTrendingMovies()
    trendingMovies.value = movieStore.trendingMovies
  } catch (error) {
    handleFetchError(error)
  }
}

async function getTrendingTVShows(): Promise<void> {
  try {
    await tvStore.getTrendingTVShows()
    trendingTVShows.value = tvStore.trendingTVShows
  } catch (error) {
    handleFetchError(error)
  }
}

function combinedArray(): void {
  const combinedArray = [...trendingMovies.value, ...trendingTVShows.value] as [Movie, TV]

  shuffleArray(combinedArray)
}

function shuffleArray(array: [Movie, TV]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  trendingList.value = array.splice(0, 10)
}

function handleFetchError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.'
  toast({ title: errorMessage, variant: 'destructive' })
}

function handleResize(): void {
  carouselEl.value?.destroyCarousel()
  if (window.innerWidth <= 1024) {
    options.Panzoom.touch = true
  } else {
    options.Panzoom.touch = false
  }
  carouselEl.value?.initCarousel()
}
</script>
