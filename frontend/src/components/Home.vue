<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../../firebaseconfig'
import { ref, onMounted } from 'vue'

type Employee = {
  firstName: string
  lastName: string
  birthDate: string
  employeeNumber: number
  salary: number
  position: string
  managerId: string | null
  isManager: boolean
}

const columns = [
  { field: 'firstName', header: 'Name' },
  { field: 'lastName', header: 'Surname' },
  { field: 'employeeNumber', header: 'Employee Number' },
  { field: 'salary', header: 'Salary' },
  { field: 'position', header: 'Position' },
  { field: 'birthDate', header: 'Birth Date' },
  { field: 'isManager', header: 'Manager' },
  { field: 'managerId', header: 'Manager ID' }
]

const employees = ref<Employee[]>([])
const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'))
    console.log(`Number of documents fetched: ${querySnapshot.docs.length}`)
    employees.value = querySnapshot.docs.map((doc) => {
      const data = doc.data() as any
      const employee = {
        firstName: data.firstName || data['First Name'] || 'def',
        lastName: data.lastName || data['Last Name'] || 'def',
        birthDate: formatTimestamp(data['Birth Date'] || null),
        employeeNumber: data.employeeNumber || data['Employee Number'],
        salary: data.Salary,
        position: data.Position,
        managerId: data.managerId || null,
        isManager: data.isManager
      }
      return employee
    })
    console.log('Employees data:', employees.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const formatTimestamp = (timestamp: Timestamp | null): string => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate()
  return date.toLocaleDateString() // Customize this format as needed
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="card">
    <DataTable :value="employees" showGridlines tableStyle="min-width: 50rem">
      <Column field="firstName" header="First Name" sortable></Column>
      <Column field="lastName" header="Last Name" sortable></Column>
      <Column field="employeeNumber" header="Employee Number" sortable></Column>
      <Column field="salary" header="Salary" sortable></Column>
      <Column field="position" header="Position" sortable></Column>
      <Column field="birthDate" header="Birth Date" sortable></Column>
      <Column field="isManager" header="Manager" sortable></Column>
      <!-- <Column field="managerId" header="Manager ID"></Column> -->
    </DataTable>
  </div>
</template>

<style scoped></style>
