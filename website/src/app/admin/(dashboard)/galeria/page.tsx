export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function AdminGalleryPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: { take: 1, orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galeria</h1>
          <p className="text-sm text-gray-500 mt-1">{galleries.length} galerias</p>
        </div>
        <Link href="/admin/galeria/novo"><Button>+ Nova Galeria</Button></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleries.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-12">Nenhuma galeria encontrada.</p>
        ) : galleries.map((gallery) => (
          <Link key={gallery.id} href={`/admin/galeria/${gallery.id}`}>
            <Card hover>
              <div className="h-40 bg-gradient-to-br from-navy-100 to-navy-50 rounded-t-xl overflow-hidden">
                {(gallery.coverImage || gallery.photos[0]?.url) && (
                  <img src={gallery.coverImage || gallery.photos[0]?.url} alt={gallery.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 text-sm line-clamp-1">{gallery.title}</p>
                  <Badge variant={gallery.published ? "success" : "warning"}>
                    {gallery.published ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
                {gallery.description && <p className="text-xs text-gray-500 line-clamp-1">{gallery.description}</p>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
