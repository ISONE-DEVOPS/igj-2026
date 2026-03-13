export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getDashboardData() {
  const [
    pages, news, legislation, publications, galleries, zones, slides, users, media,
    recentNews, activeSlides, recentUsers,
  ] = await Promise.all([
    prisma.page.count(),
    prisma.news.count(),
    prisma.legislation.count(),
    prisma.publication.count(),
    prisma.gallery.count(),
    prisma.gamingZone.count(),
    prisma.slide.count(),
    prisma.user.count(),
    prisma.media.count(),
    prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, published: true, publishedAt: true, createdAt: true },
    }),
    prisma.slide.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { id: true, title: true, image: true, order: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    }),
  ]);

  const publishedNews = await prisma.news.count({ where: { published: true } });
  const publishedLegislation = await prisma.legislation.count({ where: { published: true } });
  const publishedPages = await prisma.page.count({ where: { published: true } });

  return {
    counts: { pages, news, legislation, publications, galleries, zones, slides, users, media },
    published: { news: publishedNews, legislation: publishedLegislation, pages: publishedPages },
    recentNews,
    activeSlides,
    recentUsers,
  };
}

export default async function AdminDashboardPage() {
  const { counts, published, recentNews, activeSlides, recentUsers } = await getDashboardData();

  const cards = [
    {
      label: "Notícias",
      value: counts.news,
      sub: `${published.news} publicadas`,
      href: "/admin/noticias",
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Páginas",
      value: counts.pages,
      sub: `${published.pages} publicadas`,
      href: "/admin/paginas",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Legislação",
      value: counts.legislation,
      sub: `${published.legislation} publicadas`,
      href: "/admin/legislacao",
      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Publicações",
      value: counts.publications,
      href: "/admin/publicacoes",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Galeria",
      value: counts.galleries,
      href: "/admin/galeria",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "from-pink-500 to-pink-600",
    },
    {
      label: "Zonas de Jogo",
      value: counts.zones,
      href: "/admin/zonas-de-jogo",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Slides",
      value: counts.slides,
      sub: `${activeSlides.length} activos`,
      href: "/admin/slides",
      icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Utilizadores",
      value: counts.users,
      href: "/admin/utilizadores",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral do website IGJ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card hover className="h-full">
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center shrink-0 shadow-sm`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs font-medium text-gray-500">{card.label}</p>
                    {card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent News */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Notícias Recentes</h3>
                <Link href="/admin/noticias" className="text-xs text-gold-600 hover:text-gold-700 font-medium">Ver todas</Link>
              </div>
              {recentNews.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">Nenhuma notícia criada.</p>
              ) : (
                <div className="space-y-3">
                  {recentNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/admin/noticias/${item.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gold-200 hover:bg-gold-50/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleDateString("pt-CV", { day: "numeric", month: "short", year: "numeric" })
                            : new Date(item.createdAt).toLocaleDateString("pt-CV", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <Badge variant={item.published ? "success" : "warning"} className="ml-3 shrink-0">
                        {item.published ? "Publicada" : "Rascunho"}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <h3 className="font-semibold text-gray-900 mb-4">Acções Rápidas</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Criar Notícia", href: "/admin/noticias/novo" },
                  { label: "Adicionar Legislação", href: "/admin/legislacao/novo" },
                  { label: "Nova Publicação", href: "/admin/publicacoes/novo" },
                  { label: "Novo Slide", href: "/admin/slides/novo" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-gold-200 hover:bg-gold-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Active Slides */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Slides Activos</h3>
                <Link href="/admin/slides" className="text-xs text-gold-600 hover:text-gold-700 font-medium">Gerir</Link>
              </div>
              {activeSlides.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Nenhum slide activo.</p>
              ) : (
                <div className="space-y-2">
                  {activeSlides.map((slide) => (
                    <Link
                      key={slide.id}
                      href={`/admin/slides/${slide.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        {slide.image && <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{slide.title}</p>
                        <p className="text-xs text-gray-400">Ordem: {slide.order}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Utilizadores</h3>
                <Link href="/admin/utilizadores" className="text-xs text-gold-600 hover:text-gold-700 font-medium">Ver todos</Link>
              </div>
              <div className="space-y-2">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 py-1.5">
                    <div className="w-8 h-8 bg-navy-100 text-navy-600 rounded-full flex items-center justify-center font-medium text-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.role === "ADMIN" ? "Administrador" : "Editor"}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${user.active ? "bg-emerald-400" : "bg-gray-300"}`} />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
