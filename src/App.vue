<template>
  <h1>Hello World</h1>
  <Button>Click Me</Button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMovieStore } from '@/stores/movies'

import { Button } from '@/components/ui/button'

const movieStore = useMovieStore()

onMounted(async () => {
  await movieStore.getMovies()
})
</script>
