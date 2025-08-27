<template>
  <q-dialog v-model="showModal" persistent @hide="resetForm">
    <q-card style="min-width: 600px; max-width: 800px">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none bg-primary text-white">
        <q-avatar color="white" text-color="primary" class="q-mr-md mb-2">
          <q-icon :name="editMode ? 'edit' : 'pets'" />
        </q-avatar>
        <div class="text-h6">{{ editMode ? 'Editar Pet' : 'Publicar Novo Pet' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal" />
      </q-card-section>

      <!-- Form -->
      <q-card-section class="q-pa-lg">
        <q-form @submit="submitForm" ref="petForm" class="q-gutter-md">
          <!-- Nome do Pet -->
          <q-input
            v-model="form.name"
            label="Nome do pet *"
            outlined
            :rules="[
              (val) => !!val || 'Nome é obrigatório',
              (val) => val.length >= 2 || 'Nome deve ter pelo menos 2 caracteres',
            ]"
            hint="Digite o nome do seu pet"
          >
            <template v-slot:prepend>
              <q-icon name="pets" />
            </template>
          </q-input>

          <!-- Descrição -->
          <q-input
            v-model="form.description"
            label="Descrição *"
            type="textarea"
            outlined
            rows="4"
            :rules="[
              (val) => !!val || 'Descrição é obrigatória',
              (val) => val.length >= 10 || 'Descrição deve ter pelo menos 10 caracteres',
            ]"
            hint="Conte sobre a personalidade, cuidados especiais, etc."
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>

          <!-- Espécie e Gênero -->
          <div class="row q-gutter-md">
            <div class="col">
              <q-select
                v-model="form.species"
                :options="speciesOptions"
                label="Espécie *"
                outlined
                emit-value
                map-options
                :rules="[(val) => !!val || 'Espécie é obrigatória']"
              >
                <template v-slot:prepend>
                  <q-icon name="category" />
                </template>
              </q-select>
            </div>
            <div class="col">
              <q-select
                v-model="form.gender"
                :options="genderOptions"
                label="Gênero *"
                outlined
                emit-value
                map-options
                :rules="[(val) => !!val || 'Gênero é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon
                    :name="
                      form.gender === 'MALE' ? 'male' : form.gender === 'FEMALE' ? 'female' : 'help'
                    "
                  />
                </template>
              </q-select>
            </div>
          </div>

          <!-- Idade e Porte -->
          <div class="row q-gutter-md">
            <div class="col">
              <q-select
                v-model="form.age"
                :options="ageOptions"
                label="Idade *"
                outlined
                emit-value
                map-options
                :rules="[(val) => !!val || 'Idade é obrigatória']"
              >
                <template v-slot:prepend>
                  <q-icon name="schedule" />
                </template>
              </q-select>
            </div>
            <div class="col">
              <q-select
                v-model="form.size"
                :options="sizeOptions"
                label="Porte *"
                outlined
                emit-value
                map-options
                :rules="[(val) => !!val || 'Porte é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="straighten" />
                </template>
              </q-select>
            </div>
          </div>

          <!-- Upload de Fotos -->
          <div>
            <label class="text-body1 text-weight-medium q-mb-sm block"> Fotos do pet * </label>
            <q-file
              v-model="form.photos"
              label="Selecionar fotos"
              outlined
              multiple
              accept="image/*"
              max-files="5"
              :rules="[
                (val) => {
                  // No modo de edição, se já existem fotos (previews) não é obrigatório adicionar novas
                  if (props.editMode && photosPreviews.length > 0) return true;
                  // No modo de criação ou edição sem fotos existentes, é obrigatório
                  return (!!val && val.length > 0) || 'É obrigatório enviar pelo menos uma foto';
                },
                (val) => !val || val.length <= 5 || 'Máximo 5 fotos permitidas',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="photo_camera" />
              </template>
              <template v-slot:hint>
                {{
                  props.editMode && photosPreviews.length > 0
                    ? 'Selecione novas fotos para substituir as existentes (opcional)'
                    : 'Selecione até 5 fotos do seu pet (formatos: JPG, PNG) - Obrigatório'
                }}
              </template>
            </q-file>

            <!-- Preview das fotos -->
            <div v-if="photosPreviews.length > 0" class="row q-gutter-sm q-mt-md">
              <div v-for="(preview, index) in photosPreviews" :key="index" class="relative">
                <img
                  :src="preview"
                  class="w-20 h-20 object-cover rounded border"
                  style="width: 80px; height: 80px"
                />
                <q-btn
                  round
                  size="xs"
                  color="negative"
                  icon="close"
                  class="absolute -top-2 -right-2"
                  @click="removePhoto(index)"
                />
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-lg bg-grey-1">
        <q-btn flat label="Cancelar" @click="closeModal" class="q-px-xl" />
        <q-btn
          color="primary"
          :label="editMode ? 'Atualizar' : 'Publicar'"
          @click="submitForm"
          :loading="saving"
          unelevated
          class="q-px-xl"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Pet } from 'src/types/pet';
