<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../../firebaseconfig'
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { auth } from '../../firebaseconfig'

const loading = ref(true)
type Employee = {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  salary: number
  position: string
  managerId: string
  isManager: boolean
}

const employees = ref<Employee[]>([])
const fetchData = async () => {
  loading.value = true
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'))
    employees.value = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, any>
      const employee = {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: formatTimestamp(data.birthDate || null),
        salary: data.Salary,
        position: data.Position,
        managerId: data.managerId,
        isManager: data.isManager
      }
      return employee
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const formatTimestamp = (timestamp: Timestamp | null): string => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate()
  return date.toLocaleDateString()
}

onMounted(() => {
  fetchData()
  loading.value = false
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS }
})
</script>

<template>
  <div class="card">
    <DataTable
      v-model:filters="filters"
      :value="employees"
      paginator
      :rows="10"
      :loading="loading"
      showGridlines
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="header">
          <span class="text-xl font-bold">Employees</span>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>
      <template #empty> No employees found. </template>
      <template #loading> Loading employee data. Please wait. </template>
      <Column field="firstName" header="First Name" sortable></Column>
      <Column field="lastName" header="Last Name" sortable></Column>
      <Column field="salary" header="Salary" sortable></Column>
      <Column field="position" header="Position" sortable></Column>
      <Column field="birthDate" header="Birth Date" sortable></Column>
      <Column field="isManager" header="Manager" sortable></Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  margin: 4rem;
  font-size: small;
  border-radius: 10%;
}

.search {
  display: flex;

  justify-content: flex-end;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}
</style>
