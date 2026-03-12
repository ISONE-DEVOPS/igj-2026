"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FileUpload } from "@/components/admin/FileUpload";

const islands = ["Santiago", "São Vicente", "Sal", "Maio", "Boavista", "Santo Antão", "São Nicolau", "Fogo", "Brava"];

export default function GamingZoneFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "novo";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", island: "Santiago", description: "", address: "", image: "", published: false, order: 0,
  });

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`/api/admin/zonas-de-jogo/${params.id}`).then(r => r.json()).then(data => {
        setForm({
          name: data.name || "", slug: data.slug || "", island: data.island || "Santiago",
          description: data.description || "", address: data.address || "",
          image: data.image || "", published: data.published || false, order: data.order || 0,
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [isNew, params.id]);

  function generateSlug(name: string) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = isNew ? "/api/admin/zonas-de-jogo" : `/api/admin/zonas-de-jogo/${params.id}`;
    const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.push("/admin/zonas-de-jogo"); router.refresh(); } else { alert("Erro ao guardar"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Eliminar esta zona?")) return;
    const res = await fetch(`/api/admin/zonas-de-jogo/${params.id}`, { method: "DELETE" });
    if (res.ok) { router.push("/admin/zonas-de-jogo"); router.refresh(); }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? "Nova Zona de Jogo" : "Editar Zona"}</h1>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mt-1">&larr; Voltar</button>
        </div>
        {!isNew && <Button variant="danger" onClick={handleDelete}>Eliminar</Button>}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card><CardBody className="space-y-4">
              <Input label="Nome" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value, slug: isNew ? generateSlug(e.target.value) : f.slug }))} required />
              <Input label="Slug" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} required />
              <Input label="Endereço" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />
              <Textarea label="Descrição" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={6} />
            </CardBody></Card>
          </div>
          <div className="space-y-6">
            <Card><CardHeader><h3 className="font-semibold text-gray-900">Detalhes</h3></CardHeader><CardBody className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Ilha</label>
                <select value={form.island} onChange={(e) => setForm(f => ({ ...f, island: e.target.value }))} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  {islands.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))} className="rounded border-gray-300 text-gold-600 focus:ring-gold-500" />
                <label htmlFor="published" className="text-sm text-gray-700">Publicado</label>
              </div>
              <Input label="Ordem" type="number" value={String(form.order)} onChange={(e) => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
            </CardBody></Card>
            <Card><CardHeader><h3 className="font-semibold text-gray-900">Imagem</h3></CardHeader><CardBody>
              <FileUpload
                accept="image/*"
                value={form.image}
                onChange={(url) => setForm(f => ({ ...f, image: url }))}
              />
            </CardBody></Card>
            <Button type="submit" loading={saving} className="w-full">{isNew ? "Criar" : "Guardar"}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
