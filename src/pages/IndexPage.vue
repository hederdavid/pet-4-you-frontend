<template>
  <q-page class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- Hero Section -->
    <section class="relative py-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          <span class="text-orange-400">Pet</span><span class="text-accent">4</span
          ><span class="text-primary">You</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-8">
          Conectando corações e patinhas para uma vida mais feliz
        </p>
        <p class="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
          Encontre seu novo melhor amigo ou ajude um animalzinho a encontrar um lar cheio de amor.
          Juntos, fazemos a diferença na vida dos pets que precisam de uma segunda chance.
        </p>

        <!-- Main Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <q-btn
            color="accent"
            size="xl"
            class="px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            no-caps
            @click="navigateToAdopt"
          >
            <q-icon name="pets" class="mr-3" size="md" />
            Quero Adotar
          </q-btn>

          <q-btn
            color="primary"
            size="xl"
            class="px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            no-caps
            @click="navigateToMyPets"
          >
            <q-icon name="volunteer_activism" class="mr-3" size="md" />
            Divulgar Animal
          </q-btn>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-4">Como Funciona</h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Um processo simples e seguro para conectar pets e famílias
        </p>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Adotar -->
          <div
            class="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow duration-300"
          >
            <q-icon name="search" size="60px" class="text-accent mb-4" />
            <h3 class="text-2xl font-semibold text-gray-800 mb-3">Encontre seu Pet</h3>
            <p class="text-gray-600 mb-6">
              Navegue por nossa galeria de animais disponíveis e encontre seu novo companheiro
            </p>
            <q-btn color="accent" class="rounded-lg" no-caps @click="navigateToAdopt">
              Ver Animais
            </q-btn>
          </div>

          <!-- Divulgar -->
          <div
            class="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow duration-300"
          >
            <q-icon name="add_circle" size="60px" class="text-primary mb-4" />
            <h3 class="text-2xl font-semibold text-gray-800 mb-3">Divulgue um Animal</h3>
            <p class="text-gray-600 mb-6">
              Ajude um animalzinho a encontrar um lar cadastrando-o em nossa plataforma
            </p>
            <q-btn color="primary" class="rounded-lg" no-caps @click="navigateToMyPets">
              Cadastrar Pet
            </q-btn>
          </div>

          <!-- Conectar -->
          <div
            class="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow duration-300"
          >
            <q-icon name="favorite" size="60px" class="text-orange-400 mb-4" />
            <h3 class="text-2xl font-semibold text-gray-800 mb-3">Conecte-se</h3>
            <p class="text-gray-600 mb-6">
              Entre em contato diretamente com os responsáveis e inicie o processo de adoção
            </p>
            <q-btn color="orange" class="rounded-lg" no-caps @click="navigateToContact">
              Saiba Mais
            </q-btn>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-20 px-4"
      :style="{ background: `linear-gradient(to right, var(--q-accent), var(--q-primary))` }"
    >
      <div class="max-w-4xl mx-auto text-center text-white">
        <h2 class="text-4xl font-bold mb-6">Pronto para Fazer a Diferença?</h2>
        <p class="text-xl mb-8 opacity-90">
          Cada adoção é uma vida transformada. Seja parte dessa história de amor.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <q-btn
            size="lg"
            class="bg-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            color="accent"
            text-color="accent"
            no-caps
            @click="navigateToAdopt"
          >
            Começar Adoção
          </q-btn>

          <q-btn
            size="lg"
            outline
            class="border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white transition-all duration-300"
            color="white"
            no-caps
            @click="navigateToAbout"
          >
            Saiba Mais
          </q-btn>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// Funções de navegação
const navigateToAdopt = () => {
  void router.push('/pets')
};

const navigateToContact = () => {
  // router.push('/contato')
  console.log('Navegar para página de contato');
};

const navigateToAbout = () => {
  // router.push('/sobre')
  console.log('Navegar para página sobre');
};

const navigateToMyPets = () => {
  void router.push('/meusPets')
}
</script>
