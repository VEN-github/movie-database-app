<template>
  <header
    ref="header"
    class="fixed left-0 top-0 z-10 w-full -translate-y-96 py-10 transition-transform duration-300 md:py-12"
  >
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
import { ref, provide, watch, onMounted, onUnmounted } from 'vue'

import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import AppLogo from '@/components/ui/logo/AppLogo.vue'
import NavLinks from '@/components/ui/menu/NavLinks.vue'
import NavExtras from '@/components/ui/menu/NavExtras.vue'

const header = ref<HTMLHeadingElement | null>(null)
const isOpen = ref<boolean>(false)
const lastScrollTop = ref<number>(0)
let timeout: undefined | number

provide('isOpen', isOpen)

watch(isOpen, (value) => {
  if (value) document.addEventListener('click', detectClickOutside)
})

onMounted(() => {
  header.value?.classList.add('translate-y-0')
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function toggleMenu(): void {
  isOpen.value = !isOpen.value
  document.body.classList.toggle('overflow-y-hidden')
}

function detectClickOutside(event: Event): void {
  if (!(event.target as HTMLInputElement).closest('.hamburger')) {
    isOpen.value = false
    document.body.classList.remove('overflow-y-hidden')
  }
}

function handleScroll(): void {
  clearTimeout(timeout)

  if (window.scrollY > lastScrollTop.value) {
    header.value?.classList.remove('translate-y-0')
  } else if (window.scrollY < lastScrollTop.value) {
    header.value?.classList.add('translate-y-0')
  }
  lastScrollTop.value = window.scrollY <= 0 ? 0 : window.scrollY

  timeout = setTimeout(() => {
    header.value?.classList.add('translate-y-0')
  }, 500)
}
</script>
