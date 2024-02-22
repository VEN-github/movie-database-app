<template>
  <section class="grid h-screen place-items-center">
    <BaseContainer>
      <div class="flex flex-col items-center justify-center text-center">
        <FileX :size="48" />
        <h1 class="mt-5 text-2xl font-bold tracking-tight sm:text-5xl">Something went wrong</h1>
        <p class="mb-6 mt-2 text-custom-foreground-secondary">
          Please refresh the page and try again.
        </p>
        <a
          href="javascript:window.location.reload()"
          role="button"
          class="flex items-center gap-2 font-medium text-custom-secondary transition-colors hover:text-custom-secondary/70"
        >
          Refresh Page <span><RotateCcw :size="16" /></span
        ></a>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import { FileX, RotateCcw } from 'lucide-vue-next'
</script>
