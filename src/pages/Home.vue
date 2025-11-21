<script setup lang="ts">
import Button from 'primevue/button'
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-8">
      Claims Management
    </h1>
    <div class="flex space-x-4">
      <router-link to="/claims">
        <Button label="Start Now" />
      </router-link>
    </div>
  </div>
</template>
