export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeria | IGJ - Inspecção-Geral de Jogos",
};

export default async function GalleryPage() {
  const galleries = await prisma.gallery.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { photos: { take: 4, orderBy: { order: "asc" } } },
  });

  return (
    <>
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <span className="text-white">Galeria</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Galeria de Fotos</h1>
          <p className="text-lg text-gray-300">Momentos e eventos da IGJ em imagens</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {galleries.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-lg">Nenhuma galeria disponível.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleries.map((gallery) => (
                <Link key={gallery.id} href={`/galeria/${gallery.slug}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-60 bg-gradient-to-br from-navy-100 to-navy-50 overflow-hidden">
                      {(gallery.coverImage || gallery.photos[0]?.url) ? (
                        <img
                          src={gallery.coverImage || gallery.photos[0]?.url}
                          alt={gallery.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-navy-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {gallery.photos.length} fotos
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                        <span className="text-white text-sm font-medium flex items-center gap-1.5">
                          Ver galeria
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-navy-800 text-lg group-hover:text-gold-600 transition-colors">
                        {gallery.title}
                      </h3>
                      {gallery.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{gallery.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
