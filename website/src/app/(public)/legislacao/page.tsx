export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legislação | IGJ - Inspecção-Geral de Jogos",
};

export default async function LegislationPage() {
  const items = await prisma.legislation.findMany({
    where: { published: true },
    orderBy: { publishDate: "desc" },
  });

  return (
    <>
      <section className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Legislação</h1>
          <p className="text-lg text-gray-300">Enquadramento legal da actividade de jogos em Cabo Verde</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gold-600">IGJ</Link>
            <span>&gt;</span>
            <span className="text-gray-900">Legislação</span>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Nenhuma legislação publicada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={item.fileUrl || "#"}
                  target={item.fileUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 bg-white border-l-4 border-gold-500 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Document icon */}
                  <div className="shrink-0 w-12 h-14 bg-gold-50 border border-gold-200 rounded flex items-center justify-center">
                    <svg className="w-7 h-7 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-snug group-hover:text-gold-700 transition-colors">
                      {item.publishDate && (
                        <span className="font-semibold">
                          {new Date(item.publishDate).toLocaleDateString("pt-CV", { day: "2-digit", month: "2-digit", year: "numeric" })}
                          {" – "}
                        </span>
                      )}
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
