import { useState } from "react";

const colors = {
  bg: "#0A0E1A",
  surface: "#111827",
  surfaceLight: "#1E293B",
  border: "#2D3A50",
  accent: "#3B82F6",
  accentGlow: "rgba(59,130,246,0.15)",
  gold: "#D4A843",
  goldGlow: "rgba(212,168,67,0.12)",
  teal: "#2ED8B6",
  tealGlow: "rgba(46,216,182,0.12)",
  orange: "#F39C12",
  red: "#EF4444",
  purple: "#8B5CF6",
  text: "#E2E8F0",
  textMuted: "#94A3B8",
  textDim: "#64748B",
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
  { name: "Administração", pages: 5, color: colors.accent, icon: "⚙️" },
  { name: "Entidades", pages: 12, color: colors.teal, icon: "🏢" },
  { name: "Eventos", pages: 3, color: colors.gold, icon: "🎲" },
  { name: "Processos", pages: 8, color: colors.orange, icon: "📋" },
  { name: "Configuração", pages: 35, color: colors.purple, icon: "🔧" },
  { name: "Financeiro", pages: 11, color: colors.red, icon: "💰" },
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
        border: `1px solid ${active ? color : colors.border}`,
        borderRadius: 12,
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        boxShadow: active ? `0 0 30px ${color}33` : "none",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: 3,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: active ? 1 : 0.4,
          transition: "opacity 0.3s",
        }}
      />
      {children}
    </div>
  );
}

function ConnectionLine({ from, to, color = colors.accent }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 0",
    }}>
      <div style={{
        width: 2,
        height: 32,
        background: `linear-gradient(180deg, ${color}, ${color}44)`,
      }} />
    </div>
  );
}

function ArrowDown({ color = colors.textDim }) {
  return (
    <div style={{ textAlign: "center", color, fontSize: 18, lineHeight: 1, padding: "4px 0" }}>
      ▼
    </div>
  );
}

