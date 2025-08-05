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
                <q-avatar size="60px" class="bg-accent shadow-lg">
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

            <q-form @submit="onSubmit" class="space-y-1">
              <div>
                <q-input
                  v-model="fullName"
                  label="Nome Completo"
                  outlined
                  lazy-rules
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

              <div>
                <q-input
                  v-model="email"
                  type="email"
                  label="E-mail"
                  outlined
                  lazy-rules
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

              <div>
                <q-input
                  v-model="phone"
                  label="Telefone (opcional)"
                  outlined
                  mask="(##) #####-####"
                  placeholder="(77) 99999-9999"
                  lazy-rules
                  :rules="[isValidPhoneNumber]"
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" class="text-primary" />
                  </template>
                </q-input>
              </div>

              <div>
                <q-input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Senha"
                  outlined
                  lazy-rules
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

              <div>
                <q-input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  label="Confirmar Senha"
                  outlined
                  lazy-rules
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

              <div>
                <q-select
                  v-model="selectedState"
                  :options="filteredStateOptions"
                  label="Estado"
                  outlined
                  option-label="name"
                  option-value="code"
                  emit-value
                  map-options
                  clearable
                  use-input
                  input-debounce="300"
                  lazy-rules
                  @filter="filterStates"
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

              <div>
                <q-select
                  v-model="selectedCity"
                  :options="filteredCityOptions"
                  label="Cidade"
                  outlined
                  option-label="name"
                  option-value="name"
                  emit-value
                  map-options
                  clearable
                  use-input
                  input-debounce="300"
                  lazy-rules
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
                </q-select>
              </div>

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

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { brazilianStates, getCitiesByState } from 'src/services/locationService';
import { notification } from 'src/utils/notification';
import { isValidEmail, isValidPhoneNumber } from 'src/utils/validators';
import type { State } from 'src/types/state';
import type { City } from 'src/types/city';

// Interfaces para tipagem forte

const router = useRouter();
const fullName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

// --- Lógica de Estado e Cidade ---
const selectedState = ref<string | null>(null);
const selectedCity = ref<string | null>(null);
const loadingCities = ref(false);

const filteredStateOptions = ref<State[]>([...brazilianStates]);
const allCitiesForState = ref<City[]>([]); // A "fonte da verdade" para cidades
const filteredCityOptions = ref<City[]>([]); // A lista para o QSelect

const filterStates = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredStateOptions.value = [...brazilianStates];
    } else {
      const needle = val.toLowerCase();
      filteredStateOptions.value = brazilianStates.filter((state) =>
        state.name.toLowerCase().includes(needle),
      );
    }
  });
};

const filterCities = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredCityOptions.value = [...allCitiesForState.value];
    } else {
      const needle = val.toLowerCase();
      filteredCityOptions.value = allCitiesForState.value.filter((city) =>
        city.name.toLowerCase().includes(needle),
      );
    }
  });
};

// Observador para buscar as cidades quando o estado muda
watch(selectedState, async (stateCode) => {
  allCitiesForState.value = [];
  filteredCityOptions.value = [];
  selectedCity.value = null;

  if (stateCode) {
    try {
      loadingCities.value = true;
      const response = await getCitiesByState(stateCode);
      const cities = response.data
        .map((city) => ({ name: city.nome, id: city.id }))
        .sort((a, b) => a.name.localeCompare(b.name));

      allCitiesForState.value = cities;
      filteredCityOptions.value = cities;
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      notification.show('Erro ao carregar cidades. Tente novamente.', 'error');
    } finally {
      loadingCities.value = false;
    }
  }
});

const onSubmit = async () => {
  loading.value = true;
  try {
    const payload = {
      name: fullName.value,
      email: email.value,
      password: password.value,
      phone: phone.value.replace(/\D/g, ''), // Envia apenas os números
      state: selectedState.value,
      city: selectedCity.value,
    };

    const promise = api.post('/users', payload);

    await notification.handlePromise(promise, {
      loading: 'Criando sua conta...',
      success: 'Conta criada com sucesso! Redirecionando...',
      error: 'Ocorreu um erro ao criar sua conta.',
    });

    void router.push('/login');
  } catch (error) {
    console.error('Falha no processo de cadastro:', error);
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  void router.push('/login');
};
</script>

<style scoped>
/* Você pode adicionar estilos específicos aqui se necessário */
</style>
