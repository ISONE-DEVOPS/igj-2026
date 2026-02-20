import { useState } from "react";

const colors = {
  bg: "#FAFBFD",
  surface: "#FFFFFF",
  surfaceLight: "#F1F5F9",
  border: "#E2E8F0",
  accent: "#2563EB",
  accentLight: "#EFF6FF",
  gold: "#B8860B",
  goldLight: "#FEF9EE",
  teal: "#0D9488",
  tealLight: "#F0FDFA",
  orange: "#EA580C",
  orangeLight: "#FFF7ED",
  red: "#DC2626",
  redLight: "#FEF2F2",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
  text: "#1E293B",
  textMuted: "#475569",
  textDim: "#94A3B8",
};

const flowSteps = [
  { id: 1, label: "Auto de Exclusão", sub: "Abertura" },
  { id: 2, label: "Despacho Inicial", sub: "Atribuição" },
  { id: 3, label: "Instrução", sub: "Investigação" },
  { id: 4, label: "Peças Processuais", sub: "7 tipos" },
  { id: 5, label: "Despacho Final", sub: "Decisão" },
  { id: 6, label: "Notificação", sub: "PDF + Email" },
  { id: 7, label: "Decisão Tutelar", sub: "Recursos" },
  { id: 8, label: "Encerramento", sub: "Fecho" },
];

const modules = [
  { name: "Administração", pages: 5, color: colors.accent, bg: colors.accentLight, icon: "⚙️" },
  { name: "Entidades", pages: 12, color: colors.teal, bg: colors.tealLight, icon: "🏢" },
  { name: "Eventos", pages: 3, color: colors.gold, bg: colors.goldLight, icon: "🎲" },
  { name: "Processos", pages: 8, color: colors.orange, bg: colors.orangeLight, icon: "📋" },
  { name: "Configuração", pages: 35, color: colors.purple, bg: colors.purpleLight, icon: "🔧" },
  { name: "Financeiro", pages: 11, color: colors.red, bg: colors.redLight, icon: "💰" },
];

const stats = [
  { label: "Linhas de Código", value: "139.565", color: colors.accent },
  { label: "Ficheiros", value: "436", color: colors.teal },
  { label: "Endpoints API", value: "200+", color: colors.gold },
  { label: "Modelos BD", value: "92", color: colors.orange },
  { label: "Tabelas", value: "150+", color: colors.purple },
  { label: "Páginas UI", value: "56", color: colors.red },
];

function GlowCard({ children, color = colors.accent, style, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: colors.surface,
        border: `1.5px solid ${active ? color : colors.border}`,
        borderRadius: 14,
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        boxShadow: active
          ? `0 4px 24px ${color}18, 0 1px 3px ${color}10`
          : "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
        ...style,
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: 3,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: active ? 1 : 0.35,
        transition: "opacity 0.3s",
      }} />
      {children}
    </div>
  );
}

function ConnectionLine({ color = colors.textDim }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2px 0" }}>
      <div style={{ width: 2, height: 30, background: `linear-gradient(180deg, ${color}88, ${color}33)`, borderRadius: 1 }} />
    </div>
  );
}

function ArrowDown({ color = colors.textDim }) {
  return <div style={{ textAlign: "center", color: `${color}99`, fontSize: 14, lineHeight: 1, padding: "2px 0" }}>▼</div>;
}

