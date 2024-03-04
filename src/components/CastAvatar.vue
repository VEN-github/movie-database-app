<template>
  <div v-for="cast in formattedCasts" :key="cast.id" class="flex items-center gap-3 xs:flex-col">
    <img
      :src="cast.profile_path"
      :alt="cast.name"
      class="size-10 rounded-full object-cover object-center ring-2 ring-custom-foreground sm:size-12"
    />
    <div class="xs:text-center">
      <h3 class="text-sm md:text-base">{{ cast.name }}</h3>
      <p class="text-xs text-custom-foreground/70 md:text-sm">{{ cast.character }}</p>
    </div>
  </div>
  <div
    v-if="casts.length > 4"
    class="flex items-center gap-3 xs:col-span-full xs:flex-col xs:justify-center sm:col-auto"
  >
    <button
      type="button"
      class="flex size-10 items-center justify-center rounded-full bg-custom-foreground-secondary/50 ring-2 ring-custom-foreground-secondary/50 sm:size-12"
    >
      <Plus />
    </button>
    <h3 class="text-sm xs:text-center md:text-base">More Cast</h3>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Cast } from '@/services/movies/types'

import { Plus } from 'lucide-vue-next'

const props = defineProps<{
  casts: Cast[]
}>()

const formattedCasts = computed<Cast[]>(() => {
  return props.casts.slice(0, 4)
})
</script>
