<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { setTimeout } from 'node:timers/promises'
import { DatePicker, Select } from 'primevue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Chip from 'primevue/chip'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu'
import MultiSelect from 'primevue/multiselect'
import ProgressSpinner from 'primevue/progressspinner'
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'

// Types
interface SearchCriteria {
  claimNumber: string | null
  reportNumber: string | null
  policyNumber: string | null
  status: string | null
  createdDates: Date[]
  submittedDates: Date[]
  lossTypes: string[]
}

interface Claim {
  id: string
  reportNumber: string
  claimNumber: string
  policyNumber: string
  createdDate: Date
  submittedDate: Date
  status: string
  lossType: string
  attachments: any[]
}

interface ColumnConfig {
  field: string
  header: string
  visible: boolean
}

// State
const isSearchPanelCollapsed = ref(false)
const isSearching = ref(false)
const hasSearched = ref(false)
const showColumnToggle = ref(false)
const selectedClaims = ref<Claim[]>([])
const selectedClaimForActions = ref<Claim | null>(null)
const actionsMenu = ref()

const searchCriteria = ref<SearchCriteria>({
  reportNumber: '',
  claimNumber: '',
  policyNumber: '',
  status: null,
  createdDates: [],
  submittedDates: [],
  lossTypes: [],
})

const claims = ref<Claim[]>([])

const columns = ref<ColumnConfig[]>([
  { field: 'reportNumber', header: 'Report Number', visible: true },
  { field: 'claimNumber', header: 'Claim Number', visible: true },
  { field: 'policyNumber', header: 'Policy Name', visible: true },
  { field: 'createdDate', header: 'Date Created', visible: true },
  { field: 'submittedDate', header: 'Date Submitted', visible: true },
  { field: 'status', header: 'Status', visible: true },
  { field: 'lossType', header: 'Loss Type', visible: true },
])

// Options
const statusOptions = [
  { label: 'Created', value: 'created' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'In Progress', value: 'inprogress' },
]

const lossTypeOptions = [
  { label: 'Medical', value: 'medical' },
  { label: 'Auto', value: 'auto' },
  { label: 'Vision', value: 'vision' },
  { label: 'Pharmacy', value: 'pharmacy' },
]

// Computed
const activeFilters = computed(() => {
  const filters = []
  if (searchCriteria.value.claimNumber) {
    filters.push({ key: 'claimNumber', label: `Claim: ${searchCriteria.value.claimNumber}` })
  }
  if (searchCriteria.value.status) {
    const status = statusOptions.find(s => s.value === searchCriteria.value.status)
    filters.push({ key: 'status', label: `Status: ${status?.label}` })
  }
  if (searchCriteria.value.createdDates) {
    filters.push({ key: 'createdDates', label: `From: ${formatDate(searchCriteria.value.createdDates.at(0))} To: ${formatDate(searchCriteria.value.createdDates.at(1))}` })
  }
  if (searchCriteria.value.submittedDates) {
    filters.push({ key: 'submittedDates', label: `From: ${formatDate(searchCriteria.value.submittedDates.at(0))} To: ${formatDate(searchCriteria.value.submittedDates.at(1))}` })
  }
  if (searchCriteria.value.lossTypes.length > 0) {
    filters.push({ key: 'lossTypes', label: `Types: ${searchCriteria.value.lossTypes.length}` })
  }
  return filters
})

const searchResultMessage = computed(() => {
  if (isSearching.value)
    return 'Searching...'
  if (claims.value.length === 0)
    return 'No claims found'
  return `${claims.value.length} claim${claims.value.length !== 1 ? 's' : ''} found`
})

