<script setup lang="ts">
import { ref } from 'vue'
import ActionButton from '@/components/Shared/ActionButton.vue'

const menuItems = ref([
  { text: 'Home', url: '/' },
  { text: 'Claims', url: '/claims' },
  { text: 'Search', url: '/search' },
])
</script>

<template>
  <header class="w-full text-sm h-16">
    <div class="fixed left-0 top-0 h-16 w-full bg-white">
      <div class="mx-auto flex h-full flex-nowrap border-b border-solid border-brand-gray-1 px-8">
        <router-link :to="{ name: 'Home' }" class="flex h-full items-center text-xl">
          <span class="font-bold">Threads</span>
        </router-link>

        <nav class="ml-12 h-full">
          <ul class="flex h-full list-none">
            <li v-for="menuItem in menuItems" :key="menuItem.text" class="ml-9 h-full first:ml-0">
              <router-link :to="menuItem.url" class="flex h-full items-center py-2.5">
                {{ menuItem.text }}
              </router-link>
            </li>
          </ul>
        </nav>

        <div class="ml-auto flex h-full items-center">
          <ActionButton text="Sign in" />
        </div>
      </div>
    </div>
  </header>
</template>
