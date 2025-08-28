# 🐾 Pet-4-You Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Quasar-16B7FB?style=for-the-badge&logo=quasar&logoColor=white" alt="Quasar" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<p align="center">
  <a href="https://pet-4-you-frontend.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Ver_Demo-FF6B35?style=for-the-badge&logoColor=white" alt="Ver Demo" />
  </a>
  <a href="https://github.com/hederdavid/pet-4-you-backend" target="_blank">
    <img src="https://img.shields.io/badge/🔗_Backend-1976D2?style=for-the-badge&logoColor=white" alt="Backend" />
  </a>
</p>

## 📋 Sobre o Projeto

**Pet-4-You** é uma plataforma web moderna e responsiva que conecta pessoas que desejam adotar animais de estimação com aqueles que precisam encontrar um novo lar para seus pets. O frontend foi desenvolvido com foco na experiência do usuário, oferecendo uma interface intuitiva e acessível para facilitar o processo de adoção responsável.

### 🎯 O que o projeto faz

- **Interface de Usuário Moderna**: Design responsivo e intuitivo para todos os dispositivos
- **Sistema de Autenticação**: Login e registro seguros com gerenciamento de sessão
- **Catálogo de Pets**: Visualização de pets disponíveis com filtros avançados
- **Perfil do Usuário**: Gerenciamento completo de dados pessoais e preferências
- **Gestão de Pets**: Interface para cadastro, edição e gerenciamento de pets
- **Sistema Admin**: Painel administrativo para aprovação e moderação de conteúdo
- **Upload de Fotos**: Interface drag-and-drop para upload de múltiplas fotos
- **Notificações**: Sistema de feedback em tempo real para ações do usuário

### 💡 Por que foi construído

Este projeto frontend complementa a API Pet-4-You, nascendo da necessidade de criar uma interface acessível e moderna que torne o processo de adoção mais humano e eficiente. Os principais objetivos incluem:

- **Facilitar o acesso**: Interface intuitiva para usuários de todas as idades
- **Responsividade**: Funciona perfeitamente em celulares, tablets e desktops
- **Experiência visual**: Design atrativo que incentiva a adoção responsável
- **Acessibilidade**: Componentes otimizados para diferentes necessidades
- **Performance**: Carregamento rápido e navegação fluida

## 🚀 Tecnologias Utilizadas

### Frontend Core

