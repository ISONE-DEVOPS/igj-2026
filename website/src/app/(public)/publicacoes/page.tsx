export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publicações | IGJ - Inspecção-Geral de Jogos",
};

const typeLabels: Record<string, string> = {
  RELATORIO: "Relatório", REGULAMENTO: "Regulamento", BROCHURA: "Brochura", OUTRO: "Outro",
};

const typeColors: Record<string, string> = {
  RELATORIO: "bg-blue-50 text-blue-700",
  REGULAMENTO: "bg-emerald-50 text-emerald-700",
  BROCHURA: "bg-amber-50 text-amber-700",
  OUTRO: "bg-gray-50 text-gray-700",
};

export default async function PublicationsPage() {
  const items = await prisma.publication.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <span className="text-white">Publicações</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Publicações</h1>
          <p className="text-lg text-gray-300">Relatórios, regulamentos e brochuras da IGJ</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-gray-400 text-lg">Nenhuma publicação disponível.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                  <div className="h-52 bg-gradient-to-br from-gold-50 to-gold-100/50 flex items-center justify-center overflow-hidden">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gold-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className={`inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-semibold mb-3 ${typeColors[item.type] || typeColors.OUTRO}`}>
                      {typeLabels[item.type] || item.type}
                    </span>
                    <h3 className="font-bold text-navy-800 text-lg mb-2 group-hover:text-gold-600 transition-colors">{item.title}</h3>
                    {item.description && <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{item.description}</p>}
                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gold-600 text-sm font-semibold mt-auto pt-4 border-t border-gray-50 hover:text-gold-700 group/link"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descarregar PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
