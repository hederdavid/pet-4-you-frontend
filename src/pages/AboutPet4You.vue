<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white py-20 border-b">
      <div class="container mx-auto px-4 text-center max-w-4xl">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6"
        >
          <q-icon name="pets" size="32px" class="text-accent" />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Sobre o <span class="text-orange-400">Pet</span><span class="text-accent">4</span
          ><span class="text-primary">You</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Criado para aproximar pessoas que querem doar pets daqueles que sonham em adotar um novo
          amigo 🐾
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-16 max-w-4xl">
      <div class="mb-16 text-center">
        <div class="bg-white rounded-2xl shadow-sm p-8 border">
          <div class="flex items-center justify-center mb-6">
            <q-icon name="favorite" size="32px" class="text-accent mr-3" />
            <h2 class="text-3xl font-bold text-gray-800">Nossa História</h2>
          </div>
          <p class="text-gray-600 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            O Pet4You nasceu do desejo de tornar a adoção de pets mais simples e acessível. Sempre
            acreditei que cada animal merece um lar cheio de carinho, mas percebia que muitas
            pessoas tinham dificuldade em encontrar ou divulgar pets para adoção. Foi então que
            surgiu a ideia de criar um espaço digital que funcionasse como uma ponte entre quem
            deseja doar e quem sonha em adotar. Assim nasceu o Pet4You: um projeto criado para
            facilitar conexões e incentivar novas histórias de amizade entre pessoas e seus futuros
            companheiros de vida.
          </p>
        </div>
      </div>

      <div class="mb-32">
        <div class="text-center mb-8 md:mb-12">
          <h2 class="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">Como Funciona</h2>
          <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Um processo simples e direto para conectar corações
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 md:gap-12 lg:gap-6 gap-24">
          <div class="text-center">
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg"
            >
              <span class="text-white font-bold text-lg md:text-2xl">1</span>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-4 md:p-6 h-full">
              <q-icon
                name="add_circle"
                size="36px"
                class="text-blue-500 mb-3 md:mb-4 md:text-5xl"
              />
              <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                Cadastre seu Pet
              </h3>
              <p class="text-gray-600 text-sm md:text-base">
                Pessoas que desejam doar cadastram seus pets com fotos, informações e dados de
                contato
              </p>
            </div>
          </div>

          <div class="text-center">
            <div
              class="bg-gradient-to-r from-purple-500 to-orange-400 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg"
            >
              <span class="text-white font-bold text-lg md:text-2xl">2</span>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-4 md:p-6 h-full">
              <q-icon name="search" size="36px" class="text-purple-500 mb-3 md:mb-4 md:text-5xl" />
              <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                Encontre seu Amigo
              </h3>
              <p class="text-gray-600 text-sm md:text-base">
                Adotantes navegam pelos pets disponíveis, filtram por preferências e encontram seu
                match perfeito
              </p>
            </div>
          </div>

          <div class="text-center">
            <div
              class="bg-gradient-to-r from-orange-400 to-pink-500 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg"
            >
              <span class="text-white font-bold text-lg md:text-2xl">3</span>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-4 md:p-6 h-full">
              <q-icon
                name="connect_without_contact"
                size="36px"
                class="text-orange-500 mb-3 md:mb-4 md:text-5xl"
              />
              <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">Conecte-se</h3>
              <p class="text-gray-600 text-sm md:text-base">
                As informações de contato ficam disponíveis diretamente entre as partes para
                negociação
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-16 md:mb-20">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-8">
          <div class="flex flex-col md:flex-row md:items-start">
            <div class="flex-shrink-0 mb-4 md:mb-0 text-center md:text-left">
              <q-icon name="info" size="28px" class="text-amber-600 md:text-4xl" />
            </div>
            <div class="md:ml-4 text-center md:text-left">
              <h3 class="text-xl md:text-2xl font-bold text-amber-800 mb-3 md:mb-4">
                Importante Saber
              </h3>
              <p class="text-amber-700 text-base md:text-lg leading-relaxed">
                O Pet4You é apenas um facilitador que conecta pessoas. Não nos responsabilizamos por
                negociações, condições de saúde dos pets ou compromissos assumidos entre adotantes e
                doadores. Recomendamos sempre verificar as condições do animal, documentação
                veterinária e estabelecer acordos claros entre as partes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <div class="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
          <div class="mb-6">
            <q-icon name="code" size="48px" class="text-blue-500 mb-4" />
            <h2 class="text-3xl font-bold text-gray-800">Sobre o Desenvolvimento</h2>
          </div>
          <p class="text-gray-600 text-lg leading-relaxed mb-8">
            Projeto desenvolvido por Heder David, Desenvolvedor Full Stack apaixonado por criar
            soluções inovadoras e impactantes na web.
          </p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <q-icon name="code" size="32px" class="text-blue-600 mb-2" />
              <p class="font-semibold text-blue-800">Vue 3</p>
              <p class="text-sm text-blue-600">Frontend</p>
            </div>
            <div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <q-icon name="layers" size="32px" class="text-purple-600 mb-2" />
              <p class="font-semibold text-purple-800">Quasar</p>
              <p class="text-sm text-purple-600">Framework UI</p>
            </div>
            <div class="bg-red-50 rounded-xl p-4 border border-red-100">
              <q-icon name="storage" size="32px" class="text-red-600 mb-2" />
              <p class="font-semibold text-red-800">NestJs</p>
              <p class="text-sm text-red-600">Backend</p>
            </div>
            <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <q-icon name="palette" size="32px" class="text-orange-600 mb-2" />
              <p class="font-semibold text-orange-800">Tailwind</p>
              <p class="text-sm text-orange-600">Styling</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <q-btn
              outline
              size="lg"
              color="accent"
              icon="fa-solid fa-user"
              label="Portfólio do Dev"
              class="rounded-xl px-8 py-3"
              no-caps
              @click="openPortfolio"
            />
            <q-btn
              outline
              size="lg"
              color="primary"
              icon="fab fa-linkedin"
              label="LinkedIn do Dev"
              class="rounded-xl px-8 py-3"
              no-caps
              @click="openLinkedIn"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-orange-400 to-pink-500 py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para Fazer a Diferença?
        </h2>
        <p class="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
          Junte-se à nossa comunidade e ajude a conectar pets com suas famílias para sempre!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <q-btn
            size="lg"
            color="white"
            text-color="orange-600"
            icon="pets"
            label="Adotar um Pet"
            class="rounded-xl px-8 py-3 font-semibold shadow-lg"
            no-caps
            @click="goToAdoption"
          />
          <q-btn
            size="lg"
            outline
            color="white"
            icon="add_circle"
            label="Cadastrar Pet"
            class="rounded-xl px-8 py-3 font-semibold border-2"
            no-caps
            @click="goToRegister"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const openPortfolio = () => {
  window.open('https://heder.tech', '_blank');
};

const openLinkedIn = () => {
  window.open('https://linkedin.com/in/hederdavid', '_blank');
};

const goToAdoption = () => {
  void router.push('/pets');
};

const goToRegister = () => {
  void router.push('/meusPets');
};
</script>
