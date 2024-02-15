<template>
  <Dialog>
    <DialogTrigger as-child @click="toggleTrailer"> <slot></slot></DialogTrigger>
    <VideoTrailer :is-loading="isLoading" :video="video" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMovieStore } from '@/stores/movies'
import { useTVStore } from '@/stores/tv'
import type { Video } from '@/services/movies/types'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import VideoTrailer from '@/components/VideoTrailer.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps<{
  id: number
  mediaType: string
}>()

const movieStore = useMovieStore()
const tvStore = useTVStore()
const video = ref<Video | null>(null)
const isLoading = ref<boolean>(false)
const { toast } = useToast()

async function toggleTrailer(): Promise<void> {
  isLoading.value = true
  try {
    if (props.mediaType === 'movie') {
      await movieStore.getVideos(props.id)
      video.value = movieStore.video
    }
    if (props.mediaType === 'tv') {
      await tvStore.getVideos(props.id)
      video.value = tvStore.video
    }
  } catch (error) {
    handleFetchError(error)
  } finally {
    isLoading.value = false
  }
}

function handleFetchError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.'
  toast({ title: errorMessage, variant: 'destructive' })
}
</script>
