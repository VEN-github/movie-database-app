<template>
  <header class="fixed left-0 top-0 w-full py-10 md:py-12">
    <BaseContainer>
      <div class="flex items-center justify-between">
        <AppLogo />
        <nav class="hidden lg:block">
          <NavLinks />
        </nav>
        <NavExtras />
      </div>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import AppLogo from '@/components/ui/logo/AppLogo.vue'
import NavLinks from '@/components/ui/menu/NavLinks.vue'
import NavExtras from '@/components/ui/menu/NavExtras.vue'
</script>
