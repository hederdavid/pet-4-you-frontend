// src/boot/firebase.ts
import { boot } from 'quasar/wrappers';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase a partir das variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Para evitar reinicialização em HMR (Hot Module Replacement)
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const firebaseApp = getApp();
const firebaseAuth = getAuth(firebaseApp);

// Adiciona a instância do Auth no protótipo do Vue para acesso global
export default boot(({ app }) => {
  app.config.globalProperties.$firebaseAuth = firebaseAuth;
});

// Exporta para uso em scripts <script setup>
export { firebaseAuth };