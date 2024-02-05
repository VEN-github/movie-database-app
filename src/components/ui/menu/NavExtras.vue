<template>
  <div class="flex items-center gap-x-5 md:gap-x-4">
    <button type="button" class="flex items-center gap-x-2">
      <Search :size="20" stroke-width="1.5" />
      <p class="hidden md:block">Search</p>
    </button>
    <Separator orientation="vertical" class="hidden !h-5 lg:block" />
    <RouterLink to="#" class="group">
      <CircleUserRound
        stroke-width="1.5"
        class="h-5 w-5 transition-colors group-hover:text-custom-primary xl:h-6 xl:w-6"
      />
    </RouterLink>
    <MenuButton @toggle-menu="emit('toggleMenu')" />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Search, CircleUserRound } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import MenuButton from './MenuButton.vue'

const emit = defineEmits(['toggleMenu'])
</script>
