export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import Link from "next/link";

async function getDashboardStats() {
  const [pages, news, legislation, publications, galleries, zones, media] =
    await Promise.all([
      prisma.page.count(),
      prisma.news.count(),
      prisma.legislation.count(),
      prisma.publication.count(),
      prisma.gallery.count(),
      prisma.gamingZone.count(),
      prisma.media.count(),
    ]);

  return { pages, news, legislation, publications, galleries, zones, media };
}

export default async function AdminDashboardPage() {
  // const stats = await getDashboardStats();

  const stats = {
    pages: 0,
    news: 0,
    legislation: 0,
    publications: 0,
    galleries: 0,
    zones: 0,
    media: 0,
  };

  const cards = [
    { label: "Páginas", value: stats.pages, href: "/admin/paginas", color: "bg-blue-500" },
    { label: "Notícias", value: stats.news, href: "/admin/noticias", color: "bg-green-500" },
    { label: "Legislação", value: stats.legislation, href: "/admin/legislacao", color: "bg-purple-500" },
    { label: "Publicações", value: stats.publications, href: "/admin/publicacoes", color: "bg-orange-500" },
    { label: "Galeria", value: stats.galleries, href: "/admin/galeria", color: "bg-pink-500" },
    { label: "Zonas de Jogo", value: stats.zones, href: "/admin/zonas-de-jogo", color: "bg-teal-500" },
    { label: "Media", value: stats.media, href: "/admin/media", color: "bg-gray-500" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral do website IGJ</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card hover className="h-full">
              <CardBody>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white`}>
                    <span className="text-xl font-bold">{card.value}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.label}</p>
                    <p className="text-xs text-gray-400">Gerir</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="font-semibold text-gray-900 mb-4">Acções Rápidas</h3>
            <div className="space-y-2">
              {[
                { label: "Criar Notícia", href: "/admin/noticias/novo" },
                { label: "Adicionar Legislação", href: "/admin/legislacao/novo" },
                { label: "Nova Publicação", href: "/admin/publicacoes/novo" },
                { label: "Gerir Slides", href: "/admin/slides" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gold-200 hover:bg-gold-50 transition-colors"
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

        <Card>
          <CardBody>
            <h3 className="font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Plataforma</span>
                <span className="text-gray-900 font-medium">Next.js 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Base de Dados</span>
                <span className="text-gray-900 font-medium">MySQL (Cloud SQL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hosting</span>
                <span className="text-gray-900 font-medium">Google Cloud Run</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Domínio</span>
                <span className="text-gray-900 font-medium">igj.cv</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
