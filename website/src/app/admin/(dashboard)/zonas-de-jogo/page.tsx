export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function AdminGamingZonesPage() {
  const zones = await prisma.gamingZone.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zonas de Jogo</h1>
          <p className="text-sm text-gray-500 mt-1">{zones.length} zonas</p>
        </div>
        <Link href="/admin/zonas-de-jogo/novo"><Button>+ Nova Zona</Button></Link>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Nome</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Ilha</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Acções</th>
              </tr>
            </thead>
            <tbody>
              {zones.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Nenhuma zona encontrada.</td></tr>
              ) : zones.map((zone) => (
                <tr key={zone.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{zone.name}</td>
                  <td className="px-6 py-4 text-gray-500">{zone.island}</td>
                  <td className="px-6 py-4"><Badge variant={zone.published ? "success" : "warning"}>{zone.published ? "Publicado" : "Rascunho"}</Badge></td>
                  <td className="px-6 py-4 text-right"><Link href={`/admin/zonas-de-jogo/${zone.id}`} className="text-gold-600 hover:text-gold-700 font-medium">Editar</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
