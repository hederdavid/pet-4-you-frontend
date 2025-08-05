<template>
  <q-page class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header Section -->
      <div
        class="rounded-xl p-8 mb-8 shadow-lg"
        style="background: linear-gradient(135deg, var(--q-primary), var(--q-accent))"
      >
        <div class="flex flex-col md:flex-row items-center justify-between text-white">
          <div class="flex items-center mb-6 md:mb-0">
            <q-avatar size="100px" class="mr-6 shadow-xl bg-white">
              <div class="text-primary text-4xl font-bold">
                {{ (currentUser?.name || '').charAt(0).toUpperCase() }}
              </div>
            </q-avatar>
            <div>
              <h1 class="text-4xl font-bold mb-3">{{ currentUser?.name || 'Usuário' }}</h1>
              <p class="text-white/90 text-lg mb-2">{{ currentUser?.email }}</p>
              <div class="flex items-center">
                <span class="text-sm text-white/80 bg-white/10 px-3 py-1 rounded-full">
                  <q-icon name="schedule" size="14px" class="mr-1" />
                  Membro desde {{ formatDate(currentUser?.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Informações Pessoais -->
        <div class="lg:col-span-2">
          <q-card class="shadow-md">
            <q-card-section class="bg-white">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-semibold text-gray-800">Informações Pessoais</h2>
                <q-btn
                  v-if="!editMode"
                  flat
                  icon="edit"
                  color="primary"
                  @click="toggleEditMode"
                  size="sm"
                >
                  <q-tooltip class="bg-primary text-white text-xs">Editar Perfil</q-tooltip>
                </q-btn>
              </div>

              <q-form @submit="updateProfile" ref="profileForm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Nome -->
                  <q-input
                    v-model="profileData.name"
                    label="Nome Completo"
                    :readonly="!editMode"
                    :outlined="editMode"
                    :borderless="!editMode"
                    :rules="[(val) => !!val || 'Nome é obrigatório']"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>

                  <!-- Email -->
                  <q-input
                    v-model="profileData.email"
                    label="Email"
                    type="email"
                    :readonly="!editMode"
                    :outlined="editMode"
                    :borderless="!editMode"
                    :rules="[
                      (val) => !!val || 'Email é obrigatório',
                      (val) => isValidEmail(val) || 'Email inválido',
                    ]"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>

                  <!-- Telefone -->
                  <q-input
                    v-model="profileData.phone"
                    label="Telefone"
                    mask="(##) #####-####"
                    :readonly="!editMode"
                    :outlined="editMode"
                    :borderless="!editMode"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" />
                    </template>
                  </q-input>

                  <!-- Estado -->
                  <q-select
                    v-model="profileData.state"
                    :options="filteredStateOptions"
                    option-label="name"
                    option-value="code"
                    emit-value
                    map-options
                    label="Estado"
                    :readonly="!editMode"
                    :outlined="editMode"
                    :borderless="!editMode"
                    @filter="filterStates"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <q-icon name="location_on" />
                    </template>
                  </q-select>
                </div>

                <!-- Cidade em linha separada para dar mais destaque -->
                <div class="mb-6">
                  <q-select
                    v-model="profileData.city"
                    :options="filteredCityOptions"
                    option-label="name"
                    option-value="name"
                    emit-value
                    map-options
                    label="Cidade"
                    :readonly="!editMode"
                    :outlined="editMode"
                    :borderless="!editMode"
                    :disable="!profileData.state"
                    :loading="loadingCities"
                    use-input
                    @filter="filterCities"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <q-icon name="location_city" />
                    </template>
                  </q-select>
                </div>

                <!-- Botões de Ação -->
                <div v-if="editMode" class="flex justify-end gap-3">
                  <q-btn color="grey" outline label="Cancelar" @click="cancelEdit" no-caps />
                  <q-btn
                    color="primary"
                    label="Salvar Alterações"
                    type="submit"
                    :loading="saving"
                    no-caps
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <!-- Sidebar com Estatísticas e Ações -->
        <div class="space-y-6">
          <!-- Estatísticas -->
          <q-card class="shadow-md">
            <q-card-section class="bg-white">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Minhas Estatísticas</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div class="flex items-center">
                    <q-icon name="pets" class="text-primary mr-3" size="24px" />
                    <span class="text-gray-700">Pets Cadastrados</span>
                  </div>
                  <span class="text-2xl font-bold text-primary">{{
                    userStats.petsRegistered
                  }}</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div class="flex items-center">
                    <q-icon name="favorite" class="text-green-600 mr-3" size="24px" />
                    <span class="text-gray-700">Adoções Realizadas</span>
                  </div>
                  <span class="text-2xl font-bold text-green-600">{{ userStats.adoptions }}</span>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Ações Rápidas -->
          <q-card class="shadow-md">
            <q-card-section class="bg-white">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Ações</h3>
              <div class="space-y-3">
                <q-btn
                  color="primary"
                  icon="add_circle"
                  label="Cadastrar Pet"
                  @click="navigateToRegisterPet"
                  no-caps
                  class="w-full"
                />

                <q-btn
                  color="secondary"
                  icon="pets"
                  label="Meus Pets"
                  @click="navigateToMyPets"
                  no-caps
                  class="w-full"
                />

                <q-btn
                  color="orange"
                  icon="history"
                  label="Histórico"
                  @click="navigateToHistory"
                  no-caps
                  class="w-full"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Configurações de Conta -->
          <q-card class="shadow-md">
            <q-card-section class="bg-white">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Configurações</h3>
              <div class="space-y-3">
                <q-btn
                  color="blue-grey"
                  icon="lock"
                  label="Alterar Senha"
                  @click="showChangePassword = true"
                  no-caps
                  class="w-full"
                />

                <q-btn
                  color="negative"
                  icon="delete"
                  label="Excluir Conta"
                  @click="showDeleteAccount = true"
                  no-caps
                  class="w-full"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Dialog para Alterar Senha -->
    <q-dialog v-model="showChangePassword">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Alterar Senha</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="changePassword" ref="passwordForm">
            <q-input
              v-model="passwordData.newPassword"
              label="Nova Senha"
              :type="showPassword ? 'text' : 'password'"
              :rules="[
                (val) => !!val || 'Nova senha é obrigatória',
                (val) => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
              ]"
              class="mb-4"
            >
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer text-gray-400 hover:text-primary"
                @click="showPassword = !showPassword"
              />
            </q-input>

            <q-input
              v-model="passwordData.confirmPassword"
              label="Confirmar Nova Senha"
              :type="showPassword ? 'text' : 'password'"
              :rules="[
                (val) => !!val || 'Confirmação é obrigatória',
                (val) => val === passwordData.newPassword || 'Senhas não coincidem',
              ]"
              class="mb-4"
            >
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer text-gray-400 hover:text-primary"
                @click="showPassword = !showPassword"
              />
            </q-input>

            <div class="flex justify-end gap-3">
              <q-btn color="grey" outline label="Cancelar" @click="showChangePassword = false" />
              <q-btn
                color="primary"
                label="Alterar Senha"
                type="submit"
                :loading="changingPassword"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog para Confirmar Exclusão -->
    <q-dialog v-model="showDeleteAccount">
      <q-card>
        <q-card-section class="bg-negative text-white">
          <div class="text-h6">Excluir Conta</div>
        </q-card-section>

        <q-card-section>
          <p class="text-grey-8 mb-4">
            Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
          </p>
          <p class="text-weight-bold">Digite "EXCLUIR" para confirmar:</p>
          <q-input v-model="deleteConfirmation" placeholder="EXCLUIR" class="mt-2" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="grey" outline label="Cancelar" @click="showDeleteAccount = false" />
          <q-btn
            color="negative"
            label="Excluir Conta"
            @click="deleteAccount"
            :disable="deleteConfirmation !== 'EXCLUIR'"
            :loading="deletingAccount"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import { QForm } from 'quasar';
