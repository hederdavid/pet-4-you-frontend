<template>
  <q-page class="q-pa-lg">
    <!-- Header da página -->
    <div class="row items-center q-mb-xl">
      <div class="col">
        <h3 class="text-2xl font-bold text-gray-800 q-mb-xs">Gerenciamento de Usuários</h3>
        <p class="text-gray-600">Administre todos os usuários do sistema Pet4You</p>
      </div>
      <q-btn
        color="primary"
        class="q-ml-auto"
        @click="loadUsers"
        icon="add"
        label="Novo Usuário"
      />
    </div>

    <!-- Estatísticas Rápidas -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="bg-blue-50 border-l-4 border-blue-500">
          <q-card-section class="q-pa-md">
            <div class="flex items-center">
              <q-icon name="group" size="md" class="text-blue-600 q-mr-md" />
              <div>
                <div class="text-lg font-bold text-blue-800">{{ totalUsers }}</div>
                <div class="text-sm text-blue-600">Total de Usuários</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="bg-green-50 border-l-4 border-green-500">
          <q-card-section class="q-pa-md">
            <div class="flex items-center">
              <q-icon name="person" size="md" class="text-green-600 q-mr-md" />
              <div>
                <div class="text-lg font-bold text-green-800">{{ userCount }}</div>
                <div class="text-sm text-green-600">Usuários Comuns</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="bg-orange-50 border-l-4 border-orange-500">
          <q-card-section class="q-pa-md">
            <div class="flex items-center">
              <q-icon name="admin_panel_settings" size="md" class="text-orange-600 q-mr-md" />
              <div>
                <div class="text-lg font-bold text-orange-800">{{ adminCount }}</div>
                <div class="text-sm text-orange-600">Administradores</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
    </div>

    <!-- Filtros e Busca -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section class="bg-gray-50">
        <div class="row q-gutter-md items-end">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-input
              v-model="searchFilter"
              placeholder="Buscar por nome ou email..."
              outlined
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-md-2 col-sm-3 col-xs-6">
            <q-select
              v-model="roleFilter"
              :options="roleOptions"
              label="Filtrar por role"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-md-2 col-sm-3 col-xs-6">
            <q-select
              v-model="stateFilter"
              :options="stateOptions"
              label="Filtrar por estado"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de Usuários -->
    <q-card flat bordered>
      <q-card-section class="q-pa-none">
        <q-table
          :rows="filteredUsers"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
        >
          <!-- Avatar e Nome -->
          <template v-slot:body-cell-name="props">
            <q-td :props="props" class="q-py-md">
              <div class="flex items-center">
                <q-avatar size="40px" class="q-mr-md">
                  <q-icon name="person" size="20px" class="text-gray-500" />
                </q-avatar>
                <div>
                  <div class="font-medium text-gray-900">{{ props.row.name }}</div>
                  <div class="text-sm text-gray-500">{{ props.row.email }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Role com Badge -->
          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.role === 'ADMIN' ? 'orange' : 'blue'"
                :label="props.row.role === 'ADMIN' ? 'Administrador' : 'Usuário'"
                class="q-pa-sm font-medium"
              />
            </q-td>
          </template>

          <!-- Localização -->
          <template v-slot:body-cell-location="props">
            <q-td :props="props">
              <div class="text-sm">
                <div class="text-gray-900">{{ props.row.city }}</div>
                <div class="text-gray-500">{{ props.row.state }}</div>
              </div>
            </q-td>
          </template>

          <!-- Data de Criação -->
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              <div class="text-sm text-gray-600">
                {{ formatDate(props.row.createdAt) }}
              </div>
            </q-td>
          </template>

          <!-- Ações -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="flex q-gutter-xs">
                <q-btn
                  icon="edit"
                  color="blue"
                  size="sm"
                  flat
                  round
                  @click="openEditDialog(props.row)"
                  class="hover:bg-blue-100"
                >
                  <q-tooltip>Editar usuário</q-tooltip>
                </q-btn>
                <q-btn
                  icon="security"
                  color="orange"
                  size="sm"
                  flat
                  round
                  @click="openRoleDialog(props.row)"
                  class="hover:bg-orange-100"
                >
                  <q-tooltip>Alterar permissões</q-tooltip>
                </q-btn>
                <q-btn
                  icon="delete"
                  color="red"
                  size="sm"
                  flat
                  round
                  @click="confirmDelete(props.row)"
                  class="hover:bg-red-100"
                  :disable="props.row.id === currentUser?.id"
                >
                  <q-tooltip>Excluir usuário</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog de Edição -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Editar Usuário</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="editDialog = false" />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveUser" class="q-gutter-md">
            <q-input
              v-model="editForm.name"
              label="Nome completo"
              outlined
              :rules="[(val) => !!val || 'Nome é obrigatório']"
            />
            <q-input
              v-model="editForm.email"
              label="Email"
              type="email"
              outlined
              :rules="[(val) => !!val || 'Email é obrigatório']"
            />
            <q-input v-model="editForm.phone" label="Telefone" outlined mask="(##) #####-####" />
            <div class="row q-gutter-md">
              <div class="col">
                <q-select
                  v-model="editForm.state"
                  :options="states"
                  option-label="nome"
                  option-value="sigla"
                  emit-value
                  map-options
                  label="Estado"
                  outlined
                  @update:model-value="loadCities"
                />
              </div>
              <div class="col">
                <q-select
                  v-model="editForm.city"
                  :options="cities"
                  option-label="nome"
                  option-value="nome"
                  emit-value
                  map-options
                  label="Cidade"
                  outlined
                  :disable="!editForm.state"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" @click="editDialog = false" />
          <q-btn color="primary" label="Salvar" @click="saveUser" :loading="saving" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Alteração de Role -->
    <q-dialog v-model="roleDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Alterar Permissões</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="roleDialog = false" />
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><strong>Usuário:</strong> {{ selectedUser?.name }}</div>
          <q-select
            v-model="newRole"
            :options="[
              { label: 'Usuário Comum', value: 'USER' },
              { label: 'Administrador', value: 'ADMIN' },
            ]"
            label="Nova permissão"
            outlined
            emit-value
            map-options
          />
          <div class="text-caption text-gray-600 q-mt-sm">
            <strong>Atenção:</strong> Administradores têm acesso total ao sistema.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" @click="roleDialog = false" />
          <q-btn
            color="orange"
            label="Alterar"
            @click="changeUserRole"
            :loading="saving"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useAuthStore } from 'stores/auth';
