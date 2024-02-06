<template>
  <div
    class="relative h-screen w-full bg-cover bg-center bg-no-repeat"
    :data-lazy-src="trending.backdrop_path"
  >
    <div class="absolute bottom-0 left-0 w-full">
      <div class="absolute inset-0 w-full bg-custom-bg blur-3xl"></div>
      <BaseContainer class="relative pb-6 pt-4 sm:pb-14">
        <div class="mb-8 flex flex-col gap-y-2 sm:gap-y-4">
          <h1 class="text-2xl font-bold tracking-tight xs:text-3xl sm:text-6xl">{{ title }}</h1>
          <p class="flex items-center gap-x-3 text-sm sm:text-base">
            <span>{{ releaseDate }}</span>
            <Separator orientation="vertical" class="!h-4" />
            <span :title="genres">{{ formmattedGenreNames }}</span>
            <span class="rounded bg-custom-primary px-2 text-base font-medium sm:text-lg">{{
              rating
            }}</span>
          </p>
        </div>
        <div
          class="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-end landscape:flex-row landscape:justify-end"
        >
          <Button variant="ghost" class="rounded-full"
            ><PlusCircle stroke-width="1.5" :size="18" /><span class="pl-2 font-medium sm:text-lg"
              >My List</span
            ></Button
          >
          <Button class="rounded-full bg-custom-primary hover:bg-custom-primary/90"
            ><PlayCircle stroke-width="1.5" :size="20" /><span class="pl-2 font-medium sm:text-lg"
              >Watch Trailer</span
            ></Button
          >
        </div>
      </BaseContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useMovieStore } from '@/stores/movies'
import { useTVStore } from '@/stores/tv'
import type { Movie } from '@/services/movies/types'
import type { TV } from '@/services/tv/types'
import dayjs from 'dayjs'

import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PlusCircle, PlayCircle } from 'lucide-vue-next'

const props = defineProps({
  trending: {
    type: Object as PropType<Movie | TV>,
    required: true
  }
})

const movieStore = useMovieStore()
const tvStore = useTVStore()

const title = computed<string>(() => {
  if ('title' in props.trending) {
    return props.trending.title
  }

  if ('name' in props.trending) {
    return props.trending.name
  }

  return ''
})

const releaseDate = computed<string>(() => {
  if ('release_date' in props.trending) {
    return dayjs(props.trending.release_date).format('YYYY')
  }

  if ('first_air_date' in props.trending) {
    return dayjs(props.trending.first_air_date).format('YYYY')
  }

  return ''
})

const genres = computed<string>(() => {
  let genreNames: (string | undefined)[] = []

  if ('release_date' in props.trending) {
    genreNames = props.trending.genre_ids.map(
      (id) => movieStore.genres.find((genre) => genre.id === id)?.name
    )
  }

  if ('first_air_date' in props.trending) {
    genreNames = props.trending.genre_ids.map(
      (id) => tvStore.genres.find((genre) => genre.id === id)?.name
    )
  }

  return genreNames?.join(', ') || ''
})

const formmattedGenreNames = computed<string>(() => {
  return genres.value.split(',').length > 2
    ? genres.value.split(',').slice(0, 2).concat(['...']).join(', ')
    : genres.value
})

const rating = computed<string>(() => {
  return props.trending.vote_average.toFixed(1)
})
</script>