export default function SGIGJArchitecture() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [showFlow, setShowFlow] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      color: colors.text,
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      padding: "32px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `
          linear-gradient(${colors.border}22 1px, transparent 1px),
          linear-gradient(90deg, ${colors.border}22 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-block",
            padding: "6px 16px",
            background: `${colors.accent}15`,
            border: `1px solid ${colors.accent}40`,
            borderRadius: 20,
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: colors.accent,
            marginBottom: 16,
          }}>
            Diagrama de Arquitetura
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            background: `linear-gradient(135deg, ${colors.text}, ${colors.gold})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -0.5,
          }}>
            SGIGJ — Sistema Integrado de Gestão
          </h1>
          <p style={{ color: colors.textDim, fontSize: 13, margin: "8px 0 0" }}>
            Inspeção Geral de Jogos · Cabo Verde
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 8,
          marginBottom: 32,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center",
              padding: "14px 8px",
              background: colors.surface,
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: colors.textDim, marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* === LAYER 1: Client === */}
        <GlowCard
          color={colors.accent}
          active={activeLayer === "client"}
          onClick={() => setActiveLayer(activeLayer === "client" ? null : "client")}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>🌐</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Utilizador (Browser)</span>
              </div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>
                sgigj.igj.cv · Aplicação SPA React
              </div>
            </div>
            <div style={{
              padding: "4px 10px",
              background: `${colors.accent}20`,
              borderRadius: 6,
              fontSize: 10,
              color: colors.accent,
            }}>HTTPS</div>
          </div>
        </GlowCard>

        <ConnectionLine color={colors.accent} />
        <ArrowDown color={colors.accent} />

        {/* === LAYER 2: Frontend === */}
        <GlowCard
          color={colors.teal}
          active={activeLayer === "frontend"}
          onClick={() => setActiveLayer(activeLayer === "frontend" ? null : "frontend")}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>🖥️</span>
            <div>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Firebase Hosting</span>
              <span style={{ fontSize: 11, color: colors.textDim, marginLeft: 10 }}>Frontend React SPA</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 12 }}>
            React 17 · Redux · React Router · Bootstrap 4 · 105.622 linhas · 219 ficheiros
          </div>

          {/* Modules Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {modules.map((m, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveModule(activeModule === i ? null : i); }}
                style={{
                  padding: "12px",
                  background: activeModule === i ? `${m.color}15` : colors.surfaceLight,
                  border: `1px solid ${activeModule === i ? m.color : colors.border}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{m.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{m.name}</span>
                </div>
                <div style={{ fontSize: 10, color: colors.textDim }}>{m.pages} páginas</div>
              </div>
            ))}
          </div>

          {/* Module Detail */}
          {activeModule !== null && activeModule === 3 && (
            <div style={{ marginTop: 12, padding: 12, background: colors.surfaceLight, borderRadius: 8, border: `1px solid ${colors.orange}40` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.orange, marginBottom: 8 }}>
                📋 Módulo de Processos — Fluxo de 8 Etapas
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {flowSteps.map((s) => (
                  <div key={s.id} style={{
                    padding: "8px",
                    background: `${colors.orange}10`,
                    border: `1px solid ${colors.orange}30`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: colors.orange }}>{s.id}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: colors.text, marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 8, color: colors.textDim, marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlowCard>

        {/* Connection */}
        <ConnectionLine color={colors.gold} />
        <div style={{ textAlign: "center" }}>
          <span style={{
            display: "inline-block",
            padding: "3px 12px",
            background: `${colors.gold}15`,
            border: `1px solid ${colors.gold}40`,
            borderRadius: 12,
            fontSize: 10,
            color: colors.gold,
          }}>REST API + WebSocket</span>
        </div>
        <ArrowDown color={colors.gold} />

        {/* === LAYER 3: Backend API === */}
        <GlowCard
          color={colors.gold}
          active={activeLayer === "backend"}
          onClick={() => setActiveLayer(activeLayer === "backend" ? null : "backend")}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Cloud Run — API AdonisJS</span>
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
              <div key={i} style={{
                padding: "10px",
                background: colors.surfaceLight,
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                textAlign: "center",
              }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 9, color: colors.textDim, marginTop: 2 }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {activeLayer === "backend" && (
            <div style={{ marginTop: 12, padding: 12, background: colors.surfaceLight, borderRadius: 8, border: `1px solid ${colors.gold}30` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.gold, marginBottom: 8 }}>Funcionalidades Transversais</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
                {[
                  "Geração PDF (html-pdf / jsPDF)",
                  "Email (Nodemailer SMTP)",
                  "11 modelos DOCX",
                  "Gerador de texto automático",
                  "Fusão de PDFs (Juntada)",
                  "Exportação CSV/Excel",
                  "Trilha de auditoria",
                  "Soft-delete (ESTADO)",
                ].map((f, i) => (
                  <div key={i} style={{ fontSize: 10, color: colors.textMuted, padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: colors.gold, fontSize: 8 }}>●</span> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlowCard>

        {/* Split connection to databases */}
        <div style={{ display: "flex", justifyContent: "center", gap: 200, marginTop: 0 }}>
          <ConnectionLine color={colors.purple} />
          <ConnectionLine color={colors.orange} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 130 }}>
          <ArrowDown color={colors.purple} />
          <ArrowDown color={colors.orange} />
        </div>

        {/* === LAYER 4: Data Stores === */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 }}>
          {/* MySQL */}
          <GlowCard
            color={colors.purple}
            active={activeLayer === "db"}
            onClick={() => setActiveLayer(activeLayer === "db" ? null : "db")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>🗄️</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Cloud SQL</div>
                <div style={{ fontSize: 10, color: colors.textDim }}>MySQL 8.0</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                { v: "150+", l: "Tabelas" },
                { v: "92", l: "Modelos" },
                { v: "93", l: "Migrações" },
                { v: "200+", l: "Rotas" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "8px 4px", background: `${colors.purple}10`, borderRadius: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: colors.purple }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: colors.textDim }}>{s.l}</div>
                </div>
              ))}
            </div>
            {activeLayer === "db" && (
              <div style={{ marginTop: 10, fontSize: 10, color: colors.textMuted }}>
                <div style={{ fontWeight: 600, color: colors.purple, marginBottom: 4 }}>Categorias:</div>
                {["Processos (15+)", "Entidades (8+)", "Eventos (5+)", "Financeiro (12+)", "Pessoas (5+)", "Config (35+)", "Sistema (8+)"].map((c, i) => (
                  <span key={i} style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    margin: "2px 4px 2px 0",
                    background: `${colors.purple}15`,
                    borderRadius: 4,
                    fontSize: 9,
                  }}>{c}</span>
                ))}
              </div>
            )}
          </GlowCard>

          {/* Firebase Storage */}
          <GlowCard
            color={colors.orange}
            active={activeLayer === "storage"}
            onClick={() => setActiveLayer(activeLayer === "storage" ? null : "storage")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>📦</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Firebase Storage</div>
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
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: `${colors.orange}08`, borderRadius: 6 }}>
                  <span style={{ fontSize: 14 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500 }}>{f.label}</div>
                    <div style={{ fontSize: 9, color: colors.textDim }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* === CI/CD Pipeline === */}
        <div style={{ marginTop: 24 }}>
          <GlowCard color={colors.teal} active={activeLayer === "cicd"} onClick={() => setActiveLayer(activeLayer === "cicd" ? null : "cicd")}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>🚀</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Pipeline CI/CD — Google Cloud Build</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {["Git Push", "Cloud Build", "Docker Image", "Cloud Run"].map((step, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    padding: "8px 14px",
                    background: `${colors.teal}12`,
                    border: `1px solid ${colors.teal}30`,
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 500,
                  }}>
                    {step}
                  </div>
                  {i < arr.length - 1 && <span style={{ color: colors.teal, fontSize: 14 }}>→</span>}
                </div>
              ))}
            </div>
            {activeLayer === "cicd" && (
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ padding: 10, background: `${colors.teal}08`, borderRadius: 6, border: `1px solid ${colors.teal}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: colors.teal }}>🧪 Sandbox</div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>dev.igj.cv → dev.api.igj.cv</div>
                </div>
                <div style={{ padding: 10, background: `${colors.teal}08`, borderRadius: 6, border: `1px solid ${colors.teal}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: colors.teal }}>🏭 Produção</div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>sgigj.igj.cv → api.igj.cv</div>
                </div>
              </div>
            )}
          </GlowCard>
        </div>

        {/* === Security Layer === */}
        <div style={{ marginTop: 16 }}>
          <GlowCard color={colors.red} active={activeLayer === "security"} onClick={() => setActiveLayer(activeLayer === "security" ? null : "security")}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Segurança e Controlo</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { label: "JWT Auth", sub: "Tokens seguros" },
                { label: "RBAC", sub: "Perfis + Permissões" },
                { label: "Auditoria", sub: "Registo total" },
                { label: "SSL/TLS", sub: "HTTPS automático" },
              ].map((s, i) => (
                <div key={i} style={{
                  textAlign: "center",
                  padding: "10px 6px",
                  background: `${colors.red}08`,
                  borderRadius: 6,
                  border: `1px solid ${colors.red}20`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: colors.text }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: colors.textDim, marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32, paddingBottom: 24 }}>
          <div style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1 }}>
            CLOUD TECNOLOGY, LDA · PRAIA, CABO VERDE · FEV 2026
          </div>
          <div style={{ fontSize: 9, color: `${colors.textDim}80`, marginTop: 6 }}>
            Clique em cada camada para explorar detalhes
          </div>
        </div>
      </div>
    </div>
  );
}
