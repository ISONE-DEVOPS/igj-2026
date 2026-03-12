"use client";

import { useState, useRef } from "react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  value?: string;
  onChange: (url: string) => void;
}

export function FileUpload({ label, accept, value, onChange }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
      } else {
        alert(data.error || "Erro no upload");
      }
    } catch {
      alert("Erro no upload");
    }
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  const isPdf = value?.endsWith(".pdf");
  const isImage = value && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragOver ? "border-gold-500 bg-gold-50" : "border-gray-300 hover:border-gold-400 hover:bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold-600" />
            <span className="text-sm text-gray-500">A enviar...</span>
          </div>
        ) : value ? (
          <div className="flex items-center gap-3">
            {isImage && (
              <img src={value} alt="" className="w-12 h-12 rounded object-cover" />
            )}
            {isPdf && (
              <div className="w-12 h-12 bg-red-50 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm text-gray-700 truncate">{value.split("/").pop()}</p>
              <p className="text-xs text-gray-400">Clique para alterar</p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-500">Arraste um ficheiro ou clique para seleccionar</p>
            <p className="text-xs text-gray-400 mt-1">{accept || "Qualquer ficheiro"}</p>
          </div>
        )}
      </div>

      {value && (
        <div className="flex items-center gap-2">
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 hover:text-gold-700">
            Ver ficheiro
          </a>
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-500 hover:text-red-700">
            Remover
          </button>
        </div>
      )}
    </div>
  );
}
