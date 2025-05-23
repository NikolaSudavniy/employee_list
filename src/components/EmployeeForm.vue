<template>
  <div class="employee-form">
    <h2>{{ isEditMode ? 'Редактировать сотрудника' : 'Добавить сотрудника' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div
        class="form-group"
        v-for="field in fields"
        :key="field.name"
        :class="{
          focused: focusedFields[field.name],
          filled: !!form[field.name],
          invalid: !!errors[field.name],
        }"
      >
        <label
          :for="field.name"
          :class="{
            'text-label': field.type !== 'select' && field.type !== 'checkbox',
            'select-label': field.type === 'select',
            'checkbox-label': field.type === 'checkbox'
          }"
        >
          {{ field.label }}
        </label>

        <input
          v-if="field.type !== 'select' && field.type !== 'checkbox'"
          :id="field.name"
          :type="field.type"
          v-model="form[field.name]"
          @focus="handleFocus(field.name)"
          @blur="handleBlur(field.name)"
          :class="['field-input']"
        />

        <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          v-model="form[field.name]"
          @focus="handleFocus(field.name)"
          @blur="handleBlur(field.name)"
        >
          <option value="" disabled>Выберите должность</option>
          <option v-for="pos in positions" :key="pos" :value="pos">{{ pos }}</option>
        </select>

        <div v-else-if="field.type === 'checkbox'" class="switch-group">
          <input
            id="switch"
            type="checkbox"
            class="switch"
            v-model="checkboxModel"
          />
          <label class="switch-label" for="switch"></label>
          <span class="switch-text">{{ checkboxModel ? 'Активный' : 'Неактивный' }}</span>
        </div>

        <span v-if="errors[field.name]" class="error">{{ errors[field.name] }}</span>
      </div>

      <div class="form-actions">
        <button type="submit">Сохранить</button>
        <button type="button" @click="handleCancel">Отмена</button>
        <button
          v-if="isEditMode"
          type="button"
          @click="handleDelete"
          class="delete-button"
        >
          Удалить
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { Employee } from '../types/employee';
  import { getEmployees, saveEmployees } from '../utils/storage';

  const router = useRouter();
  const route = useRoute();
  const isEditMode = computed(() => !!route.params.id);
  const employeeId = computed(() => Number(route.params.id));
  const positions = ['Менеджер', 'HR', 'Разработчик', 'Дизайнер'];

  interface Field {
    name: keyof Employee;
    label: string;
    type: 'text' | 'email' | 'select' | 'url' | 'checkbox' | 'tel' | 'date';
  }

  const fields: Field[] = [
    { name: 'firstName', label: 'Имя', type: 'text' },
    { name: 'lastName', label: 'Фамилия', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'position', label: 'Должность', type: 'select' },
    { name: 'photoUrl', label: 'Фото (URL)', type: 'url' },
    { name: 'status', label: 'Статус', type: 'checkbox' },
    { name: 'phone', label: 'Телефон', type: 'tel' },
    { name: 'birthDate', label: 'Дата рождения', type: 'date' },
  ];

  const form = reactive<Employee>({
    id: Date.now(),
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    photoUrl: '',
    status: 'active',
    phone: '',
    birthDate: '',
  });

  const errors = reactive<Record<keyof Employee, string>>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    photoUrl: '',
    status: '',
    phone: '',
    birthDate: '',
  });

  const focusedFields = reactive<Record<keyof Employee, boolean>>({
    id: false,
    firstName: false,
    lastName: false,
    email: false,
    position: false,
    photoUrl: false,
    status: false,
    phone: false,
    birthDate: false,
  });

  const checkboxModel = ref(form.status === 'active');

  watch(checkboxModel, (val) => {
    form.status = val ? 'active' : 'inactive';
  });
  watch(
    () => form.status,
    (val) => {
      checkboxModel.value = val === 'active';
    },
    { immediate: true }
  );

  onMounted(() => {
    if (isEditMode.value) {
      const list = getEmployees();
      const found = list.find((e) => e.id === employeeId.value);
      if (found) Object.assign(form, found);
    }
  });

  function handleFocus(field: keyof Employee) {
    focusedFields[field] = true;
  }

  function handleBlur(field: keyof Employee) {
    focusedFields[field] = false;
    validateField(field);
  }

  function validateField(field: keyof Employee) {
    switch (field) {
      case 'firstName':
        errors.firstName = form.firstName.trim() ? '' : 'Имя обязательно';
        break;
      case 'lastName':
        errors.lastName = form.lastName.trim() ? '' : 'Фамилия обязательна';
        break;
      case 'position':
        errors.position = form.position ? '' : 'Выберите должность';
        break;
      case 'email':
        errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
          ? ''
          : 'Неверный email';
        break;
      case 'phone':
        errors.phone =
          !form.phone || /^\+?\d{10,15}$/.test(form.phone)
            ? ''
            : 'Некорректный телефон';
        break;
      case 'birthDate':
        if (!form.birthDate) {
          errors.birthDate = 'Дата рождения обязательна';
        } else {
          const age =
            new Date().getFullYear() - new Date(form.birthDate).getFullYear();
          errors.birthDate = age >= 18 ? '' : 'Минимум 18 лет';
        }
        break;
      default:
        if (field in errors) errors[field] = '';
        break;
    }
  }

  function validateForm() {
    let isValid = true;
    for (const field of fields) {
      validateField(field.name);
      if (errors[field.name]) isValid = false;
    }
    return isValid;
  }

  function handleSubmit() {
    if (!validateForm()) return;

    const list = getEmployees();

		if (!form.photoUrl.trim()) {
    	form.photoUrl = 'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png';
  	}

    if (isEditMode.value) {
      const index = list.findIndex((e) => e.id === employeeId.value);
      if (index !== -1) list[index] = { ...form };
    } else {
      form.id = Date.now();
      list.push({ ...form });
    }

    saveEmployees(list);
    router.push('/');
  }

  function handleDelete() {
    if (!confirm('Вы уверены, что хотите удалить сотрудника?')) return;

    const list = getEmployees();
    const updated = list.filter((e) => e.id !== employeeId.value);
    saveEmployees(updated);
    router.push('/');
  }

  function handleCancel() {
    router.push('/');
  }
</script>

<style scoped lang="scss">
  .employee-form {
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    max-width: 600px;
    margin: 32px auto;

    .form-actions {
      display: flex;
      justify-content: space-between;
    }

    .checkbox-label{
      font-size: .75rem;
    }
    .switch-group{
      margin-top: 8px;
    }
  }
</style>
