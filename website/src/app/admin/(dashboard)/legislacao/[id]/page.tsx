"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FileUpload } from "@/components/admin/FileUpload";

const legislationTypes = [
  { value: "LEI", label: "Lei" },
  { value: "DECRETO_LEI", label: "Decreto-Lei" },
  { value: "REGULAMENTO", label: "Regulamento" },
  { value: "PORTARIA", label: "Portaria" },
  { value: "RESOLUCAO", label: "Resolução" },
  { value: "DESPACHO", label: "Despacho" },
  { value: "OUTRO", label: "Outro" },
];

export default function LegislationFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "novo";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", fileUrl: "", type: "LEI", number: "", publishDate: "", published: false,
  });

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`/api/admin/legislacao/${params.id}`).then(r => r.json()).then(data => {
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          description: data.description || "",
          fileUrl: data.fileUrl || "",
          type: data.type || "LEI",
          number: data.number || "",
          publishDate: data.publishDate ? new Date(data.publishDate).toISOString().split("T")[0] : "",
          published: data.published || false,
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [isNew, params.id]);

  function generateSlug(title: string) {
    return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = isNew ? "/api/admin/legislacao" : `/api/admin/legislacao/${params.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, publishDate: form.publishDate ? new Date(form.publishDate).toISOString() : null }),
    });
    if (res.ok) { router.push("/admin/legislacao"); router.refresh(); } else { alert("Erro ao guardar"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Eliminar esta legislação?")) return;
    const res = await fetch(`/api/admin/legislacao/${params.id}`, { method: "DELETE" });
    if (res.ok) { router.push("/admin/legislacao"); router.refresh(); }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? "Nova Legislação" : "Editar Legislação"}</h1>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mt-1">&larr; Voltar</button>
        </div>
        {!isNew && <Button variant="danger" onClick={handleDelete}>Eliminar</Button>}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardBody className="space-y-4">
              <Input label="Título" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: isNew ? generateSlug(e.target.value) : f.slug }))} required />
              <Input label="Slug (URL)" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} required />
              <Input label="Número" value={form.number} onChange={(e) => setForm(f => ({ ...f, number: e.target.value }))} placeholder="Ex: B.O – 55 – Série I – Decreto Regulamentar nº 9/2024" />
              <Textarea label="Descrição" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={6} />
            </CardBody></Card>
          </div>
          <div className="space-y-6">
            <Card><CardHeader><h3 className="font-semibold text-gray-900">Detalhes</h3></CardHeader><CardBody className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  {legislationTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <Input label="Data de Publicação" type="date" value={form.publishDate} onChange={(e) => setForm(f => ({ ...f, publishDate: e.target.value }))} />
              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))} className="rounded border-gray-300 text-gold-600 focus:ring-gold-500" />
                <label htmlFor="published" className="text-sm text-gray-700">Publicado</label>
              </div>
            </CardBody></Card>
            <Card><CardHeader><h3 className="font-semibold text-gray-900">Documento PDF</h3></CardHeader><CardBody>
              <FileUpload
                label="Ficheiro do documento"
                accept=".pdf,.doc,.docx"
                value={form.fileUrl}
                onChange={(url) => setForm(f => ({ ...f, fileUrl: url }))}
              />
            </CardBody></Card>
            <Button type="submit" loading={saving} className="w-full">{isNew ? "Criar" : "Guardar"}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
