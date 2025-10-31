<script setup lang="ts">
import { Select } from 'primevue'
import Button from 'primevue/button'
import Steps from 'primevue/steps'
import Textarea from 'primevue/textarea'
import { minLength, object, pipe, safeParse, string } from 'valibot'
import { ref } from 'vue'
import ContactForm from '@/components/ContactForm.vue'

const active = ref(0)
const items = ref([
  {
    label: 'Policy Holder',
  },
  {
    label: 'Claimant',
  },
  {
    label: 'Claim Details',
  },
  {
    label: 'Review and Submit',
  },
])

const policyHolder = ref<Contact>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const claimant = ref<Contact>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const claimTypes = ref([
  { name: 'Auto' },
  { name: 'Home' },
  { name: 'Life' },
  { name: 'Health' },
])

const claimDetailsSchema = object({
  claimType: object({ name: string() }),
  description: pipe(string(), minLength(10)),
})

const claimDetails = ref({
  claimType: { name: '' },
  description: '',
})

const errors = ref({
  policyHolder: {},
  claimant: {},
  claimDetails: {},
})

function validateStep(step: number) {
  let schema, data, errorKey

  if (step === 0) {
    schema = contactSchema
    data = policyHolder.value
    errorKey = 'policyHolder'
  }
  else if (step === 1) {
    schema = contactSchema
    data = claimant.value
    errorKey = 'claimant'
  }
  else if (step === 2) {
    schema = claimDetailsSchema
    data = claimDetails.value
    errorKey = 'claimDetails'
  }
  else {
    return true
  }

  const result = safeParse(schema, data)
  if (result.success) {
    errors.value[errorKey] = {}
    return true
  }
  else {
    errors.value[errorKey] = result.issues.reduce((acc, issue) => {
      if (issue.path) {
        const key = issue.path[0].key as string
        acc[key] = issue.message
      }
      return acc
    }, {})
    return false
  }
}

function nextStep() {
  if (validateStep(active.value)) {
    active.value++
  }
}

function prevStep() {
  active.value--
}

function submit() {
  const isPolicyHolderValid = validateStep(0)
  const isClaimantValid = validateStep(1)
  const isClaimDetailsValid = validateStep(2)

  if (isPolicyHolderValid && isClaimantValid && isClaimDetailsValid) {
    console.log('Submitting claim...')

    // Reset the form
    active.value = 0
    policyHolder.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
    claimant.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
    claimDetails.value = {
      claimType: { name: '' },
      description: '',
    }
  }
}
</script>

<template>
  <div>
    <Steps
      :model="items"
      :active-step="active"
      :readonly="false"
      @update:active-step="active = $event"
    />
    <div class="p-5">
      <div v-if="active === 0">
        <h2>Policy Holder</h2>
        <ContactForm v-model="policyHolder" />
      </div>
      <div v-if="active === 1">
        <h2>Claimant</h2>
        <ContactForm v-model="claimant" />
      </div>
      <div v-if="active === 2">
        <h2>Claim Details</h2>
        <div class="p-fluid">
          <div class="p-field">
            <label for="claimType">Claim Type</label>
            <Select
              id="claimType"
              v-model="claimDetails.claimType"
              :options="claimTypes"
              option-label="name"
              placeholder="Select a Claim Type"
            />
            <small class="p-error">{{ errors.claimDetails.claimType }}</small>
          </div>
          <div class="p-field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="claimDetails.description" rows="5" />
            <small class="p-error">{{ errors.claimDetails.description }}</small>
          </div>
        </div>
      </div>
      <div v-if="active === 3">
        <h2>Review and Submit</h2>
        <div class="p-fluid">
          <h4>Policy Holder</h4>
          <p>First Name: {{ policyHolder.firstName }}</p>
          <p>Last Name: {{ policyHolder.lastName }}</p>
          <p>Email: {{ policyHolder.email }}</p>
          <p>Phone: {{ policyHolder.phone }}</p>

          <h4>Claimant</h4>
          <p>First Name: {{ claimant.firstName }}</p>
          <p>Last Name: {{ claimant.lastName }}</p>
          <p>Email: {{ claimant.email }}</p>
          <p>Phone: {{ claimant.phone }}</p>

          <h4>Claim Details</h4>
          <p>Claim Type: {{ claimDetails.claimType.name }}</p>
          <p>Description: {{ claimDetails.description }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-between p-5">
      <Button label="Back" icon="pi pi-arrow-left" :disabled="active === 0" @click="prevStep" />
      <Button v-if="active < items.length - 1" label="Next" icon="pi pi-arrow-right" @click="nextStep" />
      <Button v-if="active === items.length - 1" label="Submit" icon="pi pi-check" @click="submit" />
    </div>
  </div>
</template>
