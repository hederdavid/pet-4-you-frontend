<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
    <div class="flex items-center justify-center min-h-screen py-12 px-4">
      <div class="max-w-4xl w-full relative">
        <div class="w-full max-w-lg mx-auto relative animate-fade-in">
          <div
            class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:shadow-3xl transition-all duration-300"
          >
            <div class="text-center mb-8">
              <div class="flex justify-center items-center mb-4">
                <q-avatar
                  size="60px"
                  class="bg-accent shadow-lg"
                >
                  <q-icon name="pets" size="32px" class="text-white" />
                </q-avatar>
              </div>
              <h1 class="text-4xl font-bold text-gray-800 mb-2">
                <span class="text-orange-400">Pet</span><span class="text-accent">4</span
                ><span class="text-primary">You</span>
              </h1>
              <p class="text-gray-600">Crie sua conta gratuita e faça a diferença</p>
              <div
                class="w-16 h-1 bg-gradient-to-r from-orange-400 to-primary mx-auto mt-3 rounded-full"
              ></div>
            </div>

            <q-form @submit="onSubmit" class="space-y-1 ">
              <!-- Nome Completo -->
              <div>
                <q-input
                  v-model="fullName"
                  label="Nome Completo"
                  outlined
                  class="w-full"
                  :rules="[
                    (val) => !!val || 'Nome é obrigatório',
                    (val) => val.length >= 2 || 'Nome deve ter pelo menos 2 caracteres',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" class="text-primary" />
                  </template>
                </q-input>
              </div>

              <!-- Email -->
              <div>
                <q-input
                  v-model="email"
                  type="email"
                  label="E-mail"
                  outlined
                  class="w-full"
                  :rules="[
                    (val) => !!val || 'E-mail é obrigatório',
                    (val) => isValidEmail(val) || 'E-mail inválido',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" class="text-primary" />
                  </template>
                </q-input>
              </div>

              <!-- Telefone -->
              <div>
                <q-input
                  v-model="phone"
                  label="Telefone (opcional)"
                  outlined
                  class="w-full"
                  mask="(##) #####-####"
                  placeholder="(77) 99999-9999"
                  :rules="[
                    (val) => !!val || 'Telefone deve ter pelo menos 10 caracteres',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" class="text-primary" />
                  </template>
                </q-input>
              </div>

              <!-- Senha -->
              <div>
                <q-input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Senha"
                  outlined
                  class="w-full"
                  :rules="[
                    (val) => !!val || 'Senha é obrigatória',
                    (val) => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" class="text-primary" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer text-gray-400 hover:text-primary"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Confirmar Senha -->
              <div>
                <q-input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  label="Confirmar Senha"
                  outlined
                  class="w-full"
                  :rules="[
                    (val) => !!val || 'Confirmação de senha é obrigatória',
                    (val) => val === password || 'Senhas não conferem',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" class="text-primary" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer text-gray-400 hover:text-primary"
                      @click="showConfirmPassword = !showConfirmPassword"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Estado -->
              <div>
                <q-select
                  v-model="selectedState"
                  :options="stateOptions"
                  label="Estado"
                  outlined
                  class="w-full"
                  option-label="name"
                  option-value="code"
                  emit-value
                  map-options
                  clearable
                  use-input
                  input-debounce="300"
                  @filter="filterStates"
                  @update:model-value="onStateChange"
                  :rules="[(val) => !!val || 'Estado é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="map" class="text-primary" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey"> Nenhum estado encontrado </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Cidade -->
              <div>
                <q-select
                  v-model="selectedCity"
                  :options="cityOptions"
                  label="Cidade"
                  outlined
                  class="w-full"
                  option-label="name"
                  option-value="name"
                  emit-value
                  map-options
                  clearable
                  use-input
                  input-debounce="300"
                  @filter="filterCities"
                  :disable="!selectedState"
                  :loading="loadingCities"
                  :rules="[(val) => !!val || 'Cidade é obrigatória']"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" class="text-primary" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{
                          !selectedState
                            ? 'Selecione um estado primeiro'
                            : loadingCities
                              ? 'Carregando cidades...'
                              : 'Nenhuma cidade encontrada'
                        }}
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:loading>
                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          <q-spinner-dots color="primary" size="20px" />
                          Carregando cidades...
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Botão de Cadastro -->
              <q-btn
                type="submit"
                color="accent"
                size="lg"
                class="w-full rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                no-caps
                :loading="loading"
              >
                <q-icon name="person_add" class="mr-2" />
                Criar Conta
              </q-btn>
            </q-form>

            <!-- Divisor -->
            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">ou cadastre-se com</span>
              </div>
            </div>

            <!-- Link para Login -->
            <div class="text-center mt-6">
              <p class="text-gray-600">
                Já tem uma conta?
                <q-btn
                  flat
                  no-caps
                  class="text-primary font-semibold hover:text-accent transition-colors duration-200 p-0 ml-1"
                  @click="goToLogin"
                >
                  Faça login
                </q-btn>
              </p>
            </div>
          </div>
        </div>

        <!-- Imagem Mobile -->
        <div class="lg:hidden mt-8 text-center">
          <div class="relative inline-block">
            <img
              src="/cute-dog-and-cat.png"
              alt="Cachorro e gato fofos"
              class="w-40 h-40 mx-auto rounded-full shadow-xl object-cover"
            />
            <div
              class="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white p-2 rounded-full shadow-lg animate-bounce"
            >
              <q-icon name="favorite" size="16px" />
            </div>
          </div>
          <p class="text-gray-600 mt-4 text-sm">Seja parte da mudança na vida dos pets! 🐾❤️</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { api } from 'src/boot/axios';

