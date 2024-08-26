<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import DatePicker from 'primevue/datepicker'
import SelectButton from 'primevue/selectbutton'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore'
import { db } from '../../firebaseconfig'
import { ref, onMounted, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { auth } from '../../firebaseconfig'

const toast = useToast()
const deleteConfirmation = ref(false)
const editingRows = ref([])
const selected = ref()
const size = ref({ label: 'Small', value: 'small' })
const visible = ref(false)
const isManager = ref('No')
const options = ref(['No', 'Yes'])
const date = ref()
const firstName = ref(null)
const lastName = ref(null)
const Salary = ref(null)
const Position = ref(null)
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
  if (!Salary.value) errors.value.Salary = 'Salary is required'
  else if (isNaN(Number(Salary.value))) errors.value.Salary = 'Salary must be a number'
  if (!Position.value) errors.value.Position = 'Position is required'

  return Object.keys(errors.value).length === 0
}

const handleAddEmployee = async () => {
  if (!validateInputs()) {
    Object.keys(errors.value).forEach((field) => {
      const errorMessage = errors.value[field]
      toast.add({
        severity: 'error',
        summary: `Error in ${field}`,
        detail: errorMessage,
        group: 'tl',
        life: 3000
      })
    })
    return
  }
  if (Position.value === 'CEO' || Position.value === 'Ceo' || Position.value === 'ceo') {
    const ceo = employees.value.find((emp) => emp.Position === 'CEO')
    if (ceo) {
      toast.add({
        severity: 'error',
        summary: 'CEO already exists',
        detail: 'There can only be one CEO in the company',
        group: 'tl',
        life: 3000
      })
      return
    }
  }
  const selectedEmployeeId = selectedEmployee.value.code || null
  const docRef = await addDoc(collection(db, 'employees'), {
    firstName: firstName.value,
    lastName: lastName.value,
    birthDate: date.value,
    Salary: Salary.value,
    Position: Position.value,
    managerId: selectedEmployeeId,
    isManager: isManager.value
  })
  selectedEmployee.value = null
  visible.value = false
  await fetchData()
  toast.add({
    severity: 'success',
    summary: 'Employee added successfully',
    group: 'tl',
    life: 3000
  })
}

type Employee = {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  Salary: number
  Position: string
  managerId: string
  isManager: boolean
  managerName: string
}

const fetchData = async () => {
  loading.value = true
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'))
    const tempEmployees = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, any>
      return {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: formatTimestamp(data.birthDate || null),
        Salary: data.Salary,
        Position: data.Position,
        managerId: data.managerId,
        isManager: data.isManager,
        managerName: ''
      }
    })
    setTimeout(() => {}, 0)
    employees.value = tempEmployees.map((emp) => {
      if (emp.managerId) {
        const manager = tempEmployees.find((e) => e.id == emp.managerId)
        emp.managerName = manager ? `${manager.firstName} ${manager.lastName}` : 'Unknown'
      } else {
        emp.managerName = 'None'
      }
      return emp
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
    if (newData.id === newData.managerId) {
      toast.add({
        severity: 'error',
        summary: 'Employee cannot be their own manager',
        detail: 'Please select a different manager',
        group: 'tl',
        life: 3000
      })
      return
    }
    if (newData.Position === 'CEO' || newData.Position === 'ceo' || newData.Position === 'Ceo') {
      toast.add({
        severity: 'error',
        summary: 'The CEO is the owner of this company and cannot be changed',
        detail: 'Otherwise the company hierarchy will be broken',
        group: 'tl',
        life: 3000
      })
      return
    }
    const employeeRef = doc(db, 'employees', newData.id)
    await updateDoc(employeeRef, {
      firstName: newData.firstName,
      lastName: newData.lastName,
      birthDate: Timestamp.fromDate(new Date(newData.birthDate)),
      Salary: newData.Salary,
      Position: newData.Position,
      isManager: newData.isManager,
      managerId: newData.managerId
    })
    employees.value[index] = newData
    editingRows.value = []
    await fetchData()
    toast.add({
      severity: 'success',
      summary: 'Employee updated successfully',
      group: 'tl',
      life: 3000
    })
  } catch (error) {
    console.error('Error updating document: ', error)
  }
}

