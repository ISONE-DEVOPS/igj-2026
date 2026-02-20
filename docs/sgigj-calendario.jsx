import { useState } from "react";

const colors = {
  bg: "#FAFBFD",
  surface: "#FFFFFF",
  surfaceLight: "#F1F5F9",
  border: "#E2E8F0",
  text: "#1E293B",
  textMuted: "#475569",
  textDim: "#94A3B8",
  accent: "#2563EB",
  accentLight: "#EFF6FF",
  teal: "#0D9488",
  tealLight: "#F0FDFA",
  gold: "#B8860B",
  goldLight: "#FEF9EE",
  orange: "#EA580C",
  orangeLight: "#FFF7ED",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
};

const weeks = [
  {
    id: 1,
    label: "Semana 1–2",
    dateRange: "24 Fev – 7 Mar 2026",
    color: colors.accent,
    colorLight: colors.accentLight,
    icon: "🔧",
    title: "Ajustes, Correções e Testes Integrados",
    tasks: [
      { text: "Finalização dos ajustes pendentes", days: "24–28 Fev" },
      { text: "Correções de bugs identificados", days: "24–28 Fev" },
      { text: "Testes integrados de todos os módulos", days: "2–6 Mar" },
      { text: "Validação de fluxos processuais completos", days: "2–6 Mar" },
      { text: "Revisão de performance e segurança", days: "5–7 Mar" },
    ],
  },
  {
    id: 2,
    label: "Semana 3",
    dateRange: "9 – 13 Mar 2026",
    color: colors.teal,
    colorLight: colors.tealLight,
    icon: "👥",
    title: "Testes de Aceitação e Formação",
    tasks: [
      { text: "Testes de aceitação com utilizadores da IGJ", days: "9–11 Mar" },
      { text: "Recolha de feedback e ajustes rápidos", days: "10–11 Mar" },
      { text: "Formação dos utilizadores finais", days: "11–13 Mar" },
      { text: "Elaboração de manuais de utilização", days: "12–13 Mar" },
    ],
  },
  {
    id: 3,
    label: "Semana 4",
    dateRange: "16 – 20 Mar 2026",
    color: colors.purple,
    colorLight: colors.purpleLight,
    icon: "🚀",
    title: "Estabilização e Entrega Formal",
    tasks: [
      { text: "Estabilização final do sistema", days: "16–17 Mar" },
      { text: "Documentação técnica completa", days: "16–18 Mar" },
      { text: "Revisão final de qualidade", days: "18–19 Mar" },
      { text: "Entrega formal do sistema à IGJ", days: "20 Mar" },
    ],
  },
];

const calendarDays = (() => {
  const days = [];
  const startDate = new Date(2026, 1, 23); // Feb 23 (Monday)
  for (let i = 0; i < 28; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    days.push({
      date: d,
      day: d.getDate(),
      month: d.getMonth(),
      monthName: d.toLocaleDateString("pt-PT", { month: "short" }),
      weekday: d.toLocaleDateString("pt-PT", { weekday: "short" }),
      iso: d.toISOString().slice(0, 10),
    });
  }
  return days;
})();

function getWeekColor(dayIndex) {
  if (dayIndex < 10) return { bg: colors.accentLight, border: colors.accent, dot: colors.accent };
  if (dayIndex < 15) return { bg: colors.tealLight, border: colors.teal, dot: colors.teal };
  return { bg: colors.purpleLight, border: colors.purple, dot: colors.purple };
}

