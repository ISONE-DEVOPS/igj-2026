export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notícias</h1>
          <p className="text-sm text-gray-500 mt-1">{news.length} notícias registadas</p>
        </div>
        <Link href="/admin/noticias/novo">
          <Button>+ Nova Notícia</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Título</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Categoria</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Data</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Acções</th>
              </tr>
            </thead>
            <tbody>
              {news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Nenhuma notícia encontrada. Crie a primeira!
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{item.category?.name || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={item.published ? "success" : "warning"}>
                        {item.published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("pt-CV")
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/noticias/${item.id}`}
                        className="text-gold-600 hover:text-gold-700 font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
