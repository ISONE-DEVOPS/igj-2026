import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contactos | IGJ - Inspecção-Geral de Jogos",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <span className="text-white">Contactos</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contactos</h1>
          <p className="text-lg text-gray-300">Entre em contacto com a Inspecção-Geral de Jogos</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info cards */}
            <div className="space-y-6">
              {[
                {
                  title: "Morada",
                  info: "Praia, Cabo Verde",
                  detail: "República de Cabo Verde",
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  title: "Telefone",
                  info: "(+238) 260 48 43/34",
                  detail: "Chamada para rede fixa",
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  title: "Horário",
                  info: "Segunda - Sexta",
                  detail: "8:00 - 17:00",
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  color: "from-amber-500 to-amber-600",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-0.5">{item.title}</p>
                      <p className="font-bold text-navy-800">{item.info}</p>
                      <p className="text-sm text-gray-500">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick links */}
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4">Links Úteis</h3>
                <div className="space-y-2">
                  {[
                    { name: "Legislação", href: "/legislacao" },
                    { name: "Publicações", href: "/publicacoes" },
                    { name: "Zonas de Jogo", href: "/zonas-de-jogo" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <span className="text-sm text-gray-300 group-hover:text-white">{link.name}</span>
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-navy-800 mb-2">Envie-nos uma mensagem</h2>
                <p className="text-gray-500 mb-8">Preencha o formulário e entraremos em contacto consigo.</p>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
                      <input
                        type="text"
                        className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                        placeholder="O seu nome"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                        placeholder="email@exemplo.cv"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Assunto</label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                      placeholder="Assunto da mensagem"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensagem</label>
                    <textarea
                      rows={6}
                      className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none resize-none"
                      placeholder="Escreva a sua mensagem..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-gold-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-gold-500 transition-all shadow-lg shadow-gold-600/25 hover:shadow-gold-500/30"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
