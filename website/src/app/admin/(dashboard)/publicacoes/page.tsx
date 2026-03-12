export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const typeLabels: Record<string, string> = {
  RELATORIO: "Relatório", REGULAMENTO: "Regulamento", BROCHURA: "Brochura", OUTRO: "Outro",
};

export default async function AdminPublicationsPage() {
  const items = await prisma.publication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Publicações</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} publicações</p>
        </div>
        <Link href="/admin/publicacoes/novo"><Button>+ Nova Publicação</Button></Link>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Título</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Tipo</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Acções</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Nenhuma publicação encontrada.</td></tr>
              ) : items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4"><Badge variant="info">{typeLabels[item.type] || item.type}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={item.published ? "success" : "warning"}>{item.published ? "Publicado" : "Rascunho"}</Badge></td>
                  <td className="px-6 py-4 text-right"><Link href={`/admin/publicacoes/${item.id}`} className="text-gold-600 hover:text-gold-700 font-medium">Editar</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
