export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zonas de Jogo | IGJ - Inspecção-Geral de Jogos",
};

export default async function GamingZonesPage() {
  const zones = await prisma.gamingZone.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const islands = ["Santiago", "São Vicente", "Sal", "Maio", "Boavista"];

  return (
    <>
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <span className="text-white">Zonas de Jogo</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Zonas Permanentes de Jogo</h1>
          <p className="text-lg text-gray-300">Ilhas com actividade de jogo autorizada em Cabo Verde</p>
        </div>
      </section>

      {/* Islands overview bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {islands.map((island) => {
              const hasZone = zones.some((z) => z.island === island);
              return (
                <div
                  key={island}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all ${
                    hasZone
                      ? "bg-gold-50 border-gold-200 text-gold-800"
                      : "bg-gray-50 border-gray-100 text-gray-500"
                  }`}
                >
                  <svg className={`w-5 h-5 ${hasZone ? "text-gold-500" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="font-semibold text-sm">{island}</span>
                  {hasZone && <span className="w-2 h-2 bg-green-400 rounded-full" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {zones.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">Zonas de jogo em breve.</p>
              <p className="text-gray-400 text-sm">As 5 ilhas com zonas permanentes de jogo serão apresentadas aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {zones.map((zone) => (
                <div key={zone.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {zone.image ? (
                    <div className="h-56 overflow-hidden">
                      <img src={zone.image} alt={zone.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-navy-100 to-navy-50 flex items-center justify-center">
                      <svg className="w-16 h-16 text-navy-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 text-gold-700 px-3 py-1 text-xs font-semibold border border-gold-100">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {zone.island}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-navy-800 mb-3 group-hover:text-gold-600 transition-colors">{zone.name}</h3>
                    {zone.description && <p className="text-gray-600 mb-3 leading-relaxed">{zone.description}</p>}
                    {zone.address && (
                      <p className="text-sm text-gray-400 flex items-center gap-1.5">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {zone.address}
                      </p>
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
