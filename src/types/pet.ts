import type { User } from "./user";

export enum PetStatus {
  AVAILABLE = 'AVAILABLE',
  ADOPTED = 'ADOPTED',
}

export enum PetSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
}

export enum PetAge {
  PUPPY = 'PUPPY',
  ADULT = 'ADULT',
  SENIOR = 'SENIOR',
}

export enum PublicationStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

export interface Photo {
  id: string;
  url: string;
  petId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Pet {
  id: string;
  name: string;
  description: string;
  species: PetSpecies;
  age: PetAge;
  size: PetSize;
  gender: PetGender;
  pet_status: PetStatus;
  publication_status: PublicationStatus;
  publication_date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  userId: string;
  photos: Photo[];
  user?: User;
}

export interface PetForm {
  name: string;
  description: string;
  species: PetSpecies;
  age: PetAge;
  size: PetSize;
  gender: PetGender;
  photos: File[];
}
