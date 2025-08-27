// src/boot/firebase.ts
import { initializeApp } from 'firebase/app';
import { boot } from 'quasar/wrappers';

// Cole a configuração do seu projeto Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyAicqtf2InjWCQ0-w3lI-fAKP2cdxsVDDk",
  authDomain: "backend-pet4you.firebaseapp.com",
  projectId: "backend-pet4you",
  storageBucket: "backend-pet4you.firebasestorage.app",
  messagingSenderId: "955360629747",
  appId: "1:955360629747:web:7a42f29cabde7fa95db886",
  measurementId: "G-1KBDPDKKYM"
};

// Inicializa o Firebase
initializeApp(firebaseConfig);

export default boot(() => {
  // Este arquivo de boot garante que o Firebase seja inicializado
  // antes que qualquer outra parte do seu app tente usá-lo.
});