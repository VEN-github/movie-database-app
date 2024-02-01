<template>
  <TheHeader />
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import TheHeader from '@/layouts/TheHeader.vue'
</script>
