<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <div class="col">
        <h3 class="text-2xl font-bold text-gray-800 q-mb-xs">Adoção de Pets</h3>
        <p class="text-gray-600">Encontre seu novo uma nova chance a um pet</p>
      </div>
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section class="bg-gray-50">
        <div class="row q-gutter-md items-center justify-center">
          <div class="col-md-3 col-sm-6 col-xs-10">
            <q-input v-model="searchFilter" placeholder="Buscar pets..." outlined dense clearable>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-md-2 col-sm-3 col-xs-10">
            <q-select
              v-model="speciesFilter"
              :options="speciesOptions"
              label="Espécie"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-md-2 col-sm-3 col-xs-10">
            <q-select
              v-model="ageFilter"
              :options="ageOptions"
              label="Idade"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-md-2 col-sm-3 col-xs-10">
            <q-select
              v-model="sizeFilter"
              :options="sizeOptions"
              label="Porte"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-md-2 col-sm-3 col-xs-10">
            <q-select
              v-model="genderFilter"
              :options="genderOptions"
              label="Gênero"
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

    <div class="q-mb-md">
      <div class="text-body1 text-weight-medium text-gray-700">
        {{ filteredPets.length }} pet{{ filteredPets.length !== 1 ? 's' : '' }}
        {{ filteredPets.length !== 1 ? 'encontrados' : 'encontrado' }}
      </div>
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <div class="text-center">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md text-grey-7">Carregando pets...</div>
      </div>
    </div>

    <div v-else-if="filteredPets.length === 0" class="row justify-center q-pa-xl">
      <div class="text-center">
        <q-icon name="pets" size="4em" class="text-grey-4 q-mb-md" />
        <div class="text-h6 text-grey-7 q-mb-sm">Nenhum pet encontrado</div>
        <div class="text-grey-6">Tente ajustar os filtros ou verifique novamente em breve</div>
      </div>
    </div>

    <div v-else class="row q-gutter-md">
      <div
        v-for="pet in paginatedPets"
        :key="pet.id"
        class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12"
      >
        <q-card class="pet-card cursor-pointer" @click="goToPetDetails(pet.id)" v-ripple>
          <div class="relative-position">
            <q-img
              v-if="pet.photos && pet.photos.length > 0"
              :src="pet.photos[0]?.url"
              :alt="pet.name"
              class="pet-image"
              ratio="4/3"
            />
            <div v-else class="pet-image-placeholder">
              <q-icon name="pets" size="4em" class="text-grey-4" />
            </div>

            <div class="absolute-top-right q-pa-sm">
              <q-chip
                :color="getSpeciesColor(pet.species)"
                text-color="white"
                size="sm"
                :icon="getSpeciesIcon(pet.species)"
              >
                {{ getSpeciesLabel(pet.species) }}
              </q-chip>
            </div>

            <div v-if="pet.photos && pet.photos.length > 1" class="absolute-bottom-right q-pa-sm">
              <q-chip color="black" text-color="white" size="sm" icon="photo_library">
                {{ pet.photos.length }}
              </q-chip>
            </div>
          </div>

          <q-card-section class="q-pa-md">
            <div class="row items-center q-mb-sm">
              <h6 class="text-h6 text-weight-bold q-ma-none col">{{ pet.name }}</h6>
              <q-icon
                :name="pet.gender === 'MALE' ? 'male' : 'female'"
                :color="pet.gender === 'MALE' ? 'blue' : 'pink'"
                size="sm"
              />
            </div>

            <p class="text-body2 text-grey-7 q-mb-md line-clamp-2">
              {{ pet.description }}
            </p>

            <div class="row q-gutter-xs q-mb-md">
              <q-chip color="blue-1" text-color="blue-8" size="sm" :icon="getAgeIcon(pet.age)">
                {{ getAgeLabel(pet.age) }}
              </q-chip>
              <q-chip
                color="purple-1"
                text-color="purple-8"
                size="sm"
                :icon="getSizeIcon(pet.size)"
              >
                {{ getSizeLabel(pet.size) }}
              </q-chip>
            </div>

            <div class="row items-center text-grey-6">
              <q-icon name="person" size="xs" class="q-mr-xs" />
              <span class="text-caption">{{ pet.user?.name || 'Anônimo' }}</span>
              <q-space />
              <q-icon name="location_on" size="xs" class="q-mr-xs" />
              <span class="text-caption"> {{ pet.user?.city }}, {{ pet.user?.state }} </span>
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-md q-pt-none">
            <q-btn
              color="primary"
              unelevated
              class="full-width"
              icon="favorite"
              label="Ver Detalhes"
              @click.stop="goToPetDetails(pet.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-if="filteredPets.length > itemsPerPage" class="row justify-center q-mt-lg">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        :max-pages="6"
        boundary-numbers
        direction-links
        outline
        color="primary"
        size="md"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import type { Pet } from 'src/types/pet';
