"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Slide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  videoUrl: string | null;
  link: string | null;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/);
  return match ? match[1] : null;
}

interface HeroSliderProps {
  slides: Slide[];
  zones: number;
  legislationCount: number;
}

export function HeroSlider({ slides, zones, legislationCount }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const hasSlides = slides.length > 0;

  const next = useCallback(() => {
    if (hasSlides) setCurrent((c) => (c + 1) % slides.length);
  }, [hasSlides, slides.length]);

  const prev = useCallback(() => {
    if (hasSlides) setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [hasSlides, slides.length]);

  // Auto-advance every 6 seconds (paused on video slides)
  const currentSlideHasVideo = hasSlides && slides[current]?.videoUrl ? !!getYouTubeId(slides[current].videoUrl!) : false;
  useEffect(() => {
    if (slides.length <= 1 || currentSlideHasVideo) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length, currentSlideHasVideo]);

  const stats = [
    { label: "Zonas de Jogo", value: zones > 0 ? String(zones) : "5", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
    { label: "Anos de Regulação", value: "20+", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Legislação Vigente", value: legislationCount > 0 ? String(legislationCount) : "10+", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Ilhas Reguladas", value: "5", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div className="relative">
      {/* Hero Section — image fills, content at bottom */}
      <section className="relative h-[75vh] min-h-[500px] max-h-[750px] bg-navy-900 text-white overflow-hidden">
        {/* Slide background images / videos */}
        {hasSlides ? (
          slides.map((slide, i) => {
            const ytId = slide.videoUrl ? getYouTubeId(slide.videoUrl) : null;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
              >
                {ytId ? (
                  <>
                    {/* Fallback image while video loads */}
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    {i === current && (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{ border: 0, transform: "scale(1.2)", transformOrigin: "center" }}
                        title={slide.title}
                      />
                    )}
                  </>
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            );
          })
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          </>
        )}

        {/* Gradient overlay — only bottom half, keeps top of image visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent" />

        {/* Content pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 pb-28 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4">
            {hasSlides ? (
              <div key={current} className="animate-fade-in max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-gold-600/20 text-gold-400 px-4 py-1.5 rounded-full text-sm font-medium mb-5 backdrop-blur-sm border border-gold-500/10">
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
                  Inspecção-Geral de Jogos
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold leading-[1.15] mb-4 tracking-tight drop-shadow-lg">
                  {slides[current].title}
                </h1>
                {slides[current].subtitle && (
                  <p className="text-base lg:text-lg text-gray-200 mb-6 max-w-xl leading-relaxed drop-shadow">
                    {slides[current].subtitle}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  {slides[current].link ? (
                    <Link
                      href={slides[current].link!}
                      className="inline-flex items-center px-6 py-3 bg-gold-600 hover:bg-gold-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-gold-600/25 hover:-translate-y-0.5"
                    >
                      Saber mais
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      href="/sobre"
                      className="inline-flex items-center px-6 py-3 bg-gold-600 hover:bg-gold-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-gold-600/25 hover:-translate-y-0.5"
                    >
                      Conheça a IGJ
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                  <Link
                    href="/legislacao"
                    className="inline-flex items-center px-6 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-xl transition-all backdrop-blur-sm"
                  >
                    Legislação
                  </Link>

                  {/* Slide indicators inline */}
                  {slides.length > 1 && (
                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={prev} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrent(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-gold-500" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
                        />
                      ))}
                      <button onClick={next} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-gold-600/20 text-gold-400 px-4 py-1.5 rounded-full text-sm font-medium mb-5 backdrop-blur-sm border border-gold-500/10">
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
                  Entidade Reguladora de Jogos e Apostas
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold leading-[1.15] mb-4 tracking-tight">
                  Inspecção-Geral
                  <br />
                  <span className="text-gold-400">de Jogos</span>
                </h1>
                <p className="text-base lg:text-lg text-gray-200 mb-6 max-w-xl leading-relaxed">
                  Regulação e Supervisão para Casinos, Jogos de Fortuna ou Azar.
                  Desenvolvimento da actividade do jogo baseado numa fiscalização e
                  controlo apertados.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/sobre" className="inline-flex items-center px-6 py-3 bg-gold-600 hover:bg-gold-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-gold-600/25 hover:-translate-y-0.5">
                    Conheça a IGJ
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/legislacao" className="inline-flex items-center px-6 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-xl transition-all backdrop-blur-sm">
                    Legislação
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Stats Bar — overlaps hero and next section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 -mt-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-gold-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy-800">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
