<template>
  <div class="flex gap-4">
    <img
      class="h-[12.rem] w-28 rounded-lg object-cover drop-shadow-2xl xs:h-52 xs:w-32 md:h-56 md:w-36 xl:h-60 2xl:h-64"
      :src="media.poster_path"
      :alt="title"
    />
    <div>
      <h1 :title="title" class="line-clamp-2 font-semibold sm:text-xl xl:text-2xl">
        {{ title }}
      </h1>
      <p class="mt-1 space-x-4 text-sm sm:text-base">
        <span class="text-custom-foreground-secondary">{{ releaseDate }}</span
        ><span class="rounded bg-custom-primary px-1.5 font-medium">{{ rating }}</span>
      </p>
      <p
        v-if="media.overview"
        :title="media.overview"
        class="mt-2 line-clamp-2 text-xs font-light sm:line-clamp-5 sm:text-sm md:line-clamp-2 xl:line-clamp-4 2xl:line-clamp-5"
      >
        {{ media.overview }}
      </p>
      <div
        class="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 md:flex-col xl:flex-row"
      >
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors hover:text-custom-primary"
        >
          <PlusCircle stroke-width="1.5" :size="16" /><span>My List</span>
        </button>
        <Button size="sm" class="rounded-full bg-custom-primary hover:bg-custom-primary/90"
          ><PlayCircle stroke-width="1.5" :size="16" /><span class="pl-2 font-medium"
            >Watch Trailer</span
          ></Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { Movie } from '@/services/movies/types'
import type { TV } from '@/services/tv/types'
import dayjs from 'dayjs'

import { PlusCircle, PlayCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({
  media: {
    type: Object as PropType<Movie | TV>,
    required: true
  }
})

const title = computed<string>(() => {
  if ('title' in props.media) {
    return props.media.title
  }

  if ('name' in props.media) {
    return props.media.name
  }

  return ''
})

const releaseDate = computed<string>(() => {
  if ('release_date' in props.media) {
    return dayjs(props.media.release_date).format('YYYY')
  }

  if ('first_air_date' in props.media) {
    return dayjs(props.media.first_air_date).format('YYYY')
  }

  return ''
})

const rating = computed<string>(() => {
  return props.media.vote_average.toFixed(1)
})
</script>
