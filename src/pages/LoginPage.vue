<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo e Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6"
        >
          <q-icon name="pets" size="32px" class="text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          <span class="text-orange-400">Pet</span><span class="text-purple-600">4</span
          ><span class="text-blue-600">You</span>
        </h1>
        <p class="text-gray-600">Entre na sua conta e conecte-se com pets incríveis! 🐾</p>
      </div>

      <!-- Card Principal -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        <div class="space-y-6">
          <!-- Formulário -->
          <q-form @submit="onSubmit" class="space-y-6">
            <!-- Email -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">E-mail</label>
              <q-input
                v-model="email"
                type="email"
                outlined
                dense
                class="w-full"
                placeholder="seu.email@exemplo.com"
                :rules="[
                  (val) => !!val || 'E-mail é obrigatório',
                  (val) => isValidEmail(val) || 'E-mail inválido',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" class="text-blue-500" />
                </template>
              </q-input>
            </div>

            <!-- Senha -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Senha</label>
              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                outlined
                dense
                class="w-full"
                placeholder="••••••••"
                :rules="[(val) => !!val || 'Senha é obrigatória']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" class="text-blue-500" />
                </template>
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    round
                    :icon="showPassword ? 'visibility_off' : 'visibility'"
                    class="text-gray-400 hover:text-blue-500"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <!-- Opções -->
            <div class="flex items-center justify-between">
              <q-checkbox
                v-model="rememberMe"
                label="Lembrar de mim"
                color="blue"
                class="text-sm text-gray-600"
              />
              <q-btn
                flat
                no-caps
                dense
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                @click="forgotPassword"
              >
                Esqueci a senha
              </q-btn>
            </div>

            <!-- Botão Login -->
            <q-btn
              type="submit"
              color="primary"
              size="lg"
              class="w-full h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600"
              no-caps
              :loading="loading"
            >
              <q-icon name="login" class="mr-2" />
              Entrar na minha conta
            </q-btn>
          </q-form>

          <!-- Divisor -->
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-4 bg-white text-sm text-gray-500 font-medium">ou continue com</span>
            </div>
          </div>

          <!-- Login Social -->
          <div class="grid grid-cols-2 gap-3">
            <q-btn
              outline
              class="h-12 rounded-xl border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              no-caps
              @click="loginWithGoogle"
            >
              <q-icon name="fab fa-google" class="text-red-500 mr-2" />
              <span class="text-gray-700">Google</span>
            </q-btn>
            <q-btn
              outline
              class="h-12 rounded-xl border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              no-caps
              @click="loginWithFacebook"
            >
              <q-icon name="fab fa-facebook-f" class="text-blue-600 mr-2" />
              <span class="text-gray-700">Facebook</span>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Link Cadastro -->
      <div class="text-center mt-6">
        <p class="text-gray-600">
          Primeira vez aqui?
          <q-btn
            flat
            no-caps
            dense
            class="text-purple-600 font-semibold hover:text-purple-700 transition-colors ml-1"
            @click="goToSignup"
          >
            Crie sua conta gratuita
          </q-btn>
        </p>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-xs text-gray-500">
          Ao continuar, você concorda com nossos
          <span class="text-blue-600 hover:underline cursor-pointer">Termos de Uso</span>
          e
          <span class="text-blue-600 hover:underline cursor-pointer">Política de Privacidade</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { notification } from 'src/utils/notification';

const router = useRouter();

// Form data
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);

const authStore = useAuthStore();

// Validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Actions
const onSubmit = async () => {
  loading.value = true;

  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });

    if (success) {
      // ...O COMPONENTE decide para onde ir.
      await router.push('/'); // ou a rota que preferir
    } else {
      // Se não, mostra a notificação de erro
      notification.show('E-mail ou senha inválidos!', 'error');
    }
  } catch (error) {
    notification.show('Erro ao fazer login. Tente novamente.', 'error');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const forgotPassword = () => {
  notification.show('Link de recuperação será enviado para seu e-mail', 'info');
};

const loginWithGoogle = () => {
  notification.show('Login com Google em desenvolvimento', 'info');
};

const loginWithFacebook = () => {
  notification.show('Login com Facebook em desenvolvimento', 'info');
};

const goToSignup = () => {
  void router.push('/register');
};

onMounted(() => {});
</script>
