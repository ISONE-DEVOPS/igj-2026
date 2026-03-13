import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img src="/igj-logo.png" alt="IGJ" className="h-11 w-auto brightness-0 invert" />
              <div>
                <p className="font-bold leading-tight">Inspecção-Geral de Jogos</p>
                <p className="text-sm text-gray-400 leading-tight">República de Cabo Verde</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Entidade Reguladora de Jogos e Apostas. Regulação e Supervisão para
              Casinos, Jogos de Fortuna ou Azar.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-5">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Quem Somos", href: "/sobre" },
                { name: "Legislação", href: "/legislacao" },
                { name: "Publicações", href: "/publicacoes" },
                { name: "Notícias", href: "/noticias" },
                { name: "Galeria", href: "/galeria" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                    <svg className="w-3 h-3 text-gold-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Zonas de Jogo */}
          <div>
            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-5">
              Zonas de Jogo
            </h3>
            <ul className="space-y-3">
              {["Santiago", "São Vicente", "Sal", "Maio", "Boavista"].map((zone) => (
                <li key={zone}>
                  <Link href="/zonas-de-jogo" className="text-sm text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-2">
                    <svg className="w-3 h-3 text-gold-600/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {zone}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contactos */}
          <div>
            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-5">
              Contactos
            </h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">(+238) 260 48 43/34</p>
                  <p className="text-xs">Chamada para rede fixa</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Seg - Sex: 8:00 - 17:00</p>
                  <p className="text-xs">Horário de funcionamento</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Praia, Cabo Verde</p>
                  <p className="text-xs">República de Cabo Verde</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Inspecção-Geral de Jogos. Todos os direitos reservados.
          </p>
          <p className="text-sm text-gray-600">
            República de Cabo Verde
          </p>
        </div>
      </div>
    </footer>
  );
}
