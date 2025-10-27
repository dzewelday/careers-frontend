import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  firstName: string | null
  lastName: string | null
  inactive: boolean
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    firstName: null,
    lastName: null,
    inactive: false,
  })

  const selectedOrganizations = ref<Array<string>>([])
  const selectedJobTypes = ref<Array<string>>([])
  const selectedDegrees = ref<Array<string>>([])

  function loginUser() {
    user.value = {
      firstName: 'Test',
      lastName: 'User',
      inactive: false,
      isLoggedIn: true,
    }
  }

  function addSelectedOrganizations(organizations: Array<string>) {
    selectedOrganizations.value = organizations
  }

  function addSelectedJobTypes(jobTypes: Array<string>) {
    selectedJobTypes.value = jobTypes
  }

  function addSelectedDegrees(degrees: Array<string>) {
    selectedDegrees.value = degrees
  }

  function reset() {
    selectedDegrees.value = []
    selectedJobTypes.value = []
    selectedOrganizations.value = []
  }

  return {
    loginUser,
    selectedOrganizations,
    addSelectedOrganizations,
    selectedJobTypes,
    addSelectedJobTypes,
    selectedDegrees,
    addSelectedDegrees,
    reset,
  }
})
