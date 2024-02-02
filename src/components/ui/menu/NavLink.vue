<template>
  <li class="text-2xl lg:text-base xl:text-lg">
    <RouterLink :to="link.url" class="transition-colors hover:text-custom-primary">{{
      link.text
    }}</RouterLink>
  </li>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { RouterLink } from 'vue-router'
import type { Link } from '@/types'

defineProps({
  link: {
    type: Object as PropType<Link>,
    required: true
  }
})
</script>
