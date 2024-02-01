<template>
  <RouterLink to="/" class="flex items-center">
    <img src="@/assets/images/logo.svg" alt="Logo" class="w-8 xs:w-10 sm:w-12 2xl:w-16" />
    <span class="text-2xl font-semibold tracking-tighter text-custom-primary sm:text-3xl"
      >sinehan</span
    >
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
