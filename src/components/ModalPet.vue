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
            <label class="text-body1 text-weight-medium q-mb-sm block"> Fotos do pet </label>
            <q-file
              v-model="form.photos"
              label="Selecionar fotos"
              outlined
              multiple
              accept="image/*"
              max-files="5"
              :rules="[(val) => !val || val.length <= 5 || 'Máximo 5 fotos permitidas']"
            >
              <template v-slot:prepend>
                <q-icon name="photo_camera" />
              </template>
              <template v-slot:hint>
                Selecione até 5 fotos do seu pet (formatos: JPG, PNG)
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
import {
  PetSpecies,
  PetAge,
  PetSize,
  PetGender,
  type PetForm,
} from 'src/types/pet';
import { api } from 'src/boot/axios';
import { useAuthStore } from 'src/stores/auth';

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

// Watch para carregar dados quando editing
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
        photos: [],
      };

      // Carregar previews das fotos existentes
      if (newPet.photos && newPet.photos.length > 0) {
        photosPreviews.value = newPet.photos.map((photo) => photo.url);
      }
    }
  },
  { immediate: true },
);

// Watch para gerar previews das fotos
watch(
  () => form.value.photos,
  (newPhotos) => {
    if (newPhotos && newPhotos.length > 0) {
      photosPreviews.value = [];
      Array.from(newPhotos).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            photosPreviews.value.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (!props.editMode) {
      photosPreviews.value = [];
    }
  },
);

const removePhoto = (index: number) => {
  photosPreviews.value.splice(index, 1);

  if (form.value.photos && form.value.photos.length > 0) {
    const filesArray = Array.from(form.value.photos);
    filesArray.splice(index, 1);

    // Atualizar o array de fotos
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
};

const closeModal = () => {
  resetForm();
  showModal.value = false;
};

const submitForm = async () => {
  const valid = await petForm.value?.validate();
  if (!valid) return;

  saving.value = true;

  try {
    const formData = new FormData();

    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('species', form.value.species);
    formData.append('age', form.value.age);
    formData.append('size', form.value.size);
    formData.append('gender', form.value.gender);
    formData.append('userId', authStore.user?.id || '');

    if (form.value.photos && form.value.photos.length > 0) {
      Array.from(form.value.photos).forEach((file) => {
        formData.append(`photos`, file);
      });
    }
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    let response;
    if (props.editMode && props.pet) {
      response = await api.patch(`/pets/${props.pet.id}`, formData);
      emit('pet-updated', response.data);
    } else {
      response = await api.post('/pets', formData);
      emit('pet-created', response.data);
    }

    closeModal();
  } catch (error) {
    console.error('Erro ao salvar pet:', error);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.block {
  display: block;
}
</style>
