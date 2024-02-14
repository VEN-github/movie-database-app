<template>
  <BaseContainer>
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-x-4">
        <h2 class="text-sm font-semibold xs:text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl">
          {{ title }}
        </h2>
        <div class="nav-container hidden sm:flex sm:items-center">
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
      <RouterLink
        :to="link"
        class="flex items-center gap-x-1 text-sm font-medium text-custom-secondary sm:text-base"
        >View all <ChevronRight :size="18"
      /></RouterLink>
    </div>
    <div
      class="mx-auto w-full max-w-60 xs:max-w-[300px] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[1100px] 2xl:max-w-7xl"
    >
      <BaseCarousel
        ref="carouselEl"
        :options="options"
        style="--f-carousel-slide-padding: 0 1rem; --f-carousel-slide-width: fit-content"
      >
        <CarouselSlide v-for="media in medias" :key="media.id">
          <MediaCardGrid :media="media" />
        </CarouselSlide>
      </BaseCarousel>
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import type { Movie } from '@/services/movies/types'
import type { TV } from '@/services/tv/types'

import BaseCarousel from '@/components/ui/carousel/BaseCarousel.vue'
import CarouselSlide from '@/components/ui/carousel/CarouselSlide.vue'
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import MediaCardGrid from './MediaCardGrid.vue'

defineProps<{
  title: string
  medias: (Movie | TV)[]
  link: string
}>()

const carouselEl = ref<InstanceType<typeof BaseCarousel> | null>(null)
const options = reactive({
  slidesPerPage: 1,
  transition: 'slide',
  Navigation: false,
  Dots: false
})
</script>
