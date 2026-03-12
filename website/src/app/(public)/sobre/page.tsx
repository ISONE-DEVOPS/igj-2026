import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quem Somos | IGJ - Inspecção-Geral de Jogos",
  description: "Conheça a Inspecção-Geral de Jogos de Cabo Verde",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">IGJ</Link>
            <span>&gt;</span>
            <span className="text-white">Quem Somos</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Quem Somos</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Conheça a Inspecção-Geral de Jogos, a entidade reguladora de jogos e apostas de Cabo Verde.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-wider mb-3">Sobre a IGJ</p>
              <h2 className="text-3xl font-bold text-navy-800 mb-6">A Instituição</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  A Inspecção-Geral de Jogos, abreviadamente IGJ, é um Serviço Central de
                  Inspecção e Controlo da Actividade de Jogos, dotado de Autonomia Funcional,
                  Administrativa e Financeira, directamente dependente do Ministro do Turismo,
                  Investimentos e Desenvolvimento Empresarial.
                </p>
                <p>
                  A IGJ foi criada com o objetivo de regular, supervisionar e fiscalizar toda a
                  actividade de jogos de fortuna ou azar na República de Cabo Verde, garantindo
                  que esta se desenvolva de forma transparente, segura e em conformidade com a
                  legislação vigente.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="sticky top-28 bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white">
                <h3 className="text-lg font-bold mb-6 text-gold-400">Em Números</h3>
                <div className="space-y-6">
                  {[
                    { value: "20+", label: "Anos de experiência regulatória" },
                    { value: "5", label: "Ilhas com zonas de jogo" },
                    { value: "3+", label: "Casinos regulados" },
                    { value: "10+", label: "Diplomas legislativos" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-gold-400 w-16 shrink-0">{stat.value}</span>
                      <span className="text-sm text-gray-300">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão e Visão */}
      <section id="missao" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-wider mb-2">A Nossa Essência</p>
            <h2 className="text-3xl font-bold text-navy-800">Visão e Valores</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visão */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-800 mb-4">Visão</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Desenvolvimento da actividade do jogo baseado numa fiscalização e controlo
                apertados de modo que essa actividade seja desenvolvida em ambiente saudável.
                Grande importância na contribuição e na formação do PIB.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-navy-700 to-navy-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-800 mb-4">Valores</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Credibilidade", desc: "Actuação responsável" },
                  { name: "Transparência", desc: "Processos claros" },
                  { name: "Confiança", desc: "Relações sólidas" },
                  { name: "Tranquilidade", desc: "Ambiente saudável" },
                ].map((v) => (
                  <div key={v.name} className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-navy-800 text-sm">{v.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competências */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-wider mb-2">O Que Fazemos</p>
            <h2 className="text-3xl font-bold text-navy-800">Competências</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Regulação", desc: "Regulação e supervisão da actividade de jogos de fortuna ou azar", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
              { title: "Fiscalização", desc: "Fiscalização e controlo das actividades de jogo autorizadas", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              { title: "Licenciamento", desc: "Análise e emissão de licenças para operadores de jogo", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
              { title: "Prevenção", desc: "Prevenção do jogo ilegal e protecção dos consumidores", icon: "M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: "Aconselhamento", desc: "Aconselhamento técnico ao Governo sobre política de jogos", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
              { title: "Cooperação", desc: "Cooperação com entidades nacionais e internacionais do sector", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((item) => (
              <div key={item.title} className="group p-7 rounded-2xl border border-gray-100 hover:border-gold-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organograma */}
      <section id="organograma" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gold-600 font-semibold text-sm uppercase tracking-wider mb-2">Estrutura</p>
          <h2 className="text-3xl font-bold text-navy-800 mb-8">Organograma</h2>
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-400">Organograma será carregado da base de dados</p>
          </div>
        </div>
      </section>
    </>
  );
}
