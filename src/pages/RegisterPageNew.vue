<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
    <!-- Imagem Flutuante Grande no Canto Superior Direito -->
    <div class="fixed top-8 right-8 z-10 hidden xl:block animate-float">
      <div class="relative">
        <div
          class="bg-white rounded-full p-6 shadow-2xl border-4 border-white/20 backdrop-blur-sm transform hover:scale-110 transition-all duration-500"
        >
          <img
            src="/cute-dog-and-cat.png"
            alt="Cachorro e gato fofos"
            class="w-48 h-48 rounded-full object-cover"
          />

          <!-- Partículas flutuantes ao redor da imagem -->
          <div
            class="absolute -top-4 -left-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white p-3 rounded-full shadow-lg animate-bounce-slow"
          >
            <q-icon name="favorite" size="24px" />
          </div>
          <div
            class="absolute -bottom-4 -right-4 bg-gradient-to-r from-accent to-purple-600 text-white p-2 rounded-full shadow-lg animate-pulse"
          >
            <q-icon name="pets" size="20px" />
          </div>
          <div
            class="absolute top-4 -left-4 bg-gradient-to-r from-primary to-blue-600 text-white p-2 rounded-full shadow-lg animate-spin-slow"
          >
            <q-icon name="star" size="16px" />
          </div>
          <div
            class="absolute -top-2 right-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-1 rounded-full shadow-lg animate-ping"
          >
            <q-icon name="diamond" size="12px" />
          </div>

          <!-- Efeito de brilho -->
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
          ></div>
        </div>

        <!-- Texto flutuante -->
        <div class="mt-4 text-center bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
          <p class="text-primary font-semibold text-sm">Junte-se à família! 🐾</p>
          <p class="text-gray-600 text-xs">Mais de 10.000 pets adotados</p>
        </div>
      </div>
    </div>

    <!-- Container Principal -->
    <div class="flex items-center justify-center min-h-screen py-12 px-4">
      <div class="max-w-4xl w-full relative">
        <!-- Formulário de Registro Centralizado -->
        <div class="w-full max-w-lg mx-auto relative animate-fade-in">
          <!-- Elementos decorativos animados -->
          <div
            class="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full opacity-20 animate-pulse"
          ></div>
          <div
            class="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full opacity-25 animate-bounce-slow"
          ></div>
          <div
            class="absolute top-1/3 -right-8 w-6 h-6 bg-gradient-to-r from-accent to-purple-600 rounded-full opacity-30 animate-ping"
          ></div>

          <div
            class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:shadow-3xl transition-all duration-300"
          >
            <!-- Header do Formulário -->
            <div class="text-center mb-8">
              <div class="flex justify-center items-center mb-4">
                <q-avatar
                  size="60px"
                  class="bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg"
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

            <!-- Formulário -->
            <q-form @submit="onSubmit" class="space-y-5">
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
                  placeholder="(11) 99999-9999"
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

              <!-- Tipo de Usuário -->
              <div>
                <q-select
                  v-model="userType"
                  :options="userTypeOptions"
                  label="Eu sou..."
                  outlined
                  class="w-full"
                  :rules="[(val) => !!val || 'Selecione o tipo de usuário']"
                >
                  <template v-slot:prepend>
                    <q-icon name="category" class="text-primary" />
                  </template>
                </q-select>
              </div>

              <!-- Termos e Condições -->
              <div class="flex items-start space-x-3">
                <q-checkbox
                  v-model="acceptTerms"
                  color="primary"
                  :rules="[(val: boolean) => !!val || 'Você deve aceitar os termos']"
                />
                <div class="text-sm text-gray-600 leading-relaxed">
                  Eu concordo com os
                  <q-btn
                    flat
                    no-caps
                    class="text-primary hover:text-accent transition-colors duration-200 p-0"
                    @click="showTerms"
                  >
                    Termos de Uso
                  </q-btn>
                  e
                  <q-btn
                    flat
                    no-caps
                    class="text-primary hover:text-accent transition-colors duration-200 p-0"
                    @click="showPrivacy"
                  >
                    Política de Privacidade
                  </q-btn>
                </div>
              </div>

              <!-- Newsletter -->
              <div class="flex items-center space-x-3">
                <q-checkbox v-model="acceptNewsletter" color="accent" />
                <span class="text-sm text-gray-600">
                  Quero receber novidades sobre adoções e eventos
                </span>
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

            <!-- Cadastro Social -->
            <div class="grid grid-cols-2 gap-4">
              <q-btn
                outline
                color="primary"
                class="py-3 rounded-xl hover:bg-blue-50 transition-all duration-200"
                no-caps
                @click="registerWithGoogle"
              >
                <q-icon name="fab fa-google" class="mr-2" />
                Google
              </q-btn>
              <q-btn
                outline
                color="accent"
                class="py-3 rounded-xl hover:bg-purple-50 transition-all duration-200"
                no-caps
                @click="registerWithFacebook"
              >
                <q-icon name="fab fa-facebook-f" class="mr-2" />
                Facebook
              </q-btn>
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

    <!-- Decorações de Fundo Animadas -->
    <!-- Não conflitam com a imagem principal no canto superior direito -->
    <div
      class="fixed top-1/2 left-8 text-orange-200 opacity-15 hidden xl:block animate-bounce-slow"
    >
      <q-icon name="pets" size="40px" />
    </div>
    <div class="fixed bottom-20 left-1/4 text-accent opacity-20 hidden xl:block animate-pulse">
      <q-icon name="favorite" size="35px" />
    </div>
    <div class="fixed top-1/4 left-12 text-primary opacity-25 hidden xl:block animate-spin-slow">
      <q-icon name="star" size="30px" />
    </div>
    <div
      class="fixed bottom-1/3 right-1/4 text-orange-300 opacity-15 hidden xl:block animate-float"
    >
      <q-icon name="volunteer_activism" size="45px" />
    </div>
    <div class="fixed top-3/4 left-1/3 text-purple-300 opacity-20 hidden xl:block animate-ping">
      <q-icon name="diamond" size="25px" />
    </div>

    <!-- Partículas flutuantes menores -->
    <div
      class="fixed top-16 left-1/2 w-3 h-3 bg-orange-300 rounded-full opacity-30 hidden xl:block animate-bounce-slow"
    ></div>
    <div
      class="fixed bottom-32 right-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-40 hidden xl:block animate-pulse"
    ></div>
    <div
      class="fixed top-2/3 right-20 w-4 h-4 bg-blue-300 rounded-full opacity-25 hidden xl:block animate-ping"
    ></div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}

