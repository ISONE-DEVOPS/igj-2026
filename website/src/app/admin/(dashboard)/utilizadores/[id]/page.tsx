"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

export default function UserFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "novo";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
    active: true,
  });

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      fetch(`/api/admin/utilizadores/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            name: data.name || "",
            email: data.email || "",
            password: "",
            role: data.role || "EDITOR",
            active: data.active ?? true,
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isNew, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isNew && !form.password) {
      alert("A password é obrigatória para novos utilizadores");
      return;
    }

    setSaving(true);
    const url = isNew ? "/api/admin/utilizadores" : `/api/admin/utilizadores/${params.id}`;
    const method = isNew ? "POST" : "PUT";

    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      role: form.role,
      active: form.active,
    };

    // Only send password if filled
    if (form.password) {
      payload.password = form.password;
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/utilizadores");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error || "Erro ao guardar utilizador");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Tem a certeza que deseja eliminar este utilizador?")) return;

    const res = await fetch(`/api/admin/utilizadores/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/utilizadores");
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
            {isNew ? "Novo Utilizador" : "Editar Utilizador"}
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
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Dados pessoais</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Nome"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Segurança</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label={isNew ? "Password" : "Nova Password (deixe vazio para manter)"}
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required={isNew}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Permissões</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Papel</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Utilizador activo
                </label>
              </div>
            </CardBody>
          </Card>

          <Button type="submit" loading={saving} className="w-full">
            {isNew ? "Criar Utilizador" : "Guardar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
