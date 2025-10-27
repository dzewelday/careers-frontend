<script setup lang="ts">
import { computed, toRefs } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: 'primary',
    validator(value: string) {
      return ['primary', 'secondary'].includes(value)
    },
  },
})

const { type } = toRefs(props)
const buttonClass = computed(() => {
  return {
    [type.value]: true,
  }
})
</script>

<template>
  <button :class="buttonClass">
    {{ text }}
  </button>
</template>

<style scoped>
</style>
