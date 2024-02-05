<template>
  <TheHeader />
  <main>
    <RouterView />
  </main>
  <TheFooter />
  <Toaster />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import TheHeader from '@/layouts/TheHeader.vue'
import TheFooter from '@/layouts/TheFooter.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>
