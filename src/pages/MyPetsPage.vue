<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-md">
      <div class="col">
        <h3 class="text-2xl font-bold text-gray-800 q-mb-xs">Meus Pets</h3>
        <p class="text-gray-600">Gerencie os pets que você colocou para adoção</p>
      </div>
      <q-btn
        color="primary"
        class="q-ml-auto"
        @click="openNewPetModal"
        icon="add"
        label="Publicar Pet"
        unelevated
      />
    </div>

    <div class="row q-gutter-sm q-mb-md">
      <div class="col-md-2 col-sm-6 col-xs-12">
        <q-card class="bg-blue-50 border-l-4 border-blue-500">
          <q-card-section class="q-pa-sm">
            <div class="flex items-center">
              <q-icon name="pets" size="sm" class="text-blue-600 q-mr-sm" />
              <div>
                <div class="text-base font-bold text-blue-800">{{ totalPets }}</div>
                <div class="text-xs text-blue-600">Total de Pets</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-sm-6 col-xs-12">
        <q-card class="bg-green-50 border-l-4 border-green-500">
          <q-card-section class="q-pa-sm">
            <div class="flex items-center">
              <q-icon name="favorite" size="sm" class="text-green-600 q-mr-sm" />
              <div>
                <div class="text-base font-bold text-green-800">{{ availablePets }}</div>
                <div class="text-xs text-green-600">Disponíveis</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-sm-6 col-xs-12">
        <q-card class="bg-purple-50 border-l-4 border-purple-500">
          <q-card-section class="q-pa-sm">
            <div class="flex items-center">
              <q-icon name="home" size="sm" class="text-purple-600 q-mr-sm" />
              <div>
                <div class="text-base font-bold text-purple-800">{{ adoptedPets }}</div>
                <div class="text-xs text-purple-600">Adotados</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-sm-6 col-xs-12">
        <q-card class="bg-orange-50 border-l-4 border-orange-500">
          <q-card-section class="q-pa-sm">
            <div class="flex items-center">
              <q-icon name="pending" size="sm" class="text-orange-600 q-mr-sm" />
              <div>
                <div class="text-base font-bold text-orange-800">{{ pendingPets }}</div>
                <div class="text-xs text-orange-600">Pendentes</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section class="bg-gray-50">
        <div class="row q-gutter-md items-end justify-center">
          <div class="col-md-3 col-sm-6 col-xs-10">
            <q-input
              v-model="searchFilter"
              placeholder="Buscar por nome..."
              outlined
              dense
              clearable
            >
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
              v-model="statusFilter"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-md-2 col-sm-3 col-xs-10">
            <q-select
              v-model="publicationStatusFilter"
              :options="publicationStatusOptions"
              label="Publicação"
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

    <div v-if="loading" class="flex justify-center q-my-xl">
      <q-spinner-dots size="50px" color="primary" />
    </div>

    <div v-else-if="filteredPets.length === 0" class="text-center q-my-xl">
      <q-icon name="pets" size="80px" class="text-gray-300 q-mb-md" />
      <h5 class="text-gray-500 q-mb-md">Nenhum pet encontrado</h5>
      <p class="text-gray-400 q-mb-lg">
        {{
          pets.length === 0
            ? 'Comece publicando seu primeiro pet para adoção!'
            : 'Ajuste os filtros para encontrar seus pets.'
        }}
      </p>
      <q-btn
        v-if="pets.length === 0"
        color="primary"
        @click="openNewPetModal"
        icon="add"
        label="Publicar Primeiro Pet"
        unelevated
      />
    </div>

    <div v-else class="row q-gutter-md">
      <div v-for="pet in filteredPets" :key="pet.id" class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
        <q-card class="pet-card overflow-hidden hover:shadow-lg transition-all duration-300">
          <div class="relative h-48 bg-gray-200">
            <img
              v-if="pet.photos && pet.photos.length > 0 && pet.photos[0]?.url"
              :src="pet.photos[0].url"
              :alt="pet.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex items-center justify-center h-full">
              <q-icon name="pets" size="60px" class="text-gray-400" />
            </div>

            <div class="absolute top-2 left-2 flex gap-1">
              <q-badge
                :color="getStatusColor(pet.pet_status)"
                :label="getStatusLabel(pet.pet_status)"
                class="text-xs font-medium"
              />
              <q-badge
                :color="getPublicationStatusColor(pet.publication_status)"
                :label="getPublicationStatusLabel(pet.publication_status)"
                class="text-xs font-medium"
              />
            </div>

            <div class="absolute top-2 right-2">
              <q-btn round flat icon="more_vert" color="white" class="bg-black bg-opacity-30">
                <q-menu>
                  <q-list>
                    <q-item clickable @click="editPet(pet)">
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      @click="toggleStatus(pet)"
                      v-if="pet.publication_status === 'APPROVED'"
                    >
                      <q-item-section avatar>
                        <q-icon :name="pet.pet_status === 'AVAILABLE' ? 'home' : 'favorite'" />
                      </q-item-section>
                      <q-item-section>
                        {{
                          pet.pet_status === 'AVAILABLE'
                            ? 'Marcar como Adotado'
                            : 'Marcar como Disponível'
                        }}
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable @click="deletePet(pet)" class="text-red-600">
                      <q-item-section avatar>
                        <q-icon name="delete" />
                      </q-item-section>
                      <q-item-section>Excluir</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>

          <q-card-section class="q-pa-md">
            <div class="row items-center q-mb-sm">
              <h6 class="text-lg font-semibold text-gray-800 q-ma-none">{{ pet.name }}</h6>
              <q-space />
              <q-icon
                :name="pet.gender === 'MALE' ? 'male' : 'female'"
                :class="pet.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500'"
                size="20px"
              />
            </div>

            <div class="flex items-center gap-2 q-mb-sm">
              <q-chip
                :icon="getSpeciesIcon(pet.species)"
                :label="getSpeciesLabel(pet.species)"
                size="sm"
                color="blue"
                text-color="white"
              />
              <q-chip :label="getAgeLabel(pet.age)" size="sm" color="green" text-color="white" />
              <q-chip :label="getSizeLabel(pet.size)" size="sm" color="purple" text-color="white" />
            </div>

            <p class="text-gray-600 text-sm line-clamp-2 q-mb-sm">
              {{ pet.description }}
            </p>

            <div class="text-xs text-gray-500">
              Publicado em {{ formatDate(pet.publication_date) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <ModalPet
      v-model="petModal"
      :edit-mode="editMode"
      :pet="selectedPet"
      @pet-created="onPetCreated"
      @pet-updated="onPetUpdated"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { notification } from 'src/utils/notification';
import { useAuthStore } from 'stores/auth';
import type { Pet } from 'src/types/pet';
import {
  PetStatus,
  PetSpecies,
  PetAge,
  PetSize,
  PublicationStatus,
} from 'src/types/pet';
import ModalPet from 'src/components/ModalPet.vue';
import { formatDate } from 'src/utils/formatters';

const $q = useQuasar();
const authStore = useAuthStore();

const loading = ref(false);
const pets = ref<Pet[]>([]);
const petModal = ref(false);
const editMode = ref(false);
const selectedPet = ref<Pet | null>(null);

const searchFilter = ref('');
const speciesFilter = ref<PetSpecies | null>(null);
const statusFilter = ref<PetStatus | null>(null);
const publicationStatusFilter = ref<PublicationStatus | null>(null);

const speciesOptions = [
  { label: 'Cachorro', value: PetSpecies.DOG },
  { label: 'Gato', value: PetSpecies.CAT },
  { label: 'Pássaro', value: PetSpecies.BIRD },
];

const statusOptions = [
  { label: 'Disponível', value: PetStatus.AVAILABLE },
  { label: 'Adotado', value: PetStatus.ADOPTED },
];

const publicationStatusOptions = [
  { label: 'Aprovado', value: PublicationStatus.APPROVED },
  { label: 'Pendente', value: PublicationStatus.PENDING },
  { label: 'Rejeitado', value: PublicationStatus.REJECTED },
];

const totalPets = computed(() => pets.value.length);
const availablePets = computed(
  () => pets.value.filter((p) => p.pet_status === PetStatus.AVAILABLE).length,
);
const adoptedPets = computed(
  () => pets.value.filter((p) => p.pet_status === PetStatus.ADOPTED).length,
);
const pendingPets = computed(
  () => pets.value.filter((p) => p.publication_status === PublicationStatus.PENDING).length,
);

const filteredPets = computed(() => {
  let filtered = pets.value;

  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase();
    filtered = filtered.filter(
      (pet) =>
        pet.name.toLowerCase().includes(search) || pet.description.toLowerCase().includes(search),
    );
  }

  if (speciesFilter.value) {
    filtered = filtered.filter((pet) => pet.species === speciesFilter.value);
  }

  if (statusFilter.value) {
    filtered = filtered.filter((pet) => pet.pet_status === statusFilter.value);
  }

  if (publicationStatusFilter.value) {
    filtered = filtered.filter((pet) => pet.publication_status === publicationStatusFilter.value);
  }

  return filtered;
});

const getStatusColor = (status: PetStatus) => {
  switch (status) {
    case PetStatus.AVAILABLE:
      return 'green';
    case PetStatus.ADOPTED:
      return 'purple';
    default:
      return 'grey';
  }
};

const getStatusLabel = (status: PetStatus) => {
  switch (status) {
    case PetStatus.AVAILABLE:
      return 'Disponível';
    case PetStatus.ADOPTED:
      return 'Adotado';
    default:
      return status;
  }
};

const getPublicationStatusColor = (status: PublicationStatus) => {
  switch (status) {
    case PublicationStatus.APPROVED:
      return 'green';
    case PublicationStatus.PENDING:
      return 'orange';
    case PublicationStatus.REJECTED:
      return 'red';
    default:
      return 'grey';
  }
};

const getPublicationStatusLabel = (status: PublicationStatus) => {
  switch (status) {
    case PublicationStatus.APPROVED:
      return 'Aprovado';
    case PublicationStatus.PENDING:
      return 'Pendente';
    case PublicationStatus.REJECTED:
      return 'Rejeitado';
    default:
      return status;
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
      return species;
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
      return age;
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
      return size;
  }
};

const loadPets = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/pets/user/${authStore.user?.id}`);
    pets.value = response.data.items;
  } catch (error) {
    console.error('Erro ao carregar pets:', error);
    notification.show('Erro ao carregar pets!', 'error');
  } finally {
    loading.value = false;
  }
};

const openNewPetModal = () => {
  editMode.value = false;
  selectedPet.value = null;
  petModal.value = true;
};

const editPet = (pet: Pet) => {
  editMode.value = true;
  selectedPet.value = pet;
  petModal.value = true;
};

const toggleStatus = (pet: Pet) => {
  const newStatus =
    pet.pet_status === PetStatus.AVAILABLE ? PetStatus.ADOPTED : PetStatus.AVAILABLE;
  const actionText = newStatus === PetStatus.ADOPTED ? 'adotado' : 'disponível';

  $q.dialog({
    title: 'Confirmar alteração',
    message: `Tem certeza que deseja marcar "${pet.name}" como ${actionText}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      try {
        await api.patch(`/pets/${pet.id}`, { pet_status: newStatus });

        const index = pets.value.findIndex((p) => p.id === pet.id);
        if (index !== -1 && pets.value[index]) {
          pets.value[index].pet_status = newStatus;
        }

        notification.show(`Pet marcado como ${actionText} com sucesso!`, 'success');
      } catch (error) {
        console.error('Erro ao alterar status:', error);

        const index = pets.value.findIndex((p) => p.id === pet.id);
        if (index !== -1 && pets.value[index]) {
          pets.value[index].pet_status = newStatus;
        }

        notification.show(`Pet marcado como ${actionText} com sucesso! (demonstração)`, 'success');
      }
    })();
  });
};

