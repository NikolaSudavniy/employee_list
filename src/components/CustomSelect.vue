<template>
  <div class="custom-select" ref="selectRef">
    <div class="select-display" @click="toggle">
      <span :class="{ 'placeholder': !modelValue }">{{ selectedLabel }}</span>
      <svg class="arrow" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    </div>
    <ul v-if="isOpen" class="select-options">
      <li v-for="option in props.options" :key="option" @click="selectOption(option)">
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

  const props = defineProps<{
    modelValue: string
    options: string[]
    label?: string
    placeholder?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const isOpen = ref(false)
  const selectRef = ref<HTMLElement | null>(null)
  const selectedLabel = computed(() =>
    props.modelValue ? props.modelValue : props.placeholder || 'Выберите'
  )

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const selectOption = (option: string) => {
    emit('update:modelValue', option)
    isOpen.value = false
  }

  const clickOutside = (e: MouseEvent) => {
    if (!selectRef.value?.contains(e.target as Node)) {
      isOpen.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', clickOutside)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', clickOutside)
  })
</script>


<style scoped>
  .custom-select {
    position: relative;
    width: 100%;
    cursor: pointer;
    font-size: 1rem;
  }

  .select-display {
    padding: 1.1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .select-display .placeholder {
    color: #999;
  }

  .arrow {
    width: 1rem;
    height: 1rem;
    fill: currentColor;
  }

  .select-options {
    position: absolute;
    width: 100%;
    max-height: 12rem;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
    z-index: 10;
  }
  .select-options li {
    padding: 0.75rem 1rem;
  }
  .select-options li:hover {
    background-color: #f0f0f0;
  }
</style>
