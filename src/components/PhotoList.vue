<template>
  <div
    v-for="photo in formattedPhotos"
    :key="photo"
    :class="{ relative: photos.length > 4 && photo === lastPhoto }"
  >
    <img
      :src="photo"
      :alt="photo"
      class="w-28 rounded-lg object-cover object-center drop-shadow-2xl xs:w-36"
    />
    <div
      v-if="photos.length > 4 && photo === lastPhoto"
      class="absolute inset-0 rounded-lg bg-[#222]/75 ring-2 ring-custom-foreground"
    ></div>
    <div
      v-if="photos.length > 4 && photo === lastPhoto"
      class="absolute inset-0 flex items-center justify-center"
    >
      <p v-if="photos.length > 4 && photo === lastPhoto" class="text-2xl text-white">
        +{{ photos.length - 4 }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  photos: string[]
}>()

const formattedPhotos = computed<string[]>(() => {
  return props.photos.slice(0, 4)
})

const lastPhoto = computed<string>(() => {
  return formattedPhotos.value[formattedPhotos.value.length - 1]
})
</script>
