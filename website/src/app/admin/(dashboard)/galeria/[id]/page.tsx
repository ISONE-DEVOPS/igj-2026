"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FileUpload } from "@/components/admin/FileUpload";

interface Photo {
  url: string;
  caption: string;
}

export default function GalleryFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "novo";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", coverImage: "", published: false,
  });
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`/api/admin/galeria/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({
            title: data.title,
            slug: data.slug,
            description: data.description || "",
            coverImage: data.coverImage || "",
            published: data.published,
          });
          setPhotos(data.photos?.map((p: { url: string; caption: string }) => ({
            url: p.url,
            caption: p.caption || "",
          })) || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isNew, params.id]);

  function generateSlug(title: string) {
    return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function addPhoto() {
    setPhotos([...photos, { url: "", caption: "" }]);
  }

  function removePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  function updatePhoto(index: number, field: keyof Photo, value: string) {
    const updated = [...photos];
    updated[index][field] = value;
    setPhotos(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = isNew ? "/api/admin/galeria" : `/api/admin/galeria/${params.id}`;
    const validPhotos = photos.filter((p) => p.url.trim());
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, photos: validPhotos }),
    });
    if (res.ok) { router.push("/admin/galeria"); router.refresh(); } else { alert("Erro ao guardar"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Eliminar esta galeria e todas as fotos?")) return;
    const res = await fetch(`/api/admin/galeria/${params.id}`, { method: "DELETE" });
    if (res.ok) { router.push("/admin/galeria"); router.refresh(); }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? "Nova Galeria" : "Editar Galeria"}</h1>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mt-1">&larr; Voltar</button>
        </div>
        {!isNew && <Button variant="danger" onClick={handleDelete}>Eliminar</Button>}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardBody className="space-y-4">
              <Input label="Título" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: isNew ? generateSlug(e.target.value) : f.slug }))} required />
              <Input label="Slug" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} required />
              <Textarea label="Descrição" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </CardBody></Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Fotos ({photos.length})</h3>
                  <button type="button" onClick={addPhoto} className="text-sm text-gold-600 hover:text-gold-700 font-medium">
                    + Adicionar Foto
                  </button>
                </div>
              </CardHeader>
              <CardBody>
                {photos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-3">Nenhuma foto adicionada</p>
                    <button type="button" onClick={addPhoto} className="text-sm bg-gold-50 text-gold-700 px-4 py-2 rounded-lg hover:bg-gold-100">
                      + Adicionar primeira foto
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {photos.map((photo, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Foto {i + 1}</span>
                          <button type="button" onClick={() => removePhoto(i)} className="text-red-400 hover:text-red-600 p-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <FileUpload
                          accept="image/*"
                          value={photo.url}
                          onChange={(url) => updatePhoto(i, "url", url)}
                        />
                        <Input
                          placeholder="Legenda (opcional)"
                          value={photo.caption}
                          onChange={(e) => updatePhoto(i, "caption", e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card><CardHeader><h3 className="font-semibold text-gray-900">Publicação</h3></CardHeader><CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))} className="rounded border-gray-300 text-gold-600 focus:ring-gold-500" />
                <label htmlFor="published" className="text-sm text-gray-700">Publicado</label>
              </div>
            </CardBody></Card>
            <Card><CardHeader><h3 className="font-semibold text-gray-900">Imagem de Capa</h3></CardHeader><CardBody>
              <FileUpload
                accept="image/*"
                value={form.coverImage}
                onChange={(url) => setForm(f => ({ ...f, coverImage: url }))}
              />
            </CardBody></Card>
            <Button type="submit" loading={saving} className="w-full">{isNew ? "Criar Galeria" : "Guardar"}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
