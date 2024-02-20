<template>
  <div v-if="isLoading" class="grid h-screen place-items-center">
    <BaseSpinner />
  </div>
  <div v-else>{{ media }}</div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/services/movies/types'
import { useTVStore } from '@/stores/tv'
import type { TV } from '@/services/tv/types'

import BaseSpinner from '@/components/ui/loader/BaseSpinner.vue'

const props = defineProps<{
  type: string
  id: string
}>()

const router = useRouter()
const movieStore = useMovieStore()
const tvStore = useTVStore()
const media = ref<Movie | TV | null>(null)
const isLoading = ref<boolean>(false)

const convertedId = computed<number>(() => {
  return parseInt(props.id)
})

onBeforeMount(async () => {
  isLoading.value = true
  try {
    if (props.type === 'movie') {
      await getMovie()
    } else if (props.type === 'tv-show') {
      await getTVShow()
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

async function getTVShow(): Promise<void> {
  await tvStore.getTVShow(convertedId.value)
  media.value = tvStore.tvShow
}
</script>