/* Animação de entrada */
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects */
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

// Form data
const fullName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const userType = ref(null);
const acceptTerms = ref(false);
const acceptNewsletter = ref(true);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

// Options
const userTypeOptions = [
  { label: '🏠 Quero adotar um pet', value: 'adopter' },
  { label: '❤️ Tenho pets para doação', value: 'donor' },
  { label: '🏥 Sou de uma ONG/Abrigo', value: 'organization' },
  { label: '🤝 Quero ser voluntário', value: 'volunteer' },
];

// Validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Actions
const onSubmit = async () => {
  if (!acceptTerms.value) {
    $q.notify({
      color: 'negative',
      message: 'Você deve aceitar os termos de uso',
      icon: 'error',
      position: 'top',
    });
    return;
  }

  loading.value = true;

  try {
    // Simular cadastro
    await new Promise((resolve) => setTimeout(resolve, 2000));

    $q.notify({
      color: 'positive',
      message: 'Conta criada com sucesso! Bem-vindo ao Pet4You!',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000,
    });

    // Redirecionar para página inicial ou dashboard
    void router.push('/');
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

const showTerms = () => {
  $q.notify({
    color: 'info',
    message: 'Termos de uso em desenvolvimento',
    icon: 'info',
    position: 'top',
  });
};

const showPrivacy = () => {
  $q.notify({
    color: 'info',
    message: 'Política de privacidade em desenvolvimento',
    icon: 'info',
    position: 'top',
  });
};

const registerWithGoogle = () => {
  $q.notify({
    color: 'info',
    message: 'Cadastro com Google em desenvolvimento',
    icon: 'info',
    position: 'top',
  });
};

const registerWithFacebook = () => {
  $q.notify({
    color: 'info',
    message: 'Cadastro com Facebook em desenvolvimento',
    icon: 'info',
    position: 'top',
  });
};

const goToLogin = () => {
  void router.push('/login');
};
</script>
