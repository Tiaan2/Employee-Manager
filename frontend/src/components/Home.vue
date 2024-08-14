<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../../firebaseconfig'
import { ref, onMounted } from 'vue'

type Employee = {
  name: string
  surname: string
  birthDate: Timestamp
  employeeNumber: string
  salary: number
  position: string
  isManager: boolean
}

const employees = ref<Employee[]>([])

const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'))
    employees.value = querySnapshot.docs.map((doc) => doc.data() as Employee)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <DataTable :value="employees" :paginator="true" :rows="10" responsive-layout="scroll">
      <Column field="name" header="Name" />
      <Column field="surname" header="Surname" />
      <Column field="birthDate" header="Birth Date" />
      <Column field="employeeNumber" header="Employee Number" />
      <Column field="salary" header="Salary" />
      <Column field="position" header="Role" />
      <Column field="isManager" header="Reporting Line" />
    </DataTable>
  </div>
</template>

<style scoped></style>
