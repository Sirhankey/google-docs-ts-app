import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Interface para representar um documento
interface Document {
    id: number;
    title: string;
}

function Dashboard() {
    // Estado para armazenar a lista de documentos
    const [documents, setDocuments] = useState<Document[]>([]);

    // Efeito de efeito colateral para buscar documentos do servidor
    useEffect(() => {
        console.log('Fazendo chamada para /documents');
        fetch('/documents')
            .then((response) => response.json())
            .then((data) => {
                console.log('Dados recebidos:', data);
                // Define os documentos recebidos no estado 'documents'
                setDocuments(data);
            })
            .catch((error) => {
                console.error('Erro ao buscar documentos:', error);
            });
    }, []); // Executa somente uma vez quando o componente é montado

    return (
        <div>
            <h1>Lista de Documentos</h1>
            <ul>
                {/* Mapeia a lista de documentos para criar uma lista de links */}
                {documents.map((document) => (
                    <li key={document.id}>
                        {/* Cria um link para o documento individual com base no ID */}
                        <Link to={`/documents/${document.id}`}>{document.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
