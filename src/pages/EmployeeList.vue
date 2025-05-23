<template>
  <div class="employee-list container">
    <div class="header">
      <h1>Сотрудники</h1>
      <button @click="goToAdd">Добавить сотрудника</button>
      <EmployeeFilters
        :searchQuery="searchQuery"
        :selectedPosition="selectedPosition"
        :positions="positions"
        @update:searchQuery="searchQuery = $event"
        @update:selectedPosition="selectedPosition = $event"
      />
    </div>

    <div v-if="sortedEmployees.length" class="grid">
      <EmployeeCard
        v-for="employee in sortedEmployees"
        :key="employee.id"
        :employee="employee"
        @click="goToEdit(employee.id)"
      />
    </div>
    <p v-else class="empty">Сотрудников не найдено</p>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Employee } from '../types/employee';
  import EmployeeCard from '../components/EmployeeCard.vue';
  import EmployeeFilters from '../components/EmployeeFilters.vue';
  import { defaultEmployees } from '../data/defaultEmployees';

  const router = useRouter();
  const employees = ref<Employee[]>([]);

  const searchQuery = ref('');
  const selectedPosition = ref('');

  const loadEmployees = () => {
    const data = localStorage.getItem('employees');
    if (!data) {
      localStorage.setItem('employees', JSON.stringify(defaultEmployees));
      employees.value = [...defaultEmployees];
    } else {
      employees.value = JSON.parse(data);
    }
  };

  onMounted(loadEmployees);

  const positions = computed(() => {
    const all = employees.value.map(emp => emp.position);
    return [...new Set(all)].filter(Boolean).sort();
  });

  const filteredEmployees = computed(() =>
    employees.value.filter(emp =>
      (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (!selectedPosition.value || emp.position === selectedPosition.value)
    )
  );

  const sortedEmployees = computed(() =>
    [...filteredEmployees.value].sort((a, b) => {
      const last = a.lastName.localeCompare(b.lastName);
      return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
    })
  );

  const goToAdd = () => router.push('/employee');
  const goToEdit = (id: number) => router.push(`/employee/${id}`);
</script>

<style scoped lang="scss">
  .employee-list {
    padding: 20px;

    button{
      margin-bottom: 1rem;;
    }

    .empty {
      text-align: center;
      font-style: italic;
      margin-top: 40px;
      color: #666;
    }
  }
</style>