import { PetSpecies, PetAge, PetSize, PetGender, PublicationStatus } from 'src/types/pet';
import { api } from 'src/boot/axios';

const router = useRouter();
const $q = useQuasar();

// Estados
const loading = ref(false);
const pets = ref<Pet[]>([]);

// Filtros
const searchFilter = ref('');
const speciesFilter = ref<PetSpecies | ''>('');
const ageFilter = ref<PetAge | ''>('');
const sizeFilter = ref<PetSize | ''>('');
const genderFilter = ref<PetGender | ''>('');

// Paginação
const currentPage = ref(1);
const itemsPerPage = 12;

// Opções para os selects
const speciesOptions = [
  { label: 'Cachorro', value: PetSpecies.DOG, icon: 'pets' },
  { label: 'Gato', value: PetSpecies.CAT, icon: 'pets' },
  { label: 'Pássaro', value: PetSpecies.BIRD, icon: 'flight' },
];

const ageOptions = [
  { label: 'Filhote', value: PetAge.PUPPY, icon: 'child_care' },
  { label: 'Adulto', value: PetAge.ADULT, icon: 'person' },
  { label: 'Idoso', value: PetAge.SENIOR, icon: 'elderly' },
];

const sizeOptions = [
  { label: 'Pequeno', value: PetSize.SMALL, icon: 'radio_button_unchecked' },
  { label: 'Médio', value: PetSize.MEDIUM, icon: 'circle' },
  { label: 'Grande', value: PetSize.LARGE, icon: 'album' },
];

const genderOptions = [
  { label: 'Macho', value: PetGender.MALE, icon: 'male' },
  { label: 'Fêmea', value: PetGender.FEMALE, icon: 'female' },
];

// Computed
const filteredPets = computed(() => {
  // ✅ CORREÇÃO: Adiciona uma verificação para garantir que 'pets.value' é um array.
  if (!Array.isArray(pets.value)) {
    return []; // Retorna um array vazio para evitar o erro.
  }

  let filtered = pets.value;

  // Filtrar apenas pets aprovados
  filtered = filtered.filter((pet) => pet.publication_status === PublicationStatus.APPROVED);

  // Filtro por busca
  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase();
    filtered = filtered.filter(
      (pet) =>
        pet.name.toLowerCase().includes(search) ||
        pet.description.toLowerCase().includes(search) ||
        pet.user?.name?.toLowerCase().includes(search),
    );
  }

  // Filtro por espécie
  if (speciesFilter.value) {
    filtered = filtered.filter((pet) => pet.species === speciesFilter.value);
  }

  // Filtro por idade
  if (ageFilter.value) {
    filtered = filtered.filter((pet) => pet.age === ageFilter.value);
  }

  // Filtro por porte
  if (sizeFilter.value) {
    filtered = filtered.filter((pet) => pet.size === sizeFilter.value);
  }

  // Filtro por gênero
  if (genderFilter.value) {
    filtered = filtered.filter((pet) => pet.gender === genderFilter.value);
  }

  return filtered.sort(
    (a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime(),
  );
});

const totalPages = computed(() => Math.ceil(filteredPets.value.length / itemsPerPage));

const paginatedPets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPets.value.slice(start, end);
});

// Métodos
const loadPets = async () => {
  loading.value = true;
  try {
    const response = await api.get('/pets?status=APPROVED');

    // ✅ CORREÇÃO: Garante que o valor atribuído a 'pets.value' seja sempre um array.
    if (Array.isArray(response.data.items)) {
      pets.value = response.data.items;
    } else {
      console.warn(
        'A resposta da API não foi um array. Definindo para array vazio.',
        response.data,
      );
      pets.value = []; // Evita erros ao definir um array vazio como fallback.
    }
  } catch (error) {
    console.error('Erro ao carregar pets:', error);
    pets.value = []; // Garante que pets seja um array mesmo em caso de erro.
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar pets para adoção',
    });
  } finally {
    loading.value = false;
  }
};

const goToPetDetails = (petId: string) => {
  void router.push(`/pets/${petId}`);
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

const getSizeIcon = (size: PetSize) => {
  switch (size) {
    case PetSize.SMALL:
      return 'radio_button_unchecked';
    case PetSize.MEDIUM:
      return 'circle';
    case PetSize.LARGE:
      return 'album';
    default:
      return 'help';
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
onMounted(() => {
  void loadPets();
});
</script>

<style scoped>
.pet-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.pet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.pet-image {
  height: 200px;
  object-fit: cover;
}

.pet-image-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  max-height: 2.8em;
}

.absolute-top-right {
  position: absolute;
  top: 0;
  right: 0;
}

.absolute-bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
}

.relative-position {
  position: relative;
}
</style>