export default function ProjectCalendar() {
  const [activeWeek, setActiveWeek] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      color: colors.text,
      fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
      padding: "32px 24px",
    }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-block", padding: "5px 14px",
            background: colors.accentLight, border: `1px solid ${colors.accent}30`,
            borderRadius: 20, fontSize: 10, letterSpacing: 2.5,
            textTransform: "uppercase", color: colors.accent, fontWeight: 600, marginBottom: 14,
          }}>
            Calendário de Implementação
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: colors.text }}>
            SGIGJ — Plano de Finalização
          </h1>
          <p style={{ color: colors.textDim, fontSize: 12, margin: "6px 0 0", fontWeight: 500 }}>
            24 de Fevereiro – 20 de Março de 2026
          </p>
        </div>

        {/* Timeline Bar */}
        <div style={{
          display: "flex", gap: 0, marginBottom: 28,
          borderRadius: 12, overflow: "hidden",
          border: `1px solid ${colors.border}`,
          background: colors.surface,
        }}>
          {weeks.map((w, i) => (
            <div
              key={w.id}
              onClick={() => setActiveWeek(activeWeek === i ? null : i)}
              style={{
                flex: w.id === 1 ? 2 : 1,
                padding: "14px 16px",
                background: activeWeek === i ? w.colorLight : colors.surface,
                borderRight: i < 2 ? `1px solid ${colors.border}` : "none",
                cursor: "pointer",
                transition: "all 0.2s",
                borderBottom: `3px solid ${activeWeek === i ? w.color : "transparent"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{w.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: w.color }}>{w.label}</span>
              </div>
              <div style={{ fontSize: 9, color: colors.textDim, fontWeight: 500 }}>{w.dateRange}</div>
            </div>
          ))}
        </div>

        {/* Gantt-style Calendar */}
        <div style={{
          background: colors.surface,
          borderRadius: 14,
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
          marginBottom: 24,
        }}>
          {/* Day headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${calendarDays.length}, 1fr)`,
            borderBottom: `1px solid ${colors.border}`,
          }}>
            {calendarDays.map((d, i) => {
              const wc = getWeekColor(i);
              const isMonday = d.weekday.includes("seg") || d.date.getDay() === 1;
              return (
                <div key={i} style={{
                  padding: "10px 2px",
                  textAlign: "center",
                  borderLeft: isMonday && i > 0 ? `2px solid ${colors.border}` : `1px solid ${colors.border}22`,
                  background: i % 2 === 0 ? colors.surfaceLight + "80" : "transparent",
                }}>
                  <div style={{ fontSize: 8, color: colors.textDim, textTransform: "uppercase", fontWeight: 600 }}>
                    {d.weekday.slice(0, 3)}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: wc.dot, marginTop: 2 }}>
                    {d.day}
                  </div>
                  <div style={{ fontSize: 7, color: colors.textDim, textTransform: "uppercase" }}>
                    {d.monthName}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phase bars */}
          <div style={{ padding: "12px 0" }}>
            {weeks.map((w) => {
              const startIdx = w.id === 1 ? 0 : w.id === 2 ? 10 : 15;
              const endIdx = w.id === 1 ? 10 : w.id === 2 ? 15 : 20;
              const total = calendarDays.length;
              const leftPct = (startIdx / total) * 100;
              const widthPct = ((endIdx - startIdx) / total) * 100;

              return (
                <div key={w.id} style={{ position: "relative", height: 36, margin: "4px 0" }}>
                  <div style={{
                    position: "absolute",
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    height: "100%",
                    background: w.colorLight,
                    border: `1.5px solid ${w.color}`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 12,
                    gap: 8,
                  }}>
                    <span style={{ fontSize: 13 }}>{w.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: w.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {w.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Phase Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {weeks.map((w, wi) => (
            <div key={w.id} style={{
              background: colors.surface,
              borderRadius: 14,
              border: `1.5px solid ${activeWeek === wi ? w.color : colors.border}`,
              overflow: "hidden",
              transition: "all 0.3s",
              boxShadow: activeWeek === wi ? `0 4px 20px ${w.color}15` : "0 1px 3px rgba(0,0,0,0.03)",
            }}>
              {/* Top accent */}
              <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${w.color}, transparent)` }} />

              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: w.colorLight, border: `1px solid ${w.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>
                      {w.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{w.title}</div>
                      <div style={{ fontSize: 10, color: colors.textDim, fontWeight: 500 }}>{w.label} · {w.dateRange}</div>
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 10px", borderRadius: 6,
                    background: w.colorLight, border: `1px solid ${w.color}30`,
                    fontSize: 10, fontWeight: 700, color: w.color,
                  }}>
                    {w.tasks.length} tarefas
                  </div>
                </div>

                {/* Tasks */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {w.tasks.map((t, ti) => (
                    <div key={ti} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px",
                      background: ti % 2 === 0 ? w.colorLight + "80" : colors.surfaceLight,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: w.color,
                        }} />
                        <span style={{ fontSize: 11, fontWeight: 500, color: colors.text }}>{t.text}</span>
                      </div>
                      <span style={{
                        fontSize: 9, color: w.color, fontWeight: 600,
                        padding: "2px 8px", background: w.colorLight,
                        borderRadius: 4, whiteSpace: "nowrap",
                      }}>
                        {t.days}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Milestone */}
        <div style={{
          marginTop: 20,
          background: colors.surface,
          borderRadius: 14,
          border: `1.5px solid ${colors.purple}`,
          padding: "20px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ height: 3, background: `linear-gradient(90deg, ${colors.accent}, ${colors.teal}, ${colors.purple})`, position: "absolute", top: 0, left: 0, right: 0 }} />
          <div style={{ fontSize: 24, marginBottom: 6 }}>🏁</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>Entrega Formal do Sistema</div>
          <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4 }}>20 de Março de 2026</div>
          <div style={{
            display: "inline-block", marginTop: 10,
            padding: "5px 16px", background: colors.purpleLight,
            border: `1px solid ${colors.purple}30`, borderRadius: 20,
            fontSize: 10, fontWeight: 700, color: colors.purple,
          }}>
            Marco Final — Go Live SGIGJ
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 24 }}>
          <div style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1, fontWeight: 600 }}>
            CLOUD TECNOLOGY, LDA · PRAIA, CABO VERDE · FEV 2026
          </div>
        </div>
      </div>
    </div>
  );
}
