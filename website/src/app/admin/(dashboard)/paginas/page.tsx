export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Páginas</h1>
          <p className="text-sm text-gray-500 mt-1">{pages.length} páginas</p>
        </div>
        <Link href="/admin/paginas/novo"><Button>+ Nova Página</Button></Link>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Título</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Slug</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Acções</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Nenhuma página encontrada.</td></tr>
              ) : pages.map((page) => (
                <tr key={page.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                  <td className="px-6 py-4 text-gray-500">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <Badge variant={page.published ? "success" : "warning"}>{page.published ? "Publicado" : "Rascunho"}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/paginas/${page.id}`} className="text-gold-600 hover:text-gold-700 font-medium">Editar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
