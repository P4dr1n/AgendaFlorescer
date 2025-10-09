# AgendaFlorescer
Um aplicativo de agendamento para uma empresa de estética naturalista e paliativa

## Funcionalidades Implementadas

- **Fluxo de Autenticação Completo:**
  - Tela de Login (`app/login.tsx`)
  - Tela de Registro (`app/register.tsx`)
- **Navegação Funcional:**
  - Navegação entre as telas de Login e Registro.
  - Acesso à área principal do aplicativo (Tela Home) após o login.
  - Função de Logout na Tela Home para retornar ao Login.
- **Estrutura de Navegação Híbrida:**
  - Navegação em "Pilha" (Stack) para o fluxo de autenticação.
  - Navegação em "Abas" (Tabs) para a área principal do aplicativo.

### Pré-requisitos

- **Node.js (versão LTS):** Essencial para executar o projeto.
- **App Expo Go:** Instalado no seu celular (Android ou iOS) para visualização.

### Passos

1.  **Instale todas as dependências do projeto:**
    Abra o terminal na raiz do projeto e execute o comando abaixo. Ele lerá o arquivo `package.json` e instalará tudo o que é necessário, incluindo `expo-linear-gradient` e `@expo/vector-icons`.

    ```bash
    npm install
    ```

2.  **Inicie o servidor de desenvolvimento:**
    Após a instalação, execute o seguinte comando para iniciar o projeto.

    ```bash
    npx expo start
    ```

3.  **Visualize no seu celular:**
    Abra o aplicativo Expo Go e escaneie o QR Code que apareceu no seu terminal.

**A regra é simples: um arquivo `.tsx` na pasta `app` cria uma nova página/rota no aplicativo.**

Nossa estrutura atual é a seguinte:
app/
├── _layout.tsx      # Layout Raiz: Gerencia a navegação principal (Stack) entre autenticação e a área logada.
├── index.tsx        # Ponto de entrada: Apenas redireciona o usuário para /login.
├── login.tsx        # Tela e rota de Login.
├── register.tsx     # Tela e rota de Registro.
└── (tabs)/          # Grupo de rotas que compartilharão o layout de Abas.
    ├── _layout.tsx  # Layout das Abas: Configura a barra de abas e quais telas ela exibe.
    └── home.tsx     # Tela e rota Home (principal). É a primeira aba exibida após o login.