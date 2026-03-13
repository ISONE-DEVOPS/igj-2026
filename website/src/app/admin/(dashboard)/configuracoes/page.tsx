"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string | null;
}

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [adding, setAdding] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    fetch("/api/admin/configuracoes")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: settings.map((s) => ({ id: s.id, value: s.value })) }),
    });
    if (res.ok) {
      alert("Configurações guardadas com sucesso!");
    } else {
      alert("Erro ao guardar configurações");
    }
    setSaving(false);
  }

  async function handleAdd() {
    if (!newKey.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/configuracoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey, value: newValue, label: newLabel }),
    });
    if (res.ok) {
      const setting = await res.json();
      setSettings((prev) => [...prev, setting]);
      setNewKey("");
      setNewLabel("");
      setNewValue("");
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error || "Erro ao criar configuração");
    }
    setAdding(false);
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">Acesso Restrito</p>
          <p className="text-gray-400 text-sm mt-1">Apenas administradores podem aceder às configurações.</p>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Site</h1>
          <p className="text-sm text-gray-500 mt-1">Configurações gerais do website IGJ</p>
        </div>
        <Button type="button" onClick={handleSave} loading={saving}>
          Guardar Alterações
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Configurações</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {settings.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhuma configuração encontrada. Adicione a primeira abaixo.</p>
            ) : (
              settings.map((setting, idx) => (
                <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{setting.label || setting.key}</label>
                    <p className="text-xs text-gray-400">{setting.key}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      value={setting.value}
                      onChange={(e) => {
                        const updated = [...settings];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        setSettings(updated);
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Adicionar Nova Configuração</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <Input label="Chave" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="ex: site_phone" />
              <Input label="Nome" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="ex: Telefone" />
              <Input label="Valor" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="ex: (+238) 260 48 43" />
              <Button type="button" onClick={handleAdd} loading={adding} variant="secondary">
                + Adicionar
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