const router = useRouter();
const $q = useQuasar();

const fullName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const selectedState = ref('');
const selectedCity = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

const brazilianStates = [
  { name: 'Acre', code: 'AC' },
  { name: 'Alagoas', code: 'AL' },
  { name: 'Amapá', code: 'AP' },
  { name: 'Amazonas', code: 'AM' },
  { name: 'Bahia', code: 'BA' },
  { name: 'Ceará', code: 'CE' },
  { name: 'Distrito Federal', code: 'DF' },
  { name: 'Espírito Santo', code: 'ES' },
  { name: 'Goiás', code: 'GO' },
  { name: 'Maranhão', code: 'MA' },
  { name: 'Mato Grosso', code: 'MT' },
  { name: 'Mato Grosso do Sul', code: 'MS' },
  { name: 'Minas Gerais', code: 'MG' },
  { name: 'Pará', code: 'PA' },
  { name: 'Paraíba', code: 'PB' },
  { name: 'Paraná', code: 'PR' },
  { name: 'Pernambuco', code: 'PE' },
  { name: 'Piauí', code: 'PI' },
  { name: 'Rio de Janeiro', code: 'RJ' },
  { name: 'Rio Grande do Norte', code: 'RN' },
  { name: 'Rio Grande do Sul', code: 'RS' },
  { name: 'Rondônia', code: 'RO' },
  { name: 'Roraima', code: 'RR' },
  { name: 'Santa Catarina', code: 'SC' },
  { name: 'São Paulo', code: 'SP' },
  { name: 'Sergipe', code: 'SE' },
  { name: 'Tocantins', code: 'TO' },
];

interface IBGECity {
  id: number;
  nome: string;
}

const stateOptions = ref([...brazilianStates]);
const cityOptions = ref<Array<{ name: string; id: number }>>([]);
const loadingCities = ref(false);

const fetchCitiesByState = async (stateCode: string) => {
  try {
    loadingCities.value = true;
    const response = await axios.get<IBGECity[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios`,
    );
    
    const cities = response.data
      .map((city) => ({
        name: city.nome,
        id: city.id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return cities;
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar cidades. Tente novamente.',
      icon: 'error',
      position: 'top',
    });
    return [];
  } finally {
    loadingCities.value = false;
  }
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const filterStates = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    if (val === '') {
      stateOptions.value = [...brazilianStates];
    } else {
      const needle = val.toLowerCase();
      stateOptions.value = brazilianStates.filter((state) =>
        state.name.toLowerCase().includes(needle),
      );
    }
  });
};

const filterCities = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    if (!selectedState.value || cityOptions.value.length === 0) {
      return;
    }

    const allCities = [...cityOptions.value];

    if (val === '') {
      cityOptions.value = allCities;
    } else {
      const needle = val.toLowerCase();
      cityOptions.value = allCities.filter((city: { name: string; id: number }) =>
        city.name.toLowerCase().includes(needle),
      );
    }
  });
};

const onStateChange = async (stateCode: string) => {
  selectedCity.value = '';
  cityOptions.value = [];

  if (stateCode) {
    const cities = await fetchCitiesByState(stateCode);
    cityOptions.value = cities;
  }
};

const onSubmit = async () => {

  if (!selectedState.value || !selectedCity.value) {
    $q.notify({
      color: 'negative',
      message: 'Por favor, selecione o estado e a cidade',
      icon: 'error',
      position: 'top',
    });
    return;
  }

  loading.value = true;

  try {
    const formData = {
      name: fullName.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
      state: selectedState.value,
      city: selectedCity.value,
    };

    console.log('Dados do cadastro:', formData);

    const response = await api.post('/users', formData);
    console.log('Cadastro realizado com sucesso:', response.data);

    $q.notify({
      color: 'positive',
      message: 'Conta criada com sucesso!',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000,
    });

    void router.push('/login');
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao criar conta. Tente novamente.',
      icon: 'error',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  void router.push('/login');
};
</script>
