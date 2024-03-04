<template>
  <BaseSpinnerContainer v-if="isLoading" />
  <section
    v-else-if="!isLoading && media"
    class="min-h-screen w-full bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: `url(${media.backdrop_path})` }"
  >
    <div
      class="min-h-screen w-full bg-gradient-to-br from-custom-bg from-0% to-transparent pb-16 pt-32 backdrop-blur-sm sm:pt-40"
    >
      <BaseContainer>
        <h1 class="text-2xl font-bold sm:text-4xl xl:text-7xl">{{ title }}</h1>
        <p
          class="mt-2 flex flex-wrap items-center gap-3 text-sm text-custom-foreground-secondary sm:text-base"
        >
          <span>{{ releaseDate }}</span>
          <Separator v-if="runtime" orientation="vertical" class="!h-3.5" />
          <span v-if="runtime">{{ runtime }}</span>
          <Separator orientation="vertical" class="!h-3.5" />
          <span>{{ formmattedGenres }}</span>
          <span
            v-if="rating"
            class="rounded bg-custom-primary px-2 text-base font-medium text-custom-foreground sm:text-xl"
            >{{ rating }}</span
          >
        </p>
        <p v-if="media.overview" class="mt-5 max-w-3xl sm:text-lg">
          {{ media.overview }}
        </p>
        <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <VideoTrailerDialog :id="media.id" :media-type="type">
            <Button class="rounded-full bg-custom-primary hover:bg-custom-primary/90"
              ><PlayCircle stroke-width="1.5" :size="20" /><span class="pl-2 font-medium sm:text-lg"
                >Watch Trailer</span
              ></Button
            >
          </VideoTrailerDialog>
          <Button variant="ghost" class="rounded-full"
            ><PlusCircle stroke-width="1.5" :size="18" /><span class="pl-2 font-medium sm:text-lg"
              >My List</span
            ></Button
          >
        </div>
        <div v-if="casts.length" class="mt-5 sm:mt-10">
          <h2 class="text-xl">Cast</h2>
          <div
            class="mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-5 sm:items-start md:gap-6 lg:flex"
          >
            <CastAvatar :casts="casts" />
          </div>
        </div>
        <div v-if="photos.length" class="mt-10">
          <h2 class="text-xl">Photos</h2>

          <div class="mt-5 flex flex-wrap items-center gap-4">
            <PhotoList :photos="photos" />
          </div>
        </div>
      </BaseContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movies'
import type { Movie, Cast, Photo } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'
import dayjs from 'dayjs'

import BaseSpinnerContainer from '@/components/ui/loader/BaseSpinnerContainer.vue'
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import { Separator } from '@/components/ui/separator'
import VideoTrailerDialog from '@/components/VideoTrailerDialog.vue'
import { Button } from '@/components/ui/button'
import { PlusCircle, PlayCircle } from 'lucide-vue-next'
import CastAvatar from '@/components/CastAvatar.vue'
import PhotoList from '@/components/PhotoList.vue'

const props = defineProps<{
  type: string
  id: string
}>()

const router = useRouter()
const movieStore = useMovieStore()
const tvStore = useTVStore()
const media = ref<Movie | TV | null>(null)
const casts = ref<Cast[]>([])
const photos = ref<Photo[]>([])
const isLoading = ref<boolean>(false)

const convertedId = computed<number>(() => {
  return parseInt(props.id)
})

const title = computed<string>(() => {
  if (media.value && 'title' in media.value) {
    return media.value.title
  }

  if (media.value && 'name' in media.value) {
    return media.value.name
  }

  return ''
})

const releaseDate = computed<string>(() => {
  if (media.value && 'release_date' in media.value) {
    return dayjs(media.value.release_date).format('YYYY')
  }

  if (media.value && 'first_air_date' in media.value) {
    return dayjs(media.value.first_air_date).format('YYYY')
  }

  return ''
})

const rating = computed<string | undefined>(() => {
  return media.value?.vote_average.toFixed(1)
})

const formmattedGenres = computed<string>(() => {
  return media.value?.genres?.map((genre) => genre.name).join(', ') || ''
})

const runtime = computed<string | null>(() => {
  let minute: number | undefined

  if (media.value && 'runtime' in media.value) {
    minute = media.value.runtime
  }

  if (media.value && 'episode_run_time' in media.value && media.value.episode_run_time?.length) {
    minute = media.value.episode_run_time[0]
  }

  if (!minute || isNaN(minute)) return null

  const hours = Math.floor(minute / 60)
  const remainingMinutes = minute % 60

  const hoursText = hours > 0 ? hours + 'h' : ''
  const minutesText = remainingMinutes > 0 ? remainingMinutes + 'min' : ''

  return hoursText + (hours > 0 && remainingMinutes > 0 ? ' ' : '') + minutesText
})

onBeforeMount(async () => {
  isLoading.value = true
  try {
    if (props.type === 'movie') {
      await Promise.all([getMovie(), getMovieCasts(), getMoviePhotos()])
    } else if (props.type === 'tv-show') {
      await Promise.all([getTVShow(), getTVShowCasts(), getTVShowPhotos()])
    }
  } catch (error) {
    router.push('/404')
  } finally {
    isLoading.value = false
  }
})

async function getMovie(): Promise<void> {
  await movieStore.getMovie(convertedId.value)
  media.value = movieStore.movie
}

async function getMovieCasts(): Promise<void> {
  await movieStore.getCasts(convertedId.value)
  casts.value = movieStore.casts
}

async function getMoviePhotos(): Promise<void> {
  await movieStore.getMoviePhotos(convertedId.value)
  photos.value = movieStore.photos
}

async function getTVShow(): Promise<void> {
  await tvStore.getTVShow(convertedId.value)
  media.value = tvStore.tvShow
}

async function getTVShowCasts(): Promise<void> {
  await tvStore.getCasts(convertedId.value)
  casts.value = tvStore.casts
}

async function getTVShowPhotos(): Promise<void> {
  await tvStore.getTVShowPhotos(convertedId.value)
  photos.value = tvStore.photos
}
</script>
