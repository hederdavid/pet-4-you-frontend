<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4"
  >
    <div class="grid grid-cols-1 gap-4">
      
      <div class="grid grid-cols-1 gap-4">
        <div class="max-w-6xl w-full">
          <div class="text-center mt-8 flex flex-col items-center">
            <h2 class="text-3xl font-bold text-gray-800 mb-3">Bem-vindo de volta!</h2>
          </div>

          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="lg:flex flex-col items-center justify-center">
              <div class="relative">
                <img
                  src="/dog-and-cat-happy.png"
                  alt="Cachorro e gato felizes"
                  class="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
                />
                <div
                  class="absolute -bottom-4 -left-4 bg-accent text-white p-3 rounded-full shadow-lg"
                >
                  <q-icon name="pets" size="24px" />
                </div>
              </div>
            </div>

            <div class="w-full max-w-md mx-auto lg:mx-0 flex flex-col items-center">
              <div class="bg-white rounded-3xl shadow-xl p-8 w-full">
                <!-- Header do Formulário -->
                <div class="text-center mb-8">
                  <div class="flex justify-center items-center mb-4">
                    <q-avatar size="50px" class="bg-accent">
                      <q-icon name="pets" size="28px" class="text-white" />
                    </q-avatar>
                  </div>
                  <h1 class="text-3xl font-bold text-gray-800">
                    <span class="text-orange-400">Pet</span><span class="text-accent">4</span
                    ><span class="text-primary">You</span>
                  </h1>
                  <p class="text-gray-600 mt-2">Faça login na sua conta</p>
                </div>

                <q-form @submit="onSubmit" class="space-y-6">
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

                  <!-- Senha -->
                  <div>
                    <q-input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      label="Senha"
                      outlined
                      class="w-full"
                      :rules="[(val) => !!val || 'Senha é obrigatória']"
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

                  <!-- Lembrar-me e Esqueci senha -->
                  <div class="flex items-center justify-between">
                    <q-checkbox
                      v-model="rememberMe"
                      label="Lembrar de mim"
                      color="primary"
                      class="text-sm"
                    />
                    <q-btn
                      flat
                      no-caps
                      class="text-primary text-sm hover:text-accent transition-colors duration-200"
                      @click="forgotPassword"
                    >
                      Esqueci minha senha
                    </q-btn>
                  </div>

                  <!-- Botão de Login -->
                  <q-btn
                    type="submit"
                    color="primary"
                    size="lg"
                    class="w-full rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    no-caps
                    :loading="loading"
                  >
                    <q-icon name="login" class="mr-2" />
                    Entrar
                  </q-btn>
                </q-form>

                <!-- Divisor -->
                <div class="relative my-8">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white text-gray-500">ou continue com</span>
                  </div>
                </div>

                <!-- Login Social -->
                <div class="grid grid-cols-2 gap-4">
                  <q-btn
                    outline
                    color="primary"
                    class="py-3 rounded-xl hover:bg-blue-50 transition-all duration-200"
                    no-caps
                    @click="loginWithGoogle"
                  >
                    <q-icon name="fab fa-google" class="mr-2" />
                    Google
                  </q-btn>
                  <q-btn
                    outline
                    color="accent"
                    class="py-3 rounded-xl hover:bg-purple-50 transition-all duration-200"
                    no-caps
                    @click="loginWithFacebook"
                  >
                    <q-icon name="fab fa-facebook-f" class="mr-2" />
                    Facebook
                  </q-btn>
                </div>

                <!-- Link para Cadastro -->
                <div class="text-center mt-8">
                  <p class="text-gray-600">
                    Não tem uma conta?
                    <q-btn
                      flat
                      no-caps
                      class="text-accent font-semibold hover:text-orange-400 transition-colors duration-200 p-0 ml-1 rounded px-2"
                      @click="goToSignup"
                    >
                      Cadastre-se gratuitamente
                    </q-btn>
                  </p>
                </div>
              </div>

              <!-- Mobile Image -->
              <div class="lg:hidden mt-8 text-center">
                <img
                  src="/dog-and-cat-happy.png"
                  alt="Cachorro e gato felizes"
                  class="w-48 h-48 mx-auto rounded-full shadow-xl object-cover"
                />
                <p class="text-gray-600 mt-4 text-sm">
                  Junte-se a nós e ajude pets a encontrarem uma família! 🐾
                </p>
              </div>
            </div>
          </div>
        </div>
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

onMounted(() => {
  
});
</script>