import { api } from 'src/boot/axios';
import { notification } from 'src/utils/notification';
import { brazilianStates, getCitiesByState } from 'src/services/locationService';
import type { State } from 'src/types/state';
import type { City } from 'src/types/city';
import { isValidEmail } from 'src/utils/validators';
import { formatDate } from 'src/utils/formatters';

// Interfaces para os dados
interface ProfileData {
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
}

interface PasswordData {
  newPassword: string;
  confirmPassword: string;
}

interface UserStats {
  petsRegistered: number;
  adoptions: number;
}

const router = useRouter();
const authStore = useAuthStore();
const { user: currentUser } = storeToRefs(authStore);

// --- Refs de Estado da UI ---
const editMode = ref(false);
const saving = ref(false); // Mantido para o botão, embora o handlePromise gerencie o loading da notificação
const changingPassword = ref(false);
const deletingAccount = ref(false);
const showChangePassword = ref(false);
const showDeleteAccount = ref(false);
const deleteConfirmation = ref('');
const showPassword = ref(false);
const loadingCities = ref(false);

// --- Dados Reativos ---
const profileData = reactive<ProfileData>({ name: '', email: '', phone: '', state: '', city: '' });
const passwordData = reactive<PasswordData>({ newPassword: '', confirmPassword: '' });
const userStats = reactive<UserStats>({ petsRegistered: 0, adoptions: 0 }); // Carregar isso da API se necessário

