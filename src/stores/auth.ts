import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { User } from 'src/types/user';
// 1. IMPORTE AS FUNÇÕES DE AUTENTICAÇÃO DO FIREBASE
import { getAuth, signInWithCustomToken, signOut } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAuthReady: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthReady: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    /**
     * Ação privada para autenticar no Firebase com um token customizado do backend.
     * @private
     */
    async _authenticateWithFirebase() {
      if (!this.user) {
        console.error('Tentativa de autenticar no Firebase sem um usuário logado no backend.');
        return;
      }
      try {
        // Pega o token customizado do nosso backend seguro
        const response = await api.get('/auth/firebase-token');
        const firebaseToken = response.data.token;

        // Usa o token para fazer login silencioso no SDK do Firebase no frontend
        const auth = getAuth();
        await signInWithCustomToken(auth, firebaseToken);
        console.log('Sessão do Firebase sincronizada com sucesso.');
      } catch (error) {
        console.error('Falha ao sincronizar a sessão com o Firebase:', error);
      }
    },

    async login(credentials: LoginCredentials) {
      try {
        const response = await api.post('/auth/login', credentials);
        this.user = response.data.user;

        // 2. APÓS O LOGIN BEM-SUCEDIDO, SINCRONIZA A SESSÃO COM O FIREBASE
        await this._authenticateWithFirebase();

        return true;
      } catch (error) {
        this.user = null;
        console.error('Falha no login:', error);
        return false;
      }
    },

    async loginWithFirebase(token: string) {
      try {
        await api.post('/auth/firebase-login', { token });
        // fetchUser já irá chamar a autenticação do Firebase
        await this.fetchUser();
      } catch (error) {
        console.error('Erro no login com Firebase no backend:', error);
        throw error;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout');

        // 3. FAZ O LOGOUT DO FIREBASE TAMBÉM
        const auth = getAuth();
        await signOut(auth);
      } catch (error) {
        console.error('Erro na chamada de logout da API:', error);
      } finally {
        this.user = null;
      }
    },

    async fetchUser() {
      if (this.isAuthReady) return;

      try {
        const { data } = await api.get('/auth/profile');
        this.user = {
          id: data.userId,
          name: data.name,
          email: data.email,
          city: data.city || '',
          state: data.state || '',
          phone: data.phone || '',
          role: data.role,
          createdAt: data.createdAt,
        };

        // 4. SE O USUÁRIO TINHA UMA SESSÃO VÁLIDA, SINCRONIZA COM O FIREBASE
        await this._authenticateWithFirebase();
      } catch (error: unknown) {
        console.log(error)
        this.user = null;
      } finally {
        this.isAuthReady = true;
      }
    },

    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData };
      }
    },
  },
});
