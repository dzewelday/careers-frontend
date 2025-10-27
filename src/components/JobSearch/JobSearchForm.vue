<script setup lang="ts">
import type { FormValues } from './CustomInput.vue'
import { ref } from 'vue'

const claim = ref<FormValues>({
  isA: true,
  isB: true,
  isC: true,
})
</script>

<template>
  <CustomInput v-model:claim="claim" />
</template>