import { PetSpecies, PetAge, PetSize, PetGender, type PetForm } from 'src/types/pet';
import { api } from 'src/boot/axios';
import { useAuthStore } from 'src/stores/auth';
// 1. IMPORTE AS FUNÇÕES DO FIREBASE STORAGE
// (Certifique-se de que seu projeto frontend tenha o firebase instalado e configurado)
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Props {
  modelValue: boolean;
  pet?: Pet | null;
  editMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  pet: null,
  editMode: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'pet-created': [pet: Pet];
  'pet-updated': [pet: Pet];
}>();

const authStore = useAuthStore();

const petForm = ref();
const saving = ref(false);
const photosPreviews = ref<string[]>([]);

// O tipo do form.photos agora é File[] para o input, mas enviaremos string[] para a API
const form = ref<PetForm>({
  name: '',
  description: '',
  species: PetSpecies.DOG,
  age: PetAge.ADULT,
  size: PetSize.MEDIUM,
  gender: PetGender.MALE,
  photos: [],
});

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Opções para os selects
const speciesOptions = [
  { label: 'Cachorro', value: PetSpecies.DOG, icon: 'pets' },
  { label: 'Gato', value: PetSpecies.CAT, icon: 'pets' },
  { label: 'Pássaro', value: PetSpecies.BIRD, icon: 'flight' },
];

const genderOptions = [
  { label: 'Macho', value: PetGender.MALE, icon: 'male' },
  { label: 'Fêmea', value: PetGender.FEMALE, icon: 'female' },
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

// Watch para carregar dados quando está editando
watch(
  () => props.pet,
  (newPet) => {
    if (newPet && props.editMode) {
      form.value = {
        name: newPet.name,
        description: newPet.description,
        species: newPet.species,
        age: newPet.age,
        size: newPet.size,
        gender: newPet.gender,
        photos: [], // Começa vazio, pois o usuário pode querer adicionar novas fotos
      };

      // Carregar previews das fotos existentes
      if (newPet.photos && newPet.photos.length > 0) {
        // Assume que as URLs do backend já estão completas e corretas
        photosPreviews.value = newPet.photos.map((photo) => photo.url);
      }
    }
  },
  { immediate: true },
);

// Watch para gerar previews das novas fotos selecionadas
watch(
  () => form.value.photos,
  (newPhotos) => {
    if (newPhotos && newPhotos.length > 0) {
      const newPreviews: string[] = [];
      const filePromises = Array.from(newPhotos).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(filePromises).then((previews) => {
        photosPreviews.value = previews;
      });
    } else if (!props.editMode || (props.editMode && !props.pet?.photos?.length)) {
      photosPreviews.value = [];
    }
  },
);

const removePhoto = (index: number) => {
  photosPreviews.value.splice(index, 1);
  if (form.value.photos) {
    const filesArray = Array.from(form.value.photos);
    filesArray.splice(index, 1);
    form.value.photos = filesArray;
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    species: PetSpecies.DOG,
    age: PetAge.ADULT,
    size: PetSize.MEDIUM,
    gender: PetGender.MALE,
    photos: [],
  };
  photosPreviews.value = [];
  if (petForm.value) {
    petForm.value.resetValidation();
  }
};

const closeModal = () => {
  resetForm();
  showModal.value = false;
};

// Nova função para fazer upload das imagens para o Firebase Storage
const uploadPhotosToFirebase = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const storage = getStorage();
  const uploadPromises = files.map(async (file) => {
    // Cria um nome de arquivo único para evitar conflitos
    const uniqueFileName = `pets/${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name}`;
    const fileRef = storageRef(storage, uniqueFileName);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  });

  return Promise.all(uploadPromises);
};

const submitForm = async () => {
  const valid = await petForm.value?.validate();
  if (!valid) return;

  saving.value = true;

  try {
    let photoUrls: string[] = [];

    // 1. Faça o upload das novas fotos (se houver) para o Firebase Storage
    if (form.value.photos && form.value.photos.length > 0) {
      photoUrls = await uploadPhotosToFirebase(Array.from(form.value.photos));
    } else if (props.editMode && props.pet?.photos) {
      // Se estiver editando sem novas fotos, mantenha as URLs antigas
      photoUrls = props.pet.photos.map((p) => p.url);
    }

    // 2. Monte o payload JSON para enviar ao backend
    const payload = {
      name: form.value.name,
      description: form.value.description,
      species: form.value.species,
      age: form.value.age,
      size: form.value.size,
      gender: form.value.gender,
      userId: authStore.user?.id || '',
      photos: photoUrls, // Envia o array de URLs
    };

    let response;
    if (props.editMode && props.pet) {
      // 3. Envie o payload JSON via PATCH - sem cabeçalhos extras
      response = await api.patch(`/pets/${props.pet.id}`, payload);
      emit('pet-updated', response.data);
    } else {
      // 4. Envie o payload JSON via POST - sem cabeçalhos extras
      response = await api.post('/pets', payload);
      emit('pet-created', response.data);
    }

    closeModal();
  } catch (error: any) {
    console.error('Erro ao salvar pet:', error);
    if (error.response?.data?.message) {
      console.error('Erro do servidor:', error.response.data.message);
    }
  } finally {
    saving.value = false;
  }
};
</script>
