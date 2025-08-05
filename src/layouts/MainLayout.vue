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
            <span class="text-orange-400">Pet</span><span class="text-accent">4</span
            ><span class="text-primary">You</span>
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered :width="280">
      <!-- Logo Section -->
      <div class="q-pa-lg bg-white shadow-sm">
        <div class="flex items-center">
          <q-avatar size="36px" class="q-mr-sm">
            <q-icon name="pets" size="20px" class="text-accent" />
          </q-avatar>
          <span class="text-lg font-bold">
            <span class="text-orange-400">Pet</span><span class="text-accent">4</span
            ><span class="text-primary">You</span>
          </span>
        </div>
        <p class="text-xs text-gray-500 q-mt-xs q-mb-none">Conectando corações e patinhas</p>
      </div>

      <q-list class="q-pa-md">
        <div v-if="currentUser?.role === 'ADMIN'">
          <q-item-label header class="text-gray-700 font-semibold text-sm q-mb-sm">
            ADMINISTRAÇÃO
          </q-item-label>
          <q-item
            clickable
            v-ripple
            @click="navigateToAdminStats"
            class="rounded-xl q-mb-xs hover:bg-blue-100 transition-all duration-200"
          >
            <q-item-section avatar>
              <q-icon name="analytics" class="text-blue-600" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium">Dashboard</q-item-label>
              <q-item-label caption class="text-xs">Métricas e estatísticas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="navigateToAdminUsers"
            class="rounded-xl q-mb-xs hover:bg-green-100 transition-all duration-200"
          >
            <q-item-section avatar>
              <q-icon name="group" class="text-green-600" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium">Usuários</q-item-label>
              <q-item-label caption class="text-xs">Gerenciar usuários</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="navigateToAdminPets"
            class="rounded-xl q-mb-xs hover:bg-orange-100 transition-all duration-200"
          >
            <q-item-section avatar>
              <q-icon name="pets" class="text-orange-600" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium">Pets</q-item-label>
              <q-item-label caption class="text-xs">Moderar publicaões</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="navigateToAdminReports"
            class="rounded-xl q-mb-xs hover:bg-red-100 transition-all duration-200"
          >
            <q-item-section avatar>
              <q-icon name="report" class="text-red-600" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-medium">Denúncias</q-item-label>
              <q-item-label caption class="text-xs">Revisar infrações</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md bg-gray-200" />
        </div>
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
        <div v-if="!isLoggedIn">
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
        </div>
        <div v-else>
          <!-- Perfil do Usuário Logado -->
          <div
            class="bg-primary rounded-xl q-pa-md q-mb-md shadow-lg"
            style="background: linear-gradient(135deg, var(--q-primary), var(--q-accent))"
          >
            <div class="flex items-center">
              <q-avatar size="48px" class="q-mr-md shadow-md bg-white">
                <div class="text-primary text-xl font-bold">
                  {{ (currentUser?.name || '').charAt(0).toUpperCase() }}
                </div>
              </q-avatar>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-white font-semibold text-sm q-ma-none">
                    Olá, {{ currentUser?.name?.split(' ')[0] || 'Usuário' }}! 👋
                  </p>
                  <q-btn
                    flat
                    dense
                    round
                    icon="logout"
                    class="text-white hover:bg-white/20 transition-all duration-200"
                    style="opacity: 0.9"
                    size="sm"
                    @click="logout"
                  >
                    <q-tooltip class="bg-grey-8 text-white text-xs">Sair</q-tooltip>
                  </q-btn>
                </div>

                <div class="text-white text-xs q-mt-xs" style="opacity: 0.9">
                  <p class="q-ma-none">{{ currentUser?.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ações Rápidas -->
          <div class="q-mb-md">
            <q-item-label header class="text-gray-700 font-semibold text-xs q-mb-sm">
              AÇÕES RÁPIDAS
            </q-item-label>

            <q-item
              clickable
              v-ripple
              @click="navigateToProfile"
              class="rounded-xl q-mb-xs hover:bg-blue-100 transition-all duration-200"
            >
              <q-item-section avatar>
                <q-icon name="account_circle" class="text-primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-medium">Meu Perfil</q-item-label>
                <q-item-label caption class="text-xs">Editar informações</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              @click="navigateToMyPets"
              class="rounded-xl q-mb-xs hover:bg-orange-100 transition-all duration-200"
            >
              <q-item-section avatar>
                <q-icon name="pets" class="text-orange-500" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-medium">Meus Pets</q-item-label>
                <q-item-label caption class="text-xs">Pets cadastrados</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
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
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';

const router = useRouter();
const leftDrawerOpen = ref(false);
const authStore = useAuthStore();

const { user: currentUser, isLoggedIn } = storeToRefs(authStore);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const navigateToHome = () => {
  void router.push('/');
};

const navigateToAdopt = () => {
  console.log('Navegar para página de adoção');
};

const navigateToRegister = () => {};

const navigateToAbout = () => {
  console.log('Navegar para página sobre');
};

const navigateToLogin = () => {
  void router.push('/login');
};

const navigateToSignup = () => {
  void router.push('/register');
};

const logout = async () => {
  try {
    await authStore.logout();
    void router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

const navigateToProfile = () => {
  void router.push('/perfil');
};

const navigateToMyPets = () => {
  console.log('Navegar para meus pets');
  // void router.push('/meus-pets');
};

// Navegação Admin
const navigateToAdminStats = () => {
  console.log('Navegar para dashboard administrativo');
  // void router.push('/admin/dashboard');
};

const navigateToAdminUsers = () => {
  void router.push('/admin/usuarios');
};

const navigateToAdminPets = () => {
  console.log('Navegar para moderação de pets');
  // void router.push('/admin/pets');
};

const navigateToAdminReports = () => {
  console.log('Navegar para denúncias');
  // void router.push('/admin/reports');
};

</script>
