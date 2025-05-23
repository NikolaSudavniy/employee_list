<template>
  <div class="card" @click="$emit('click')">
    <img :src="employee.photoUrl || defaultPhoto" alt="Фото сотрудника" />
    <div class="info">
      <h3>{{ employee.firstName }} {{ employee.lastName }}</h3>
      <p>{{ employee.email }}</p>
      <p>{{ employee.position }}</p>
      <span class="badge" :class="employee.status">
        {{ employee.status === 'active' ? 'Активный' : 'Неактивный' }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Employee } from '../types/employee'

  interface EmployeeCardProps {
    employee: Employee
  }

  const props = defineProps<EmployeeCardProps>()
  const defaultPhoto = 'https://via.placeholder.com/100x100?text=Фото'
</script>

<style scoped lang="scss">
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    background-color: #fff;
    transition: box-shadow 0.2s ease;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 12px;
    }

    .info {
      text-align: center;

      h3 {
        margin: 4px 0;
        font-size: 18px;
      }

      p {
        margin: 2px 0;
        font-size: 14px;
      }

      .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        margin-top: 8px;
        text-transform: uppercase;
        font-weight: bold;

        &.active {
          background-color: #28a745;
          color: #fff;
        }

        &.inactive {
          background-color: #dc3545;
          color: #fff;
        }
      }
    }
  }
</style>
