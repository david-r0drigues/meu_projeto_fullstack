# Projeto: Gerenciador de Usuários

Aplicação Full Stack para o cadastro, visualização, edição e exclusão de usuários, desenvolvida como projeto para certificação.

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

### Frontend
- ReactJS
- Axios
- (Pode adicionar aqui a biblioteca de estilo, ex: CSS puro, TailwindCSS)

## Como Rodar o Projeto

### Backend
1. Navegue para a pasta `backend-node`.
2. Instale as dependências: `npm install`.
3. Configure o arquivo `.env` com a URL do seu banco de dados.
4. Rode as migrações do Prisma: `npx prisma migrate dev`.
5. Inicie o servidor: `npm start` (ou `node index.js`).

### Frontend
1. Navegue para a pasta `frontend-react`.
2. Instale as dependências: `npm install`.
3. Inicie a aplicação: `npm run dev`.
4. Abra `http://localhost:5173` (ou a porta indicada pelo Vite) no seu navegador.

## Endpoints da API

- `POST /usuarios`: Cadastra um novo usuário.
- `GET /usuarios`: Lista todos os usuários.
- `GET /usuarios/:id`: Obtém um usuário específico.
- `PUT /usuarios/:id`: Atualiza um usuário.
- `DELETE /usuarios/:id`: Exclui um usuário.