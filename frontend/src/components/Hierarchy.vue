<script setup lang="ts">
import { ref } from 'vue'
import OrganizationChart from 'primevue/organizationchart'

const data = ref({
  key: '0',
  type: 'country',
  label: 'Argentina',
  data: 'ar',
  children: [
    {
      key: '0_0',
      type: 'country',
      label: 'Argentina',
      data: 'ar',
      children: [
        {
          key: '0_0_0',
          type: 'country',
          label: 'Argentina',
          data: 'ar'
        },
        {
          key: '0_0_1',
          type: 'country',
          label: 'Croatia',
          data: 'hr'
        }
      ]
    },
    {
      key: '0_1',
      type: 'country',
      label: 'France',
      data: 'fr',
      children: [
        {
          key: '0_1_0',
          type: 'country',
          label: 'France',
          data: 'fr'
        },
        {
          key: '0_1_1',
          type: 'country',
          label: 'Morocco',
          data: 'ma'
        }
      ]
    }
  ]
})
</script>

<template>
  <div class="card overflow-x-auto">
    <OrganizationChart :value="data" collapsible>
      <template #country="slotProps">
        <div class="flex flex-col items-center">
          <img
            :alt="slotProps.node.label"
            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
            :class="`w-2rem flag flag-${slotProps.node.data}`"
          />
          <div class="mt-4 font-medium text-lg">{{ slotProps.node.label }}</div>
        </div>
      </template>
      <template #default="slotProps">
        <span>{{ slotProps.node.data.label }}</span>
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
