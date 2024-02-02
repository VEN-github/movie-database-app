<template>
  <header class="fixed left-0 top-0 z-10 w-full py-10 md:py-12">
    <div class="absolute inset-0 w-full bg-custom-bg blur-3xl"></div>
    <BaseContainer class="relative">
      <div class="flex items-center justify-between">
        <AppLogo />
        <nav class="hidden lg:block">
          <NavLinks type="desktop" />
        </nav>
        <NavExtras @toggle-menu="toggleMenu" />
        <div
          class="fixed right-0 top-0 w-full bg-custom-foreground-secondary/10 backdrop-blur transition-transform duration-500 md:w-2/4 lg:hidden"
          :class="[isOpen ? 'translate-x-0' : 'translate-x-full']"
        >
          <NavLinks />
        </div>
      </div>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'

import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import AppLogo from '@/components/ui/logo/AppLogo.vue'
import NavLinks from '@/components/ui/menu/NavLinks.vue'
import NavExtras from '@/components/ui/menu/NavExtras.vue'

const isOpen = ref<boolean>(false)

provide('isOpen', isOpen)

function toggleMenu(): void {
  isOpen.value = !isOpen.value
  document.body.classList.toggle('overflow-y-hidden')
}
</script>
