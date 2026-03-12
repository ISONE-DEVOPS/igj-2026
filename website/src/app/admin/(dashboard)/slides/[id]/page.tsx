"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FileUpload } from "@/components/admin/FileUpload";

export default function SlideFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "novo";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", subtitle: "", image: "", link: "", active: true, order: 0,
  });

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`/api/admin/slides/${params.id}`).then(r => r.json()).then(data => { setForm(data); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [isNew, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = isNew ? "/api/admin/slides" : `/api/admin/slides/${params.id}`;
    const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.push("/admin/slides"); router.refresh(); } else { alert("Erro ao guardar"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Eliminar este slide?")) return;
    const res = await fetch(`/api/admin/slides/${params.id}`, { method: "DELETE" });
    if (res.ok) { router.push("/admin/slides"); router.refresh(); }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? "Novo Slide" : "Editar Slide"}</h1>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mt-1">&larr; Voltar</button>
        </div>
        {!isNew && <Button variant="danger" onClick={handleDelete}>Eliminar</Button>}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card><CardBody className="space-y-4">
              <Input label="Título" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
              <Input label="Subtítulo" value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} />
              <FileUpload label="Imagem do Slide" accept="image/*" value={form.image} onChange={(url) => setForm(f => ({ ...f, image: url }))} />
              <Input label="Link (opcional)" value={form.link} onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
            </CardBody></Card>
          </div>
          <div className="space-y-6">
            <Card><CardHeader><h3 className="font-semibold text-gray-900">Opções</h3></CardHeader><CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded border-gray-300 text-gold-600 focus:ring-gold-500" />
                <label htmlFor="active" className="text-sm text-gray-700">Activo</label>
              </div>
              <Input label="Ordem" type="number" value={String(form.order)} onChange={(e) => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
            </CardBody></Card>
            <Button type="submit" loading={saving} className="w-full">{isNew ? "Criar Slide" : "Guardar"}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
