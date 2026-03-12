export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function AdminSlidesPage() {
  const slides = await prisma.slide.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slides da Homepage</h1>
          <p className="text-sm text-gray-500 mt-1">{slides.length} slides</p>
        </div>
        <Link href="/admin/slides/novo"><Button>+ Novo Slide</Button></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-12">Nenhum slide encontrado.</p>
        ) : slides.map((slide) => (
          <Link key={slide.id} href={`/admin/slides/${slide.id}`}>
            <Card hover>
              <div className="h-40 bg-gradient-to-br from-navy-100 to-navy-50 rounded-t-xl overflow-hidden">
                {slide.image && <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 text-sm line-clamp-1">{slide.title}</p>
                  <Badge variant={slide.active ? "success" : "warning"}>{slide.active ? "Activo" : "Inactivo"}</Badge>
                </div>
                {slide.subtitle && <p className="text-xs text-gray-500 line-clamp-1">{slide.subtitle}</p>}
                <p className="text-xs text-gray-400 mt-1">Ordem: {slide.order}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
