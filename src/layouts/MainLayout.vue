<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-white text-primary shadow-lg" height-hint="70">
      <q-toolbar class="q-px-lg">
        <q-btn
          dense
          flat
          round
          icon="menu"
          class="text-gray-600 hover:text-primary hover:bg-blue-50 transition-all duration-200"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="flex items-center q-ml-md">
          <q-avatar size="40px" class="q-mr-sm">
            <q-icon name="pets" size="24px" class="text-accent" />
          </q-avatar>
          <span class="text-2xl font-bold">
            <span class="text-orange-400">Pet</span><span class="text-accent">4</span><span class="text-primary">You</span>
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="280"
    >
      <!-- Logo Section -->
      <div class="q-pa-lg bg-white shadow-sm">
        <div class="flex items-center">
          <q-avatar size="36px" class="q-mr-sm">
            <q-icon name="pets" size="20px" class="text-accent" />
          </q-avatar>
          <span class="text-lg font-bold">
            <span class="text-orange-400">Pet</span><span class="text-accent">4</span><span class="text-primary">You</span>
          </span>
        </div>
        <p class="text-xs text-gray-500 q-mt-xs q-mb-none">Conectando corações e patinhas</p>
      </div>

      <q-list class="q-pa-md">
        <q-item-label header class="text-gray-700 font-semibold text-sm q-mb-sm">
          NAVEGAÇÃO
        </q-item-label>

        <q-item
          clickable
          v-ripple
          @click="navigateToHome"
          class="rounded-xl q-mb-xs hover:bg-blue-100 transition-all duration-200"
          active-class="bg-primary text-white shadow-md"
        >
          <q-item-section avatar>
            <q-icon name="home" class="text-primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-medium">Início</q-item-label>
            <q-item-label caption class="text-xs">Página principal</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="navigateToAdopt"
          class="rounded-xl q-mb-xs hover:bg-blue-100 transition-all duration-200"
        >
          <q-item-section avatar>
            <q-icon name="pets" class="text-primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-medium">Adotar</q-item-label>
            <q-item-label caption class="text-xs">Encontre seu pet</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="navigateToRegister"
          class="rounded-xl q-mb-xs hover:bg-teal-100 transition-all duration-200"
        >
          <q-item-section avatar>
            <q-icon name="volunteer_activism" class="text-secondary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-medium">Divulgar</q-item-label>
            <q-item-label caption class="text-xs">Cadastre um animal</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="navigateToAbout"
          class="rounded-xl q-mb-xs hover:bg-purple-100 transition-all duration-200"
        >
          <q-item-section avatar>
            <q-icon name="info" class="text-accent" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-medium">Sobre</q-item-label>
            <q-item-label caption class="text-xs">Nossa missão</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md bg-gray-200" />

        <q-item-label header class="text-gray-700 font-semibold text-sm q-mb-sm">
          MINHA CONTA
        </q-item-label>

        <q-item
          clickable
          v-ripple
          @click="navigateToLogin"
          class="rounded-xl q-mb-xs hover:bg-blue-100 transition-all duration-200"
        >
          <q-item-section avatar>
            <q-icon name="login" class="text-primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-medium" @click="navigateToLogin">Entrar</q-item-label>
            <q-item-label caption class="text-xs">Acesse sua conta</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="navigateToSignup"
          class="rounded-xl q-mb-xs hover:bg-blue-100 transition-all duration-200"
        >
          <q-item-section avatar>
            <q-icon name="person_add" class="text-primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-medium">Cadastrar</q-item-label>
            <q-item-label caption class="text-xs">Crie sua conta</q-item-label>
          </q-item-section>
        </q-item>
        
      </q-list>

      <!-- Footer do Drawer -->
      <div class="absolute-bottom q-pa-md">
        <div class="bg-white rounded-xl q-pa-md shadow-sm">
          <div class="flex items-center q-mb-xs">
            <q-icon name="favorite" class="text-red-500 q-mr-xs" size="16px" />
            <span class="text-xs font-medium text-gray-700">Faça a diferença</span>
          </div>
          <p class="text-xs text-gray-500 q-ma-none">Cada adoção é uma vida transformada</p>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const navigateToHome = () => {
  void router.push('/');
};

const navigateToAdopt = () => {
  console.log('Navegar para página de adoção');
};

const navigateToRegister = () => {
  
};

const navigateToAbout = () => {
  console.log('Navegar para página sobre');
};

const navigateToLogin = () => {
  void router.push('/login');
};

const navigateToSignup = () => {
  void router.push('/register');
};
</script>