const deleteSelected = async () => {
  try {
    if (!selected.value) return
    if (
      selected.value.Position === 'CEO' ||
      selected.value.Position === 'ceo' ||
      selected.value.Position === 'Ceo' ||
      selected.value.Position === 'CEo' ||
      selected.value.Position === 'CeO' ||
      selected.value.Position === 'cEo' ||
      selected.value.Position === 'cEO' ||
      selected.value.Position === 'ceO'
    ) {
      toast.add({
        severity: 'error',
        summary: 'The CEO is the owner of this company and cannot be deleted',
        detail: 'Otherwise the company hierarchy will be broken',
        group: 'tl',
        life: 3000
      })
      return
    }
    const employeesRef: Employee[] = []
    const q = query(collection(db, 'employees'), where('managerId', '==', selected.value.id))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      employeesRef.push({ ...doc.data(), id: doc.id } as Employee)
    })

    for (const emp of employeesRef) {
      const employeeRef = doc(db, 'employees', emp.id)
      await updateDoc(employeeRef, {
        firstName: emp.firstName,
        lastName: emp.lastName,
        birthDate: Timestamp.fromDate(new Date(emp.birthDate)),
        Salary: emp.Salary,
        Position: emp.Position,
        isManager: emp.isManager,
        managerId: selected.value.managerId
      })
    }

    await deleteDoc(doc(db, 'employees', selected.value.id))
    await fetchData()
    selected.value = []

    toast.add({
      severity: 'success',
      summary: 'Employee deleted successfully',
      life: 3000,
      group: 'tl'
    })
  } catch (error) {
    console.error('Error deleting employees:', error)
  }
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS }
})

onMounted(() => {
  fetchData()
  loading.value = false
})
</script>

<template>
  <div class="card">
    <Toast />
    <Toast Position="bottom-right" group="tl" />
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
          <div class="spacing">
            <span class="text-xl font-bold">Employees</span>
            <div class="search">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
              </IconField>
            </div>
            <div class="buttons">
              <Button
                label="Delete Employee"
                @click="deleteSelected"
                icon="pi pi-trash"
                severity="danger"
                :disabled="selected == null"
              />
              <Button
                class="button"
                icon="pi pi-plus"
                label="Add Employee"
                @click="visible = true"
              />
            </div>
          </div>
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
              </div>
              <div class="dialog-columns flex flex-column gap-4">
                <FloatLabel>
                  <InputText id="Salary" v-model="Salary" />
                  <label for="Salary">Salary</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText id="Position" v-model="Position" />
                  <label for="Position">Position</label>
                </FloatLabel>
                <Select
                  v-model="selectedEmployee"
                  :options="employeeOptions"
                  optionLabel="name"
                  placeholder="Select a Manager"
                  class="w-full md:w-56"
                />
                <!-- <div class="manager">
                  <label for="isManager">Is a Manager</label>
                  <SelectButton v-model="isManager" :options="options" aria-labelledby="basic" />
                </div> -->
              </div>
            </div>
            <div class="buttons">
              <div class="flex gap-4">
                <Button
                  type="button"
                  label="Cancel"
                  severity="secondary"
                  icon="pi pi-times"
                  @click="visible = false"
                ></Button>
                <Button
                  type="button"
                  label="Save"
                  icon="pi pi-check"
                  @click="handleAddEmployee()"
                ></Button>
              </div>
            </div>
          </Dialog>
        </div>
      </template>
      <template #empty> No employees found. </template>
      <template #loading> Loading employee data. Please wait. </template>
      <Column selectionMode="single" headerStyle="width: 3%"></Column>
      <Column field="firstName" header="First Name" style="width: 12%" sortable>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="lastName" header="Last Name" style="width: 12%" sortable>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="Position" header="Position" style="width: 15%" sortable>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="Salary" header="Salary" style="width: 10%" sortable>
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" mode="currency" currency="ZAR" locale="en-US" fluid />
        </template>
      </Column>
      <Column field="birthDate" header="Birth Date" style="width: 10%" sortable>
        <template #editor="{ data, field }">
          <DatePicker v-model="data[field]" inputId="birth_date" />
        </template>
      </Column>
      <!-- <Column field="isManager" header="Manager" style="width: 10%" sortable>
        <template #editor="{ data, field }">
          <SelectButton v-model="data[field]" :options="options" />
        </template>
      </Column> -->
      <Column field="managerName" header="Manager" style="width: 10%" sortable>
        <template #editor="{ data }">
          <Select
            v-model="data.managerId"
            :options="employeeOptions"
            optionLabel="name"
            optionValue="code"
            :placeholder="data.managerName"
            class="w-full md:w-56"
          />
        </template>
      </Column>
      <Column :rowEditor="true" style="width: 8%" bodyStyle="text-align:center"></Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  margin: 2rem;
  font-size: small;
  border-radius: 10%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  gap: 1rem;
  align-items: center;
}

.spacing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 1rem;
}
</style>
