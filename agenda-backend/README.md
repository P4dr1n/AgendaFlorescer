Documentação do Back-end - Agenda Florescer
Bem-vindo à documentação da API do projeto Agenda Florescer. Este documento contém todas as informações necessárias para configurar, executar e contribuir com o projeto de back-end.

1. Visão Geral do Projeto
Este projeto é a API RESTful para a aplicação Agenda Florescer. Ele é responsável por toda a lógica de negócio, gestão de dados e autenticação de utilizadores.

Tecnologias Principais
Node.js: Ambiente de execução do servidor.

TypeScript: Linguagem de programação para um código mais robusto e seguro.

Express.js: Framework para a construção da API e gestão das rotas.

PostgreSQL: Banco de dados relacional para persistência dos dados.

Docker: Ferramenta para executar o banco de dados PostgreSQL num ambiente de desenvolvimento isolado.

Prisma: ORM para interagir com o banco de dados de forma intuitiva e type-safe.

JSON Web Tokens (JWT): Para autenticação e segurança das rotas.

2. Configuração do Ambiente de Desenvolvimento
Siga estes passos para configurar e executar o projeto na sua máquina local.

Pré-requisitos
Node.js (versão 18 ou superior)

Git

Docker Desktop (precisa de estar em execução)

Um cliente de API como Postman ou Insomnia para testar os endpoints.

Passo a Passo
Clonar o Repositório:

Bash

git clone <URL_DO_SEU_REPOSITORIO>
cd agenda-backend
Instalar as Dependências:
Este comando irá instalar todos os pacotes necessários definidos no package.json.

Bash

npm install
Configurar Variáveis de Ambiente:
Crie um arquivo chamado .env na raiz do projeto e cole o seguinte conteúdo. Este arquivo é ignorado pelo Git por segurança.

Snippet de código

# URL de conexão para o banco de dados PostgreSQL no Docker
DATABASE_URL="postgresql://agenda_user:agenda_password@localhost:5432/agenda_florescer?schema=public"

# Segredo para assinar os tokens JWT. Substitua por uma frase longa e segura.
JWT_SECRET="SUA_FRASE_SUPER_SECRETA_E_LONGA_AQUI"
Iniciar o Banco de Dados com Docker:
Com o Docker Desktop em execução, este comando irá criar e iniciar o container do PostgreSQL em segundo plano.

Bash

docker compose up -d
Para verificar se o container está a correr, use docker ps. Você deve ver um container chamado agenda_db.

Aplicar as Migrações do Banco de Dados:
Este comando irá ler o schema.prisma e criar todas as tabelas (User, Servico, Agendamento) no seu banco de dados.

Bash

npx prisma migrate dev
Iniciar o Servidor de Desenvolvimento:
Este comando iniciará a API. O servidor irá reiniciar automaticamente sempre que você salvar uma alteração nos arquivos.

Bash

npm run dev
Se tudo estiver correto, você verá a mensagem: Servidor rodando com sucesso em http://localhost:3000.

3. Arquitetura do Projeto
O código está organizado seguindo o princípio da Separação de Responsabilidades:

src/routes: Define os endpoints da API (ex: /login, /servicos) e os conecta aos seus respectivos controladores.

src/controllers: Responsáveis por receber a requisição (Request) e enviar a resposta (Response). Eles orquestram a lógica, validam os dados de entrada e chamam os serviços.

src/services: Contêm toda a lógica de negócio pura. Interagem com o banco de dados (através do Prisma) e executam as regras da aplicação.

src/middlewares: Funções que interceptam as requisições para realizar tarefas como autenticação (authMiddleware) ou verificação de permissões (adminMiddleware).

prisma/schema.prisma: A "única fonte da verdade" para a estrutura do nosso banco de dados. Todos os modelos e relações são definidos aqui.

4. Documentação da API (Endpoints)
A URL base para todas as requisições é http://localhost:3000.

Autenticação (/api/auth)
Método	Endpoint	Protegido	Descrição	Corpo (Body) da Requisição	Resposta de Sucesso (2xx)
POST	/register	Não	Regista um novo utilizador (com role CLIENTE).	{ "nomeCompleto", "email", "senha", "telefone?" }	201 Created - { id, nomeCompleto, email }
POST	/login	Não	Autentica um utilizador e retorna um token JWT.	{ "email", "senha" }	200 OK - { token }
GET	/me	Sim	Retorna os dados do utilizador autenticado.	-	200 OK - { id, nomeCompleto, role }

Exportar para as Planilhas
Serviços (/api/servicos)
Método	Endpoint	Protegido	Permissão	Descrição	Corpo (Body) da Requisição	Resposta de Sucesso (2xx)
GET	/	Não	-	Lista todos os serviços disponíveis.	-	200 OK - [ { id, nome, ... } ]
POST	/	Sim	ADMIN	Cria um novo serviço.	{ "nome", "preco", "duracao", "descricao?" }	201 Created - { id, nome, ... }
PUT	/:id	Sim	ADMIN	Atualiza um serviço existente.	{ "nome?", "preco?", "duracao?", "descricao?" }	200 OK - { id, nome, ... }
DELETE	/:id	Sim	ADMIN	Apaga um serviço existente.	-	204 No Content

Exportar para as Planilhas
Agendamentos (/api/agendamentos)
Método	Endpoint	Protegido	Permissão	Descrição	Corpo (Body) da Requisição	Resposta de Sucesso (2xx)
GET	/	Sim	CLIENTE	Lista os agendamentos do utilizador logado.	-	200 OK - [ { id, data, status, servico } ]
POST	/	Sim	CLIENTE	Cria um novo agendamento.	{ "servicoId", "data" } (data em formato ISO)	201 Created - { id, data, status, servico }
PATCH	/:id/cancelar	Sim	CLIENTE	Cancela um agendamento do próprio utilizador.	-	200 OK - { id, data, status: "CANCELADO", ... }
GET	/todos	Sim	ADMIN	Lista TODOS os agendamentos do sistema.	-	200 OK - [ { id, data, cliente, servico } ]
PATCH	/:id/status	Sim	ADMIN	Atualiza o status de qualquer agendamento.	{ "status": "CONFIRMADO" }	200 OK - { id, data, status, ... }

Exportar para as Planilhas
5. Gestão do Banco de Dados com Prisma
Fonte da Verdade: O arquivo prisma/schema.prisma define a estrutura do banco de dados.

Para Alterar a Estrutura:

Modifique o schema.prisma (ex: adicione um novo campo a um modelo).

Execute o comando abaixo para aplicar a alteração ao banco de dados:

Bash

npx prisma migrate dev --name "nome_descritivo_da_migracao"
Para Visualizar os Dados:
Use o Prisma Studio, uma interface gráfica para o seu banco de dados.

Bash

npx prisma studio