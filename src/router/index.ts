import { createRouter, createWebHistory } from 'vue-router';
import EmployeeList from '../pages/EmployeeList.vue';
import EmployeeForm from '../components/EmployeeForm.vue';

const routes = [
  { 
    path: '/',
    name: 'Home', 
    component: EmployeeList 
  },
  { 
    path: '/employee', 
    name: 'AddEmployee', 
    component: EmployeeForm 
  },
  { 
    path: '/employee/:id', 
    name: 'EditEmployee', 
    component: EmployeeForm 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
