<template>
  <q-page class="bg-gray-50 min-h-screen">
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh] p-8">
      <div class="text-center">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md text-h6 text-grey-7">Carregando informações do pet...</div>
      </div>
    </div>

    <div v-else-if="!pet" class="flex items-center justify-center min-h-[60vh] p-8">
      <div class="text-center">
        <q-icon name="pets" size="6em" class="text-grey-4 q-mb-md" />
        <div class="text-h5 text-grey-7 q-mb-sm">Pet não encontrado</div>
        <div class="text-body1 text-grey-6 q-mb-lg">
          Este pet pode ter sido removido ou não está mais disponível
        </div>
        <q-btn
          color="primary"
          unelevated
          icon="arrow_back"
          label="Voltar"
          @click="goBack"
          class="q-px-xl"
        />
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4">
      <div class="bg-white py-8 pb-12 mb-8 border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4">
          <q-breadcrumbs class="q-mb-md">
            <q-breadcrumbs-el label="Pet4You" icon="home" @click="$router.push('/')" />
            <q-breadcrumbs-el label="Adoção" @click="$router.push('/pets')" />
            <q-breadcrumbs-el :label="pet.name" />
          </q-breadcrumbs>

          <q-btn
            flat
            color="grey-8"
            icon="arrow_back"
            label="Voltar"
            @click="goBack"
            class="q-mb-md"
          />

          <div class="mt-6 md:mt-8">
            <h1 class="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">
              {{ pet.name }}
            </h1>
            <div class="flex flex-wrap gap-2 md:gap-3">
              <q-chip
                :color="getSpeciesColor(pet.species)"
                text-color="white"
                :icon="getSpeciesIcon(pet.species)"
                size="md"
                class="text-xs md:text-sm px-2 md:px-3"
              >
                {{ getSpeciesLabel(pet.species) }}
              </q-chip>
              <q-chip
                :color="pet.gender === 'MALE' ? 'blue' : 'pink'"
                text-color="white"
                :icon="pet.gender === 'MALE' ? 'male' : 'female'"
                size="md"
                class="text-xs md:text-sm px-2 md:px-3"
              >
                {{ pet.gender === 'MALE' ? 'Macho' : 'Fêmea' }}
              </q-chip>
              <q-chip
                color="teal"
                text-color="white"
                :icon="getAgeIcon(pet.age)"
                size="md"
                class="text-xs md:text-sm px-2 md:px-3"
              >
                {{ getAgeLabel(pet.age) }}
              </q-chip>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="pb-16">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <!-- Photo Gallery -->
            <div class="">
              <div class="mb-4">
                <q-img
                  v-if="pet.photos && pet.photos.length > 0"
                  :src="pet.photos[0]?.url"
                  :alt="pet.name"
                  class="rounded-2xl shadow-lg w-full h-auto"
                />
                <div
                  v-else
                  class="aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300"
                >
                  <q-icon name="pets" size="4em" class="text-grey-4" />
                </div>
              </div>

              <!-- Thumbnails -->
              <div
                v-if="pet.photos && pet.photos.length > 1"
                class="grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] gap-3"
              >
                <div
                  v-for="(photo, index) in pet.photos"
                  :key="photo.id"
                  class="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-blue-500 hover:-translate-y-1"
                  :class="{
                    'border-blue-500':
                      selectedPhoto?.id === photo.id || (!selectedPhoto && index === 0),
                  }"
                  @click="selectedPhoto = photo"
                >
                  <q-img
                    :src="pet.photos[0]?.url"
                    :alt="`${pet.name} - Foto ${index + 1}`"
                    ratio="1"
                  />
                </div>
              </div>
            </div>

            <!-- Pet Information -->
            <div class="flex flex-col space-y-6">
              <!-- Description Card -->
              <q-card flat class="bg-white rounded-2xl shadow-sm border border-gray-100">
                <q-card-section>
                  <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    Sobre {{ pet.name }}
                  </h3>
                  <p class="text-gray-600 leading-relaxed">{{ pet.description }}</p>
                </q-card-section>
              </q-card>

              <!-- Characteristics Card -->
              <q-card flat class="bg-white rounded-2xl shadow-sm border border-gray-100">
                <q-card-section>
                  <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    Características
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <q-icon name="straighten" class="text-gray-600 text-xl" />
                      <div>
                        <div class="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Porte
                        </div>
                        <div class="text-sm text-gray-800 font-semibold">
                          {{ getSizeLabel(pet.size) }}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <q-icon name="cake" class="text-gray-600 text-xl" />
                      <div>
                        <div class="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Idade
                        </div>
                        <div class="text-sm text-gray-800 font-semibold">
                          {{ getAgeLabel(pet.age) }}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <q-icon name="health_and_safety" class="text-gray-600 text-xl" />
                      <div>
                        <div class="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Estado
                        </div>
                        <div class="text-sm text-gray-800 font-semibold">Saudável</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <q-icon name="event" class="text-gray-600 text-xl" />
                      <div>
                        <div class="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Publicado em
                        </div>
                        <div class="text-sm text-gray-800 font-semibold">
                          {{ formatDate(pet.publication_date) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Contact Card -->
              <q-card flat class="bg-white rounded-2xl shadow-sm border-2 border-blue-100">
                <q-card-section>
                  <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <q-icon name="person" class="q-mr-sm" />
                    Responsável
                  </h3>

                  <div class="flex flex-col space-y-6">
                    <div class="flex items-center space-x-4">
                      <q-avatar
                        size="64px"
                        class="bg-gradient-to-br from-blue-500 to-blue-400 text-white"
                      >
                        <q-icon name="person" size="lg" />
                      </q-avatar>
                      <div class="flex-1">
                        <h4 class="text-xl font-semibold text-gray-800 mb-2">
                          {{ pet.user?.name || 'Nome não informado' }}
                        </h4>
                        <div class="text-gray-600 text-sm flex items-center space-x-1 mb-1">
                          <q-icon name="location_on" size="sm" />
                          <span
                            >{{ pet.user?.city || 'Cidade não informada' }},
                            {{ pet.user?.state || 'Estado não informado' }}</span
                          >
                        </div>
                        <div class="text-gray-600 text-sm flex items-center space-x-1">
                          <q-icon name="event" size="sm" />
                          <span>Membro desde {{ formatDate(pet.user?.createdAt) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex space-x-4 flex-wrap">
                      <q-btn
                        v-if="pet.user?.phone"
                        color="green"
                        icon="phone"
                        label="WhatsApp"
                        @click="openWhatsApp"
                        unelevated
                        class="flex-1 min-w-[140px]"
                      />
                      <q-btn
                        v-if="pet.user?.email"
                        color="blue"
                        icon="email"
                        label="E-mail"
                        @click="openEmail"
                        outline
                        class="flex-1 min-w-[140px]"
                      />
                    </div>

                    <q-banner class="bg-blue-50 border border-blue-200 text-gray-800" rounded>
                      <template v-slot:avatar>
                        <q-icon name="info" color="primary" />
                      </template>
                      Entre em contato para conhecer melhor <strong>{{ pet.name }}</strong> e
                      iniciar o processo de adoção responsável.
                    </q-banner>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Action Button -->
              <div class="text-center py-8">
                <q-btn
                  color="accent"
                  size="lg"
                  icon="favorite"
                  label="Tenho Interesse em Adotar"
                  @click="showInterestDialog = true"
                  unelevated
                  class="text-lg font-semibold px-8 py-4 rounded-xl w-full max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog de Interesse -->
    <q-dialog v-model="showInterestDialog">
      <q-card class="min-w-[400px] rounded-2xl overflow-hidden">
        <q-card-section class="text-center q-pa-lg">
          <q-icon name="favorite" size="3em" class="text-accent q-mb-md" />
          <h4 class="text-h5 q-mb-md">Interesse em {{ pet?.name }}</h4>
          <p class="text-body1 q-mb-md">
            Que ótimo que você tem interesse em adotar {{ pet?.name }}!
          </p>
          <p class="text-gray-400">
            Entre em contato com o responsável para conhecer melhor o pet e iniciar o processo de
            adoção.
          </p>
          <p>Email: {{ pet?.user?.email || 'E-mail não informado' }}</p>
          <p>Número: {{ pet?.user?.phone || 'Número não informado' }}</p>
        </q-card-section>

        <q-card-actions align="center" class="q-pa-lg">
          <q-btn flat label="Fechar" color="grey" v-close-popup />
          <q-btn
            v-if="pet?.user?.phone"
            color="green"
            icon="phone"
            label="Entrar em Contato"
            @click="openWhatsApp"
            v-close-popup
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import type { Pet, Photo } from 'src/types/pet';
import { PetSpecies, PetAge, PetSize, PublicationStatus } from 'src/types/pet';
import { api } from 'src/boot/axios';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// Estados
const loading = ref(false);
const pet = ref<Pet | null>(null);
const selectedPhoto = ref<Photo | null>(null);
const showInterestDialog = ref(false);

// Métodos
const loadPet = async () => {
  loading.value = true;
  try {
    const petId = route.params.id as string;
    const response = await api.get(`/pets/${petId}`);
    pet.value = response.data;
    console.log(pet.value);

    // Verificar se o pet está aprovado
    if (pet.value && pet.value.publication_status !== PublicationStatus.APPROVED) {
      $q.notify({
        type: 'warning',
        message: 'Este pet não está disponível para adoção no momento.',
      });
      await router.push('/pets');
      return;
    }
  } catch (error) {
    console.error('Erro ao carregar pet:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar informações do pet',
    });
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.go(-1);
};

const openWhatsApp = () => {
  if (pet.value?.user?.phone) {
    const message = encodeURIComponent(
      `Olá! Vi o ${pet.value.name} no Pet4You e gostaria de saber mais sobre a adoção. Você poderia me dar mais informações?`,
    );
    const phone = pet.value.user.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  }
};

const openEmail = () => {
  if (pet.value?.user?.email) {
    const subject = encodeURIComponent(`Interesse em adotar ${pet.value.name} - Pet4You`);
    const body = encodeURIComponent(
      `Olá!\n\nVi o ${pet.value.name} no Pet4You e gostaria de saber mais sobre a adoção.\n\nVocê poderia me dar mais informações sobre o pet?\n\nObrigado!`,
    );
    window.open(`mailto:${pet.value.user.email}?subject=${subject}&body=${body}`);
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Helpers para exibição
const getSpeciesColor = (species: PetSpecies) => {
  switch (species) {
    case PetSpecies.DOG:
      return 'brown';
    case PetSpecies.CAT:
      return 'orange';
    case PetSpecies.BIRD:
      return 'blue';
    default:
      return 'grey';
  }
};

const getSpeciesIcon = (species: PetSpecies) => {
  switch (species) {
    case PetSpecies.DOG:
      return 'pets';
    case PetSpecies.CAT:
      return 'pets';
    case PetSpecies.BIRD:
      return 'flight';
    default:
      return 'pets';
  }
};

const getSpeciesLabel = (species: PetSpecies) => {
  switch (species) {
    case PetSpecies.DOG:
      return 'Cachorro';
    case PetSpecies.CAT:
      return 'Gato';
    case PetSpecies.BIRD:
      return 'Pássaro';
    default:
      return 'Desconhecido';
  }
};

const getAgeIcon = (age: PetAge) => {
  switch (age) {
    case PetAge.PUPPY:
      return 'child_care';
    case PetAge.ADULT:
      return 'person';
    case PetAge.SENIOR:
      return 'elderly';
    default:
      return 'help';
  }
};

const getAgeLabel = (age: PetAge) => {
  switch (age) {
    case PetAge.PUPPY:
      return 'Filhote';
    case PetAge.ADULT:
      return 'Adulto';
    case PetAge.SENIOR:
      return 'Idoso';
    default:
      return 'Desconhecido';
  }
};

const getSizeLabel = (size: PetSize) => {
  switch (size) {
    case PetSize.SMALL:
      return 'Pequeno';
    case PetSize.MEDIUM:
      return 'Médio';
    case PetSize.LARGE:
      return 'Grande';
    default:
      return 'Desconhecido';
  }
};

// Lifecycle
onMounted(async () => {
  await loadPet();
  console.log(pet.value?.photos[0]?.url);
});
</script>
