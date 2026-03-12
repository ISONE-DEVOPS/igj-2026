export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gallery = await prisma.gallery.findUnique({ where: { slug } });
  if (!gallery) return { title: "Galeria não encontrada" };
  return { title: `${gallery.title} | IGJ`, description: gallery.description || "" };
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gallery = await prisma.gallery.findUnique({
    where: { slug, published: true },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!gallery) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <Link href="/galeria" className="hover:text-gold-400 transition-colors">Galeria</Link>
            <span>&gt;</span>
            <span className="text-white">{gallery.title}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{gallery.title}</h1>
          {gallery.description && (
            <p className="text-lg text-gray-300 max-w-3xl">{gallery.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-4">
            {gallery.photos.length} {gallery.photos.length === 1 ? "foto" : "fotos"}
          </p>
        </div>
      </section>

      {/* Photos grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {gallery.photos.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-lg">Esta galeria ainda não tem fotos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.photos.map((photo) => (
                <div key={photo.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.caption || gallery.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {photo.caption && (
                    <div className="p-4">
                      <p className="text-sm text-gray-600">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link href="/galeria" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar à Galeria
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