export default function SGIGJArchitecture() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      color: colors.text,
      fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      padding: "32px 24px",
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-block",
            padding: "5px 14px",
            background: colors.accentLight,
            border: `1px solid ${colors.accent}30`,
            borderRadius: 20,
            fontSize: 10,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: colors.accent,
            fontWeight: 600,
            marginBottom: 14,
          }}>
            Diagrama de Arquitetura
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: colors.text, letterSpacing: -0.5 }}>
            SGIGJ — Sistema Integrado de Gestão
          </h1>
          <p style={{ color: colors.textDim, fontSize: 13, margin: "6px 0 0", fontWeight: 500 }}>
            Inspeção Geral de Jogos · Cabo Verde
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "14px 8px",
              background: colors.surface, borderRadius: 10,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 8.5, color: colors.textDim, marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Client */}
        <GlowCard color={colors.accent} active={activeLayer === "client"} onClick={() => setActiveLayer(activeLayer === "client" ? null : "client")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>🌐</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Utilizador (Browser)</span>
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>sgigj.igj.cv · Aplicação SPA React</div>
            </div>
            <div style={{ padding: "4px 10px", background: colors.accentLight, borderRadius: 6, fontSize: 10, color: colors.accent, fontWeight: 700, border: `1px solid ${colors.accent}25` }}>HTTPS</div>
          </div>
        </GlowCard>

        <ConnectionLine color={colors.accent} />
        <ArrowDown color={colors.accent} />

        {/* Frontend */}
        <GlowCard color={colors.teal} active={activeLayer === "frontend"} onClick={() => setActiveLayer(activeLayer === "frontend" ? null : "frontend")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>🖥️</span>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Firebase Hosting</span>
              <span style={{ fontSize: 11, color: colors.textDim, marginLeft: 10 }}>Frontend React SPA</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 12 }}>
            React 17 · Redux · React Router · Bootstrap 4 · 105.622 linhas · 219 ficheiros
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {modules.map((m, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); setActiveModule(activeModule === i ? null : i); }}
                style={{
                  padding: "12px", background: activeModule === i ? m.bg : colors.surfaceLight,
                  border: `1.5px solid ${activeModule === i ? m.color : colors.border}`,
                  borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{m.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.name}</span>
                </div>
                <div style={{ fontSize: 10, color: colors.textDim, fontWeight: 500 }}>{m.pages} páginas</div>
              </div>
            ))}
          </div>
          {activeModule === 3 && (
            <div style={{ marginTop: 12, padding: 14, background: colors.orangeLight, borderRadius: 10, border: `1.5px solid ${colors.orange}30` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, marginBottom: 10 }}>📋 Módulo de Processos — Fluxo de 8 Etapas</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {flowSteps.map((s) => (
                  <div key={s.id} style={{ padding: "8px", background: colors.surface, border: `1px solid ${colors.orange}25`, borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: colors.orange }}>{s.id}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: colors.text, marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 8, color: colors.textDim, marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlowCard>

        <ConnectionLine color={colors.gold} />
        <div style={{ textAlign: "center" }}>
          <span style={{ display: "inline-block", padding: "3px 12px", background: colors.goldLight, border: `1px solid ${colors.gold}30`, borderRadius: 12, fontSize: 10, color: colors.gold, fontWeight: 700 }}>REST API + WebSocket</span>
        </div>
        <ArrowDown color={colors.gold} />

        {/* Backend */}
        <GlowCard color={colors.gold} active={activeLayer === "backend"} onClick={() => setActiveLayer(activeLayer === "backend" ? null : "backend")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>⚡</span>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Cloud Run — API AdonisJS</span>
              <span style={{ fontSize: 11, color: colors.textDim, marginLeft: 10 }}>api.igj.cv</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 12 }}>
            AdonisJS 4.1 · Node.js · Lucid ORM · 33.943 linhas · 217 ficheiros
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[
              { label: "103 Controladores", sub: "API endpoints", icon: "🔌" },
              { label: "92 Modelos", sub: "Lucid ORM", icon: "🗃️" },
              { label: "JWT + RBAC", sub: "Autenticação", icon: "🔐" },
              { label: "Socket.io", sub: "Tempo real", icon: "📡" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "10px", background: colors.surfaceLight, borderRadius: 8, border: `1px solid ${colors.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 9, color: colors.textDim, marginTop: 2 }}>{item.sub}</div>
              </div>
            ))}
          </div>
          {activeLayer === "backend" && (
            <div style={{ marginTop: 12, padding: 14, background: colors.goldLight, borderRadius: 10, border: `1.5px solid ${colors.gold}25` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.gold, marginBottom: 8 }}>Funcionalidades Transversais</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
                {["Geração PDF (html-pdf / jsPDF)", "Email (Nodemailer SMTP)", "11 modelos DOCX", "Gerador de texto automático", "Fusão de PDFs (Juntada)", "Exportação CSV/Excel", "Trilha de auditoria", "Soft-delete (ESTADO)"].map((f, i) => (
                  <div key={i} style={{ fontSize: 10, color: colors.textMuted, padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: colors.gold, fontSize: 10 }}>●</span> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlowCard>

        {/* Split connections */}
        <div style={{ display: "flex", justifyContent: "center", gap: 200 }}>
          <ConnectionLine color={colors.purple} />
          <ConnectionLine color={colors.orange} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 130 }}>
          <ArrowDown color={colors.purple} />
          <ArrowDown color={colors.orange} />
        </div>

        {/* Data Stores */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <GlowCard color={colors.purple} active={activeLayer === "db"} onClick={() => setActiveLayer(activeLayer === "db" ? null : "db")}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>🗄️</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Cloud SQL</div>
                <div style={{ fontSize: 10, color: colors.textDim }}>MySQL 8.0</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[{ v: "150+", l: "Tabelas" }, { v: "92", l: "Modelos" }, { v: "93", l: "Migrações" }, { v: "200+", l: "Rotas" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "8px 4px", background: colors.purpleLight, borderRadius: 6, border: `1px solid ${colors.purple}15` }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: colors.purple }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: colors.textDim, fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
            {activeLayer === "db" && (
              <div style={{ marginTop: 10, fontSize: 10, color: colors.textMuted }}>
                <div style={{ fontWeight: 700, color: colors.purple, marginBottom: 6 }}>Categorias:</div>
                {["Processos (15+)", "Entidades (8+)", "Eventos (5+)", "Financeiro (12+)", "Pessoas (5+)", "Config (35+)", "Sistema (8+)"].map((c, i) => (
                  <span key={i} style={{ display: "inline-block", padding: "3px 8px", margin: "2px 4px 2px 0", background: colors.purpleLight, border: `1px solid ${colors.purple}18`, borderRadius: 5, fontSize: 9, fontWeight: 500 }}>{c}</span>
                ))}
              </div>
            )}
          </GlowCard>

          <GlowCard color={colors.orange} active={activeLayer === "storage"} onClick={() => setActiveLayer(activeLayer === "storage" ? null : "storage")}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>📦</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Firebase Storage</div>
                <div style={{ fontSize: 10, color: colors.textDim }}>Documentos e Ficheiros</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { icon: "📄", label: "PDFs gerados", sub: "Despachos, notificações" },
                { icon: "📝", label: "11 modelos DOCX", sub: "Templates processuais" },
                { icon: "🖼️", label: "Imagens", sub: "Uploads e anexos" },
                { icon: "📎", label: "Anexos", sub: "Provas, documentos" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: colors.orangeLight, borderRadius: 6, border: `1px solid ${colors.orange}15` }}>
                  <span style={{ fontSize: 14 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{f.label}</div>
                    <div style={{ fontSize: 9, color: colors.textDim }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* CI/CD */}
        <div style={{ marginTop: 20 }}>
          <GlowCard color={colors.teal} active={activeLayer === "cicd"} onClick={() => setActiveLayer(activeLayer === "cicd" ? null : "cicd")}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>🚀</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Pipeline CI/CD — Google Cloud Build</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {["Git Push", "Cloud Build", "Docker Image", "Cloud Run"].map((step, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ padding: "8px 14px", background: colors.tealLight, border: `1px solid ${colors.teal}25`, borderRadius: 7, fontSize: 11, fontWeight: 600 }}>{step}</div>
                  {i < arr.length - 1 && <span style={{ color: colors.teal, fontSize: 14, fontWeight: 700 }}>→</span>}
                </div>
              ))}
            </div>
            {activeLayer === "cicd" && (
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ padding: 10, background: colors.tealLight, borderRadius: 8, border: `1px solid ${colors.teal}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: colors.teal }}>🧪 Sandbox</div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>dev.igj.cv → dev.api.igj.cv</div>
                </div>
                <div style={{ padding: 10, background: colors.tealLight, borderRadius: 8, border: `1px solid ${colors.teal}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: colors.teal }}>🏭 Produção</div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>sgigj.igj.cv → api.igj.cv</div>
                </div>
              </div>
            )}
          </GlowCard>
        </div>

        {/* Security */}
        <div style={{ marginTop: 14 }}>
          <GlowCard color={colors.red} active={activeLayer === "security"} onClick={() => setActiveLayer(activeLayer === "security" ? null : "security")}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Segurança e Controlo</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { label: "JWT Auth", sub: "Tokens seguros" },
                { label: "RBAC", sub: "Perfis + Permissões" },
                { label: "Auditoria", sub: "Registo total" },
                { label: "SSL/TLS", sub: "HTTPS automático" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "10px 6px", background: colors.redLight, borderRadius: 7, border: `1px solid ${colors.red}15` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: colors.text }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: colors.textDim, marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 28, paddingBottom: 24 }}>
          <div style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1, fontWeight: 600 }}>
            CLOUD TECNOLOGY, LDA · PRAIA, CABO VERDE · FEV 2026
          </div>
          <div style={{ fontSize: 9, color: `${colors.textDim}99`, marginTop: 6 }}>
            Clique em cada camada para explorar detalhes
          </div>
        </div>
      </div>
    </div>
  );
}
