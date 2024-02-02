<template>
  <div
    class="relative h-screen w-full bg-[url('https://image.tmdb.org/t/p/original/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg')] bg-cover bg-center bg-no-repeat"
  >
    <div class="absolute bottom-0 left-0 w-full">
      <div class="absolute inset-0 w-full bg-custom-bg blur-3xl"></div>
      <BaseContainer class="relative pb-6 pt-4 sm:pb-14">
        <div class="mb-8 flex flex-col gap-y-2 sm:gap-y-4">
          <h1 class="text-2xl font-bold tracking-tight xs:text-3xl sm:text-6xl">
            Avengers: Infinity War
          </h1>
          <p class="flex items-center gap-x-3 text-sm sm:text-base">
            <span>2018</span>
            <Separator orientation="vertical" class="!h-4" />
            <span>Action, Sci - Fi</span>
            <span class="rounded bg-custom-primary px-2 text-base font-medium sm:text-lg">8.9</span>
          </p>
        </div>
        <div
          class="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-end landscape:flex-row landscape:justify-end"
        >
          <Button variant="ghost" class="rounded-full"
            ><PlusCircle stroke-width="1.5" :size="18" /><span class="pl-2 font-medium sm:text-lg"
              >My List</span
            ></Button
          >
          <Button class="rounded-full bg-custom-primary hover:bg-custom-primary/90"
            ><PlayCircle stroke-width="1.5" :size="20" /><span class="pl-2 font-medium sm:text-lg"
              >Watch Trailer</span
            ></Button
          >
        </div>
      </BaseContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseContainer from '@/components/ui/container/BaseContainer.vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-vue-next'
import { PlayCircle } from 'lucide-vue-next'
</script>
