<template>
  <q-page class="q-pa-lg">
    <!-- Header da página -->
    <div class="row items-center q-mb-xl">
      <div class="col">
        <h3 class="text-2xl font-bold text-gray-800 q-mb-xs">Gerenciar Publicações de Pets</h3>
        <p class="text-gray-600">Aprove, rejeite ou gerencie as publicações de pets dos usuários</p>
      </div>
    </div>

    <!-- Estatísticas Rápidas -->
    <div class="row q-gutter-sm q-mb-md">
      <div class="col-md-2 col-sm-6 col-xs-12">
        <q-card class="bg-orange-50 border-l-4 border-orange-500">
          <q-card-section class="q-pa-sm">
            <div class="flex items-center">
              <q-icon name="pending" size="sm" class="text-orange-600 q-mr-sm" />
              <div>
                <div class="text-base font-bold text-orange-800">{{ pendingCount }}</div>
                <div class="text-xs text-orange-600">Pendentes</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-sm-6 col-xs-12">
        <q-card class="bg-green-50 border-l-4 border-green-500">
          <q-card-section class="q-pa-sm">
            <div class="flex items-center">
              <q-icon name="check_circle" size="sm" class="text-green-600 q-mr-sm" />
              <div>
                <div class="text-base font-bold text-green-800">{{ approvedCount }}</div>
                <div class="text-xs text-green-600">Aprovadas</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-sm-6 col-xs-12">
        <q-card class="bg-red-50 border-l-4 border-red-500">
          <q-card-section class="q-pa-sm">
            <div class="flex items-center">
              <q-icon name="cancel" size="sm" class="text-red-600 q-mr-sm" />
              <div>
                <div class="text-base font-bold text-red-800">{{ rejectedCount }}</div>
                <div class="text-xs text-red-600">Rejeitadas</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-sm-6 col-xs-12">
        <q-card class="bg-blue-50 border-l-4 border-blue-500">
          <q-card-section class="q-pa-sm">
            <div class="flex items-center">
              <q-icon name="pets" size="sm" class="text-blue-600 q-mr-sm" />
              <div>
                <div class="text-base font-bold text-blue-800">{{ totalPets }}</div>
                <div class="text-xs text-blue-600">Total</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section class="bg-gray-50">
        <div class="row q-gutter-md items-end">
          <div class="col-md-3 col-sm-6 col-xs-12">
            <q-input
              v-model="searchFilter"
              placeholder="Buscar por nome do pet ou usuário..."
              outlined
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-md-2 col-sm-3 col-xs-6">
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
          <div class="col-md-2 col-sm-3 col-xs-6">
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
          <div class="col-md-2 col-sm-3 col-xs-6">
            <q-select
              v-model="dateFilter"
              :options="dateOptions"
              label="Data"
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

    <!-- Lista de Publicações -->
    <q-card flat bordered>
      <q-card-section v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="2em" />
        <div class="q-mt-md text-grey-7">Carregando publicações...</div>
      </q-card-section>

      <q-card-section v-else-if="filteredPets.length === 0" class="text-center q-pa-xl">
        <q-icon name="pets" size="4em" class="text-grey-4 q-mb-md" />
        <div class="text-h6 text-grey-7 q-mb-sm">Nenhuma publicação encontrada</div>
        <div class="text-grey-6">Tente ajustar os filtros ou aguarde novas publicações</div>
      </q-card-section>

      <div v-else>
        <q-list separator>
          <q-item
            v-for="pet in paginatedPets"
            :key="pet.id"
            class="q-pa-md"
            clickable
            v-ripple
            @click="viewPetDetails(pet)"
          >
            <q-item-section avatar>
              <q-avatar size="80px" class="rounded-lg">
                <img
                  v-if="pet.photos && pet.photos.length > 0 && pet.photos[0]"
                  :src="pet.photos[0].url"
                  :alt="pet.name"
                  class="object-cover"
                />
                <q-icon v-else name="pets" size="40px" class="text-grey-5" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6 text-weight-medium">{{ pet.name }}</q-item-label>
              <q-item-label caption class="q-mt-xs">
                <div class="row items-center q-gutter-sm">
                  <q-chip
                    :color="getSpeciesColor(pet.species)"
                    text-color="white"
                    size="sm"
                    :icon="getSpeciesIcon(pet.species)"
                  >
                    {{ getSpeciesLabel(pet.species) }}
                  </q-chip>
                  <q-chip color="blue" text-color="white" size="sm" :icon="getAgeIcon(pet.age)">
                    {{ getAgeLabel(pet.age) }}
                  </q-chip>
                  <q-chip color="purple" text-color="white" size="sm" :icon="getSizeIcon(pet.size)">
                    {{ getSizeLabel(pet.size) }}
                  </q-chip>
                </div>
              </q-item-label>
              <q-item-label caption class="q-mt-sm">
                <div class="text-grey-7">
                  <q-icon name="person" size="sm" class="q-mr-xs" />
                  {{ pet.user?.name || 'Usuário não encontrado' }}
                </div>
                <div class="text-grey-6 q-mt-xs">
                  <q-icon name="schedule" size="sm" class="q-mr-xs" />
                  Publicado em {{ formatDate(pet.publication_date) }}
                </div>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="column items-end q-gutter-sm">
                <q-chip
                  :color="getStatusColor(pet.publication_status)"
                  text-color="white"
                  :icon="getStatusIcon(pet.publication_status)"
                >
                  {{ getStatusLabel(pet.publication_status) }}
                </q-chip>

                <div class="row q-gutter-xs">
                  <!-- Botões para pets pendentes -->
                  <template v-if="pet.publication_status === 'PENDING'">
                    <q-btn
                      color="green"
                      icon="check"
                      size="sm"
                      round
                      @click.stop="approvePet(pet)"
                      :loading="actionLoading[pet.id]"
                    >
                      <q-tooltip>Aprovar</q-tooltip>
                    </q-btn>

                    <q-btn
                      color="red"
                      icon="close"
                      size="sm"
                      round
                      @click.stop="rejectPet(pet)"
                      :loading="actionLoading[pet.id]"
                    >
                      <q-tooltip>Rejeitar</q-tooltip>
                    </q-btn>
                  </template>

                  <!-- Menu dropdown para alterar status (pets aprovados/rejeitados) -->
                  <template v-else>
                    <q-btn
                      color="primary"
                      icon="swap_horiz"
                      size="sm"
                      round
                      :loading="actionLoading[pet.id]"
                      @click.stop
                    >
                      <q-tooltip>Alterar Status</q-tooltip>
                      <q-menu>
                        <q-list>
                          <q-item clickable v-close-popup @click="changeStatusToPending(pet)">
                            <q-item-section avatar>
                              <q-icon name="pending" color="orange" />
                            </q-item-section>
                            <q-item-section>Tornar Pendente</q-item-section>
                          </q-item>
                          <q-item
                            v-if="pet.publication_status !== 'APPROVED'"
                            clickable
                            v-close-popup
                            @click="approvePet(pet)"
                          >
                            <q-item-section avatar>
                              <q-icon name="check_circle" color="green" />
                            </q-item-section>
                            <q-item-section>Aprovar</q-item-section>
                          </q-item>
                          <q-item
                            v-if="pet.publication_status !== 'REJECTED'"
                            clickable
                            v-close-popup
                            @click="rejectPet(pet)"
                          >
                            <q-item-section avatar>
                              <q-icon name="cancel" color="red" />
                            </q-item-section>
                            <q-item-section>Rejeitar</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </template>

                  <q-btn color="blue" icon="edit" size="sm" round @click.stop="editPet(pet)">
                    <q-tooltip>Editar Pet</q-tooltip>
                  </q-btn>

                  <q-btn
                    color="negative"
                    icon="delete"
                    size="sm"
                    round
                    @click.stop="deletePet(pet)"
                    :loading="actionLoading[pet.id]"
                  >
                    <q-tooltip>Excluir</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Paginação -->
        <q-separator />
        <q-card-section class="bg-grey-1">
          <div class="row items-center justify-between">
            <div class="text-grey-7">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a
              {{ Math.min(currentPage * itemsPerPage, filteredPets.length) }} de
              {{ filteredPets.length }} publicações
            </div>
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="6"
              boundary-numbers
              direction-links
              outline
              color="primary"
              size="sm"
            />
          </div>
        </q-card-section>
      </div>
    </q-card>

    <!-- Modal de Detalhes do Pet -->
    <q-dialog v-model="showDetailsModal" persistent>
      <q-card style="min-width: 700px; max-width: 900px">
        <q-card-section class="row items-center bg-primary text-white">
          <q-avatar color="white" text-color="primary" class="q-mr-md">
            <q-icon name="pets" />
          </q-avatar>
          <div class="text-h6">Detalhes da Publicação</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showDetailsModal = false" />
        </q-card-section>

        <q-card-section v-if="selectedPet" class="q-pa-lg">
          <!-- Fotos do Pet -->
          <div v-if="selectedPet.photos && selectedPet.photos.length > 0" class="q-mb-lg">
            <h6 class="text-weight-medium q-mb-md">Fotos</h6>
            <div class="row q-gutter-sm">
              <div v-for="(photo, index) in selectedPet.photos" :key="photo.id" class="col-auto">
                <q-img
                  :src="photo.url"
                  :alt="`Foto ${index + 1} do ${selectedPet.name}`"
                  style="width: 120px; height: 120px"
                  class="rounded-borders cursor-pointer"
                  @click="viewPhotoFullsize(photo.url)"
                />
              </div>
            </div>
          </div>

          <!-- Informações do Pet -->
          <div class="row q-gutter-lg">
            <div class="col">
              <h6 class="text-weight-medium q-mb-md">Informações do Pet</h6>
              <q-list dense>
                <q-item>
                  <q-item-section avatar><q-icon name="pets" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Nome</q-item-label>
                    <q-item-label caption>{{ selectedPet.name }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="description" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Descrição</q-item-label>
                    <q-item-label caption>{{ selectedPet.description }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="category" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Espécie</q-item-label>
                    <q-item-label caption>{{ getSpeciesLabel(selectedPet.species) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="cake" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Idade</q-item-label>
                    <q-item-label caption>{{ getAgeLabel(selectedPet.age) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="straighten" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Porte</q-item-label>
                    <q-item-label caption>{{ getSizeLabel(selectedPet.size) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon :name="selectedPet.gender === 'MALE' ? 'male' : 'female'" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Gênero</q-item-label>
                    <q-item-label caption>{{
                      selectedPet.gender === 'MALE' ? 'Macho' : 'Fêmea'
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col">
              <h6 class="text-weight-medium q-mb-md">Informações da Publicação</h6>
              <q-list dense>
                <q-item>
                  <q-item-section avatar><q-icon name="person" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Publicado por</q-item-label>
                    <q-item-label caption>{{
                      selectedPet.user?.name || 'Usuário não encontrado'
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="email" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Email do usuário</q-item-label>
                    <q-item-label caption>{{
                      selectedPet.user?.email || 'Email não encontrado'
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="phone" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Telefone</q-item-label>
                    <q-item-label caption>{{
                      selectedPet.user?.phone || 'Telefone não informado'
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="location_on" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Localização</q-item-label>
                    <q-item-label caption
                      >{{ selectedPet.user?.city }}, {{ selectedPet.user?.state }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="schedule" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Data de publicação</q-item-label>
                    <q-item-label caption>{{
                      formatDate(selectedPet.publication_date)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="info" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Status</q-item-label>
                    <q-item-label caption>
                      <q-chip
                        :color="getStatusColor(selectedPet.publication_status)"
                        text-color="white"
                        :icon="getStatusIcon(selectedPet.publication_status)"
                        size="sm"
                      >
                        {{ getStatusLabel(selectedPet.publication_status) }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-lg">
          <q-btn flat label="Fechar" @click="showDetailsModal = false" />

          <!-- Botões para pets pendentes -->
          <template v-if="selectedPet?.publication_status === 'PENDING'">
            <q-btn
              color="green"
              icon="check"
              label="Aprovar"
              @click="approvePet(selectedPet!)"
              :loading="actionLoading[selectedPet?.id || '']"
            />
            <q-btn
              color="red"
              icon="close"
              label="Rejeitar"
              @click="rejectPet(selectedPet!)"
              :loading="actionLoading[selectedPet?.id || '']"
            />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Visualização de Foto -->
    <q-dialog v-model="showPhotoModal">
      <q-card>
        <q-card-section class="q-pa-none">
          <q-img :src="selectedPhoto" style="max-width: 80vw; max-height: 80vh" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fechar" @click="showPhotoModal = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Edição -->
    <ModalPet
      v-model="showEditModal"
      :pet="selectedPet"
      :edit-mode="true"
      @pet-updated="onPetUpdated"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import type { Pet } from 'src/types/pet';
import { PetSpecies, PetAge, PetSize, PublicationStatus } from 'src/types/pet';
import { api } from 'src/boot/axios';
import ModalPet from 'src/components/ModalPet.vue';
import { notification } from 'src/utils/notification';

const $q = useQuasar();

// Estados
const loading = ref(false);
const pets = ref<Pet[]>([]);
const selectedPet = ref<Pet | null>(null);
const showDetailsModal = ref(false);
const showPhotoModal = ref(false);
const showEditModal = ref(false);
const selectedPhoto = ref('');
const actionLoading = ref<Record<string, boolean>>({});

// Filtros
const searchFilter = ref('');
const statusFilter = ref<PublicationStatus | ''>('');
const speciesFilter = ref<PetSpecies | ''>('');
const dateFilter = ref('');

// Paginação
const currentPage = ref(1);
const itemsPerPage = 10;

// Opções para os selects
const statusOptions = [
  { label: 'Pendente', value: PublicationStatus.PENDING, icon: 'pending' },
  { label: 'Aprovado', value: PublicationStatus.APPROVED, icon: 'check_circle' },
  { label: 'Rejeitado', value: PublicationStatus.REJECTED, icon: 'cancel' },
];

const speciesOptions = [
  { label: 'Cachorro', value: PetSpecies.DOG, icon: 'pets' },
  { label: 'Gato', value: PetSpecies.CAT, icon: 'pets' },
  { label: 'Pássaro', value: PetSpecies.BIRD, icon: 'flight' },
];

const dateOptions = [
  { label: 'Hoje', value: 'today' },
  { label: 'Esta semana', value: 'week' },
  { label: 'Este mês', value: 'month' },
  { label: 'Últimos 3 meses', value: '3months' },
];

// Computed
const filteredPets = computed(() => {
  let filtered = pets.value;

  // Filtro por busca
  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase();
    filtered = filtered.filter(
      (pet) =>
        pet.name.toLowerCase().includes(search) ||
        pet.user?.name?.toLowerCase().includes(search) ||
        pet.description.toLowerCase().includes(search),
    );
  }

  // Filtro por status
  if (statusFilter.value) {
    filtered = filtered.filter((pet) => pet.publication_status === statusFilter.value);
  }

  // Filtro por espécie
  if (speciesFilter.value) {
    filtered = filtered.filter((pet) => pet.species === speciesFilter.value);
  }

  // Filtro por data
  if (dateFilter.value) {
    const now = new Date();
    filtered = filtered.filter((pet) => {
      const petDate = new Date(pet.publication_date);
      switch (dateFilter.value) {
        case 'today': {
          return petDate.toDateString() === now.toDateString();
        }
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return petDate >= weekAgo;
        }
        case 'month': {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return petDate >= monthAgo;
        }
        case '3months': {
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return petDate >= threeMonthsAgo;
        }
        default:
          return true;
      }
    });
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

// Estatísticas
const totalPets = computed(() => pets.value.length);
const pendingCount = computed(
  () => pets.value.filter((pet) => pet.publication_status === PublicationStatus.PENDING).length,
);
const approvedCount = computed(
  () => pets.value.filter((pet) => pet.publication_status === PublicationStatus.APPROVED).length,
);
const rejectedCount = computed(
  () => pets.value.filter((pet) => pet.publication_status === PublicationStatus.REJECTED).length,
);

// Métodos
const loadPets = async () => {
  loading.value = true;
  try {
    const response = await api.get('/pets?includeUser=true&adminView=true');
    pets.value = response.data.items;
  } catch (error) {
    console.error('Erro ao carregar pets:', error);
    notification.show('Erro ao carregar pets', 'error');
  } finally {
    loading.value = false;
  }
};

const viewPetDetails = (pet: Pet) => {
  selectedPet.value = pet;
  showDetailsModal.value = true;
};

const viewPhotoFullsize = (photoUrl: string) => {
  selectedPhoto.value = photoUrl;
  showPhotoModal.value = true;
};

const editPet = (pet: Pet) => {
  selectedPet.value = pet;
  showDetailsModal.value = false;
  showEditModal.value = true;
};

const approvePet = async (pet: Pet) => {
  actionLoading.value[pet.id] = true;
  try {
    await api.patch(`/pets/${pet.id}`, {
      publication_status: PublicationStatus.APPROVED,
    });

    pet.publication_status = PublicationStatus.APPROVED;

    notification.show(`Publicação de ${pet.name} aprovada com sucesso!`, 'success');

    if (showDetailsModal.value) {
      showDetailsModal.value = false;
    }
  } catch (error) {
    console.error('Erro ao aprovar pet:', error);
    notification.show('Erro ao aprovar publicação', 'error');
  } finally {
    actionLoading.value[pet.id] = false;
  }
};

const rejectPet = async (pet: Pet) => {
  actionLoading.value[pet.id] = true;
  try {
    await api.patch(`/pets/${pet.id}`, {
      publication_status: PublicationStatus.REJECTED,
    });

    pet.publication_status = PublicationStatus.REJECTED;

    notification.show(`Publicação de ${pet.name} rejeitada com sucesso!`, 'success');

    if (showDetailsModal.value) {
      showDetailsModal.value = false;
    }
  } catch (error) {
    console.error('Erro ao rejeitar pet:', error);
    notification.show('Erro ao rejeitar publicação', 'error');
  } finally {
    actionLoading.value[pet.id] = false;
  }
};

const changeStatusToPending = async (pet: Pet) => {
  actionLoading.value[pet.id] = true;
  try {
    await api.patch(`/pets/${pet.id}`, {
      publication_status: PublicationStatus.PENDING,
    });

    pet.publication_status = PublicationStatus.PENDING;

    notification.show(`Publicação de ${pet.name} marcada como pendente`, 'success');

    if (showDetailsModal.value) {
      showDetailsModal.value = false;
    }
  } catch (error) {
    console.error('Erro ao alterar status para pendente:', error);
    notification.show('Erro ao alterar status para pendente', 'error');
  } finally {
    actionLoading.value[pet.id] = false;
  }
};

const deletePet = (pet: Pet) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Tem certeza que deseja excluir a publicação de ${pet.name}? Esta ação não pode ser desfeita.`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // A função para o .onOk() agora é síncrona.
    // A lógica assíncrona fica encapsulada e é chamada abaixo.

    const performDelete = async () => {
      actionLoading.value[pet.id] = true;
      try {
        await api.delete(`/pets/${pet.id}`);

        const index = pets.value.findIndex((p) => p.id === pet.id);
        if (index !== -1) {
          pets.value.splice(index, 1);
        }

        notification.show(`Publicação de ${pet.name} excluída com sucesso!`, 'success');

        if (showDetailsModal.value) {
          showDetailsModal.value = false;
        }
      } catch (error) {
        console.error('Erro ao excluir pet:', error);
        notification.show('Erro ao excluir publicação', 'error');
      } finally {
        actionLoading.value[pet.id] = false;
      }
    };

    // Usamos `void` para indicar que estamos disparando a função
    // assíncrona intencionalmente sem esperar (await) por seu resultado.
    // Isso satisfaz a regra do ESLint.
    void performDelete();
  });
};

const onPetUpdated = (updatedPet: Pet) => {
  const index = pets.value.findIndex((pet) => pet.id === updatedPet.id);
  if (index !== -1) {
    pets.value[index] = updatedPet;
  }
  showEditModal.value = false;
  notification.show('Pet atualizado com sucesso!', 'success');
};

// Helpers para exibição
const getStatusColor = (status: PublicationStatus) => {
  switch (status) {
    case PublicationStatus.PENDING:
      return 'orange';
    case PublicationStatus.APPROVED:
      return 'green';
    case PublicationStatus.REJECTED:
      return 'red';
    default:
      return 'grey';
  }
};

const getStatusIcon = (status: PublicationStatus) => {
  switch (status) {
    case PublicationStatus.PENDING:
      return 'pending';
    case PublicationStatus.APPROVED:
      return 'check_circle';
    case PublicationStatus.REJECTED:
      return 'cancel';
    default:
      return 'help';
  }
};

const getStatusLabel = (status: PublicationStatus) => {
  switch (status) {
    case PublicationStatus.PENDING:
      return 'Pendente';
    case PublicationStatus.APPROVED:
      return 'Aprovado';
    case PublicationStatus.REJECTED:
      return 'Rejeitado';
    default:
      return 'Desconhecido';
  }
};

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

const formatDate = (date: string) => {
  const now = new Date();
  const petDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - petDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'há 1 dia';
  } else if (diffDays <= 7) {
    return `há ${diffDays} dias`;
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`;
  } else if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? 'há 1 mês' : `há ${months} meses`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? 'há 1 ano' : `há ${years} anos`;
  }
};

// Lifecycle
onMounted(() => {
  void loadPets();
});
</script>

<style scoped>
.object-cover {
  object-fit: cover;
}

.rounded-lg {
  border-radius: 8px;
}
</style>
