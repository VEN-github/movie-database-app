<template>
  <div class="flex h-full w-fit flex-col">
    <RouterLink :to="`/${slug}/${media.id}`" class="group">
      <img
        class="grow rounded-lg object-cover object-center drop-shadow-2xl transition-opacity group-hover:opacity-70"
        :src="media.poster_path"
        :alt="title"
        :width="imgWidth"
      />
    </RouterLink>
    <div class="mt-2 flex items-center justify-between gap-x-1">
      <RouterLink
        :to="`/${slug}/${media.id}`"
        class="w-36 truncate text-lg transition-colors hover:text-custom-primary"
        :title="title"
        >{{ title }}</RouterLink
      >
      <p v-if="rating" class="rounded bg-custom-primary px-1.5 text-sm font-medium">
        {{ rating }}
      </p>
    </div>
    <p class="text-sm text-custom-foreground-secondary">{{ releaseDate }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { PropType } from 'vue'
import type { Movie } from '@/services/movies/types'
import type { TV } from '@/services/tv/types'
import dayjs from 'dayjs'

const props = defineProps({
  media: {
    type: Object as PropType<Movie | TV>,
    required: true
  },
  imgWidth: {
    type: [String, Number],
    default() {
      return 200
    }
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

const slug = computed<string>(() => {
  if ('title' in props.media) {
    const slugTitle = props.media.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '')

    return `movie/${slugTitle}`
  }

  if ('name' in props.media) {
    const slugName = props.media.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '')

    return `tv-show/${slugName}`
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
