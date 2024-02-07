<template>
  <DialogContent class="max-w-2xl border-0 bg-custom-bg">
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
    </DialogHeader>
    <AspectRatio :ratio="16 / 9">
      <iframe
        width="100%"
        height="100%"
        :src="`https://www.youtube.com/embed/${video?.key}?autoplay=1`"
        :title="video?.name"
        frameborder="0"
        loading="lazy"
        allow="autoplay"
        allowfullscreen
      ></iframe>
    </AspectRatio>
  </DialogContent>
</template>

<script setup lang="ts">
import type { Video } from '@/services/movies/types'

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'

defineProps<{
  video: Video | null
}>()
</script>
