export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notícias | IGJ - Inspecção-Geral de Jogos",
};

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <span className="text-white">Notícias</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Notícias</h1>
          <p className="text-lg text-gray-300">Últimas notícias e comunicados da IGJ</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {news.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-400 text-lg">Nenhuma notícia publicada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <Link key={item.id} href={`/noticias/${item.slug}`}>
                  <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                    <div className="relative h-52 bg-gradient-to-br from-navy-100 to-navy-50 overflow-hidden">
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-navy-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {item.category && (
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gold-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                          {item.category.name}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-navy-800 text-lg mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{item.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleDateString("pt-CV", { day: "numeric", month: "long", year: "numeric" })
                            : ""}
                        </p>
                        <span className="text-xs text-gold-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Ler
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
