<template>
  <section v-if="trendingList.length">
    <BaseCarousel ref="carouselEl" :options="options" autoplay>
      <CarouselSlide v-for="(trending, index) in trendingList" :key="index + 'e' + trending.id">
        <HeroSection :trending="trending" />
        <div class="dots-container"></div>
      </CarouselSlide>
    </BaseCarousel>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'
import { useToast } from '@/components/ui/toast/use-toast'

import BaseCarousel from '@/components/ui/carousel/BaseCarousel.vue'
import CarouselSlide from '@/components/ui/carousel/CarouselSlide.vue'
import HeroSection from '@/components/common/HeroSection.vue'

const movieStore = useMovieStore()
const tvStore = useTVStore()
const { toast } = useToast()
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
      list: 'f-carousel__dots dots-container'
    },
    dynamicFrom: 5
  },
  transition: 'classic',
  Autoplay: {
    timeout: 3000,
    showProgress: false
  }
})

const combinedArray = computed<[Movie, TV]>(() => {
  const combinedArray = [...trendingMovies.value, ...trendingTVShows.value] as [Movie, TV]

  return combinedArray
})

const trendingList = computed<[Movie, TV]>(() => {
  const array = combinedArray.value

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
})

onMounted(async () => {
  await getTrendingMovies()
  await getTrendingTVShows()
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

async function getTrendingMovies(): Promise<void> {
  try {
    await movieStore.getTrendingMovies()
    trendingMovies.value = movieStore.trendingMovies
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: error.message,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Unknown error occured.',
        variant: 'destructive'
      })
    }
  }
}

async function getTrendingTVShows(): Promise<void> {
  try {
    await tvStore.getTrendingTVShows()
    trendingTVShows.value = tvStore.trendingTVShows
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: error.message,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Unknown error occured.',
        variant: 'destructive'
      })
    }
  }
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