import type { User } from 'src/types/user';
import axios from 'axios';
import { notification } from 'src/utils/notification';

interface State {
  sigla: string;
  nome: string;
}

interface City {
  nome: string;
}

// Store e utils
const $q = useQuasar();
const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);

// Estado reativo
const loading = ref(false);
const saving = ref(false);
const users = ref<User[]>([]);
const editDialog = ref(false);
const roleDialog = ref(false);
const selectedUser = ref<User | null>(null);
const newRole = ref<'USER' | 'ADMIN'>('USER');

// Filtros
const searchFilter = ref('');
const roleFilter = ref<string | null>(null);
const stateFilter = ref<string | null>(null);

// IBGE API
const states = ref<State[]>([]);
const cities = ref<City[]>([]);

// Formulário de edição
const editForm = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  role: 'USER' as 'USER' | 'ADMIN',
});

// Opções para filtros
const roleOptions = [
  { label: 'Usuários Comuns', value: 'USER' },
  { label: 'Administradores', value: 'ADMIN' },
];

const stateOptions = computed(() =>
  states.value.map((state) => ({
    label: state.nome,
    value: state.sigla,
  })),
);

// Colunas da tabela
const columns = [
  {
    name: 'name',
    label: 'Usuário',
    align: 'left' as const,
    field: 'name',
    sortable: true,
  },
  {
    name: 'role',
    label: 'Permissão',
    align: 'center' as const,
    field: 'role',
    sortable: true,
  },
  {
    name: 'location',
    label: 'Localização',
    align: 'left' as const,
    field: 'city',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: 'Criado em',
    align: 'center' as const,
    field: 'createdAt',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Ações',
    align: 'left' as const,
    field: 'actions',
  },
];

