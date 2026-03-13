export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return { title: "Página não encontrada" };
  return { title: `${page.title} | IGJ`, description: page.excerpt || "" };
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug, published: true },
  });

  if (!page) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <span className="text-white">{page.title}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{page.title}</h1>
          {page.excerpt && (
            <p className="text-lg text-gray-300 max-w-2xl mt-4">{page.excerpt}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {page.coverImage && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-10 -mt-8 relative z-10">
              <img src={page.coverImage} alt={page.title} className="w-full h-64 lg:h-[28rem] object-cover" />
            </div>
          )}
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao Início
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
