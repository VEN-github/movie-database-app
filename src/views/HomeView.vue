<template>
  <section v-if="movies.length">
    <BaseCarousel :options="options" autoplay>
      <CarouselSlide v-for="movie in movies" :key="movie.id">
        <HeroSection :movie="movie" />
        <div class="dots-container"></div>
      </CarouselSlide>
    </BaseCarousel>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/services/movies/types'
import { useToast } from '@/components/ui/toast/use-toast'

import BaseCarousel from '@/components/ui/carousel/BaseCarousel.vue'
import CarouselSlide from '@/components/ui/carousel/CarouselSlide.vue'
import HeroSection from '@/components/common/HeroSection.vue'

const movieStore = useMovieStore()
const { toast } = useToast()
const movies = ref<Movie[]>([])
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

onMounted(async () => {
  await getMovies()
})

async function getMovies() {
  try {
    await movieStore.getMovies()
    movies.value = movieStore.movies.splice(0, 10)
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: error.message,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Unknown error occured',
        variant: 'destructive'
      })
    }
  }
}
</script>
