export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSlider } from "@/components/public/HeroSlider";

const defaultContent = {
  pilares: {
    subtitle: "Os Nossos Pilares",
    title: "Valores que nos Orientam",
    items: [
      { title: "Credibilidade", description: "Actuação transparente e responsável na regulação do sector de jogos" },
      { title: "Transparência", description: "Processos claros e informação acessível a todos os cidadãos" },
      { title: "Confiança", description: "Relação de confiança com operadores e público em geral" },
      { title: "Tranquilidade", description: "Ambiente saudável para o desenvolvimento da actividade do jogo" },
    ],
  },
  sobre: {
    subtitle: "Sobre Nós",
    title: "Quem Somos",
    text1: "A Inspecção-Geral de Jogos, abreviadamente IGJ, é um Serviço Central de Inspecção e Controlo da Actividade de Jogos, dotado de Autonomia Funcional, Administrativa e Financeira, directamente dependente do Ministro do Turismo, Investimentos e Desenvolvimento Empresarial.",
    text2: "A nossa visão é o desenvolvimento da actividade do jogo baseado numa fiscalização e controlo apertados de modo que essa actividade seja desenvolvida em ambiente saudável, com grande importância na contribuição e na formação do PIB.",
    stats: [
      { label: "Ilhas com Zonas de Jogo", value: "5" },
      { label: "Anos de Regulação", value: "20+" },
      { label: "Casinos Regulados", value: "3+" },
      { label: "Legislação Vigente", value: "auto" },
    ],
  },
  cta: {
    title: "Consulte a Legislação",
    text: "Aceda ao enquadramento legal da actividade de jogos em Cabo Verde. Toda a legislação disponível para consulta.",
  },
};

const pilarIcons = [
  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
];

const pilarColors = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-violet-500 to-violet-600",
];

async function getHomeData() {
  const [slides, news, zones, legislationCount, homeSetting] = await Promise.all([
    prisma.slide.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { category: true },
    }),
    prisma.gamingZone.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.legislation.count({ where: { published: true } }),
    prisma.siteSetting.findUnique({ where: { key: "homepage_content" } }),
  ]);

  let homeContent = defaultContent;
  if (homeSetting?.value) {
    try {
      homeContent = { ...defaultContent, ...JSON.parse(homeSetting.value) };
    } catch {
      // use defaults
    }
  }

  return { slides, news, zones, legislationCount, homeContent };
}

export default async function HomePage() {
  const { slides, news, zones, legislationCount, homeContent } = await getHomeData();

  return (
    <>
      {/* Hero Section with Slides */}
      <HeroSlider slides={slides.map(s => ({ id: s.id, title: s.title, subtitle: s.subtitle, image: s.image, videoUrl: s.videoUrl, link: s.link }))} zones={zones.length} legislationCount={legislationCount} />

      {/* Valores / Destaques */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-wider mb-2">{homeContent.pilares.subtitle}</p>
            <h2 className="text-3xl font-bold text-navy-800">{homeContent.pilares.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeContent.pilares.items.map((item, i) => (
              <div
                key={i}
                className="group relative p-7 rounded-2xl bg-white border border-gray-100 hover:border-gold-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${pilarColors[i] || pilarColors[0]} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={pilarIcons[i] || pilarIcons[0]} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre a IGJ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-wider mb-2">{homeContent.sobre.subtitle}</p>
              <h2 className="text-3xl font-bold text-navy-800 mb-6">{homeContent.sobre.title}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">{homeContent.sobre.text1}</p>
              <p className="text-gray-600 mb-8 leading-relaxed">{homeContent.sobre.text2}</p>
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 group"
              >
                Saber mais sobre a IGJ
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-gold-200/40 to-gold-100/20 rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl p-10 shadow-sm border border-gold-100">
                <div className="grid grid-cols-2 gap-8">
                  {homeContent.sobre.stats.map((stat, i) => {
                    const displayValue = stat.value === "auto"
                      ? (legislationCount > 0 ? String(legislationCount) : "10+")
                      : stat.value;
                    return (
                      <div key={i} className="text-center">
                        <p className="text-4xl font-bold text-navy-800 mb-1">{displayValue}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notícias Recentes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-wider mb-2">Fique Informado</p>
              <h2 className="text-3xl font-bold text-navy-800">Últimas Notícias</h2>
            </div>
            <Link
              href="/noticias"
              className="hidden sm:inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 group"
            >
              Ver todas
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {news.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <article key={i} className="group rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-navy-100 to-navy-50" />
                  <div className="p-6">
                    <p className="text-xs text-gold-600 font-semibold mb-2 uppercase tracking-wider">Comunicado</p>
                    <h3 className="font-semibold text-navy-800 mb-2">Título da notícia {i}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">Descrição breve da notícia...</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, 3).map((item, i) => (
                <Link key={item.id} href={`/noticias/${item.slug}`}>
                  <article className={`group rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
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
                    <div className="p-6 bg-white border border-gray-100 border-t-0 rounded-b-2xl">
                      <h3 className="font-bold text-navy-800 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.excerpt}</p>
                      )}
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString("pt-CV", { day: "numeric", month: "long", year: "numeric" })
                          : ""}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link href="/noticias" className="inline-flex items-center gap-2 text-gold-600 font-semibold">
              Ver todas as notícias
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA - Legislação */}
      <section className="py-16 bg-gradient-to-r from-gold-600 to-gold-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">{homeContent.cta.title}</h2>
              <p className="text-gold-100 max-w-lg">{homeContent.cta.text}</p>
            </div>
            <Link
              href="/legislacao"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gold-700 font-bold rounded-xl hover:bg-gold-50 transition-colors shadow-lg shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Legislação
            </Link>
          </div>
        </div>
      </section>

      {/* Zonas de Jogo */}
      <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Cabo Verde</p>
            <h2 className="text-3xl font-bold mb-3">Zonas Permanentes de Jogo</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Ilhas com actividade de jogo autorizada em Cabo Verde</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(zones.length > 0
              ? zones.map((z) => ({ name: z.name, island: z.island }))
              : ["Santiago", "São Vicente", "Sal", "Maio", "Boavista"].map((i) => ({ name: i, island: i }))
            ).map((zone) => (
              <Link
                key={zone.name}
                href="/zonas-de-jogo"
                className="group bg-white/5 hover:bg-gold-600/20 border border-white/10 hover:border-gold-500/30 rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-gold-600/20 rounded-xl flex items-center justify-center group-hover:bg-gold-600/30 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-white">{zone.island}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