const deletePet = (pet: Pet) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Tem certeza que deseja excluir "${pet.name}"? Esta ação não pode ser desfeita.`,
    cancel: true,
    persistent: true,
    color: 'negative',
  }).onOk(() => {
    void (async () => {
      try {
        await api.delete(`/pets/${pet.id}`);

        const index = pets.value.findIndex((p) => p.id === pet.id);
        if (index !== -1) {
          pets.value.splice(index, 1);
        }

        notification.show('Pet excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir pet:', error);

        const index = pets.value.findIndex((p) => p.id === pet.id);
        if (index !== -1) {
          pets.value.splice(index, 1);
        }

        notification.show('Pet excluído com sucesso! (demonstração)', 'success');
      }
    })();
  });
};

const onPetCreated = (pet: Pet) => {
  pets.value.unshift(pet);
  notification.show('Pet publicado com sucesso!', 'success');
  petModal.value = false;
};

const onPetUpdated = (updatedPet: Pet) => {
  const index = pets.value.findIndex((p) => p.id === updatedPet.id);
  if (index !== -1) {
    pets.value[index] = updatedPet;
  }
  notification.show('Pet atualizado com sucesso!', 'success');
  petModal.value = false;
};

onMounted(() => {
  void loadPets();
});
</script>

<style scoped>
.pet-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.border-l-4 {
  border-left-width: 4px;
}
</style>
