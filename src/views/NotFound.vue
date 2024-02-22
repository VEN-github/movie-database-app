<template>
  <section class="grid h-screen place-items-center">
    <BaseContainer>
      <div class="flex flex-shrink-0 justify-center">
        <RouterLink to="/" class="inline-flex">
          <span class="sr-only">sinehan</span>
          <img class="w-auto" src="@/assets/images/logo.svg" alt="Logo" />
        </RouterLink>
      </div>
      <div class="text-center xs:py-16">
        <p class="font-semibold text-custom-primary">404</p>
        <h1 class="mt-2 text-2xl font-bold tracking-tight xs:text-4xl sm:text-5xl">
          Page not found.
        </h1>
        <p class="mt-2 text-custom-foreground-secondary">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div class="mt-6">
          <RouterLink
            to="/"
            class="font-medium text-custom-secondary transition-colors hover:text-custom-secondary/70"
          >
            Go back home <span aria-hidden="true"> &rarr;</span></RouterLink
          >
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import BaseContainer from '@/components/ui/container/BaseContainer.vue'
</script>
