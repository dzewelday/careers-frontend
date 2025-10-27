<script setup lang="ts">
import type { Contact } from '@/types'
import { valibotResolver } from '@primevue/forms/resolvers/valibot'
import { useToast } from 'primevue'
import InputText from 'primevue/inputtext'
import { email, minLength, nonEmpty, object, pipe, string } from 'valibot'

const contactSchema = object({
  firstName: pipe(
    string(),
    minLength(1, 'please enter a firstName'),
  ),
  lastName: pipe(
    string(),
    minLength(1, 'please enter a last name'),
  ),
  email: pipe(
    string(),
    nonEmpty('Email is required'),
    email('Invalid email address'),
  ),
  phone: pipe(
    string(),
    minLength(1, 'Too short.'),
  ),
})

const initialValues = defineModel<Contact>({ required: true })

const toast = useToast()
function onFormSubmit(e) {
  // e.originalEvent: Represents the native form submit event.
  // e.valid: A boolean that indicates whether the form is valid or not.
  // e.states: Contains the current state of each form field, including validity status.
  // e.errors: An object that holds any validation errors for the invalid fields in the form.
  // e.values: An object containing the current values of all form fields.
  // e.reset: A function that resets the form to its initial state.

  if (e.valid) {
    toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 })
  }
}

const resolver = valibotResolver(contactSchema)
</script>

<template>
  <div class="card flex flex-col gap-4 p-4">
    <Form v-slot="$form" :initial-values :resolver @submit="onFormSubmit">
      <div>
        <label for="firstname">First Name</label>
        <InputText id="firstname" name="firstName" type="text" fluid />
        <Message v-if="$form.firstName?.invalid" severity="error" size="small" variant="simple">
          {{ $form.firstName.error.message }}
        </Message>
      </div>
      <div>
        <label for="lastname">Last Name</label>
        <InputText id="lastname" name="lastName" type="text" fluid />
        <Message v-if="$form.lastName?.invalid" severity="error" size="small" variant="simple">
          {{ $form.lastName.error.message }}
        </Message>
      </div>
      <div>
        <label for="email">Email</label>
        <InputText id="email" name="email" type="text" fluid />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
          {{ $form.email.error.message }}
        </Message>
      </div>
      <div>
        <label for="phone">Phone</label>
        <InputMask id="phone" name="phone" mask="(999) 999-9999" fluid />
        <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">
          {{ $form.phone.error.message }}
        </Message>
      </div>
    </Form>
  </div>
</template>
