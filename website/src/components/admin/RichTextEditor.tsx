"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useMemo, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Escreva o conteúdo aqui..." }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-gold-600 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full mx-auto my-4" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL do link:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    fileInputRef.current?.click();
  }, [editor]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !e.target.files?.length) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      } else {
        alert("Erro ao carregar imagem");
      }
    } catch {
      alert("Erro ao carregar imagem");
    }
    e.target.value = "";
  }, [editor]);

  const addImageFromUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL da imagem:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const ToolButton = ({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${active ? "bg-gold-100 text-gold-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
    >
      {children}
    </button>
  );

  const Separator = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/20 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        {/* Text formatting */}
        <ToolButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrito">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
        </ToolButton>
        <ToolButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Itálico">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
        </ToolButton>
        <ToolButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Sublinhado">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
        </ToolButton>
        <ToolButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Riscado">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>
        </ToolButton>

        <Separator />

        {/* Headings */}
        <ToolButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Título H2">
          <span className="text-xs font-bold">H2</span>
        </ToolButton>
        <ToolButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Título H3">
          <span className="text-xs font-bold">H3</span>
        </ToolButton>
        <ToolButton active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} title="Título H4">
          <span className="text-xs font-bold">H4</span>
        </ToolButton>

        <Separator />

        {/* Lists */}
        <ToolButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
        </ToolButton>
        <ToolButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
        </ToolButton>
        <ToolButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citação">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
        </ToolButton>

        <Separator />

        {/* Alignment */}
        <ToolButton active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Alinhar à esquerda">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
        </ToolButton>
        <ToolButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Centrar">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>
        </ToolButton>
        <ToolButton active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Alinhar à direita">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>
        </ToolButton>
        <ToolButton active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justificar">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zM3 3v2h18V3H3z"/></svg>
        </ToolButton>

        <Separator />

        {/* Media / Links */}
        <ToolButton active={editor.isActive("link")} onClick={addLink} title="Link">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
        </ToolButton>
        <ToolButton onClick={addImage} title="Inserir imagem (upload)">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        </ToolButton>
        <ToolButton onClick={addImageFromUrl} title="Inserir imagem (URL)">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        </ToolButton>

        <Separator />

        {/* Undo/Redo */}
        <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
        </ToolButton>

        <Separator />

        {/* Clear formatting / Horizontal rule */}
        <ToolButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Linha horizontal">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 11h20v2H2z"/></svg>
        </ToolButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
