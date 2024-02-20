<template>
  <div
    class="relative h-screen w-full bg-cover bg-center bg-no-repeat"
    :data-lazy-src="media.backdrop_path"
  >
    <div class="absolute bottom-0 left-0 w-full">
      <div
        class="absolute inset-0 w-full bg-gradient-to-t from-custom-bg from-0% to-transparent"
      ></div>
      <BaseContainer class="relative pb-6 pt-4 sm:pb-14">
        <div class="mb-8 flex flex-col gap-y-2 sm:gap-y-4">
          <RouterLink
            :to="`/${slug}/${media.id}`"
            class="text-2xl font-bold tracking-tight transition-colors hover:text-custom-primary xs:text-3xl sm:text-6xl"
            >{{ title }}</RouterLink
          >
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
          <VideoTrailerDialog :id="media.id" :media-type="mediaType">
            <Button class="rounded-full bg-custom-primary hover:bg-custom-primary/90"
              ><PlayCircle stroke-width="1.5" :size="20" /><span class="pl-2 font-medium sm:text-lg"
                >Watch Trailer</span
              ></Button
            >
          </VideoTrailerDialog>
        </div>
      </BaseContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
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
import VideoTrailerDialog from '@/components/VideoTrailerDialog.vue'

const props = defineProps({
  media: {
    type: Object as PropType<Movie | TV>,
    required: true
  }
})

const movieStore = useMovieStore()
const tvStore = useTVStore()

const mediaType = computed<string>(() => {
  if ('release_date' in props.media || 'title' in props.media) {
    return 'movie'
  }
  if ('first_air_date' in props.media || 'name' in props.media) {
    return 'tv'
  }

  return ''
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

const genres = computed<string>(() => {
  let genreNames: (string | undefined)[] = []

  if ('release_date' in props.media) {
    genreNames = props.media.genre_ids.map(
      (id) => movieStore.genres.find((genre) => genre.id === id)?.name
    )
  }

  if ('first_air_date' in props.media) {
    genreNames = props.media.genre_ids.map(
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
  return props.media.vote_average.toFixed(1)
})
</script>
