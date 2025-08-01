// src/stores/auth.ts

import { defineStore } from 'pinia';
import { api } from 'boot/axios'; // Importa nossa instância configurada do Axios
import type { User } from 'src/types/auth'; // Importa o "contrato" do nosso objeto de usuário

// Define a "forma" do nosso estado de autenticação para o TypeScript
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
  // A função state agora retorna nosso tipo AuthState, garantindo a tipagem correta.
  state: (): AuthState => ({
    user: null, // Começa como nulo, será preenchido após o login ou fetchUser
    isAuthReady: false, // Flag para controlar a verificação inicial de sessão
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
          role: data.role,
        };
      } catch (error) {
        console.log('Usuário não autenticado ou sessão inválida:', error);
        // Se a API retornar um erro (ex: 401), significa que não há sessão válida.
        // Garantimos que o estado 'user' seja nulo.
        this.user = null;
      } finally {
        // Marca que a verificação inicial terminou. Agora o guarda de rotas pode prosseguir.
        this.isAuthReady = true;
      }
    },
  },
});
