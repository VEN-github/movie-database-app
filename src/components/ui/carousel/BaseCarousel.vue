<template>
  <div ref="carouselEl" class="f-carousel">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Carousel } from '@fancyapps/ui/dist/carousel/carousel.esm.js'
import '@fancyapps/ui/dist/carousel/carousel.css'
import { Autoplay } from '@fancyapps/ui/dist/carousel/carousel.autoplay.esm.js'
import '@fancyapps/ui/dist/carousel/carousel.autoplay.css'

const props = defineProps<{
  options?: Object
  autoplay?: boolean
}>()

const carousel = ref<Carousel | null>(null)
const carouselEl = ref<HTMLElement | null>(null)

defineExpose({
  carousel
})

onMounted(async () => {
  carousel.value = new Carousel(
    carouselEl.value,
    props.options,
    props.autoplay ? { Autoplay } : null
  )
})
</script>
