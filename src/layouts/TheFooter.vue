<template>
  <footer class="py-8">
    <BaseContainer>
      <div class="flex items-center justify-center gap-x-1 text-custom-foreground">
        <Copyright :size="18" />
        <p class="text-sm sm:text-lg">
          2024&nbsp;<span
            class="text-base font-medium tracking-tighter text-custom-primary sm:text-xl"
            >sinehan</span
          >. All rights reserved.
        </p>
      </div>
    </BaseContainer>
  </footer>
</template>

<script setup lang="ts">
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import { Copyright } from 'lucide-vue-next'
</script>
