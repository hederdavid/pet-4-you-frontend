import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { User } from 'src/types/user';

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

  // Getters são como "propriedades computadas" para a sua store.
  // Eles são reativos e cacheados.
  getters: {
    isLoggedIn: (state) => !!state.user, // Um jeito fácil de verificar se há um usuário
    isAdmin: (state) => state.user?.role === 'ADMIN', // Verifica a permissão de admin
  },

  // Actions são as funções que podem modificar o estado (state).
  // É onde fica a lógica de negócio e as chamadas de API.
  actions: {
    /**
     * Tenta autenticar o usuário no backend.
     * @param credentials - O objeto com email, password, etc.
     * @returns {Promise<boolean>} - Retorna `true` se o login for bem-sucedido, `false` caso contrário.
     */
    async login(credentials: LoginCredentials) {
      try {
        // Chama a API de login. O backend vai nos retornar os dados do usuário
        // e setar os cookies HttpOnly no navegador.
        const response = await api.post('/auth/login', credentials);

        // Se a chamada for bem-sucedida, atualizamos o estado 'user' com os dados recebidos.
        this.user = response.data.user;

        // Avisa o componente que chamou a função que o login deu certo.
        return true;
      } catch (error) {
        // Se a API retornar um erro (ex: 401), limpamos qualquer estado de usuário antigo.
        this.user = null;
        console.error('Falha no login:', error);

        // Avisa o componente que o login falhou.
        return false;
      }
    },

    async loginWithFirebase(token: string) {
      try {
        await api.post('/auth/firebase-login', { token });
        await this.fetchUser(); // Atualiza o estado do usuário
      } catch (error) {
        console.error('Erro no login com Firebase no backend:', error);
        throw error;
      }
    },

    /**
     * Desloga o usuário, limpando o estado e os cookies no backend.
     */
    async logout() {
      try {
        // Chama a API de logout para que o backend possa invalidar o refresh_token no banco
        // e enviar os comandos para limpar os cookies do navegador.
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Erro na chamada de logout da API:', error);
      } finally {
        // Independentemente do resultado da API, limpamos o estado do usuário no frontend.
        this.user = null;
      }
    },

    /**
     * Verifica se existe uma sessão de usuário ativa (um cookie válido)
     * e atualiza o estado da store. É chamada no carregamento da aplicação.
     */
    async fetchUser() {
      // Se a verificação já foi feita, não faz de novo.
      if (this.isAuthReady) return;

      try {
        // Chama a rota /profile. O navegador enviará o cookie de acesso automaticamente.
        const { data } = await api.get('/auth/profile');

        // Se a API retornar sucesso (200 OK), significa que o cookie é válido.
        // Populamos o estado 'user' com os dados recebidos.
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
      } catch (error) {
        this.user = null;
      } finally {
        this.isAuthReady = true;
      }
    },

    /**
     * Atualiza os dados do usuário no estado local
     * @param userData - Dados parciais do usuário para atualizar
     */
    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData };
      }
    },
  },
});
