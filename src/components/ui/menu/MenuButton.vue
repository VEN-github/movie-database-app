<template>
  <button
    type="button"
    class="hamburger hamburger--slider lg:hidden"
    :class="{ 'is-active': isOpen }"
    @click="isOpen = !isOpen"
  >
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref<boolean>(false)
</script>
