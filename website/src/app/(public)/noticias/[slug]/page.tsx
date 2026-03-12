export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({ where: { slug } });
  if (!news) return { title: "Notícia não encontrada" };
  return { title: `${news.title} | IGJ`, description: news.excerpt || "" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({
    where: { slug, published: true },
    include: { category: true },
  });

  if (!news) notFound();

  return (
    <>
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <Link href="/noticias" className="hover:text-gold-400 transition-colors">Notícias</Link>
            <span>&gt;</span>
            <span className="text-white truncate max-w-xs">{news.title}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            {news.category && (
              <span className="inline-block bg-gold-600/20 text-gold-400 px-3 py-1 rounded-full text-sm font-medium">
                {news.category.name}
              </span>
            )}
            {news.publishedAt && (
              <span className="text-gray-400 text-sm flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(news.publishedAt).toLocaleDateString("pt-CV", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{news.title}</h1>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {news.coverImage && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-10 -mt-8 relative z-10">
              <img src={news.coverImage} alt={news.title} className="w-full h-64 lg:h-[28rem] object-cover" />
            </div>
          )}
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar às Notícias
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
