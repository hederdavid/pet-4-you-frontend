<template>
  <q-dialog v-model="showModal" persistent @hide="resetForm">
    <q-card style="min-width: 500px; max-width: 600px">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none bg-primary text-white">
        <q-avatar color="white" text-color="primary" class="q-mr-md mb-2">
          <q-icon :name="editMode ? 'edit' : 'person_add'" />
        </q-avatar>
        <div class="text-h6">{{ editMode ? 'Editar Usuário' : 'Cadastrar Novo Usuário' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal" />
      </q-card-section>

      <!-- Form -->
      <q-card-section class="q-pa-lg">
        <q-form @submit="submitForm" ref="userForm" class="q-gutter-md">
          <!-- Nome -->
          <q-input
            v-model="form.name"
            label="Nome completo *"
            outlined
            :rules="[
              (val) => !!val || 'Nome é obrigatório',
              (val) => val.length >= 2 || 'Nome deve ter pelo menos 2 caracteres',
              (val) => /^[a-zA-ZÀ-ÿ\s]+$/.test(val) || 'Nome deve conter apenas letras',
            ]"
            hint="Digite o nome completo do usuário"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <!-- Email -->
          <q-input
            v-model="form.email"
            label="Email *"
            type="email"
            outlined
            :rules="[
              (val) => !!val || 'Email é obrigatório',
              (val) => /.+@.+\..+/.test(val) || 'Email deve ser válido',
            ]"
            hint="Email será usado para login"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <!-- Senha -->
          <q-input
            v-model="form.password"
            :label="editMode ? 'Nova senha (deixe vazio para manter atual)' : 'Senha *'"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="
              editMode
                ? []
                : [
                    (val) => !!val || 'Senha é obrigatória',
                    (val) => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
                  ]
            "
            :hint="editMode ? 'Deixe vazio para não alterar a senha' : 'Mínimo 6 caracteres'"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-btn
                :icon="showPassword ? 'visibility_off' : 'visibility'"
                flat
                round
                dense
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Telefone -->
          <q-input
            v-model="form.phone"
            label="Telefone"
            outlined
            mask="(##) #####-####"
            placeholder="(11) 99999-9999"
            hint="Formato: (11) 99999-9999"
          >
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>

          <!-- Localização -->
          <div class="row gap-2">
            <div class="col">
              <q-select
                v-model="form.state"
                :options="stateOptions"
                option-label="name"
                option-value="code"
                emit-value
                map-options
                label="Estado *"
                outlined
                :loading="loadingStates"
                :rules="[(val) => !!val || 'Estado é obrigatório']"
                @update:model-value="onStateChange"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> Nenhum estado encontrado </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col">
              <q-select
                v-model="form.city"
                :options="cityOptions"
                option-label="nome"
                option-value="nome"
                emit-value
                map-options
                label="Cidade *"
                outlined
                :disable="!form.state"
                :loading="loadingCities"
                :rules="[(val) => !!val || 'Cidade é obrigatória']"
              >
                <template v-slot:prepend>
                  <q-icon name="location_city" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{
                        !form.state ? 'Selecione um estado primeiro' : 'Nenhuma cidade encontrada'
                      }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <!-- Role -->
          <q-select
            v-model="form.role"
            :options="roleOptions"
            label="Tipo de usuário *"
            outlined
            emit-value
            map-options
            :rules="[(val) => !!val || 'Tipo de usuário é obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="admin_panel_settings" />
            </template>
          </q-select>
        </q-form>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-lg bg-grey-1">
        <q-btn flat label="Cancelar" color="grey-7" @click="closeModal" class="q-mr-sm" />
        <q-btn
          color="primary"
          :label="editMode ? 'Atualizar' : 'Cadastrar'"
          :icon="editMode ? 'save' : 'person_add'"
          @click="submitForm"
          :loading="saving"
          unelevated
          class="q-px-xl"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { notification } from 'src/utils/notification';
import type { User } from 'src/types/user';
import type { IBGECity } from 'src/types/ibge';
import { getCitiesByState, brazilianStates } from 'src/services/locationService';
import { api } from 'src/boot/axios';

interface Props {
  modelValue: boolean;
  user?: User | null;
  editMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  user: null,
  editMode: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'user-created': [user: User];
  'user-updated': [user: User];
}>();

const userForm = ref();
const saving = ref(false);
const loadingStates = ref(false);
const loadingCities = ref(false);
const showPassword = ref(false);

const states = ref(brazilianStates);
const cities = ref<IBGECity[]>([]);

const form = ref<User>({
  name: '',
  email: '',
  password: '',
  phone: '',
  city: '',
  state: '',
  role: 'USER',
});

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const stateOptions = computed(() =>
  states.value.map((state) => ({
    ...state,
    label: state.name,
    value: state.code,
  })),
);

const cityOptions = computed(() =>
  cities.value.map((city) => ({
    ...city,
    label: city.nome,
    value: city.nome,
  })),
);

const roleOptions = [
  { label: 'Usuário Comum', value: 'USER', icon: 'person' },
  { label: 'Administrador', value: 'ADMIN', icon: 'admin_panel_settings' },
];

watch(
  () => props.user,
  (newUser) => {
    if (newUser && props.editMode) {
      form.value = {
        name: newUser.name,
        email: newUser.email,
        password: '',
        phone: newUser.phone,
        city: newUser.city,
        state: newUser.state,
        role: newUser.role,
      };

      if (newUser.state) {
        void loadCitiesByState(newUser.state);
      }
    }
  },
  { immediate: true },
);

const loadCitiesByState = async (stateCode: string) => {
  if (!stateCode) {
    cities.value = [];
    return;
  }

  loadingCities.value = true;
  try {
    const response = await getCitiesByState(stateCode);
    cities.value = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    console.error('Erro ao carregar cidades:', error);
    notification.show('Erro ao carregar lista de cidades', 'error');
  } finally {
    loadingCities.value = false;
  }
};

const onStateChange = () => {
  form.value.city = '';
  cities.value = [];
  if (form.value.state) {
    void loadCitiesByState(form.value.state);
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    state: '',
    role: 'USER',
  };
  cities.value = [];
  showPassword.value = false;

  if (userForm.value) {
    userForm.value.resetValidation();
  }
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const submitForm = async () => {
  const isValid = await userForm.value.validate();
  if (!isValid) {
    notification.show('Por favor, corrija os campos em vermelho', 'warning');
    return;
  }

  saving.value = true;

  try {
    if (props.editMode && props.user) {
      const updateData: Partial<User> = { ...form.value };
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }

      await api.patch(`/users/${props.user.id}`, updateData);
      const updatedUser: User = {
        ...props.user,
        ...updateData,
        id: props.user.id,
        createdAt: props.user.createdAt || new Date().toISOString(),
      } as User;

      emit('user-updated', updatedUser);
      notification.show('Usuário atualizado com sucesso!', 'success');
    } else {
      await api.post('/users', form.value);

      const newUser: User = {
        id: Date.now().toString(),
        ...form.value,
        createdAt: new Date().toISOString(),
      };

      emit('user-created', newUser);
      notification.show('Usuário criado com sucesso!', 'success');
    }

    closeModal();
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    notification.show('Erro ao salvar usuário', 'error');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped></style>
