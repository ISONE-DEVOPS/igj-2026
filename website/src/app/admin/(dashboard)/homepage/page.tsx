"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

interface PilarItem {
  title: string;
  description: string;
}

interface StatItem {
  label: string;
  value: string;
}

interface HomeContent {
  pilares: {
    subtitle: string;
    title: string;
    items: PilarItem[];
  };
  sobre: {
    subtitle: string;
    title: string;
    text1: string;
    text2: string;
    stats: StatItem[];
  };
  cta: {
    title: string;
    text: string;
  };
}

export default function AdminHomepagePage() {
  const { data: session } = useSession();
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (res.ok) {
      alert("Homepage guardada com sucesso!");
    } else {
      alert("Erro ao guardar");
    }
    setSaving(false);
  }

  if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Acesso restrito a administradores.</p>
      </div>
    );
  }

  if (loading || !content) {
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
          <h1 className="text-2xl font-bold text-gray-900">Homepage</h1>
          <p className="text-sm text-gray-500 mt-1">Editar conteúdos da página inicial</p>
        </div>
        <Button type="button" onClick={handleSave} loading={saving}>
          Guardar Alterações
        </Button>
      </div>

      <div className="space-y-6">
        {/* Pilares / Valores */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Secção: Valores / Pilares</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subtítulo"
                value={content.pilares.subtitle}
                onChange={(e) =>
                  setContent({ ...content, pilares: { ...content.pilares, subtitle: e.target.value } })
                }
              />
              <Input
                label="Título"
                value={content.pilares.title}
                onChange={(e) =>
                  setContent({ ...content, pilares: { ...content.pilares, title: e.target.value } })
                }
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Pilares (4 valores)</p>
              <div className="space-y-4">
                {content.pilares.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                    <Input
                      label={`Pilar ${idx + 1} - Título`}
                      value={item.title}
                      onChange={(e) => {
                        const items = [...content.pilares.items];
                        items[idx] = { ...items[idx], title: e.target.value };
                        setContent({ ...content, pilares: { ...content.pilares, items } });
                      }}
                    />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <textarea
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const items = [...content.pilares.items];
                          items[idx] = { ...items[idx], description: e.target.value };
                          setContent({ ...content, pilares: { ...content.pilares, items } });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sobre */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Secção: Sobre Nós</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subtítulo"
                value={content.sobre.subtitle}
                onChange={(e) =>
                  setContent({ ...content, sobre: { ...content.sobre, subtitle: e.target.value } })
                }
              />
              <Input
                label="Título"
                value={content.sobre.title}
                onChange={(e) =>
                  setContent({ ...content, sobre: { ...content.sobre, title: e.target.value } })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parágrafo 1</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                rows={4}
                value={content.sobre.text1}
                onChange={(e) =>
                  setContent({ ...content, sobre: { ...content.sobre, text1: e.target.value } })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parágrafo 2</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                rows={4}
                value={content.sobre.text2}
                onChange={(e) =>
                  setContent({ ...content, sobre: { ...content.sobre, text2: e.target.value } })
                }
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Estatísticas (4 números)</p>
              <p className="text-xs text-gray-400 mb-3">Use &quot;auto&quot; no valor para calcular automaticamente da base de dados</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.sobre.stats.map((stat, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                    <Input
                      label={`Valor ${idx + 1}`}
                      value={stat.value}
                      onChange={(e) => {
                        const stats = [...content.sobre.stats];
                        stats[idx] = { ...stats[idx], value: e.target.value };
                        setContent({ ...content, sobre: { ...content.sobre, stats } });
                      }}
                    />
                    <Input
                      label="Legenda"
                      value={stat.label}
                      onChange={(e) => {
                        const stats = [...content.sobre.stats];
                        stats[idx] = { ...stats[idx], label: e.target.value };
                        setContent({ ...content, sobre: { ...content.sobre, stats } });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* CTA Legislação */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Secção: Chamada à Acção (Legislação)</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Título"
              value={content.cta.title}
              onChange={(e) =>
                setContent({ ...content, cta: { ...content.cta, title: e.target.value } })
              }
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                rows={3}
                value={content.cta.text}
                onChange={(e) =>
                  setContent({ ...content, cta: { ...content.cta, text: e.target.value } })
                }
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
