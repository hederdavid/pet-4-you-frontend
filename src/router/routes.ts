import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
      {
        path: 'perfil',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'admin/usuarios',
        name: 'usersManagement',
        component: () => import('pages/admin/UserManagementPage.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'meusPets',
        name: 'myPets',
        component: () => import('pages/MyPetsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'admin/pets',
        name: 'petsManagement',
        component: () => import('pages/admin/PetsPublicationsManagement.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        path: 'pets',
        name: 'petAdoption',
        component: () => import('pages/PetAdoption.vue'),
      },
      {
        path: 'pets/:id',
        name: 'petDetails',
        component: () => import('pages/PetDetails.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/RegisterPage.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    name: 'forbidden',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
