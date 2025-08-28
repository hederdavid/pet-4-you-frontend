<template>
  <q-dialog v-model="showModal" persistent @hide="resetForm">
    <q-card class="w-full sm:w-[400px] md:w-[600px] lg:w-[800px] h-[90%]">
      <q-card-section class="row items-center q-pb-none bg-primary text-white">
        <q-avatar color="white" text-color="primary" class="q-mr-md mb-2">
          <q-icon :name="editMode ? 'edit' : 'pets'" />
        </q-avatar>
        <div class="text-h6">{{ editMode ? 'Editar Pet' : 'Publicar Novo Pet' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal" />
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <q-form @submit="submitForm" ref="petForm" class="q-gutter-md">
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

          <div class="">
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

          <div class="">
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
                 
                  if (props.editMode && photosPreviews.length > 0) return true;
               
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
import { AxiosError } from 'axios';
import { useAuthStore } from 'src/stores/auth';
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

      if (newPet.photos && newPet.photos.length > 0) {
        photosPreviews.value = newPet.photos.map((photo) => photo.url);
      }
    }
  },
  { immediate: true },
);

watch(
  () => form.value.photos,
  (newPhotos) => {
    if (newPhotos && newPhotos.length > 0) {
      const filePromises = Array.from(newPhotos).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      void Promise.all(filePromises).then((previews) => {
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

const uploadPhotosToFirebase = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const storage = getStorage();
  const uploadPromises = files.map(async (file) => {
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

    if (form.value.photos && form.value.photos.length > 0) {
      photoUrls = await uploadPhotosToFirebase(Array.from(form.value.photos));
    } else if (props.editMode && props.pet?.photos) {
      photoUrls = props.pet.photos.map((p) => p.url);
    }

    const payload = {
      name: form.value.name,
      description: form.value.description,
      species: form.value.species,
      age: form.value.age,
      size: form.value.size,
      gender: form.value.gender,
      userId: authStore.user?.id || '',
      photos: photoUrls,
    };

    let response;
    if (props.editMode && props.pet) {
      response = await api.patch(`/pets/${props.pet.id}`, payload);
      emit('pet-updated', response.data);
    } else {
      response = await api.post('/pets', payload);
      emit('pet-created', response.data);
    }

    closeModal();
  } catch (error: unknown) {
    console.error('Erro ao salvar pet:', error);
    if (error instanceof AxiosError && error.response?.data?.message) {
      console.error('Erro do servidor:', error.response.data.message);
    }
  } finally {
    saving.value = false;
  }
};
</script>
