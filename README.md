# Google Docs Clone

Bem-vindo ao Google Docs Clone, uma aplicação que permite a edição colaborativa de documentos em tempo real. Este projeto consiste em um cliente (front-end) e um servidor (back-end).

## Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter o Node.js instalado em seu sistema e um banco de dados MongoDB configurado. Você pode baixar o Node.js em [nodejs.org](https://nodejs.org/) e configurar o MongoDB em [mongodb.com](https://cloud.mongodb.com/).

## Como Iniciar o Projeto

Siga estas etapas para iniciar o projeto completo:

1. Clone este repositório:

   ```bash
   git clone https://github.com/Sirhankey/google-docs-ts-app.git
   
2. Configure as variáveis de ambiente para o servidor criando um arquivo .env na raiz do diretório do servidor com as informações do MongoDB:

    ```bash
    MONGODB_USER=
    MONGODB_PASSWORD=

3. Navegue até o diretório do cliente:

   ```bash
    cd google-docs-clone/client

4. Instale as dependências do cliente:

    ```bash
    npm install
    
5. Inicie o cliente:

    ```bash
    "start": "react-scripts start"

6. Navegue até o diretório do servidor:

    ```bash
    cd ../server

7. Instale as dependências do servidor:

    ```bash
    npm install
    
8. Inicie o servidor:

    ```bash
    "devStart": "nodemon server.js"

Após iniciar o projeto, você pode acessar o documento no seu navegador em http://localhost:3000.

Criar um Novo Documento
Para criar um novo documento, basta acessar a rota http://localhost:3000

O novo documento será criado com um ID exclusivo.

Compartilhe o ID do documento com outras pessoas para colaborar em tempo real.

Entrar em um Documento Existente
Na página inicial, insira o ID de um documento existente após http://localhost:3000/documents/{id-documento}


Você será redirecionado para o documento existente e poderá colaborar com outros usuários em tempo real.