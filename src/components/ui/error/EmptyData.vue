<template>
  <div class="flex flex-col items-center justify-center text-center">
    <ArchiveX :size="48" />
    <h1 class="mt-5 text-2xl font-bold tracking-tight sm:text-5xl">No matching records found.</h1>
    <p class="mb-6 mt-2 text-custom-foreground-secondary">
      Sorry, we couldn't find any data matching your request.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ArchiveX } from 'lucide-vue-next'
</script>
