<template>
  <div class="employee-filters">
    <div class="form-group">
      <input
        type="text"
        class="field-input"
        v-model="localSearchQuery"
        placeholder="Поиск по имени или фамилии"
      />
    </div>
    <div class="form-group">
      <CustomSelect
        v-model="localSelectedPosition"
        :options="positions"
        label="Должность"
        placeholder="Выберите должность"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, watchEffect } from 'vue'
  import CustomSelect from './CustomSelect.vue'

  const props = defineProps<{
    searchQuery: string
    selectedPosition: string
    positions: string[]
  }>()

  const emit = defineEmits<{
    (e: 'update:searchQuery', value: string): void
    (e: 'update:selectedPosition', value: string): void
  }>()

  const localSearchQuery = ref(props.searchQuery)
  const localSelectedPosition = ref(props.selectedPosition)

  watch(localSearchQuery, (val) => emit('update:searchQuery', val))
  watch(localSelectedPosition, (val) => {
    emit('update:selectedPosition', val === 'Все' ? '' : val)
  })

  const positions = ref<string[]>([])
  watchEffect(() => {
    positions.value = ['Все', ...props.positions.filter(p => p !== 'Все')]
  })
</script>

<style scoped>
  .employee-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    flex: 1 1 200px;
  }
</style>