// Dynamic action menu items based on selected claim
const actionMenuItems = computed<MenuItem[]>(() => {
  if (!selectedClaimForActions.value)
    return []

  const claim = selectedClaimForActions.value

  return [
    {
      label: 'View Claim',
      icon: 'pi pi-eye',
      command: () => viewClaim(claim.id),
    },
    {
      separator: true,
    },
    {
      label: 'Download',
      icon: 'pi pi-download',
      items: [
        {
          label: 'Download JSON',
          icon: 'pi pi-file',
          command: () => downloadClaimJson(claim),
        },
        {
          label: 'Download PDF',
          icon: 'pi pi-file-pdf',
          command: () => downloadClaimPdf(claim),
        },
        {
          label: 'Download All Attachments',
          icon: 'pi pi-paperclip',
          command: () => downloadAllAttachments(claim),
          disabled: !claim.attachments,
        },
      ],
    },
    {
      separator: true,
    },
    {
      label: 'Email Claim',
      icon: 'pi pi-envelope',
      command: () => emailClaim(claim),
    },
    {
      label: 'Duplicate Claim',
      icon: 'pi pi-copy',
      command: () => duplicateClaim(claim),
    },
    {
      label: 'Cancel',
      icon: 'pi pi-trash',
      command: () => cancelClaim(claim.id),
      className: 'text-red-600',
    },
  ]
})

// Methods
async function handleSearch() {
  isSearching.value = true
  hasSearched.value = true

  // Simulate API call
  await setTimeout(1000)

  // Mock data generation
  claims.value = generateMockClaims()
  isSearching.value = false
  selectedClaims.value = []

  // Collapse search panel on mobile after search
  if (window.innerWidth < 768) {
    isSearchPanelCollapsed.value = true
  }
}

function handleClear() {
  searchCriteria.value = {
    reportNumber: '',
    policyNumber: '',
    claimNumber: '',
    status: null,
    createdDates: [],
    submittedDates: [],
    lossTypes: [],
  }
  claims.value = []
  hasSearched.value = false
  selectedClaims.value = []
}

function removeFilter(key: string) {
  switch (key) {
    case 'reportNumber':
      searchCriteria.value.reportNumber = ''
      break
    case 'claimNumber':
      searchCriteria.value.claimNumber = ''
      break
    case 'policyNumber':
      searchCriteria.value.policyNumber = ''
      break
    case 'status':
      searchCriteria.value.status = null
      break
    case 'createdDates':
      searchCriteria.value.createdDates = []
      break
    case 'submittedDates':
      searchCriteria.value.submittedDates = []
      break
    case 'lossTypes':
      searchCriteria.value.lossTypes = []
      break
  }
}

function getColumn(field: string) {
  return columns.value.find(col => col.field === field)
}

