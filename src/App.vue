<template>
  <TheHeader />
  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition name="route" mode="out-in">
        <Component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
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
