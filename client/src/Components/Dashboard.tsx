import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Document {
    id: number;
    title: string;
}

function Dashboard() {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        console.log('Fazendo chamada para /documents');
        fetch('/documents')
            .then((response) => response.json())
            .then((data) => {
                console.log('Dados recebidos:', data);
                setDocuments(data);
            })
            .catch((error) => {
                console.error('Erro ao buscar documentos:', error);
            });
    }, []);
    

    return (
        <div>
            <h1>Lista de Documentos</h1>
            <ul>
                {documents.map((document) => (
                    <li key={document.id}>
                        <Link to={`/documents/${document.id}`}>{document.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
