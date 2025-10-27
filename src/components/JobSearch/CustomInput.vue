<script setup lang="ts">
export interface FormValues {
  isA: boolean
  isB: boolean
  isC: boolean
}

const claim = defineModel<FormValues>('claim', {
  required: true,
})
</script>

<template>
  <form class="flex h-12 w-full items-center rounded-3xl border border-solid border-brand-gray-3">
    <div class="card flex flex-wrap justify-center gap-4">
      <div class="flex items-center gap-2">
        <Checkbox v-model="claim.isA" input-id="ingredient1" name="isA" binary />
        <label for="ingredient1"> A </label>
        <small v-if="isAErr" id="role-error">{{ isAErr }}</small>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox v-model="isB" input-id="ingredient2" name="pizza" binary />
        <label for="ingredient2"> B </label>
        <small v-if="isBErr" id="location-error">{{ isBErr }}</small>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox v-model="isC" input-id="ingredient3" name="pizza" binary />
        <label for="ingredient3"> C </label>
        <small v-if="isCErr" id="user-error">{{ isCErr }}</small>
      </div>
    </div>

    <ActionButton text="Search" type="secondary" class="rounded-r-3xl" data-test="submit-btn" @click="onSubmit" />
  </form>
</template>
