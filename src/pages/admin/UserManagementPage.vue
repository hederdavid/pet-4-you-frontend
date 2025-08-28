<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <div class="col">
        <h3 class="text-2xl font-bold text-gray-800 q-mb-xs">Gerenciamento de Usuários</h3>
        <p class="text-gray-600">Administre todos os usuários do sistema Pet4You</p>
      </div>
      <q-btn
        color="primary"
        class="q-ml-auto"
        @click="openNewUserModal"
        icon="add"
        label="Novo Usuário"
        unelevated
      />
    </div>

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

    <q-card flat bordered>
      <q-card-section class="q-pa-none">
        <q-table
          :rows="filteredUsers"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
        >
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

          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.role === 'ADMIN' ? 'orange' : 'blue'"
                :label="props.row.role === 'ADMIN' ? 'Administrador' : 'Usuário'"
                class="q-pa-sm font-medium"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-location="props">
            <q-td :props="props">
              <div class="text-sm">
                <div class="text-gray-900">{{ props.row.city }}</div>
                <div class="text-gray-500">{{ props.row.state }}</div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              <div class="text-sm text-gray-600">
                {{ formatDate(props.row.createdAt) }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="flex q-gutter-xs">
                <q-btn
                  icon="edit"
                  color="blue"
                  size="sm"
                  flat
                  round
                  @click="openEditUserModal(props.row)"
                  class="hover:bg-blue-100"
                >
                  <q-tooltip class="bg-blue">Editar usuário</q-tooltip>
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
                  <q-tooltip class="bg-red-500">Excluir usuário</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

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

    <ModalUser
      v-model="newUserModal"
      :edit-mode="editUserMode"
      :user="selectedUserForEdit"
      @user-created="loadUsers"
      @user-updated="loadUsers"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useAuthStore } from 'stores/auth';
import type { User } from 'src/types/user';
import { notification } from 'src/utils/notification';
import ModalUser from 'src/components/modals/ModalUser.vue';
import type { State } from 'src/types/state';
import { dialogService } from 'src/utils/dialog';
import { formatDate } from 'src/utils/formatters';
import { brazilianStates } from 'src/services/locationService';

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);

const loading = ref(false);
const saving = ref(false);
const users = ref<User[]>([]);
const roleDialog = ref(false);
const newUserModal = ref(false);
const editUserMode = ref(false);
const selectedUser = ref<User | null>(null);
const selectedUserForEdit = ref<User | null>(null);
const newRole = ref<'USER' | 'ADMIN'>('USER');

const searchFilter = ref('');
const roleFilter = ref<string | null>(null);
const stateFilter = ref<string | null>(null);

const states = ref<State[]>(brazilianStates);

const roleOptions = [
  { label: 'Usuários Comuns', value: 'USER' },
  { label: 'Administradores', value: 'ADMIN' },
];

const stateOptions = computed(() =>
  states.value.map((state) => ({
    label: state.name,
    value: state.code,
  })),
);

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

const changeUserRole = async () => {
  if (!selectedUser.value) return;

  saving.value = true;
  try {
    await api.patch(`users/${selectedUser.value.id}`, {
      role: newRole.value,
    });

    void loadUsers();

    roleDialog.value = false;
    notification.show('Permissões alteradas com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao alterar role:', error);

    notification.show('Erro ao alterar permissões!', 'error');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (user: User) => {
  try {
    await dialogService.confirm({
      title: 'Confirmar Exclusão',
      message: `Você tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`,
      okLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      okColor: 'negative',
      cancelColor: 'grey',
    });

    await api.patch(`/users/${user.id}`, { deletedAt: new Date() });

    notification.show('Usuário excluído com sucesso!', 'success');
    void loadUsers();
  } catch (error) {
    console.error('Erro ao confirmar exclusão:', error);
    return;
  }
};

const openNewUserModal = () => {
  editUserMode.value = false;
  selectedUserForEdit.value = null;
  newUserModal.value = true;
};

const openEditUserModal = (user: User) => {
  editUserMode.value = true;
  selectedUserForEdit.value = user;
  newUserModal.value = true;
};

onMounted(() => {
  void loadUsers();
});
</script>

<style scoped></style>