function formatDate(date: Date | null | undefined): string {
  if (!date)
    return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function getStatusSeverity(status: string): string {
  const severityMap: Record<string, string> = {
    approved: 'success',
    pending: 'warning',
    denied: 'danger',
    review: 'info',
  }
  return severityMap[status.toLowerCase()] || 'info'
}

function viewClaim(id: string) {
  console.log('View claim:', id)
  // Navigate to claim detail page
}

function cancelClaim(id: string) {
  console.log('Delete claim:', id)
  // Show confirmation dialog
}

function handleExport() {
  console.log('Export all results')
  // Implement CSV export logic
}

function exportSelected() {
  console.log('Export selected:', selectedClaims.value)
}

function bulkUpdate() {
  console.log('Bulk update:', selectedClaims.value)
}

function toggleActionMenu(event: Event, claim: Claim) {
  selectedClaimForActions.value = claim
  actionsMenu.value.toggle(event)
}

// Action menu handlers
function downloadClaimJson(claim: Claim) {
  console.log('Downloading JSON for claim:', claim.claimNumber)

  // Create JSON data
  const jsonData = JSON.stringify(claim, null, 2)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // Create download link
  const link = document.createElement('a')
  link.href = url
  link.download = `${claim.claimNumber}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function downloadClaimPdf(claim: Claim) {
  console.log('Downloading PDF for claim:', claim.claimNumber)
}

function downloadAllAttachments(claim: Claim) {
  console.log('Downloading all attachments for claim:', claim.claimNumber)
}

function emailClaim(claim: Claim) {
  console.log('Emailing claim:', claim.claimNumber)
}

function duplicateClaim(claim: Claim) {
  console.log('Duplicating claim:', claim.claimNumber)
}

// Mock data generator
function generateMockClaims(): Claim[] {
  const statuses = ['Approved', 'Submitted', 'Cancelled', 'In-Progress']
  const types = ['Medical', 'Auto', 'Vision', 'Pharmacy']

  return Array.from({ length: 47 }, (_, i) => ({
    id: `claim-${i + 1}`,
    reportNumber: `RPT-2025-${String(i + 1).padStart(3, '0')}`,
    policyNumber: `POL-2025-${String(i + 1).padStart(3, '0')}`,
    claimNumber: `CLM-2025-${String(i + 1).padStart(3, '0')}`,
    createdDate: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1),
    submittedDate: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lossType: types[Math.floor(Math.random() * types.length)],
    attachments: Math.random() > 0.3 ? ['attachment1.pdf', 'attachment2.jpg'] : [], // 70% chance of having attachments
  }))
}
</script>

<template>
  <div class="claim-search-page p-4 md:p-6 max-w-[1400px] mx-auto">
    <!-- Search Panel -->
    <Card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between p-4 border-b">
          <h1 class="text-2xl font-semibold text-gray-800">
            Search
          </h1>
          <Button
            :icon="isSearchPanelCollapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"
            text
            rounded
            aria-label="Toggle search panel"
            @click="isSearchPanelCollapsed = !isSearchPanelCollapsed"
          />
        </div>
      </template>

      <template #content>
        <Transition name="slide-fade">
          <form
            v-show="!isSearchPanelCollapsed"
            role="search"
            aria-label="Claim search form"
            class="space-y-6"
            @submit.prevent="handleSearch"
          >
            <!-- Search Criteria Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Report Number -->
              <div class="flex flex-col">
                <label for="reportNumber" class="text-sm font-medium text-gray-700 mb-2">
                  Report Number
                </label>
                <InputText
                  id="reportNumber"
                  v-model="searchCriteria.reportNumber"
                  placeholder="RPT-2025-001"
                  class="w-full"
                />
              </div>

              <!-- Claim Number -->
              <div class="flex flex-col">
                <label for="claimNumber" class="text-sm font-medium text-gray-700 mb-2">
                  Claim Number
                </label>
                <InputText
                  id="claimNumber"
                  v-model="searchCriteria.claimNumber"
                  placeholder="e.g., CLM-2025-001"
                  aria-describedby="claimNumber-help"
                  class="w-full"
                />
                <small id="claimNumber-help" class="text-gray-500 mt-1">
                  Enter full or partial claim number
                </small>
              </div>

              <!-- Policy Number -->
              <div class="flex flex-col">
                <label for="policyNumber" class="text-sm font-medium text-gray-700 mb-2">
                  Policy Number
                </label>
                <InputText
                  id="policyNumber"
                  v-model="searchCriteria.policyNumber"
                  placeholder="Policy Number"
                  class="w-full"
                />
              </div>

              <!-- Status -->
              <div class="flex flex-col">
                <label for="status" class="text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  id="status"
                  v-model="searchCriteria.status"
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select Status"
                  show-clear
                  class="w-full"
                  aria-label="Claim status filter"
                />
              </div>

              <!-- Created -->
              <div class="flex flex-col">
                <label for="createdDate" class="text-sm font-medium text-gray-700 mb-2">
                  Created Date
                </label>
                <DatePicker
                  id="createdDate"
                  v-model="searchCriteria.createdDates"
                  show-icon
                  date-format="mm/dd/yy"
                  placeholder="MM/DD/YYYY"
                  class="w-full"
                  aria-label="Start date"
                  selection-mode="range"
                  :manual-input="false"
                />
              </div>

              <!-- Submitted -->
              <div class="flex flex-col">
                <label for="submittedDate" class="text-sm font-medium text-gray-700 mb-2">
                  Submitted Date
                </label>
                <DatePicker
                  id="submittedDate"
                  v-model="searchCriteria.dateTo"
                  show-icon
                  date-format="mm/dd/yy"
                  placeholder="MM/DD/YYYY"
                  class="w-full"
                  aria-label="End date"
                  selection-mode="range"
                  :manual-input="false"
                />
              </div>

              <!-- Loss Type -->
              <div class="flex flex-col">
                <label for="claimType" class="text-sm font-medium text-gray-700 mb-2">
                  Claim Type
                </label>
                <MultiSelect
                  id="claimType"
                  v-model="searchCriteria.lossTypes"
                  :options="lossTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select Types"
                  :max-selected-labels="2"
                  class="w-full"
                  aria-label="Claim type filter"
                />
              </div>
            </div>

            <!-- Active Filters Chips -->
            <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 pt-4 border-t">
              <span class="text-sm font-medium text-gray-700 self-center">Active Filters:</span>
              <Chip
                v-for="filter in activeFilters"
                :key="filter.key"
                :label="filter.label"
                removable
                class="bg-blue-100 text-blue-800"
                @remove="removeFilter(filter.key)"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button
                label="Clear"
                icon="pi pi-times"
                severity="secondary"
                outlined
                type="button"
                :disabled="isSearching"
                @click="handleClear"
              />
              <Button
                label="Search"
                icon="pi pi-search"
                type="submit"
                aria-label="Search claims with specified criteria"
                :loading="isSearching"
              />
            </div>
          </form>
        </Transition>
      </template>
    </Card>

    <!-- Results Section -->
    <Card>
      <template #header>
        <div class="flex items-center justify-between p-4 border-b">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">
              Search Results
            </h2>
            <p
              v-if="hasSearched"
              class="text-sm text-gray-600 mt-1"
              role="status"
              aria-live="polite"
            >
              {{ searchResultMessage }}
            </p>
          </div>
          <div class="flex gap-2">
            <Button
              icon="pi pi-download"
              label="Export"
              outlined
              size="small"
              :disabled="!claims.length"
              aria-label="Export results to CSV"
              @click="handleExport"
            />
            <Button
              icon="pi pi-cog"
              outlined
              size="small"
              aria-label="Toggle column visibility"
              @click="showColumnToggle = !showColumnToggle"
            />
          </div>
        </div>
      </template>

      <template #content>
        <!-- Column Visibility Panel -->
        <div v-if="showColumnToggle" class="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">
            Visible Columns
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              v-for="col in columns"
              :key="col.field"
              class="flex items-center gap-2"
            >
              <Checkbox
                v-model="col.visible"
                :input-id="`col-${col.field}`"
                :binary="true"
              />
              <label :for="`col-${col.field}`" class="text-sm">{{ col.header }}</label>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <DataTable
          v-model:selection="selectedClaims"
          :value="claims"
          :loading="isSearching"
          paginator
          :rows="10"
          :rows-per-page-options="[10, 25, 50]"
          striped-rows
          responsive-layout="scroll"
          :global-filter-fields="['claimNumber', 'patientName', 'provider']"
          aria-label="Claim search results table"
          :aria-busy="isSearching"
          data-key="id"
          class="text-sm"
        >
          <!-- Empty State -->
          <template #empty>
            <div class="text-center py-12">
              <i class="pi pi-inbox text-5xl text-gray-300 mb-4" />
              <p class="text-gray-500 text-lg">
                {{ hasSearched
                  ? 'No claims found matching your criteria'
                  : 'Enter search criteria and click "Search Claims" to begin' }}
              </p>
            </div>
          </template>

          <!-- Loading State -->
          <template #loading>
            <div class="flex items-center justify-center py-8">
              <ProgressSpinner style="width: 50px; height: 50px" />
            </div>
          </template>

          <!-- Actions Menu Column (First Column) -->
          <Column header="Actions" frozen :style="{ width: '100px' }">
            <template #body="{ data }">
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                :aria-label="`Actions for claim ${data.claimNumber}`"
                aria-haspopup="true"
                :aria-expanded="selectedClaimForActions?.id === data.id"
                @click="toggleActionMenu($event, data)"
              />
            </template>
          </Column>

          <!-- Selection Column -->
          <Column selection-mode="multiple" header-style="width: 3rem" />

          <!-- Claim Number -->
          <Column
            v-if="getColumn('claimNumber')?.visible"
            field="claimNumber"
            header="Claim Number"
            sortable
            :style="{ minWidth: '150px' }"
          >
            <template #body="{ data }">
              <Button
                :label="data.claimNumber"
                link
                class="p-0 text-blue-600 hover:text-blue-800"
                :aria-label="`View details for claim ${data.claimNumber}`"
                @click="viewClaim(data.id)"
              />
            </template>
          </Column>

          <!-- Patient Name -->
          <Column
            v-if="getColumn('patientName')?.visible"
            field="patientName"
            header="Patient Name"
            sortable
            :style="{ minWidth: '180px' }"
          />

          <!-- Date Submitted -->
          <Column
            v-if="getColumn('dateSubmitted')?.visible"
            field="dateSubmitted"
            header="Date Submitted"
            sortable
            :style="{ minWidth: '140px' }"
          >
            <template #body="{ data }">
              {{ formatDate(data.dateSubmitted) }}
            </template>
          </Column>

          <!-- Status -->
          <Column
            v-if="getColumn('status')?.visible"
            field="status"
            header="Status"
            sortable
            :style="{ minWidth: '130px' }"
          >
            <template #body="{ data }">
              <Tag
                :value="data.status"
                :severity="getStatusSeverity(data.status)"
                class="font-medium"
              />
            </template>
          </Column>

          <!-- Claim Type -->
          <Column
            v-if="getColumn('claimType')?.visible"
            field="claimType"
            header="Claim Type"
            sortable
            :style="{ minWidth: '140px' }"
          />

          <!-- Amount -->
          <Column
            v-if="getColumn('amount')?.visible"
            field="amount"
            header="Amount"
            sortable
            :style="{ minWidth: '120px' }"
          >
            <template #body="{ data }">
              {{ formatCurrency(data.amount) }}
            </template>
          </Column>

          <!-- Provider -->
          <Column
            v-if="getColumn('provider')?.visible"
            field="provider"
            header="Provider"
            sortable
            :style="{ minWidth: '180px' }"
          />
        </DataTable>

        <!-- Actions Menu -->
        <Menu
          ref="actionsMenu"
          :model="actionMenuItems"
          :popup="true"
          aria-label="Claim actions menu"
        />

        <!-- Bulk Actions Bar -->
        <div
          v-if="selectedClaims.length > 0"
          class="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between"
        >
          <span class="text-sm font-medium text-gray-700">
            {{ selectedClaims.length }} claim(s) selected
          </span>
          <div class="flex gap-2">
            <Button
              label="Export Selected"
              icon="pi pi-download"
              size="small"
              outlined
              @click="exportSelected"
            />
            <Button
              label="Bulk Update"
              icon="pi pi-pencil"
              size="small"
              @click="bulkUpdate"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Ensure proper focus visibility */
:deep(.p-inputtext:focus),
:deep(.p-select:focus),
:deep(.p-datepicker:focus),
:deep(.p-multiselect:focus) {
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.5);
}

/* Improve table responsiveness */
:deep(.p-datatable-wrapper) {
  overflow-x: auto;
}

/* Better mobile spacing */
@media (max-width: 640px) {
  .claim-search-page {
    padding: 1rem;
  }
}
</style>
