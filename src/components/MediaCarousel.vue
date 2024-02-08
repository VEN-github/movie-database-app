<template>
  <BaseContainer>
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-x-4">
        <h2 class="text-4xl font-semibold">{{ title }}</h2>
        <div class="nav-container flex items-center">
          <button
            type="button"
            class="nav-button disabled:text-primary"
            @click="carouselEl?.slidePrev"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            class="nav-button disabled:text-primary"
            @click="carouselEl?.slideNext"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <p class="flex items-center gap-x-1 font-medium text-custom-secondary">
        View all <ChevronRight :size="18" />
      </p>
    </div>
    <BaseCarousel
      ref="carouselEl"
      :options="options"
      style="--f-carousel-spacing: 60px; --f-carousel-slide-width: fit-content"
    >
      <CarouselSlide v-for="media in medias" :key="media.id">
        <MovieCard :media="media" />
      </CarouselSlide>
    </BaseCarousel>
  </BaseContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Movie } from '@/services/movies/types'
import type { TV } from '@/services/tv/types'

import BaseCarousel from '@/components/ui/carousel/BaseCarousel.vue'
import CarouselSlide from '@/components/ui/carousel/CarouselSlide.vue'
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import MovieCard from './MovieCard.vue'

defineProps<{
  title: string
  medias: (Movie | TV)[]
}>()

const carouselEl = ref<InstanceType<typeof BaseCarousel> | null>(null)
const options = reactive({
  transition: 'slide',
  Navigation: false,
  Dots: false
})
</script>
