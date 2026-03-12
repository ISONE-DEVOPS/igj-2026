"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FileUpload } from "@/components/admin/FileUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface NewsForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  featured: boolean;
  categoryId: string;
  publishedAt: string;
}

export default function NewsFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "novo";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewsForm>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    published: false,
    featured: false,
    categoryId: "",
    publishedAt: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`/api/admin/noticias/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            title: data.title || "",
            slug: data.slug || "",
            content: data.content || "",
            excerpt: data.excerpt || "",
            coverImage: data.coverImage || "",
            published: data.published || false,
            featured: data.featured || false,
            categoryId: data.categoryId || "",
            publishedAt: data.publishedAt
              ? new Date(data.publishedAt).toISOString().split("T")[0]
              : "",
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isNew, params.id]);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = isNew ? "/api/admin/noticias" : `/api/admin/noticias/${params.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      }),
    });

    if (res.ok) {
      router.push("/admin/noticias");
      router.refresh();
    } else {
      alert("Erro ao guardar notícia");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Tem a certeza que deseja eliminar esta notícia?")) return;

    const res = await fetch(`/api/admin/noticias/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/noticias");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "Nova Notícia" : "Editar Notícia"}
          </h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 mt-1"
          >
            &larr; Voltar
          </button>
        </div>
        {!isNew && (
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody className="space-y-4">
                <Input
                  label="Título"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: isNew ? generateSlug(title) : f.slug,
                    }));
                  }}
                  required
                />
                <Input
                  label="Slug (URL)"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  required
                />
                <Textarea
                  label="Resumo"
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  rows={3}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Conteúdo</label>
                  <RichTextEditor
                    value={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                    placeholder="Escreva o conteúdo da notícia..."
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Publicação</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={form.published}
                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <label htmlFor="published" className="text-sm text-gray-700">
                    Publicado
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Destaque
                  </label>
                </div>
                <Input
                  label="Data de Publicação"
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Imagem de Capa</h3>
              </CardHeader>
              <CardBody>
                <FileUpload
                  accept="image/*"
                  value={form.coverImage}
                  onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
                                  />
              </CardBody>
            </Card>

            <Button type="submit" loading={saving} className="w-full">
              {isNew ? "Criar Notícia" : "Guardar Alterações"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
