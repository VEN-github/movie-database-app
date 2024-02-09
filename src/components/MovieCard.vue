<template>
  <div class="w-fit">
    <img class="rounded-lg drop-shadow-2xl" alt="" width="200" :data-lazy-src="media.poster_path" />
    <div class="mt-2 flex items-center justify-between gap-x-1">
      <h1 class="w-36 truncate text-lg" :title="title">{{ title }}</h1>
      <p class="rounded bg-custom-primary px-1.5 text-sm font-medium">
        {{ rating }}
      </p>
    </div>
    <p class="text-sm text-custom-foreground-secondary">{{ releaseDate }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { Movie } from '@/services/movies/types'
import type { TV } from '@/services/tv/types'
import dayjs from 'dayjs'

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