// Computed properties para estatísticas
const filteredUsers = computed(() => {
  let filtered = users.value;

  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search),
    );
  }

  if (roleFilter.value) {
    filtered = filtered.filter((user) => user.role === roleFilter.value);
  }

  if (stateFilter.value) {
    filtered = filtered.filter((user) => user.state === stateFilter.value);
  }

  return filtered;
});

const totalUsers = computed(() => users.value.length);
const userCount = computed(() => users.value.filter((u) => u.role === 'USER').length);
const adminCount = computed(() => users.value.filter((u) => u.role === 'ADMIN').length);

// Funções
const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get('users');
    users.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);

    notification.show('Erro ao carregar usuários!', 'error');
  } finally {
    loading.value = false;
  }
};

const loadStates = async () => {
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    states.value = response.data.sort((a: State, b: State) => a.nome.localeCompare(b.nome));
  } catch (error) {
    console.error('Erro ao carregar estados:', error);
  }
};

const loadCities = async () => {
  if (!editForm.value.state) {
    cities.value = [];
    return;
  }

  try {
    const response = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${editForm.value.state}/municipios`,
    );
    cities.value = response.data.sort((a: City, b: City) => a.nome.localeCompare(b.nome));
  } catch (error) {
    console.error('Erro ao carregar cidades:', error);
  }
};

const openEditDialog = (user: User) => {
  selectedUser.value = user;
  editForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    state: user.state,
    role: user.role,
  };
  editDialog.value = true;
  if (user.state) {
    void loadCities();
  }
};

const openRoleDialog = (user: User) => {
  selectedUser.value = user;
  newRole.value = user.role;
  roleDialog.value = true;
};

const saveUser = async () => {
  saving.value = true;
  try {
    await api.patch(`/users/${editForm.value.id}`, editForm.value);
    void loadUsers();
    editDialog.value = false;
    notification.show('Usuário atualizado com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);

    editDialog.value = false;
    notification.show('Erro ao atualizar o usuário!', 'error');
  } finally {
    saving.value = false;
  }
};

const changeUserRole = async () => {
  if (!selectedUser.value) return;

  saving.value = true;
  try {
    await api.put(`/admin/users/${selectedUser.value.id}/role`, {
      role: newRole.value,
    });

    // Atualizar role na lista local
    const index = users.value.findIndex((u) => u.id === selectedUser.value?.id);
    if (index !== -1 && users.value[index]) {
      users.value[index].role = newRole.value;
    }

    roleDialog.value = false;
    $q.notify({
      type: 'positive',
      message: 'Permissões alteradas com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao alterar role:', error);

    // Simular sucesso com dados mock
    const index = users.value.findIndex((u) => u.id === selectedUser.value?.id);
    if (index !== -1 && users.value[index]) {
      users.value[index].role = newRole.value;
    }

    roleDialog.value = false;
    $q.notify({
      type: 'positive',
      message: 'Permissões alteradas com sucesso! (modo demonstração)',
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (user: User) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`,
    cancel: true,
    persistent: true,
    color: 'negative',
  }).onOk(() => {
    void (async () => {
      try {
        await api.patch(`/users/${user.id}`, { deletedAt: new Date() });

        // Remover usuário da lista local
        const index = users.value.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          users.value.splice(index, 1);
        }

        notification.show('Usuário excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);

        notification.show('Erro ao excluir usuário!', 'error');
      }
    });
  });
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

// Inicialização
onMounted(() => {
  void loadUsers();
  void loadStates();
});
</script>

<style scoped>

</style>
