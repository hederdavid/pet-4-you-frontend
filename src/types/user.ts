export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  state: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}
