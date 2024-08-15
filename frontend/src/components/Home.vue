<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DatePicker from 'primevue/datepicker'
import SelectButton from 'primevue/selectbutton'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import {
  collection,
  getDocs,
  doc,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../../firebaseconfig'
import { ref, onMounted, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { auth } from '../../firebaseconfig'

const editingRows = ref([])
const selected = ref()
const size = ref({ label: 'Small', value: 'small' })
const visible = ref(false)
const isManager = ref('No')
const options = ref(['No', 'Yes'])
const date = ref()
const firstName = ref(null)
const lastName = ref(null)
const salary = ref(null)
const position = ref(null)
const employees = ref<Employee[]>([])
const loading = ref(true)
const selectedEmployee = ref<any>(null)
const errors = ref<Record<string, string>>({})
const employeeOptions = computed(() =>
  employees.value.map((employee) => ({
    name: `${employee.firstName} ${employee.lastName}`,
    code: employee.id
  }))
)

const validateInputs = (): boolean => {
  errors.value = {}
  if (!firstName.value) errors.value.firstName = 'First name is required'
  if (!lastName.value) errors.value.lastName = 'Last name is required'
  if (!date.value) errors.value.date = 'Birth date is required'
  if (!salary.value) errors.value.salary = 'Salary is required'
  else if (isNaN(Number(salary.value))) errors.value.salary = 'Salary must be a number'
  if (!position.value) errors.value.position = 'Position is required'

  return Object.keys(errors.value).length === 0
}

const handleAddEmployee = async () => {
  if (!validateInputs()) {
    console.log()
  }
  const selectedEmployeeId = selectedEmployee.value.code || null
  const docRef = await addDoc(collection(db, 'employees'), {
    firstName: firstName.value,
    lastName: lastName.value,
    birthDate: date.value,
    Salary: salary.value,
    Position: position.value,
    managerId: selectedEmployeeId,
    isManager: isManager.value
  })
  selectedEmployee.value = null
  await fetchData()
  console.log('Document written with ID: ', docRef.id)
}

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

const onRowEditSave = async (event: { newData: Employee; index: number }) => {
  const { newData, index } = event
  try {
    const employeeRef = doc(db, 'employees', newData.id)
    await updateDoc(employeeRef, {
      firstName: newData.firstName,
      lastName: newData.lastName,
      birthDate: Timestamp.fromDate(new Date(newData.birthDate)),
      Salary: newData.salary,
      Position: newData.position,
      isManager: newData.isManager
    })
    console.log('Document updated successfully')
    employees.value[index] = newData
    editingRows.value = []
    await fetchData()
  } catch (error) {
    console.error('Error updating document: ', error)
  }
}

const deleteSelected = async () => {
  if (
    confirm(
      `Are you sure you want to delete '${selected.value.firstName} ${selected.value.lastName}'?`
    )
  ) {
    try {
      await deleteDoc(doc(db, 'employees', selected.value.id))
      await fetchData()
      selected.value = []
    } catch (error) {
      console.error('Error deleting employees:', error)
    }
  }
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
      v-model:editingRows="editingRows"
      :value="employees"
      v-model:selection="selected"
      editMode="row"
      resizableColumns
      columnResizeMode="fit"
      dataKey="id"
      @row-edit-save="onRowEditSave"
      paginator
      :rows="10"
      :loading="loading"
      :size="size.value"
      showGridlines
      tableStyle="min-width: 50rem"
      :filters="filters"
      selectionMode="single"
    >
      <template #header>
        <div class="header">
          <span class="text-xl font-bold">Employees</span>
          <div class="search">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </IconField>
          </div>
          <Button class="button" icon="pi pi-plus" label="Add Employee" @click="visible = true" />
          <Button
            label="Delete Selected"
            @click="deleteSelected"
            class="mb-3"
            :disabled="selected == null"
          />
          <Dialog v-model:visible="visible" modal header="Add Employee">
            <div class="dialog">
              <div class="dialog-columns flex flex-column gap-4">
                <FloatLabel>
                  <InputText id="firstName" v-model="firstName" />
                  <label for="firstName">First Name</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText id="lastName" v-model="lastName" />
                  <label for="lastName">Last Name</label>
                </FloatLabel>
                <FloatLabel>
                  <DatePicker v-model="date" inputId="birth_date" />
                  <label for="birth_date">Birth Date</label>
                </FloatLabel>
                <Select
                  v-model="selectedEmployee"
                  :options="employeeOptions"
                  optionLabel="name"
                  placeholder="Select a Manager"
                  class="w-full md:w-56"
                />
              </div>
              <div class="dialog-columns flex flex-column gap-4">
                <FloatLabel>
                  <InputText id="salary" v-model="salary" />
                  <label for="salary">Salary</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText id="position" v-model="position" />
                  <label for="position">Position</label>
                </FloatLabel>
                <div class="manager">
                  <label for="isManager">Is a Manager</label>
                  <SelectButton v-model="isManager" :options="options" aria-labelledby="basic" />
                </div>
              </div>
            </div>
            <div class="buttons">
              <div class="flex gap-4">
                <Button
                  type="button"
                  label="Cancel"
                  severity="secondary"
                  @click="visible = false"
                ></Button>
                <Button
                  type="button"
                  label="Save"
                  @click="handleAddEmployee(), (visible = false)"
                ></Button>
              </div>
            </div>
          </Dialog>
        </div>
      </template>
      <template #empty> No employees found. </template>
      <template #loading> Loading employee data. Please wait. </template>
      <Column selectionMode="single" headerStyle="width: 3rem"></Column>
      <Column field="firstName" header="First Name" sortable>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="lastName" header="Last Name" sortable>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="salary" header="Salary" sortable>
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" />
        </template>
      </Column>
      <Column field="position" header="Position" sortable>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="birthDate" header="Birth Date" sortable>
        <template #editor="{ data, field }">
          <DatePicker v-model="data[field]" inputId="birth_date" />
        </template>
      </Column>
      <Column field="isManager" header="Manager" sortable>
        <template #editor="{ data, field }">
          <SelectButton v-model="data[field]" :options="options" />
        </template>
      </Column>
      <Column
        :rowEditor="true"
        style="width: 10%; min-width: 8rem"
        bodyStyle="text-align:center"
      ></Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  margin: 4rem;
  font-size: small;
  border-radius: 10%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  font-size: small;
}

.dialog {
  display: flex;
  gap: 2rem;
  columns: 2;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
}
.manager {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  columns: 2;
  flex-direction: row;
}
dialog-columns {
  display: flex;
}

.buttons {
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>
