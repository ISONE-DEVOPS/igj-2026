"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Início", href: "/" },
  {
    name: "IGJ",
    href: "/sobre",
    children: [
      { name: "Quem Somos", href: "/sobre" },
      { name: "Missão e Visão", href: "/sobre#missao" },
      { name: "Organograma", href: "/sobre#organograma" },
    ],
  },
  { name: "Legislação", href: "/legislacao" },
  {
    name: "Publicações",
    href: "/publicacoes",
    children: [
      { name: "Relatórios", href: "/publicacoes?tipo=relatorio" },
      { name: "Regulamentos", href: "/publicacoes?tipo=regulamento" },
      { name: "Brochuras", href: "/publicacoes?tipo=brochura" },
    ],
  },
  { name: "Notícias", href: "/noticias" },
  { name: "Galeria", href: "/galeria" },
  { name: "Zonas de Jogo", href: "/zonas-de-jogo" },
  { name: "Contactos", href: "/contactos" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-navy-900 text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="font-medium tracking-wide">Entidade Reguladora de Jogos e Apostas de Cabo Verde</span>
          <div className="hidden sm:flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (+238) 260 48 43/34
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Segunda - Sexta: 8:00 - 17:00
            </span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
              IGJ
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-navy-800 leading-tight">Inspecção-Geral</p>
              <p className="text-xs text-gray-500 leading-tight">de Jogos</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive(item.href)
                      ? "text-gold-700 bg-gold-50"
                      : "text-gray-600 hover:text-gold-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                  {item.children && (
                    <svg className="inline-block ml-1 w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.children && openDropdown === item.name && (
                  <div className="absolute left-0 top-full pt-1.5 w-52">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                        >
                          <span className="w-1 h-1 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-gold-700 bg-gold-50"
                      : "text-gray-700 hover:bg-gold-50 hover:text-gold-700"
                  }`}
                >
                  {item.name}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block pl-8 pr-3 py-2 text-sm text-gray-500 hover:text-gold-700"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
