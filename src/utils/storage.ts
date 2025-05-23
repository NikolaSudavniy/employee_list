import type { Employee } from '../types/employee';

export function getEmployees(): Employee[] {
  const data = localStorage.getItem('employees');
  return data ? JSON.parse(data) : [];
}

export function saveEmployees(list: Employee[]) {
  localStorage.setItem('employees', JSON.stringify(list));
}
