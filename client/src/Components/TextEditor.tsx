import { useCallback, useEffect, useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams } from 'react-router-dom';

// Intervalo de salvamento automático
const SAVE_INTERVAL = 2000;

// Opções da barra de ferramentas do Quill
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

export default function TextEditor() {
    // Obtém o ID do documento a partir dos parâmetros da URL
    const { id: documentId } = useParams<{ id: string }>();

    // Estados para armazenar a instância do Quill e do socket
    const [quill, setQuill] = useState<any>();
    const [socket, setSocket] = useState<any>();

    // Configuração inicial do socket
    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);
        return () => {
            s.disconnect();
        }
    }, []);

    // Carrega o conteúdo do documento do servidor quando a página é carregada
    useEffect(() => {
        if (!socket || !quill) return;
        socket.once("load-document", (document: any) => {
            quill?.setContents(document);
            quill?.enable();
        });
        socket.emit("get-document", documentId);

    }, [socket, quill, documentId]);

    // Salva periodicamente o conteúdo do documento no servidor
    useEffect(() => {
        if (!socket || !quill) return;
        const interval = setInterval(() => {
            socket?.emit("save-document", quill?.getContents());
        }, SAVE_INTERVAL);
        return () => {
            clearInterval(interval);
        }
    }, [socket, quill]);

    // Envia as mudanças de texto para o servidor quando o usuário edita o documento
    useEffect(() => {
        if (!socket || !quill) return;
        const handler = (delta: any, oldDelta: any, source: any) => {
            if (source !== "user") return;
            socket?.emit("send-changes", delta);
        }

        quill?.on("text-change", handler);

        return () => {
            quill?.off("text-change");
        }

    }, [socket, quill]);

    // Atualiza o editor do Quill quando mudanças são recebidas do servidor
    useEffect(() => {
        if (!socket || !quill) return;

        const handler = (delta: any) => {
            quill.updateContents(delta);
        }

        socket?.on("receive-changes", handler);

        return () => {
            quill?.off("receive-changes");
        }

    }, [socket, quill]);

    // Referência de wrapper para o elemento do Quill
    const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
        if (!wrapper) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");

        wrapper.append(editor)
        const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });
        q.enable(false);
        q.setText("Loading...");
        setQuill(q);
    }, []);

    // Renderização do componente
    return (
        <div className='container' ref={wrapperRef}>
        </div>
    );
}
