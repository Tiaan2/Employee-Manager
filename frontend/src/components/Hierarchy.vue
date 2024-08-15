<script setup lang="ts">
import OrganizationChart from 'primevue/organizationchart'
import Fieldset from 'primevue/fieldset'
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore'
import { db } from '../../firebaseconfig'
import { ref, onMounted } from 'vue'

class Node<T> {
  label: string
  children: Node<T>[]

  constructor(data: Employee) {
    this.label = `${data.firstName} ${data.lastName} (${data.position})`
    this.children = []
  }

  addChild(child: Node<T>): void {
    this.children.push(child)
  }
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

const employees = ref<Employee[]>([])
const loading = ref(false)
const data = ref<Node<Employee>[]>([])

const fetchData = async (): Promise<Employee[]> => {
  loading.value = true
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'))
    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, any>
      return {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: formatTimestamp(data.birthDate || null),
        salary: data.Salary,
        position: data.Position,
        managerId: data.managerId,
        isManager: data.isManager
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  } finally {
    loading.value = false
  }
}

const formatTimestamp = (timestamp: Timestamp | null): string => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate()
  return date.toLocaleDateString()
}

function buildTree(employees: Employee[]): any {
  const nodeMap = new Map<string, Node<Employee>>()
  const rootNodes: Node<Employee>[] = []

  employees.forEach((employee) => {
    const node = new Node(employee)
    nodeMap.set(employee.id, node)
  })

  employees.forEach((employee) => {
    const node = nodeMap.get(employee.id)
    if (!node) {
      return
    }
    if (employee.managerId === '' || !employee.managerId.trim()) {
      rootNodes.push(node)
    } else {
      const parentNode = nodeMap.get(employee.managerId.trim())
      if (parentNode) {
        parentNode.addChild(node)
      } else {
        console.error(`Parent node not found for employee: ${employee.id}`)
      }
    }
  })

  if (rootNodes.length === 1) {
    return transformNode(rootNodes[0])
  } else {
    console.error('Multiple root nodes found')
    return []
  }
}

function transformNode(node: Node<Employee>): any {
  return {
    label: node.label,
    children: node.children.map(transformNode)
  }
}

async function getEmployeeHierarchy() {
  const fetchedEmployees = await fetchData()
  employees.value = fetchedEmployees
  data.value = buildTree(fetchedEmployees)
  console.log(data.value)
}

onMounted(() => {
  getEmployeeHierarchy()
})
</script>

<template>
  <div class="card overflow-x-auto">
    <OrganizationChart :value="data">
      <template #default="slotProps">
        <span>{{ slotProps.node.label }}</span>
      </template>
    </OrganizationChart>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 2rem;
  max-width: 600px;
  margin: auto;
}

.p-field {
  margin-bottom: 1rem;
}
</style>