- **[Vue 3](https://vuejs.org/)** - Framework JavaScript progressivo
- **[Quasar Framework](https://quasar.dev/)** - Framework Vue.js multiplataforma
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Vite](https://vitejs.dev/)** - Build tool rápido e moderno

### UI/UX & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Quasar Components](https://quasar.dev/components)** - Componentes UI prontos
- **Material Design Icons** - Ícones consistentes e modernos

### Estado & Roteamento

- **[Pinia](https://pinia.vuejs.org/)** - Store de estado para Vue 3
- **[Vue Router](https://router.vuejs.org/)** - Roteador oficial do Vue.js

### Requisições & Comunicação

- **[Axios](https://axios-http.com/)** - Cliente HTTP para requisições
- **JWT Authentication** - Autenticação com tokens

### Desenvolvimento & Qualidade

- **[ESLint](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** - Formatador de código
- **[Composition API](https://vuejs.org/guide/introduction.html)** - API moderna do Vue 3

## 🏗️ Arquitetura do Sistema

```
src/
├── components/          # Componentes reutilizáveis
│   ├── modals/         # Modais específicos
│   ├── cards/          # Cards de exibição
│   └── forms/          # Componentes de formulário
├── layouts/            # Layouts da aplicação
│   └── MainLayout.vue  # Layout principal
├── pages/              # Páginas da aplicação
│   ├── auth/          # Páginas de autenticação
│   ├── pets/          # Páginas relacionadas a pets
│   └── admin/         # Páginas administrativas
├── stores/             # Stores do Pinia
│   ├── auth.ts        # Store de autenticação
│   ├── pets.ts        # Store de pets
│   └── user.ts        # Store do usuário
├── types/              # Definições de tipos TypeScript
│   ├── pet.ts         # Tipos relacionados a pets
│   └── user.ts        # Tipos de usuário
├── utils/              # Utilitários e helpers
│   ├── api.ts         # Configurações da API
│   ├── validation.ts  # Validações de formulário
│   └── formatting.ts  # Formatação de dados
└── router/             # Configuração de rotas
    ├── index.ts       # Configuração principal
    └── routes.ts      # Definição das rotas
```

## 📚 Funcionalidades

### 🎨 Interface do Usuário

- **Design Responsivo**: Adaptado para mobile, tablet e desktop
- **Tema Personalizado**: Cores e estilos consistentes da marca Pet4You
- **Navegação Intuitiva**: Menu e breadcrumbs para fácil orientação
- **Loading States**: Feedback visual durante carregamentos

### 🔐 Autenticação & Autorização

- **Login/Registro**: Interface moderna com validação em tempo real
- **Gerenciamento de Sessão**: Tokens JWT com renovação automática
- **Níveis de Acesso**: Interface diferenciada para usuários e admins
- **Perfil do Usuário**: Edição completa de dados pessoais

### 🐕 Catálogo de Pets

- **Galeria Visual**: Cards atraentes com fotos dos pets
- **Filtros Avançados**: Por espécie, porte, idade, localização
- **Detalhes Completos**: Página dedicada para cada pet
- **Sistema de Busca**: Pesquisa rápida por nome ou características

### 📝 Gerenciamento de Pets

- **Formulário Intuitivo**: Interface step-by-step para cadastro
- **Upload de Fotos**: Drag-and-drop com preview das imagens
- **Edição Fácil**: Modificação rápida de informações
- **Status de Publicação**: Acompanhamento do status de aprovação

### 👨‍💼 Painel Administrativo

- **Dashboard Completo**: Visão geral de pets e usuários
- **Moderação de Conteúdo**: Aprovação/rejeição de pets
- **Gestão de Usuários**: Controle de acessos e permissões
- **Relatórios**: Estatísticas de uso da plataforma

## ⚙️ Como Instalar e Rodar

### Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Git**
- API Pet-4-You rodando (backend)

### 1. Clone o repositório

```bash
git clone https://github.com/hederdavid/pet-4-you-frontend.git
cd pet-4-you-frontend
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Application
VITE_APP_TITLE="Pet4You - Adoção Responsável"
VITE_APP_DESCRIPTION="Plataforma para adoção de pets"

# Features
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_SOCIAL_LOGIN=false
```

### 4. Inicie o servidor de desenvolvimento

```bash
# Modo desenvolvimento (hot-reload)
npm run dev
# ou
yarn dev

# Modo desenvolvimento com preview
npm run preview
# ou
yarn preview
```

A aplicação estará disponível em `http://localhost:9000`

### 5. Build para produção

```bash
npm run build
# ou
yarn build
```

## 📱 Funcionalidades por Dispositivo

### 📱 Mobile

- **Menu Hamburger**: Navegação otimizada para toque
- **Cards Responsivos**: Layout adaptado para telas pequenas
- **Formulários Touch-friendly**: Campos otimizados para dispositivos móveis
- **Imagens Otimizadas**: Carregamento eficiente de fotos

### 💻 Desktop

- **Layout Expandido**: Aproveitamento total do espaço da tela
- **Sidebar Fixa**: Navegação sempre visível
- **Multi-column**: Exibição de múltiplas colunas de conteúdo
- **Hover Effects**: Interações visuais aprimoradas

### 📊 Tablet

- **Layout Híbrido**: Combinação das melhores características mobile/desktop
- **Navegação Adaptativa**: Menu que se ajusta ao tamanho da tela
- **Grid Responsivo**: Otimização automática de layouts

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run preview          # Preview da build de produção

# Build e Deploy
npm run build            # Build para produção
npm run build:pwa        # Build com PWA habilitado

# Qualidade de Código
npm run lint             # Executa o linter
npm run format           # Formata o código com Prettier
npm run type-check       # Verificação de tipos TypeScript

# Testes (quando implementados)
npm run test:unit        # Testes unitários
npm run test:e2e         # Testes end-to-end
npm run test:coverage    # Coverage dos testes
```

## 🎨 Guia de Estilo

### Cores da Marca

```css
/* Cores Primárias */
--primary: #1976d2 /* Azul Pet4You */ --secondary: #9c27b0 /* Roxo */ --accent: #ff6b35
  /* Laranja */ /* Cores de Estado */ --positive: #21ba45 /* Verde - Sucesso */ --negative: #c10015
  /* Vermelho - Erro */ --warning: #f2c037 /* Amarelo - Aviso */ --info: #31ccec
  /* Azul Claro - Informação */;
```

### Tipografia

- **Fonte Principal**: Roboto (incluída no Quasar)
- **Tamanhos**: Sistema de escala responsiva
- **Pesos**: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)

### Componentes

- **Bordas**: Radius padrão de 12px para suavidade
- **Sombras**: Elevação sutil para profundidade
- **Animações**: Transições suaves de 300ms

## 🔧 Configuração Avançada

### Personalização do Quasar

```javascript
// quasar.config.js
module.exports = {
  framework: {
    config: {
      brand: {
        primary: '#1976D2',
        secondary: '#9C27B0',
        accent: '#FF6B35',
      },
    },
  },
};
```

### Configuração do Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pet-blue': '#1976D2',
        'pet-orange': '#FF6B35',
      },
    },
  },
};
```

## 🚀 Deploy

### Netlify (Recomendado)

```bash
# Build
npm run build

# Deploy manual
netlify deploy --prod --dir=dist/spa
```

### Vercel

```bash
npm run build
vercel --prod
```

### Servidor Próprio

```bash
# Build
npm run build

# Servir arquivos estáticos da pasta dist/spa
```

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
   ```bash
   git checkout -b feature/MinhaFeature
   ```
4. **Desenvolva** e teste suas alterações
5. **Commit** suas mudanças
   ```bash
   git commit -m 'feat: adiciona MinhaFeature'
   ```
6. **Push** para sua branch
   ```bash
   git push origin feature/MinhaFeature
   ```
7. **Abra** um Pull Request

### Padrões de Código

- Use **Composition API** para novos componentes
- Mantenha **TypeScript** strict ativado
- Siga as **convenções do Vue.js Style Guide**
- Escreva **commits semânticos**

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE). Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Heder David**

- Portfolio: [heder.tech](https://heder.tech)
- GitHub: [@hederdavid](https://github.com/hederdavid)
- LinkedIn: [Heder David](https://linkedin.com/in/hederdavid)

## 🔗 Links Relacionados

- **Backend**: [Pet-4-You API](https://github.com/hederdavid/pet-4-you-backend)
- **Documentação da API**: Em desenvolvimento
- **Deploy de Demonstração**: [https://pet-4-you-frontend.vercel.app/](https://pet-4-you-frontend.vercel.app/)

---

<p align="center">
  Feito com ❤️ e 🐾 por <strong>Heder David</strong>
</p>

<p align="center">
  <em>"Tecnologia a serviço do amor aos animais"</em>
</p>
