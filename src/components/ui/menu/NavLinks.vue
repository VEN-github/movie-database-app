<template>
  <ul class="flex items-center gap-x-8 xl:gap-x-14">
    <NavLink v-for="link in links" :key="link.text" :link="link" />
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Link } from '@/types'

import NavLink from './NavLink.vue'

const links = ref<Link[]>([
  {
    text: 'Home',
    url: '#'
  },
  {
    text: 'Movies',
    url: '#'
  },
  {
    text: 'TV Shows',
    url: '#'
  },
  {
    text: 'My List',
    url: '#'
  }
])
</script>
