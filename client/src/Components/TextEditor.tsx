import { useCallback, useEffect, useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams } from 'react-router-dom';

const SAVE_INTERVAL = 2000;
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
    const { id: documentId } = useParams<{ id: string }>();
    const [quill, setQuill] = useState<any>();
    const [socket, setSocket] = useState<any>();

    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);
        return () => {
            s.disconnect();
        }
    }, []);

    useEffect(() => {
        if (!socket || !quill) return;
        socket.once("load-document", (document: any) => {
            quill?.setContents(document);
            quill?.enable();
        });
        socket.emit("get-document", documentId);

    }, [socket, quill, documentId]);

    useEffect(() => {
        if (!socket || !quill) return;
        const interval = setInterval(() => {
            socket?.emit("save-document", quill?.getContents());
        }, SAVE_INTERVAL);
        return () => {
            clearInterval(interval);
        }
    }, [socket, quill]);

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

    return (
        <div className='container' ref={wrapperRef}>
        </div>
    );
}
