const mongoose = require('mongoose');
const Document = require('./Document');
const express = require('express');
require('dotenv').config();

// Criação de uma instância do aplicativo Express
const app = express();

// Leitura de variáveis de ambiente para as credenciais do MongoDB
const mongodbUser = process.env.MONGODB_USER;
const mongodbPassword = process.env.MONGODB_PASSWORD;

// Conexão com o MongoDB usando as credenciais fornecidas
mongoose.connect(`mongodb+srv://${mongodbUser}:${mongodbPassword}@cluster0.ro9li70.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`)
    .then(() => {
        console.log('Conexão com o MongoDB estabelecida com sucesso');
    })
    .catch((error) => {
        console.error('Erro na conexão com o MongoDB:', error);
    });

// Configuração do servidor de WebSocket com Socket.IO
const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const defaultValue = '';

// Tratamento de eventos de conexão de clientes WebSocket
io.on('connection', socket => {
    console.log('new user connected');

    // Tratamento do evento 'get-document' para carregar ou criar um documento
    socket.on('get-document', async documentId => {
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);

        // Tratamento do evento 'send-changes' para enviar alterações de texto aos clientes
        socket.on('send-changes', delta => {
            // Envia as alterações apenas para os clientes no mesmo documento
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        // Tratamento do evento 'save-document' para salvar o conteúdo do documento
        socket.on('save-document', async data => {
            await Document.findByIdAndUpdate(documentId, { data });
        });
    });
});

// Função para encontrar ou criar um documento com base em seu ID
async function findOrCreateDocument(id) {
    if (id == null) return;

    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: defaultValue });
}

// TODO: Implementar tela dasboard para exibir os documentos
// Define a rota "/documents" para buscar documentos

app.get('/documents', async (req, res) => {
    try {
        console.log('Rota /documents foi acessada.');
        const documents = await Document.find();
        console.log('Documentos encontrados:', documents);
        if (documents) {
            res.json(documents);
        } else {
            res.status(404).json({ error: 'Nenhum documento encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao buscar documentos:', error);
        res.status(500).json({ error: 'Erro ao buscar documentos.' });
    }
});

// Inicia o servidor Express na porta desejada
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Servidor está ouvindo na porta ${PORT}`);
});
