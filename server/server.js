const mongoose = require('mongoose');
const Document = require('./Document');

// mongoose.connect('mongodb://localhost:27017/google-docs-clone', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// },
//     e => console.log(e));

mongoose.connect('mongodb://localhost:27017/google-docs-clone')
    .then(() => {
        console.log('Conexão com o MongoDB estabelecida com sucesso');
    })
    .catch((error) => {
        console.error('Erro na conexão com o MongoDB:', error);
    });

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const defaultValue = '';

io.on('connection', socket => {
    console.log('new user connected');

    socket.on('get-document', async documentId => {
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);
        socket.on('send-changes', delta => {
            // socket.broadcast.emit('receive-changes', delta);
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });
        
        socket.on('save-document', async data => {
            await Document.findByIdAndUpdate(documentId, { data });
        });
    });
})

async function findOrCreateDocument(id) {
    if (id == null) return;

    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: defaultValue });
}