// --- Lógica de Localização ---
const filteredStateOptions = ref<State[]>([...brazilianStates]);
const allCitiesForState = ref<City[]>([]);
const filteredCityOptions = ref<City[]>([]);

const toggleEditMode = () => {
  if (editMode.value) {
    // Se estava editando, restaura os dados originais
    loadUserData();
  }
  editMode.value = !editMode.value;
};

const filterStates = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    filteredStateOptions.value =
      val === ''
        ? [...brazilianStates]
        : brazilianStates.filter((state) => state.name.toLowerCase().includes(val.toLowerCase()));
  });
};

const filterCities = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    filteredCityOptions.value =
      val === ''
        ? [...allCitiesForState.value]
        : allCitiesForState.value.filter((city) =>
            city.name.toLowerCase().includes(val.toLowerCase()),
          );
  });
};

const fetchCities = async (stateCode: string) => {
  if (!stateCode) return;
  loadingCities.value = true;
  try {
    const response = await getCitiesByState(stateCode);
    const cities = response.data
      .map((city) => ({ name: city.nome, id: city.id }))
      .sort((a, b) => a.name.localeCompare(b.name));
    allCitiesForState.value = cities;
    filteredCityOptions.value = cities;
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    notification.show('Erro ao carregar cidades.', 'error');
  } finally {
    loadingCities.value = false;
  }
};

// Observador para buscar cidades quando o estado do formulário muda
watch(
  () => profileData.state,
  (newStateCode) => {
    profileData.city = '';
    void fetchCities(newStateCode);
  },
);

// Observador para resetar o formulário de senha quando o diálogo fecha
watch(showChangePassword, (isVisible) => {
  if (!isVisible) {
    passwordData.newPassword = '';
    passwordData.confirmPassword = '';
  }
});

// --- Funções Principais ---

const loadUserData = () => {
  if (currentUser.value) {
    profileData.name = currentUser.value.name || '';
    profileData.email = currentUser.value.email || '';
    profileData.phone = currentUser.value.phone || '';
    profileData.state = currentUser.value.state || '';
    profileData.city = currentUser.value.city || '';
  }
};

const updateProfile = async () => {
  saving.value = true;
  const promise = api.patch(`users/${currentUser.value!.id}`, profileData);

  try {
    await notification.handlePromise(promise, {
      loading: 'Salvando alterações...',
      success: 'Perfil atualizado com sucesso!',
      error: 'Erro ao atualizar o perfil.',
    });
    authStore.updateUser({ ...profileData });
    editMode.value = false;
  } catch (e) {
    // O erro já foi notificado, log é opcional
    console.error('Falha na atualização do perfil:', e);
  } finally {
    saving.value = false;
  }
};

const cancelEdit = () => {
  loadUserData();
  editMode.value = false;
};

const changePassword = async () => {
  changingPassword.value = true;
  const promise = api.patch(`users/${currentUser.value!.id}`, {
    password: passwordData.newPassword,
  });

  try {
    await notification.handlePromise(promise, {
      loading: 'Alterando senha...',
      success: 'Senha alterada com sucesso!',
      error: 'Erro ao alterar a senha.',
    });
    showChangePassword.value = false;
  } catch (e) {
    console.error('Falha na alteração de senha:', e);
  } finally {
    changingPassword.value = false;
  }
};

const deleteAccount = async () => {
  deletingAccount.value = true;
  // Usando DELETE ou um PATCH para soft-delete, dependendo da sua API
  const promise = api.delete(`users/${currentUser.value!.id}`);

  try {
    await notification.handlePromise(promise, {
      loading: 'Excluindo sua conta...',
      success: 'Conta excluída. Sentiremos sua falta!',
      error: 'Erro ao excluir a conta.',
    });
    await authStore.logout();
    void router.push('/');
  } catch (e) {
    console.error('Falha na exclusão da conta:', e);
  } finally {
    deletingAccount.value = false;
  }
};

// --- Funções de Navegação ---
const navigateToRegisterPet = () => router.push('/register-pet');
const navigateToMyPets = () => router.push('/my-pets');
const navigateToHistory = () => router.push('/history');

// --- Lifecycle Hook ---
onMounted(async () => {
  loadUserData();
  if (profileData.state) {
    await fetchCities(profileData.state);
    // Reatribui a cidade para garantir que o v-model do q-select a reconheça
    profileData.city = currentUser.value?.city || '';
  }
});
</script>
